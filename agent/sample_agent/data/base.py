from typing import Optional
from pydantic import BaseModel

class StarterCode(BaseModel):
    code: str
    description: Optional[str] = None
