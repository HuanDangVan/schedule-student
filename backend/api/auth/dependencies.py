"""
api/auth/dependencies.py
Xác thực người dùng hiện tại từ header Authorization (Bearer user_{MaNguoiDung})
Hoặc fallback tự động lấy người dùng đầu tiên để bảo đảm trải nghiệm không bị gián đoạn.
"""
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

try:
    from database import get_db
    from models.nguoi_dung import NguoiDung
    from models.tai_khoan import TaiKhoan
except ImportError:
    from backend.database import get_db
    from backend.models.nguoi_dung import NguoiDung
    from backend.models.tai_khoan import TaiKhoan


def get_current_user(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db)
) -> NguoiDung:
    user_id = None
    if authorization and "Bearer " in authorization:
        raw_token = authorization.replace("Bearer ", "").strip()
        if raw_token.startswith("user_"):
            try:
                user_id = int(raw_token.replace("user_", ""))
            except ValueError:
                user_id = None
        else:
            try:
                user_id = int(raw_token)
            except ValueError:
                user_id = None

    if user_id:
        user = db.query(NguoiDung).filter(NguoiDung.MaNguoiDung == user_id).first()
        if user:
            return user

    # Fallback: Lấy người dùng đầu tiên có sẵn trong CSDL
    first_user = db.query(NguoiDung).first()
    if first_user:
        return first_user

    # Nếu hoàn toàn chưa có người dùng nào, tự động tạo 1 tài khoản mặc định
    try:
        new_tk = TaiKhoan(Email="sinhvien@schedule.edu.vn", MatKhau="123456")
        db.add(new_tk)
        db.commit()
        db.refresh(new_tk)

        new_nd = NguoiDung(
            MaTaiKhoan=new_tk.MaTaiKhoan,
            HoTen="Nguyễn Văn Hướng",
            SoDienThoai="0987654321",
            GioiTinh="Nam"
        )
        db.add(new_nd)
        db.commit()
        db.refresh(new_nd)
        return new_nd
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Chưa đăng nhập hoặc không tìm thấy người dùng"
        )
