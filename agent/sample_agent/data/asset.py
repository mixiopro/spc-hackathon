from typing import Any, Dict, Literal, Optional
from pydantic import BaseModel, HttpUrl

class Asset(BaseModel):
    """
    Represents an asset, which can be an image, video, or audio file.
    """
    id: str
    type: Literal['image', 'video', 'audio']
    url: HttpUrl
    gsUri: str  # Consider using AnyUrl or a custom validator for stricter validation if needed
    description: Optional[str] = None
    metadata: Dict[str, Any] = {}
