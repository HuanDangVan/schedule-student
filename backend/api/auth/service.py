"""
api/auth/service.py
Xử lý đăng ký / đăng nhập trực tiếp với Database (không cần mã hóa phức tạp / không dùng JWT).
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

try:
    from models.tai_khoan import TaiKhoan
    from models.nguoi_dung import NguoiDung
    from api.auth.schemas import RegisterRequest, LoginRequest, AuthResponse
except ImportError:
    from backend.models.tai_khoan import TaiKhoan
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.schemas import RegisterRequest, LoginRequest, AuthResponse


def register(db: Session, req: RegisterRequest) -> AuthResponse:
    # Kiểm tra Email đã tồn tại chưa
    existing = db.query(TaiKhoan).filter(TaiKhoan.Email == req.Email.strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email này đã được đăng ký tài khoản!"
        )

    # 1. Tạo bản ghi TaiKhoan
    tk = TaiKhoan(
        Email=req.Email.strip(),
        MatKhau=req.MatKhau
    )
    db.add(tk)
    db.commit()
    db.refresh(tk)

    # 2. Tạo bản ghi NguoiDung tương ứng
    nd = NguoiDung(
        MaTaiKhoan=tk.MaTaiKhoan,
        HoTen=req.HoTen.strip(),
        NgaySinh=req.NgaySinh,
        GioiTinh=req.GioiTinh,
        SoDienThoai=req.SoDienThoai,
        AnhDaiDien=req.AnhDaiDien
    )
    db.add(nd)
    db.commit()
    db.refresh(nd)

    return AuthResponse(
        MaTaiKhoan=tk.MaTaiKhoan,
        MaNguoiDung=nd.MaNguoiDung,
        Email=tk.Email,
        HoTen=nd.HoTen,
        SoDienThoai=nd.SoDienThoai,
        access_token=f"user_{nd.MaNguoiDung}",
        token_type="bearer",
        message="Đăng ký tài khoản thành công!"
    )


def login(db: Session, req: LoginRequest) -> AuthResponse:
    # Tìm tài khoản theo Email
    tk = db.query(TaiKhoan).filter(TaiKhoan.Email == req.Email.strip()).first()
    if not tk or tk.MatKhau != req.MatKhau:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác!"
        )

    # Lấy thông tin người dùng
    nd = db.query(NguoiDung).filter(NguoiDung.MaTaiKhoan == tk.MaTaiKhoan).first()
    if not nd:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thông tin người dùng cho tài khoản này!"
        )

    return AuthResponse(
        MaTaiKhoan=tk.MaTaiKhoan,
        MaNguoiDung=nd.MaNguoiDung,
        Email=tk.Email,
        HoTen=nd.HoTen,
        SoDienThoai=nd.SoDienThoai,
        access_token=f"user_{nd.MaNguoiDung}",
        token_type="bearer",
        message="Đăng nhập thành công!"
    )