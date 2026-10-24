"""
api/statistics/router.py
Chức năng 14: Thống kê toàn diện về công việc và hiệu suất học tập.
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

router = APIRouter(prefix="/statistics", tags=["Statistics"])


@router.get("", summary="Lấy báo cáo thống kê chi tiết")
def get_statistics(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    tasks = db.query(CongViec).filter(CongViec.MaNguoiDung == current_user.MaNguoiDung).all()
    categories = db.query(DanhMucCongViec).filter(DanhMucCongViec.MaNguoiDung == current_user.MaNguoiDung).all()

    total = len(tasks)
    completed = sum(1 for t in tasks if t.TrangThai == "Đã hoàn thành")
    in_progress = sum(1 for t in tasks if t.TrangThai == "Đang làm")
    not_started = sum(1 for t in tasks if t.TrangThai == "Chưa làm")

    now = datetime.datetime.now()
    overdue = sum(
        1 for t in tasks
        if t.HanHoanThanh and t.HanHoanThanh < now and t.TrangThai != "Đã hoàn thành"
    )

    completion_rate = round((completed / total) * 100, 1) if total > 0 else 0

    # Phân bổ theo mức độ ưu tiên
    priority_counts = {
        "Khẩn cấp": sum(1 for t in tasks if t.MucDoUuTien == "Khẩn cấp"),
        "Cao": sum(1 for t in tasks if t.MucDoUuTien == "Cao"),
        "Trung bình": sum(1 for t in tasks if t.MucDoUuTien == "Trung bình"),
        "Thấp": sum(1 for t in tasks if t.MucDoUuTien == "Thấp")
    }

    # Phân bổ theo danh mục
    category_stats = []
    for c in categories:
        cat_tasks = [t for t in tasks if t.MaDanhMuc == c.MaDanhMuc]
        c_total = len(cat_tasks)
        c_done = sum(1 for t in cat_tasks if t.TrangThai == "Đã hoàn thành")
        category_stats.append({
            "name": c.TenDanhMuc,
            "total": c_total,
            "completed": c_done,
            "rate": round((c_done / c_total) * 100, 1) if c_total > 0 else 0
        })

    # Tổng giờ dự kiến vs thực tế
    total_est_hours = sum(t.ThoiGianDuKien or 0 for t in tasks)
    total_act_hours = sum(t.ThoiGianThucTe or 0 for t in tasks)

    return {
        "summary": {
            "total": total,
            "completed": completed,
            "in_progress": in_progress,
            "not_started": not_started,
            "overdue": overdue,
            "completion_rate": completion_rate,
            "total_estimated_hours": total_est_hours,
            "total_actual_hours": total_act_hours
        },
        "by_priority": priority_counts,
        "by_category": category_stats,
        "efficiency_score": min(100, round(completion_rate * 0.7 + (100 - (overdue / max(total, 1) * 100)) * 0.3, 1))
    }