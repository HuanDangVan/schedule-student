"""
api/profile/schemas.py
  - ProfileResponse       : thông tin cá nhân trả về
  - UpdateProfileRequest  : dữ liệu cập nhật thông tin
  - ChangePasswordRequest : dữ liệu đổi mật khẩu
"""
from pydantic import BaseModel, EmailStr

class ProfileResponse(BaseModel):
    id:        int
    username:  str
    email:     str
    full_name: str | None

    class Config:
        from_attributes = True

class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    email:     EmailStr | None = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str