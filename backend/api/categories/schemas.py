"""
api/categories/schemas.py
  - CategoryResponse      : thông tin phân loại trả về
  - CreateCategoryRequest : dữ liệu tạo phân loại mới (name, color)
  - UpdateCategoryRequest : dữ liệu cập nhật phân loại
"""
from pydantic import BaseModel

class CategoryResponse(BaseModel):
    id:    int
    name:  str
    color: str

    class Config:
        from_attributes = True

class CreateCategoryRequest(BaseModel):
    name:  str
    color: str = "#4A90E2"

class UpdateCategoryRequest(BaseModel):
    name:  str | None = None
    color: str | None = None