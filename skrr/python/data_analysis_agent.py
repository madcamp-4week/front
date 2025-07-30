#!/usr/bin/env python
"""
data_analysis_agent.py
======================

This script defines a multi-agent CrewAI workflow for data analysis.
The workflow includes agents for data exploration, statistical analysis,
and insight generation.

Usage:
    python data_analysis_agent.py "analyze sales data for Q1 2024"

The script expects environment variables to be set:
    OPENAI_API_KEY or GEMINI_API_KEY
    OPENAI_MODEL or GEMINI_MODEL

"""

import json
import os
import sys
import pandas as pd
import numpy as np
from typing import Dict, Any, List
import base64
import io

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

def main(analysis_request: str) -> None:
    """Entrypoint for data analysis workflow."""
    try:
        from crewai import Agent, Task, Crew, Process, LLM
    except ImportError as e:
        sys.stderr.write(
            "Required libraries are missing. Please install crewai via pip.\n"
        )
        sys.stderr.flush()
        raise e

    # Load environment variables
    openai_key = os.environ.get("OPENAI_API_KEY")
    openai_model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini/gemini-2.5-pro")

    # Configure LLM
    if gemini_key:
        llm = LLM(
            model=gemini_model,
            api_key=gemini_key,
        )
    elif openai_key:
        llm = LLM(
            model=openai_model,
            api_key=openai_key,
        )
    else:
        raise RuntimeError("Either OPENAI_API_KEY or GEMINI_API_KEY must be set.")

    # Create sample data for demonstration
    sample_data = create_sample_data()
    
    # Define agents
    data_explorer = Agent(
        role="Data Explorer",
        goal="Explore and understand the structure and content of the dataset",
        backstory=(
            "You are an expert data analyst with years of experience in "
            "exploring and understanding various types of datasets. You excel "
            "at identifying patterns, anomalies, and key characteristics in data."
        ),
        llm=llm,
    )

    statistician = Agent(
        role="Statistician",
        goal="Perform statistical analysis and identify significant patterns",
        backstory=(
            "You are a senior statistician with deep knowledge of statistical "
            "methods, hypothesis testing, and data interpretation. You can "
            "identify correlations, trends, and statistical significance."
        ),
        llm=llm,
    )

    business_analyst = Agent(
        role="Business Analyst",
        goal="Extract actionable business insights from the data analysis",
        backstory=(
            "You are a strategic business analyst who can translate complex "
            "data findings into clear, actionable business recommendations. "
            "You understand business context and can identify opportunities "
            "and risks from data patterns."
        ),
        llm=llm,
    )

    # Define tasks
    exploration_task = Task(
        description=(
            f"Analyze the following dataset based on the request: '{analysis_request}'\n\n"
            f"Dataset Summary:\n{sample_data['summary']}\n\n"
            "Perform initial data exploration including:\n"
            "- Data structure and types\n"
            "- Missing values and data quality\n"
            "- Basic statistics and distributions\n"
            "- Potential data issues or anomalies"
        ),
        expected_output="A comprehensive data exploration report with key findings and observations.",
        agent=data_explorer,
    )

    statistical_task = Task(
        description=(
            "Based on the data exploration results, perform statistical analysis:\n"
            "- Calculate relevant statistics (mean, median, std, correlations)\n"
            "- Identify trends and patterns\n"
            "- Perform hypothesis testing if applicable\n"
            "- Create visualizations recommendations"
        ),
        expected_output="Statistical analysis report with key metrics, patterns, and visualizations.",
        agent=statistician,
    )

    insight_task = Task(
        description=(
            "Based on the statistical analysis, generate business insights:\n"
            "- Key findings and their business implications\n"
            "- Actionable recommendations\n"
            "- Risk factors and opportunities\n"
            "- Next steps for further analysis"
        ),
        expected_output="Business insights report with actionable recommendations.",
        agent=business_analyst,
    )

    # Create crew
    crew = Crew(
        agents=[data_explorer, statistician, business_analyst],
        tasks=[exploration_task, statistical_task, insight_task],
        process=Process.sequential,
        verbose=False,
    )

    # Execute analysis
    try:
        result = crew.kickoff()
        
        # Create analysis report
        analysis_report = {
            "request": analysis_request,
            "summary": str(result),
            "data_info": sample_data['info'],
            "recommendations": extract_recommendations(str(result)),
            "charts": generate_chart_recommendations(sample_data)
        }
        
        print(json.dumps(analysis_report))
        
    except Exception as e:
        error_response = {
            "error": f"Analysis failed: {str(e)}"
        }
        print(json.dumps(error_response))
        sys.exit(1)

def create_sample_data() -> Dict[str, Any]:
    """Create sample data for demonstration."""
    np.random.seed(42)
    
    # Create sample sales data
    dates = pd.date_range('2024-01-01', '2024-03-31', freq='D')
    n_days = len(dates)
    
    data = {
        'date': dates,
        'sales_amount': np.random.normal(10000, 2000, n_days),
        'units_sold': np.random.poisson(50, n_days),
        'customer_count': np.random.poisson(25, n_days),
        'product_category': np.random.choice(['Electronics', 'Clothing', 'Books', 'Home'], n_days),
        'region': np.random.choice(['North', 'South', 'East', 'West'], n_days)
    }
    
    df = pd.DataFrame(data)
    
    # Add some trends
    df['sales_amount'] += np.linspace(0, 1000, n_days)  # Upward trend
    df.loc[df['product_category'] == 'Electronics', 'sales_amount'] *= 1.2  # Electronics premium
    
    summary = f"""
    Dataset: Sales Data (Q1 2024)
    - Rows: {len(df)}
    - Columns: {list(df.columns)}
    - Date Range: {df['date'].min().strftime('%Y-%m-%d')} to {df['date'].max().strftime('%Y-%m-%d')}
    - Total Sales: ${df['sales_amount'].sum():,.2f}
    - Average Daily Sales: ${df['sales_amount'].mean():,.2f}
    - Product Categories: {df['product_category'].unique().tolist()}
    - Regions: {df['region'].unique().tolist()}
    """
    
    info = {
        "total_records": len(df),
        "columns": list(df.columns),
        "date_range": f"{df['date'].min().strftime('%Y-%m-%d')} to {df['date'].max().strftime('%Y-%m-%d')}",
        "total_sales": f"${df['sales_amount'].sum():,.2f}",
        "avg_daily_sales": f"${df['sales_amount'].mean():,.2f}"
    }
    
    return {
        "summary": summary,
        "info": info,
        "dataframe": df
    }

def extract_recommendations(analysis_text: str) -> List[str]:
    """Extract recommendations from analysis text."""
    recommendations = []
    
    # Simple keyword-based extraction
    lines = analysis_text.split('\n')
    for line in lines:
        line = line.strip()
        if any(keyword in line.lower() for keyword in ['recommend', 'suggest', 'should', 'consider', 'action']):
            if line and len(line) > 10:
                recommendations.append(line)
    
    return recommendations[:5]  # Return top 5 recommendations

def generate_chart_recommendations(data: Dict[str, Any]) -> List[Dict[str, str]]:
    """Generate chart recommendations for the data."""
    charts = [
        {
            "type": "line_chart",
            "title": "Daily Sales Trend",
            "description": "Show sales trend over time to identify patterns and seasonality"
        },
        {
            "type": "bar_chart", 
            "title": "Sales by Product Category",
            "description": "Compare performance across different product categories"
        },
        {
            "type": "bar_chart",
            "title": "Sales by Region", 
            "description": "Analyze regional performance and identify top-performing areas"
        },
        {
            "type": "scatter_plot",
            "title": "Sales vs Customer Count",
            "description": "Explore relationship between sales and customer acquisition"
        },
        {
            "type": "histogram",
            "title": "Sales Distribution",
            "description": "Understand the distribution of daily sales amounts"
        }
    ]
    
    return charts

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python data_analysis_agent.py 'analysis request'"}))
        sys.exit(1)
    
    topic_argument = sys.argv[1]
    main(topic_argument) 