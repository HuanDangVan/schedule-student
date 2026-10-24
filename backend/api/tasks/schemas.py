"""
api/tasks/schemas.py
  - TaskResponse      : thông tin công việc đầy đủ
  - CreateTaskRequest : dữ liệu tạo task mới
  - UpdateTaskRequest : dữ liệu cập nhật task (tất cả các trường đều là tùy chọn)
"""
from pydantic import BaseModel
from datetime import datetime

class TaskResponse(BaseModel):
    id:           int
    title:        str
    description:  str | None
    priority:     str
    status:       str
    due_date:     datetime | None
    is_completed: bool
    category_id:  int | None

    class Config:
        from_attributes = True

class CreateTaskRequest(BaseModel):
    title:       str
    description: str | None = None
    priority:    str = "medium"
    due_date:    datetime | None = None
    category_id: int | None = None

class UpdateTaskRequest(BaseModel):
    title:       str | None = None
    description: str | None = None
    priority:    str | None = None
    due_date:    datetime | None = None
    category_id: int | None = None