"""
api/reminders/schemas.py
  - ReminderResponse      : thông tin nhắc nhở trả về
  - CreateReminderRequest : dữ liệu tạo nhắc nhở (task_id, remind_at, message)
"""
from pydantic import BaseModel
from datetime import datetime

class ReminderResponse(BaseModel):
    id:        int
    task_id:   int
    remind_at: datetime
    message:   str | None
    is_sent:   bool

    class Config:
        from_attributes = True

class CreateReminderRequest(BaseModel):
    task_id:   int
    remind_at: datetime
    message:   str | None = None