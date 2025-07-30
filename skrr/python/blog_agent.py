#!/usr/bin/env python
"""
blog_agent.py
================

This script defines a simple two‑agent CrewAI workflow that
researches a user‑provided topic and writes a formatted blog post.
After the article is generated, it automatically publishes the
content to a Notion database using the official Notion client.

Usage:
    python blog_agent.py "Topic of the blog"

The script expects a number of environment variables to be set:

    OPENAI_API_KEY          Your API key for the OpenAI or compatible LLM.
    OPENAI_MODEL            The name of the model (e.g., "gpt-4o", "gpt-3.5-turbo").
    SERPER_API_KEY          API key for Serper (optional if using DuckDuckGoSearchTool).
    NOTION_TOKEN            The integration token for Notion.
    NOTION_DATABASE_ID      The ID of the Notion database where posts will be created.

You can place these in a .env file in the root of the project and load
them using python‑dotenv, or export them in your shell before running
the script. See .env.example for a template.

The design of the agents and tasks follows guidelines from the
CrewAI documentation, which explains that an agent is defined by its
role, goal, and backstory, and can leverage tools such as web search
to achieve its goal【289190495545497†L98-L124】. Each agent is assigned tasks
that specify descriptions and expected outputs【289190495545497†L126-L144】. A
Crew orchestrates the agents and tasks, controlling the execution
order and passing inputs as needed【289190495545497†L151-L163】.

"""
import json
import os
import sys
from ddgs import DDGS

# Load environment variables from a .env file if present.  This allows the
# Python script to find API keys and other settings even when they are not
# propagated by the parent process.  Requires python-dotenv to be installed.
try:
    from dotenv import load_dotenv  # type: ignore
    # Load .env from the project root.  If the file doesn't exist, this call
    # silently does nothing.
    load_dotenv()
except Exception:
    # If python-dotenv isn't installed, continue silently.  Environment
    # variables will rely on the parent process.
    pass

from typing import List


def main(topic: str) -> None:
    """Entrypoint for blog generation and publication.

    Args:
        topic: The topic to research and write about.
    """
    try:
        # Defer expensive imports until runtime to improve cold start times.
        from crewai import Agent, Task, Crew, Process, LLM
        # Attempt to import SerperDevTool.  If the import fails, we'll handle it
        # gracefully by disabling external search.
        try:
            from crewai_tools import SerperDevTool  # type: ignore
        except Exception:
            SerperDevTool = None  # type: ignore
        from notion_client import Client
    except ImportError as e:
        # If dependencies are missing, inform the caller via stderr and exit.
        sys.stderr.write(
            "Required libraries are missing. Please install crewai, crewai-tools, "
            "notion_client, and their dependencies via pip.\n"
        )
        sys.stderr.flush()
        raise e

    # Load environment variables. We do not hardcode any secrets.
    openai_key = os.environ.get("OPENAI_API_KEY")
    openai_model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini/gemini-pro")
    serper_key = os.environ.get("SERPER_API_KEY")
    notion_token = os.environ.get("NOTION_TOKEN")
    notion_db_id = os.environ.get("NOTION_DATABASE_ID")

    if not notion_token or not notion_db_id:
        raise RuntimeError(
            "NOTION_TOKEN and NOTION_DATABASE_ID must be set to publish the blog post."
        )

    # Configure the language model for CrewAI.  If a Gemini API key is provided,
    # use Gemini; otherwise fall back to OpenAI.  You can override the model
    # names via the GEMINI_MODEL or OPENAI_MODEL environment variables.  The
    # CrewAI LLM class internally uses LiteLLM, which supports a variety of
    # providers, including Google Gemini【662141623612446†L287-L296】.
    if gemini_key:
        llm = LLM(
            model=gemini_model,
            api_key=gemini_key,
            temperature=0.5,
            base_url=os.environ.get("GEMINI_BASE_URL"),
        )
    else:
        if not openai_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not set and no GEMINI_API_KEY provided."
            )
        llm = LLM(
            model=openai_model,
            api_key=openai_key,
            temperature=0.5,
            base_url=os.environ.get("OPENAI_BASE_URL"),
        )

    # Choose a search tool.  We prefer Serper when an API key is provided.
    search_tool = None
    if serper_key and SerperDevTool:
        # SerperDevTool automatically reads the SERPER_API_KEY from the
        # environment.  Without the key the tool will still be instantiated
        # but will not function.
        search_tool = SerperDevTool()
    # If no search tool is available, the researcher will rely solely on
    # the language model's knowledge without external search.

    # Define the Researcher agent. This agent uses the search tool to gather
    # up‑to‑date information about the topic, summarising key points.
    researcher = Agent(
        role=f"{topic} Researcher",
        goal=f"Collect accurate, up‑to‑date information about {topic} from credible sources.",
        backstory=(
            f"You are an expert researcher specialising in {topic}. "
            "You read multiple articles and sources to compile a concise summary."
        ),
        # Only include a tool if one is configured.  Otherwise the agent will run
        # without external search capabilities.
        tools=[search_tool] if search_tool else [],
        llm=llm,
    )

    # Define the Writer agent. This agent crafts a blog post based on the
    # researcher's summary. It does not use external tools but relies on the LLM.
    writer = Agent(
        role=f"{topic} Blog Writer",
        goal=(
            f"Write an engaging, well‑structured blog post about {topic} using the researcher's notes."
        ),
        backstory=(
            "You are a talented writer known for clarity and storytelling. "
            "Use the research notes to structure the article with an introduction, body, and conclusion."
        ),
        llm=llm,
    )

    # Research task: gather information. The expected output should be a
    # structured summary that includes facts, statistics, and citations.
    research_task = Task(
        description=(
            f"Research the topic '{topic}'. Provide a bullet list of at least 5 key points, "
            "including important facts, figures, or arguments. Cite the sources you used."
        ),
        expected_output=(
            "A research summary containing bullet points with facts and citations."
        ),
        agent=researcher,
    )

    # Writing task: create the blog post. It should transform the summary into a
    # coherent article in Markdown format.
    write_task = Task(
        description=(
            "Using the research summary provided by the researcher, write a detailed blog post "
            f"about '{topic}'. The blog should have a clear introduction, sections for each key point, "
            "and a conclusion. Format the output in Markdown, using headings and bullet points where appropriate."
        ),
        expected_output=(
            "A Markdown‑formatted blog post ready for publication on Notion."
        ),
        agent=writer,
    )

    # Assemble the crew. We run tasks sequentially so that the writer has access
    # to the researcher's output. The crew orchestrates the flow of information
    # between agents【289190495545497†L151-L163】.
    crew = Crew(
        agents=[researcher, writer],
        tasks=[research_task, write_task],
        process=Process.sequential,
        verbose=False,
    )

    # Kick off the process. We inject the topic as an input, which CrewAI
    # substitutes into task descriptions and agent roles.  Wrap this call in
    # a try/except to handle common API and quota errors gracefully.  If an
    # exception occurs, we emit a JSON error message and exit with a non‑zero
    # code so the API route can return a 500.
    try:
        result = crew.kickoff(inputs={"topic": topic})
    except Exception as e:
        # Serialize the exception message into JSON.  Certain exceptions
        # (e.g., OpenAI quota errors) originate from underlying libraries and
        # contain useful details.
        error_response = {
            "error": f"Agent execution failed: {str(e)}"
        }
        print(json.dumps(error_response))
        # Exit with a non‑zero status to signal failure to the caller.
        sys.exit(1)

    # The result contains the final output of the workflow. When using
    # CrewAI, this is typically a `CrewOutput` object. According to the
    # CrewAI documentation, the `CrewOutput` class exposes a `raw` attribute
    # and implements `__str__` to return a string representation of the
    # final output【993581283242212†L444-L476】. To avoid JSON serialization
    # errors (e.g., "Object of type CrewOutput is not JSON serializable"),
    # convert the result to a string explicitly. This will extract the
    # underlying blog text while ignoring other metadata.
    if isinstance(result, str):
        blog_content = result
    else:
        # Use the string conversion of the CrewOutput which prioritizes
        # Pydantic and JSON outputs before falling back to raw text【993581283242212†L444-L476】.
        blog_content = str(result)

    # Publish the blog to Notion. We'll create a new page in the specified
    # database. Each line of the blog becomes a separate paragraph block.
    notion = Client(auth=notion_token)
    paragraphs = []  # type: List[dict]
    for line in blog_content.splitlines():
        line = line.strip()
        if not line:
            # Insert an empty paragraph to preserve spacing.
            paragraphs.append(
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {"rich_text": []},
                }
            )
        else:
            paragraphs.append(
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {"content": line},
                            }
                        ],
                    },
                }
            )

    # Use the first line or the topic itself as the title. Notion requires a
    # Title property on database items. We set it to the topic for clarity.
    title_text = topic.strip().capitalize() if topic.strip() else "New Blog Post"

    # 1. 주제와 관련된 이미지를 검색합니다.
    image_url = fetch_image_url(topic)
    image_block = None
    if image_url:
        image_block = {
            "type": "image",
            "image": {
                "type": "external",
                "external": {"url": image_url},
            },
        }

    blog_blocks = _markdown_to_notion_blocks(blog_content)

    if image_block:
        blog_blocks.insert(0, image_block)

    page = notion.pages.create(
        parent={"database_id": notion_db_id},
        properties={
            "Name": {
                "title": [
                    {
                        "type": "text",
                        "text": {"content": title_text},
                    }
                ]
            }
        },
        children=blog_blocks,
    )
    url = page.get("url")

    # Output a JSON payload for the Node API route. We include the page URL and
    # optionally the content for debugging. The Node route will parse this
    # output and relay it to the frontend.
    response = {
        "url": url,
        "title": title_text,
    }
    print(json.dumps(response))
    
def _markdown_to_notion_blocks(markdown_text: str) -> list:
    """Convert simple Markdown to Notion block format."""
    blocks = []
    for line in markdown_text.split("\n"):
        line = line.rstrip()
        if not line:
            continue  # 빈 줄은 무시
        # Heading level 1
        if line.startswith("# "):
            blocks.append({
                "type": "heading_1",
                "heading_1": {
                    "rich_text": [{
                        "type": "text",
                        "text": {"content": line[2:].strip()}
                    }]
                }
            })
        # Heading level 2
        elif line.startswith("## "):
            blocks.append({
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{
                        "type": "text",
                        "text": {"content": line[3:].strip()}
                    }]
                }
            })
        # Bulleted list
        elif line.startswith("- "):
            blocks.append({
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{
                        "type": "text",
                        "text": {"content": line[2:].strip()}
                    }]
                }
            })
        # Paragraph (default)
        else:
            blocks.append({
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{
                        "type": "text",
                        "text": {"content": line}
                    }]
                }
            })
    return blocks

def fetch_image_url(query: str) -> str | None:
    """DuckDuckGo를 이용해 첫 번째 이미지 URL을 가져옵니다."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.images(query, max_results=1))
            if results and len(results) > 0:
                return results[0]["image"]  # 직접 링크
    except Exception:
        pass
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: python blog_agent.py <topic>\n")
        sys.exit(1)
    topic_argument = sys.argv[1]
    main(topic_argument)