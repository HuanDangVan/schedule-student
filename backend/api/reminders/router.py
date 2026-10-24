"""
api/reminders/router.py
Chức năng 16: Nhắc nhở công việc đến hạn.
"""
import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

try:
    from database import get_db
    from models.nhac_nho import NhacNho
    from models.cong_viec import CongViec
    from models.nguoi_dung import NguoiDung
    from api.auth.dependencies import get_current_user
except ImportError:
    from backend.database import get_db
    from backend.models.nhac_nho import NhacNho
    from backend.models.cong_viec import CongViec
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/reminders", tags=["Reminders"])


class ReminderCreate(BaseModel):
    MaCongViec: int
    NoiDungNhacNho: str
    ThoiGianNhacNho: datetime.datetime


def serialize_reminder(r: NhacNho):
    return {
        "MaNhacNho": r.MaNhacNho,
        "MaCongViec": r.MaCongViec,
        "TenCongViec": r.cong_viec.TenCongViec if r.cong_viec else "",
        "HanHoanThanh": r.cong_viec.HanHoanThanh.isoformat() if r.cong_viec and r.cong_viec.HanHoanThanh else None,
        "NoiDungNhacNho": r.NoiDungNhacNho,
        "ThoiGianNhacNho": r.ThoiGianNhacNho.isoformat() if r.ThoiGianNhacNho else None,
        "TrangThai": r.TrangThai,
        "DaGui": r.DaGui
    }


@router.get("", summary="Lấy danh sách tất cả nhắc nhở")
def get_reminders(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    reminders = db.query(NhacNho).join(CongViec).filter(
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).order_by(NhacNho.ThoiGianNhacNho.asc()).all()

    return [serialize_reminder(r) for r in reminders]


@router.get("/today", summary="Lấy các nhắc nhở hôm nay hoặc sắp đến")
def get_today_reminders(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    now = datetime.datetime.now()
    end_of_day = datetime.datetime.combine(now.date() + datetime.timedelta(days=1), datetime.time.min)

    reminders = db.query(NhacNho).join(CongViec).filter(
        CongViec.MaNguoiDung == current_user.MaNguoiDung,
        NhacNho.ThoiGianNhacNho <= end_of_day,
        NhacNho.DaGui == False
    ).order_by(NhacNho.ThoiGianNhacNho.asc()).all()

    return [serialize_reminder(r) for r in reminders]


@router.post("", summary="Thêm nhắc nhở mới")
def create_reminder(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    task = db.query(CongViec).filter(
        CongViec.MaCongViec == payload.MaCongViec,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc tương ứng")

    reminder = NhacNho(
        MaCongViec=payload.MaCongViec,
        NoiDungNhacNho=payload.NoiDungNhacNho.strip(),
        ThoiGianNhacNho=payload.ThoiGianNhacNho,
        TrangThai="Chưa nhắc",
        DaGui=False
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return serialize_reminder(reminder)


@router.patch("/{reminder_id}/toggle", summary="Chuyển trạng thái đã nhắc")
@router.post("/{reminder_id}/toggle", summary="Chuyển trạng thái đã nhắc")
def toggle_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    reminder = db.query(NhacNho).join(CongViec).filter(
        NhacNho.MaNhacNho == reminder_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhắc nhở")

    reminder.DaGui = not reminder.DaGui
    reminder.TrangThai = "Đã nhắc" if reminder.DaGui else "Chưa nhắc"
    db.commit()
    db.refresh(reminder)
    return serialize_reminder(reminder)


@router.delete("/{reminder_id}", summary="Xóa nhắc nhở")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    reminder = db.query(NhacNho).join(CongViec).filter(
        NhacNho.MaNhacNho == reminder_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhắc nhở")

    db.delete(reminder)
    db.commit()
    return {"message": "Đã xóa nhắc nhở thành công", "MaNhacNho": reminder_id}