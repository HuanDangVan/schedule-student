"""
api/calendar/router.py
Chức năng 11: Xem lịch theo ngày, tuần, tháng.
"""
import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

try:
    from database import get_db
    from models.cong_viec import CongViec
    from models.nguoi_dung import NguoiDung
    from api.auth.dependencies import get_current_user
except ImportError:
    from backend.database import get_db
    from backend.models.cong_viec import CongViec
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/calendar", tags=["Calendar"])


@router.get("", summary="Lấy danh sách công việc theo lịch")
def get_calendar(
    view: str = Query("month", regex="^(month|week|day)$"),
    date_str: str | None = Query(None, alias="date"),
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    try:
        base_date = datetime.date.fromisoformat(date_str) if date_str else datetime.date.today()
    except ValueError:
        base_date = datetime.date.today()

    if view == "day":
        start_date = datetime.datetime.combine(base_date, datetime.time.min)
        end_date = datetime.datetime.combine(base_date, datetime.time.max)
    elif view == "week":
        start_date = datetime.datetime.combine(
            base_date - datetime.timedelta(days=base_date.weekday()),
            datetime.time.min
        )
        end_date = start_date + datetime.timedelta(days=7)
    else:  # month: fetch current month +/- some days for full calendar grid
        start_date = datetime.datetime(base_date.year, base_date.month, 1) - datetime.timedelta(days=7)
        # End of month roughly
        if base_date.month == 12:
            next_month = datetime.datetime(base_date.year + 1, 1, 1)
        else:
            next_month = datetime.datetime(base_date.year, base_date.month + 1, 1)
        end_date = next_month + datetime.timedelta(days=7)

    # Lấy toàn bộ công việc của người dùng trong khoảng thời gian hoặc có hạn
    tasks = db.query(CongViec).filter(
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).all()

    events = []
    for t in tasks:
        # Sử dụng HanHoanThanh hoặc NgayBatDau
        dt = t.HanHoanThanh or t.NgayBatDau or t.NgayTao
        events.append({
            "MaCongViec": t.MaCongViec,
            "TenCongViec": t.TenCongViec,
            "TenDanhMuc": t.danh_muc.TenDanhMuc if t.danh_muc else "",
            "MoTa": t.MoTa,
            "NgayBatDau": t.NgayBatDau.isoformat() if t.NgayBatDau else None,
            "HanHoanThanh": t.HanHoanThanh.isoformat() if t.HanHoanThanh else None,
            "MucDoUuTien": t.MucDoUuTien,
            "TrangThai": t.TrangThai,
            "TienDo": t.TienDo,
            "date": dt.date().isoformat() if dt else None,
            "IsOverdue": bool(
                t.HanHoanThanh and t.HanHoanThanh < datetime.datetime.now() and t.TrangThai != "Đã hoàn thành"
            )
        })

    return {
        "view": view,
        "current_date": base_date.isoformat(),
        "total_events": len(events),
        "events": events
    }