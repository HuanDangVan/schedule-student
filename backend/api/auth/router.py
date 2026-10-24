"""
api/auth/router.py
API endpoints cho xác thực người dùng (Đăng ký / Đăng nhập trực tiếp, không dùng JWT).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

try:
    from database import get_db
    from api.auth.schemas import RegisterRequest, LoginRequest, AuthResponse
    from api.auth.service import register, login
except ImportError:
    from backend.database import get_db
    from backend.api.auth.schemas import RegisterRequest, LoginRequest, AuthResponse
    from backend.api.auth.service import register, login

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, summary="Đăng ký tài khoản mới")
def register_endpoint(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Đăng ký tài khoản và tạo hồ sơ người dùng."""
    return register(db, payload)


@router.post("/login", response_model=AuthResponse, summary="Đăng nhập")
def login_endpoint(payload: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập bằng Email và Mật khẩu, trả về thông tin người dùng."""
    return login(db, payload)


@router.post("/logout", summary="Đăng xuất")
def logout_endpoint():
    """Đăng xuất (Client chỉ cần xóa thông tin người dùng khỏi state/storage)."""
    return {"message": "Đăng xuất thành công"}