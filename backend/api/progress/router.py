"""
api/progress/router.py
Chức năng 12: Theo dõi tiến độ công việc theo thời gian thực.
"""
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

try:
    from database import get_db
    from models.cong_viec import CongViec
    from models.danh_muc_cong_viec import DanhMucCongViec
    from models.nguoi_dung import NguoiDung
    from api.auth.dependencies import get_current_user
except ImportError:
    from backend.database import get_db
    from backend.models.cong_viec import CongViec
    from backend.models.danh_muc_cong_viec import DanhMucCongViec
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("", summary="Tổng quan toàn bộ tiến độ")
@router.get("/overview", summary="Tổng quan tiến độ")
def get_progress_overview(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    tasks = db.query(CongViec).filter(CongViec.MaNguoiDung == current_user.MaNguoiDung).all()
    total = len(tasks)

    completed = sum(1 for t in tasks if t.TrangThai == "Đã hoàn thành")
    in_progress = sum(1 for t in tasks if t.TrangThai == "Đang làm")
    not_started = sum(1 for t in tasks if t.TrangThai == "Chưa làm")

    now = datetime.datetime.now()
    overdue = sum(
        1 for t in tasks
        if t.HanHoanThanh and t.HanHoanThanh < now and t.TrangThai != "Đã hoàn thành"
    )

    avg_progress = round(sum(t.TienDo for t in tasks) / total, 1) if total > 0 else 0
    completion_rate = round((completed / total) * 100, 1) if total > 0 else 0

    return {
        "total_tasks": total,
        "completed": completed,
        "in_progress": in_progress,
        "not_started": not_started,
        "overdue": overdue,
        "average_progress": avg_progress,
        "completion_rate": completion_rate
    }


@router.get("/by-category", summary="Tiến độ theo danh mục")
def get_progress_by_category(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    categories = db.query(DanhMucCongViec).filter(
        DanhMucCongViec.MaNguoiDung == current_user.MaNguoiDung
    ).all()

    result = []
    for cat in categories:
        tasks = db.query(CongViec).filter(
            CongViec.MaDanhMuc == cat.MaDanhMuc,
            CongViec.MaNguoiDung == current_user.MaNguoiDung
        ).all()
        total = len(tasks)
        completed = sum(1 for t in tasks if t.TrangThai == "Đã hoàn thành")
        avg_progress = round(sum(t.TienDo for t in tasks) / total, 1) if total > 0 else 0
        rate = round((completed / total) * 100, 1) if total > 0 else 0

        result.append({
            "MaDanhMuc": cat.MaDanhMuc,
            "TenDanhMuc": cat.TenDanhMuc,
            "TongSoViec": total,
            "SoViecHoanThanh": completed,
            "TienDoTrungBinh": avg_progress,
            "TyLeHoanThanh": rate
        })

    return result