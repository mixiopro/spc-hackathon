from typing_extensions import Literal
from langchain_core.messages import SystemMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langgraph.types import Command
from sample_agent.state import AgentState
from sample_agent.tools.media_analyze import analyze_media_url
import logging
from sample_agent.configuration import Configuration
from langchain.chat_models import init_chat_model
from sample_agent.utils import get_copilotkit_actions, load_mcp_tools

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

import os
from dotenv import load_dotenv
load_dotenv()


async def chat_node(state: AgentState, config: RunnableConfig) -> Command[Literal["tool_node", "__end__"]]:
    """
    Standard chat node based on the ReAct design pattern. It handles:
    - The model to use (and binds in CopilotKit actions and the tools defined above)
    - The system prompt
    - Getting a response from the model
    - Handling tool calls

    For more about the ReAct design pattern, see: 
    https://www.perplexity.ai/search/react-agents-NcXLQhreS0WDzpVaS4m9Cg
    """
    
    # 1. Define the model
    model = init_chat_model(model=os.getenv('MODEL_NAME', 'openai/gpt-4o'), model_provider="openai")

    frontend_actions = get_copilotkit_actions(state)
    # configuration = Configuration.from_context()
    # print("Frontend actions:")
    # print(frontend_actions)
    
    # print("MCP SERVERS CONFIGURATION:")
    # print(configuration.MCP_SERVERS)
    
    # mcp_tools = await load_mcp_tools(configuration)
    # 2. Bind the tools to the model
    model_with_tools = model.bind_tools(
        [
            *frontend_actions,
            analyze_media_url,
            # *mcp_tools
            # your_tool_here
        ] ,
        # 2.1 Disable parallel tool calls to avoid race conditions,
        #     enable this for faster performance if you want to manage
        #     the complexity of running tool calls in parallel.
        parallel_tool_calls=False,
    )

    # 3. Define the system message by which the chat model will be run
    system_message = SystemMessage(
        content=f"You are a helpful assistant. Talk in {state.get('language', 'english')}."
    )

    # 4. Run the model to generate a response
    response = await model_with_tools.ainvoke([
        system_message,
        *state["messages"],
    ], config)

    # 5. Check for tool calls in the response and handle them. We ignore
    #    CopilotKit actions, as they are handled by CopilotKit.
    if isinstance(response, AIMessage) and response.tool_calls:
        actions = get_copilotkit_actions(state)

        # 5.1 Check for any non-copilotkit actions in the response and
        #     if there are none, go to the tool node.
        if not any(
            action.get("name") == response.tool_calls[0].get("name")
            for action in actions
        ):
            return Command(goto="tool_node", update={"messages": response})

    # 6. We've handled all tool calls, so we can end the graph.
    return Command(
        goto="__end__",
        update={
            "messages": response
        }
    )