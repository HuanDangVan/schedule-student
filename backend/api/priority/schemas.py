"""
api/priority/schemas.py
  - SetPriorityRequest : chứa trường priority (low/medium/high/urgent)
"""
from pydantic import BaseModel

class SetPriorityRequest(BaseModel):
    priority: str  # "low" | "medium" | "high" | "urgent"