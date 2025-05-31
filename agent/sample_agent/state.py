
from copilotkit import CopilotKitState
from typing import List, Dict, Any, Optional

from sample_agent.data.asset import Asset

class AgentState(CopilotKitState):
    """
    Agent state for the ReVideo LangGraph agent.
    Inherits chat history (messages) from CopilotKitState.
    """
    assets: List[Asset] = [] # type: ignore
    starter_code: Optional[str] = None # type: ignore
    prompt: str = "" # type: ignore
    planner_result: Dict[str, Any] = {} # type: ignore
    final_result: Dict[str, Any] = {} # type: ignore