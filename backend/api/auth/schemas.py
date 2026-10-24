"""
api/auth/schemas.py
Pydantic schemas cho đăng ký và đăng nhập đơn giản (không JWT).
"""
from pydantic import BaseModel
from datetime import date


class RegisterRequest(BaseModel):
    Email: str
    MatKhau: str
    HoTen: str
    NgaySinh: date | None = None
    GioiTinh: str | None = None
    SoDienThoai: str | None = None
    AnhDaiDien: str | None = None


class LoginRequest(BaseModel):
    Email: str
    MatKhau: str


class AuthResponse(BaseModel):
    MaTaiKhoan: int
    MaNguoiDung: int
    Email: str
    HoTen: str
    SoDienThoai: str | None = None
    access_token: str | None = None
    token_type: str = "bearer"
    message: str = "Thành công"

    class Config:
        from_attributes = True