"""
api/completion/router.py
Chức năng 10: Đánh dấu trạng thái hoàn thành / chưa hoàn thành của công việc.
"""
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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

router = APIRouter(prefix="/completion", tags=["Completion"])


@router.patch("/{task_id}/complete", summary="Đánh dấu hoàn thành")
@router.post("/{task_id}/complete", summary="Đánh dấu hoàn thành")
def mark_complete(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    task = db.query(CongViec).filter(
        CongViec.MaCongViec == task_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")

    task.TrangThai = "Đã hoàn thành"
    task.TienDo = 100
    task.NgayCapNhat = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)

    return {
        "MaCongViec": task.MaCongViec,
        "TenCongViec": task.TenCongViec,
        "TrangThai": task.TrangThai,
        "TienDo": task.TienDo,
        "message": "Đã đánh dấu hoàn thành công việc"
    }


@router.patch("/{task_id}/incomplete", summary="Đánh dấu chưa hoàn thành")
@router.post("/{task_id}/incomplete", summary="Đánh dấu chưa hoàn thành")
def mark_incomplete(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    task = db.query(CongViec).filter(
        CongViec.MaCongViec == task_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")

    task.TrangThai = "Chưa làm"
    task.TienDo = 0
    task.NgayCapNhat = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)

    return {
        "MaCongViec": task.MaCongViec,
        "TenCongViec": task.TenCongViec,
        "TrangThai": task.TrangThai,
        "TienDo": task.TienDo,
        "message": "Đã chuyển về trạng thái chưa hoàn thành"
    }