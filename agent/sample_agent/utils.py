"""Utility & helper functions."""

import os
from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import BaseMessage
from sample_agent.configuration import Configuration
from langchain_mcp_adapters.client import MultiServerMCPClient
from typing import Any


def get_message_text(msg: BaseMessage) -> str:
    """Get the text content of a message."""
    content = msg.content
    if isinstance(content, str):
        return content
    elif isinstance(content, dict):
        return content.get("text", "")
    else:
        txts = [c if isinstance(c, str) else (c.get("text") or "") for c in content]
        return "".join(txts).strip()


def load_chat_model(fully_specified_name: str) -> BaseChatModel:
    """Load a chat model from a fully specified name.

    Args:
        fully_specified_name (str): String in the format 'provider/model'.
    """
    provider, model = fully_specified_name.split("/", maxsplit=1)
    return init_chat_model(model, model_provider=provider)



def get_copilotkit_actions(state: Any):
    try:
        return state["copilotkit"]["actions"]
    except (AttributeError, TypeError):
        return []

async def load_mcp_tools(config: Configuration):
    
    if not config.MCP_SERVERS:
        print("No MCP servers configured. Skipping tool fetch.")
        return []
    
    mcp_client_config = config.MCP_SERVERS
    mcp_client = MultiServerMCPClient(mcp_client_config)
    try:
        fetched_tools = await mcp_client.get_tools()
    except Exception as err:
        print(f"Failed to fetch MCP tools: {err}")
        fetched_tools = []

    # return value is merged into the graph state
    return fetched_tools