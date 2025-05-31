from __future__ import annotations

import os
from dataclasses import dataclass, field, fields
from typing import Annotated

from langchain_core.runnables import ensure_config
from langgraph.config import get_config

from sample_agent import prompts


firecrawl_env = {
    "FIRECRAWL_API_URL": "https://crawler.dev.mixio.pro",
}
firecrawl_api_key = os.getenv("FIRECRAWL_API_KEY") # Ensure .env is loaded for this to work
if firecrawl_api_key:
    firecrawl_env["FIRECRAWL_API_KEY"] = firecrawl_api_key


print(firecrawl_env)
mcp_client_config = {
    "firecrawl_service": { # Unique name for this MCP server
        "command": "npx",
        "args": ["-y", "firecrawl-mcp"],
        "transport": "stdio",
        "env": firecrawl_env,      

    }
}


@dataclass(kw_only=True)
class Configuration:
    """The configuration for the agent."""

    MCP_SERVERS: dict = field(
        default_factory=lambda: mcp_client_config,
        metadata={
            "description": "Configuration for MCP servers that provide additional tools and resources."
        },
    )

    system_prompt: str = field(
        default=prompts.SYSTEM_PROMPT,
        metadata={
            "description": "The system prompt to use for the agent's interactions. "
            "This prompt sets the context and behavior for the agent."
        },
    )

    model: Annotated[str, {"__template_metadata__": {"kind": "llm"}}] = field(
        default="openai/gemini-2.5-pro-preview", # "anthropic/claude-3-5-sonnet-20240620",
        metadata={
            "description": "The name of the language model to use for the agent's main interactions. "
            "Should be in the form: provider/model-name."
        },
    )

    max_search_results: int = field(
        default=10,
        metadata={
            "description": "The maximum number of search results to return for each search query."
        },
    )

    @classmethod
    def from_context(cls) -> Configuration:
        """Create a Configuration instance from a RunnableConfig object."""
        try:
            config = get_config()
        except RuntimeError:
            config = None
        config = ensure_config(config)
        configurable = config.get("configurable") or {}
        _fields = {f.name for f in fields(cls) if f.init}
        return cls(**{k: v for k, v in configurable.items() if k in _fields})
    
    
# Base URL for the frontend API
API_BASE_URL = "http://localhost:3000"