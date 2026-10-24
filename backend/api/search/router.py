"""
api/search/router.py
Chức năng 13: Tìm kiếm và lọc công việc đa tiêu chí.
"""
import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

try:
    from database import get_db
    from models.cong_viec import CongViec
    from models.nguoi_dung import NguoiDung
    from api.auth.dependencies import get_current_user
    from api.tasks.router import serialize_task
except ImportError:
    from backend.database import get_db
    from backend.models.cong_viec import CongViec
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.dependencies import get_current_user
    from backend.api.tasks.router import serialize_task

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", summary="Tìm kiếm và lọc công việc")
def search_tasks(
    q: str | None = Query(None, description="Từ khóa tìm kiếm trong tên hoặc mô tả"),
    category_id: int | None = Query(None, description="Lọc theo mã danh mục"),
    status: str | None = Query(None, description="Lọc theo trạng thái"),
    priority: str | None = Query(None, description="Lọc theo mức độ ưu tiên"),
    sort_by: str = Query("deadline_asc", description="Sắp xếp: deadline_asc, deadline_desc, priority_desc, progress_desc, created_desc"),
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    query = db.query(CongViec).filter(CongViec.MaNguoiDung == current_user.MaNguoiDung)

    if q and q.strip():
        search_pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                CongViec.TenCongViec.ilike(search_pattern),
                CongViec.MoTa.ilike(search_pattern)
            )
        )

    if category_id:
        query = query.filter(CongViec.MaDanhMuc == category_id)

    if status and status != "Tất cả":
        if status == "Quá hạn":
            now = datetime.datetime.now()
            query = query.filter(
                CongViec.HanHoanThanh < now,
                CongViec.TrangThai != "Đã hoàn thành"
            )
        else:
            query = query.filter(CongViec.TrangThai == status)

    if priority and priority != "Tất cả":
        query = query.filter(CongViec.MucDoUuTien == priority)

    # Sắp xếp
    if sort_by == "deadline_desc":
        query = query.order_by(desc(CongViec.HanHoanThanh))
    elif sort_by == "priority_desc":
        # Sắp xếp theo ưu tiên: Khẩn cấp > Cao > Trung bình > Thấp
        query = query.order_by(
            desc(
                CongViec.MucDoUuTien == "Khẩn cấp"
            ),
            desc(
                CongViec.MucDoUuTien == "Cao"
            ),
            desc(
                CongViec.MucDoUuTien == "Trung bình"
            )
        )
    elif sort_by == "progress_desc":
        query = query.order_by(desc(CongViec.TienDo))
    elif sort_by == "created_desc":
        query = query.order_by(desc(CongViec.NgayTao))
    else:
        query = query.order_by(asc(CongViec.HanHoanThanh))

    tasks = query.all()

    return {
        "query": q,
        "total_results": len(tasks),
        "results": [serialize_task(t) for t in tasks]
    }