"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from typing import List, Dict, Any, Optional, Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from langgraph.types import Command
from copilotkit import CopilotKitState
import httpx
from .data.asset import Asset
from .data.base import StarterCode

# --- ReVideo Agent Constants ---
DEFAULT_PLANNER_SYSTEM_PROMPT = """
You are an expert video script planner. Your goal is to create a detailed, step-by-step plan to modify a given Revideo template code based on user-provided assets (images, videos, text, audio).

Instructions:
1. Analyze the provided Revideo template code (TypeScript) and its description.
2. Examine the user-provided assets, paying attention to their type, description, and any metadata. Note the numbered index for each asset.
3. Create a clear, actionable, step-by-step plan outlining the modifications needed to integrate the assets into the template effectively.
4. Reference assets using their numbered index (e.g., \"Replace the placeholder image in Scene 1 with Asset #3\").
5. Focus on *what* needs to change in the code, not *how* to write the code itself. The next step involves a coder AI.
6. Ensure the plan aligns with the template's original purpose and structure where possible, unless the assets clearly necessitate a different approach.
7. Output *only* the plan as a plain text string. Do not include greetings, explanations, or code snippets in the final plan output.
"""
REVIDEO_GENERATE_ENDPOINT = "http://localhost:8000/revideo/generate"

class AgentState(CopilotKitState):
    """
    Agent state for the ReVideo LangGraph agent.
    Inherits chat history (messages) from CopilotKitState.
    """
    assets: List[Asset] = []
    starter_code: Optional[str] = None
    prompt: str = ""
    planner_result: Dict[str, Any] = {}
    final_result: Dict[str, Any] = {}

async def planner_node(state: AgentState, config: RunnableConfig) -> Command[Literal["coder_node"]]:
    """
    Node to generate a plan for video editing based on assets, template, and prompt.
    Passes full chat history for context.
    """
    # Number assets
    assets_dict = {str(i): asset for i, asset in enumerate(state.assets)}
    assets_str = "\n".join(f"{i}: {a}" for i, a in assets_dict.items())
    template_str = f"Code: ```tsx\n{state.starter_code}\n```"
    # Build planner prompt as a HumanMessage
    planner_human = HumanMessage(
        content=f"## Assets:\n{assets_str}\n\n## Template:\n{template_str}\n\n## Goal:\n{state.prompt}"
    )
    # Compose messages: system prompt, chat history, new planner prompt
    messages = [SystemMessage(content=DEFAULT_PLANNER_SYSTEM_PROMPT)] + list(state["messages"]) + [planner_human]
    model = ChatOpenAI(model="gpt-4o")
    response = await model.ainvoke(messages, config)
    plan = getattr(response, "content", str(response))
    return Command(
        goto="coder_node",
        update={
            "planner_result": {"plan": plan, "numbered_assets": assets_dict},
            # Optionally, append the LLM's output to chat history
            "messages": state["messages"] + [response]
        }
    )

async def coder_node(state: AgentState, config: RunnableConfig) -> Command[Literal["__end__"]]:
    """
    Node to call the ReVideo generation service with the plan and assets.
    """
    plan = state.planner_result.get("plan", "")
    numbered_assets = state.planner_result.get("numbered_assets", {})
    payload = {
        "plan": plan,
        "template_code": state.starter_code,
        "description": state.prompt,
        "assets": numbered_assets,
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(REVIDEO_GENERATE_ENDPOINT, json=payload)
        response.raise_for_status()
        result = response.json()
    return Command(
        goto=END,
        update={
            "final_result": result
        }
    )

# Define the workflow graph
workflow = StateGraph(AgentState)
workflow.add_node("planner_node", planner_node)
workflow.add_node("coder_node", coder_node)
workflow.add_edge("planner_node", "coder_node")
workflow.set_entry_point("planner_node")
graph = workflow.compile()
