"""
api/profile/router.py
Chức năng 4: Quản lý hồ sơ cá nhân và đổi mật khẩu.
"""
import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

try:
    from database import get_db
    from models.nguoi_dung import NguoiDung
    from models.tai_khoan import TaiKhoan
    from models.cong_viec import CongViec
    from api.auth.dependencies import get_current_user
except ImportError:
    from backend.database import get_db
    from backend.models.nguoi_dung import NguoiDung
    from backend.models.tai_khoan import TaiKhoan
    from backend.models.cong_viec import CongViec
    from backend.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


class ProfileUpdate(BaseModel):
    HoTen: str | None = None
    NgaySinh: datetime.date | None = None
    GioiTinh: str | None = None
    SoDienThoai: str | None = None
    AnhDaiDien: str | None = None


class ChangePasswordRequest(BaseModel):
    MatKhauCu: str
    MatKhauMoi: str


@router.get("", summary="Lấy thông tin cá nhân")
def get_profile(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    tk = db.query(TaiKhoan).filter(TaiKhoan.MaTaiKhoan == current_user.MaTaiKhoan).first()

    total_tasks = db.query(CongViec).filter(CongViec.MaNguoiDung == current_user.MaNguoiDung).count()
    completed_tasks = db.query(CongViec).filter(
        CongViec.MaNguoiDung == current_user.MaNguoiDung,
        CongViec.TrangThai == "Đã hoàn thành"
    ).count()

    return {
        "MaNguoiDung": current_user.MaNguoiDung,
        "MaTaiKhoan": current_user.MaTaiKhoan,
        "Email": tk.Email if tk else "",
        "HoTen": current_user.HoTen,
        "NgaySinh": current_user.NgaySinh.isoformat() if current_user.NgaySinh else None,
        "GioiTinh": current_user.GioiTinh,
        "SoDienThoai": current_user.SoDienThoai,
        "AnhDaiDien": current_user.AnhDaiDien,
        "NgayTaoTaiKhoan": current_user.NgayTaoTaiKhoan.isoformat() if current_user.NgayTaoTaiKhoan else None,
        "TongSoViec": total_tasks,
        "SoViecHoanThanh": completed_tasks
    }


@router.put("", summary="Cập nhật hồ sơ cá nhân")
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    if payload.HoTen is not None and payload.HoTen.strip():
        current_user.HoTen = payload.HoTen.strip()
    if payload.NgaySinh is not None:
        current_user.NgaySinh = payload.NgaySinh
    if payload.GioiTinh is not None:
        current_user.GioiTinh = payload.GioiTinh
    if payload.SoDienThoai is not None:
        current_user.SoDienThoai = payload.SoDienThoai
    if payload.AnhDaiDien is not None:
        current_user.AnhDaiDien = payload.AnhDaiDien

    db.commit()
    db.refresh(current_user)

    tk = db.query(TaiKhoan).filter(TaiKhoan.MaTaiKhoan == current_user.MaTaiKhoan).first()

    return {
        "MaNguoiDung": current_user.MaNguoiDung,
        "Email": tk.Email if tk else "",
        "HoTen": current_user.HoTen,
        "NgaySinh": current_user.NgaySinh.isoformat() if current_user.NgaySinh else None,
        "GioiTinh": current_user.GioiTinh,
        "SoDienThoai": current_user.SoDienThoai,
        "AnhDaiDien": current_user.AnhDaiDien,
        "message": "Cập nhật hồ sơ thành công"
    }


@router.put("/change-password", summary="Đổi mật khẩu")
@router.post("/change-password", summary="Đổi mật khẩu")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    tk = db.query(TaiKhoan).filter(TaiKhoan.MaTaiKhoan == current_user.MaTaiKhoan).first()
    if not tk:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")

    if tk.MatKhau != payload.MatKhauCu:
        raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác!")

    if len(payload.MatKhauMoi) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 6 ký tự!")

    tk.MatKhau = payload.MatKhauMoi
    db.commit()

    return {"message": "Đổi mật khẩu thành công!"}