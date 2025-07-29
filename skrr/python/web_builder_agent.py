#!/usr/bin/env python
"""
web_builder_agent.py
=====================

This script defines a multi‑agent CrewAI workflow to design and implement a
basic Next.js web project based on a user provided specification. The
workflow follows a planner–coder–reviewer–executor pattern. Each agent
specialises in a different stage of the software creation process:

* **Planner Agent** – Analyses the high‑level request and breaks it down into a
  project plan. The plan specifies which files should be created and what
  each file should contain (pages, components, API routes, state
  management, etc.).
* **Coder Agent** – Uses the planner's plan to generate actual code for
  each file. The coder outputs a mapping of file paths to code strings.
* **Reviewer Agent** – Reviews the generated code for correctness,
  readability and best practices. It can suggest improvements and returns
  an updated code mapping.
* **Executor Agent** – Packages the reviewed code into a JSON object
  containing the project name and file contents. The Python script then
  writes these files to disk in a new directory and reports the path.

The script relies on environment variables for configuration. To use an OpenAI
model, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL`. To use Google
Gemini via LiteLLM, set `GEMINI_API_KEY` and `GEMINI_MODEL`. To enable web
search during planning and coding, you can set `SERPER_API_KEY`; if the
`crewAI_tools.SerperDevTool` is available, it will be used automatically.

Usage:
    python web_builder_agent.py "Create a simple login page with a form and validation"

The script will produce a directory (e.g., `create_a_simple_login_page_with_a_form_and_validation`) in
the working directory containing the generated Next.js project files. If an
error occurs during agent execution, the script prints a JSON error and
exits with a non‑zero status code.

"""
import json
import os
import re
import sys
import shutil
from typing import Dict, Any

# Attempt to lazily load environment variables from a .env file if python‑dotenv
# is available. This is optional and will silently fail if the package is
# missing.
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass


def _sanitize_project_name(name: str) -> str:
    """Create a safe directory name by lowercasing and replacing non‑alphanum with underscores."""
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", name.strip().lower())
    return slug.strip("_") or "nextjs_project"


def _write_files(files: Dict[str, str], project_dir: str) -> None:
    """Write each file in the mapping to the specified project directory."""
    for rel_path, content in files.items():
        # Normalise the relative path to avoid directory traversal
        clean_rel_path = os.path.normpath(rel_path.lstrip("./"))
        dest_path = os.path.join(project_dir, clean_rel_path)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        with open(dest_path, "w", encoding="utf-8") as f:
            f.write(content)


def main(spec: str) -> None:
    """Entrypoint for generating a Next.js project based on a user specification."""
    try:
        # Defer imports of crewai and related tools until runtime to improve startup time.
        from crewai import Agent, Task, Crew, Process, LLM  # type: ignore
        try:
            from crewai_tools import SerperDevTool  # type: ignore
        except Exception:
            SerperDevTool = None  # type: ignore
    except ImportError as e:
        sys.stderr.write(
            "Required libraries are missing. Please install crewai and crewai-tools via pip.\n"
        )
        sys.stderr.flush()
        raise e

    # Load environment variables for LLM configuration
    openai_key = os.environ.get("OPENAI_API_KEY")
    openai_model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini/gemini-pro")
    serper_key = os.environ.get("SERPER_API_KEY")

    # Configure the LLM. Prefer Gemini if a key is provided; otherwise use OpenAI.
    if gemini_key:
        llm = LLM(
            model=gemini_model,
            api_key=gemini_key,
            temperature=0.3,
            base_url=os.environ.get("GEMINI_BASE_URL"),
        )
    else:
        if not openai_key:
            raise RuntimeError(
                "No language model API key provided. Set OPENAI_API_KEY or GEMINI_API_KEY."
            )
        llm = LLM(
            model=openai_model,
            api_key=openai_key,
            temperature=0.3,
            base_url=os.environ.get("OPENAI_BASE_URL"),
        )

    # Configure the search tool if a Serper API key is available
    search_tool = None
    if serper_key and SerperDevTool:
        search_tool = SerperDevTool()

    # --- Define Agents ---
    planner = Agent(
        role="Next.js Project Planner",
        goal=(
            "Break down the user's web application request into a structured plan. "
            "Identify necessary pages, components, API routes, state management and "
            "other files according to Next.js conventions."
        ),
        backstory=(
            "You are a seasoned full‑stack architect specialising in React and Next.js. "
            "You analyse high‑level specifications and design project structures that "
            "balance simplicity with best practices. Your plans describe the purpose of "
            "each file and follow the conventions of the latest stable Next.js release."
        ),
        tools=[search_tool] if search_tool else [],
        llm=llm,
    )

    coder = Agent(
        role="Next.js Coder",
        goal=(
            "Generate functional Next.js code based on a project plan. Write pages, "
            "components, API routes and configuration files that match the planner's "
            "specifications. Use modern React (functional components, hooks) and ensure "
            "imports and exports are correct."
        ),
        backstory=(
            "You are an expert developer with deep knowledge of JavaScript, TypeScript, "
            "React and Next.js. You follow project plans accurately and generate clean, "
            "readable code."
        ),
        tools=[search_tool] if search_tool else [],
        llm=llm,
    )

    reviewer = Agent(
        role="Code Reviewer",
        goal=(
            "Review the generated code for correctness, clarity and best practices. "
            "Suggest improvements and refactorings without altering the overall design."
        ),
        backstory=(
            "You are an experienced code reviewer known for catching subtle bugs and "
            "improving code readability. You ensure that the code adheres to modern "
            "standards and explain your changes inline with comments where appropriate."
        ),
        llm=llm,
    )

    executor = Agent(
        role="Project Packager",
        goal=(
            "Package the final reviewed code into a structured JSON object for external "
            "writing. Do not modify the code; simply prepare the data with a project "
            "name and file mapping."
        ),
        backstory=(
            "You act as an interface between the AI agents and the file system. You "
            "assemble the final outputs into a consistent format without making any "
            "additional modifications."
        ),
        llm=llm,
    )

    # --- Define Usage Guide Agent ---
    runner = Agent(
        role="Usage Guide Agent",
        goal=(
            "Generate comprehensive README content for the Next.js project. Include:\n"
            " 1) a brief project description based on the user's specification,\n"
            " 2) a list of required npm dependencies and the installation command (e.g., npm install next react react-dom),\n"
            " 3) environment variables needed (OPENAI_API_KEY, GEMINI_API_KEY, OPENAI_MODEL, GEMINI_MODEL, SERPER_API_KEY) with example export commands,\n"
            " 4) common npm scripts (dev, build, start) and how to run them,\n"
            " 5) a quick usage example showing how to start the development server and access the site."
        ),
        backstory=(
            "You guide developers through running the web_builder_agent script, "
            "explaining which environment variables to set and how to invoke the tool."
        ),
        llm=llm,
    )

    # --- Define Tasks ---
    plan_task = Task(
        description=(
            f"The user has requested the following Next.js feature: '{spec}'. "
            "Analyse this request and break it down into a plan. List each file that needs to be "
            "created in a JSON object under the key 'files'. For each file, provide a short "
            "description of its purpose. Use Next.js conventions (e.g., pages/ for page routes, "
            "components/ for reusable components, api/ for API routes). Your output must be valid JSON."
        ),
        expected_output=(
            "A JSON plan with a 'files' object where keys are file paths and values are descriptions."
        ),
        agent=planner,
    )

    code_task = Task(
        description=(
            "Using the planner's JSON plan as input, generate the actual code for each listed file. "
            "Return a JSON object mapping each file path to the contents of the file as a string. "
            "Include imports, exports and any necessary configuration. Do not include any prose or explanation; "
            "only return a valid JSON object with file paths as keys and code strings as values."
        ),
        expected_output=(
            "A JSON dictionary mapping file paths to code strings."
        ),
        agent=coder,
    )

    review_task = Task(
        description=(
            "Review the code dictionary produced by the coder. Improve the code if necessary for "
            "readability, correctness or best practices. If you make changes, include brief inline comments "
            "(e.g., // explanation) explaining your reasoning. Return a JSON dictionary with the same structure "
            "as input: file paths mapped to updated code strings. Do not wrap your response in any additional "
            "text; output only JSON."
        ),
        expected_output=(
            "An improved JSON dictionary mapping file paths to updated code strings."
        ),
        agent=reviewer,
    )

    exec_task = Task(
        description=(
            "Prepare the final code dictionary for external writing. You will receive the reviewer's JSON output. "
            "Construct a new JSON object with two keys: 'project_name' and 'files'. Set 'project_name' to a slugified "
            "version of the user's request (lowercase with underscores). Set 'files' to the code dictionary without any changes. "
            "Return only this JSON object without any additional text."
        ),
        expected_output=(
            "A JSON object with 'project_name' (string) and 'files' (object mapping file paths to code strings)."
        ),
        agent=executor,
    )

    run_task = Task(
        description=(
            "After packaging the project, explain step-by-step how to run the generated "
            "Next.js project and which environment variables (e.g., OPENAI_API_KEY, GEMINI_API_KEY, "
            "OPENAI_MODEL, GEMINI_MODEL, SERPER_API_KEY) must be set. Include example shell commands."
        ),
        expected_output="A plain-text usage guide with commands and variable descriptions.",
        agent=runner,
    )

    # Assemble and run the crew sequentially
    crew = Crew(
        agents=[planner, coder, reviewer, executor],
        tasks=[plan_task, code_task, review_task, exec_task],
        process=Process.sequential,
        verbose=False,
    )

    try:
        result = crew.kickoff(inputs={"spec": spec})
    except Exception as e:
        # Emit a JSON error for easier handling by wrappers
        error_response = {"error": f"Agent execution failed: {str(e)}"}
        print(json.dumps(error_response))
        sys.exit(1)

    # The crew output may be a CrewOutput or string; convert to string
    if isinstance(result, str):
        final_output = result
    else:
        final_output = str(result)

    # Attempt to parse the final JSON from the executor
    try:
        data = json.loads(final_output)
    except json.JSONDecodeError:
        # Attempt to extract a JSON object from the output using a simple heuristic.
        import re

        match = re.search(r"\{.*\}", final_output, re.DOTALL)
        if match:
            json_str = match.group(0)
            try:
                data = json.loads(json_str)
            except Exception:
                response = {
                    "error": "Failed to parse executor output as JSON",
                    "output": final_output,
                }
                print(json.dumps(response))
                sys.exit(1)
        else:
            response = {
                "error": "Failed to parse executor output as JSON",
                "output": final_output,
            }
            print(json.dumps(response))
            sys.exit(1)

    # Ensure required keys exist
    project_name = data.get("project_name")
    files = data.get("files")
    if not project_name or not isinstance(files, dict):
        response = {"error": "Executor output missing required fields", "data": data}
        print(json.dumps(response))
        sys.exit(1)

    # Create project directory
    project_dir = os.path.abspath(_sanitize_project_name(project_name))
    os.makedirs(project_dir, exist_ok=True)
    # Write files to disk
    _write_files(files, project_dir)

    # Generate usage guide via a separate Crew for run_task
    guide_crew = Crew(
        agents=[runner],
        tasks=[run_task],
        process=Process.sequential,
        verbose=False,
    )
    try:
        guide_result = guide_crew.kickoff(inputs={
            "project_name": project_name,
            "project_dir": project_dir,
            "spec": spec
        })
        usage_text = guide_result if isinstance(guide_result, str) else str(guide_result)
    except Exception:
        usage_text = ""

    # Write the generated README.md
    readme_path = os.path.join(project_dir, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(usage_text.strip())

    # Create a zip archive of the project directory in Next.js public/zip_folder
    script_dir = os.path.dirname(os.path.abspath(__file__))
    nextjs_root = os.path.abspath(os.path.join(script_dir, os.pardir))
    public_zip_dir = os.path.join(nextjs_root, 'public', 'zip_folder')
    os.makedirs(public_zip_dir, exist_ok=True)
    zip_base = os.path.join(public_zip_dir, _sanitize_project_name(project_name))
    shutil.make_archive(zip_base, "zip", project_dir)

    # Build the client-accessible URL path
    zip_path = f"/zip_folder/{_sanitize_project_name(project_name)}.zip"

    # Report the zip file path as JSON
    response = {"zip_path": zip_path}
    print(json.dumps(response))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: python web_builder_agent.py <description of the web feature>\n")
        sys.exit(1)
    specification = sys.argv[1]
    main(specification)