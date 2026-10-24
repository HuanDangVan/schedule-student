"""
api/priority/router.py
Chức năng 9: Thiết lập mức độ ưu tiên cho công việc (Thấp, Trung bình, Cao, Khẩn cấp).
"""
import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
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

router = APIRouter(prefix="/priority", tags=["Priority"])


class PriorityUpdate(BaseModel):
    MucDoUuTien: str


@router.patch("/{task_id}", summary="Cập nhật mức độ ưu tiên")
@router.put("/{task_id}", summary="Cập nhật mức độ ưu tiên")
def set_priority(
    task_id: int,
    payload: PriorityUpdate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    valid_priorities = ["Thấp", "Trung bình", "Cao", "Khẩn cấp"]
    if payload.MucDoUuTien not in valid_priorities:
        raise HTTPException(
            status_code=400,
            detail=f"Mức ưu tiên không hợp lệ. Phải thuộc: {', '.join(valid_priorities)}"
        )

    task = db.query(CongViec).filter(
        CongViec.MaCongViec == task_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")

    task.MucDoUuTien = payload.MucDoUuTien
    task.NgayCapNhat = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)

    return {
        "MaCongViec": task.MaCongViec,
        "TenCongViec": task.TenCongViec,
        "MucDoUuTien": task.MucDoUuTien,
        "message": "Đã cập nhật mức độ ưu tiên thành công"
    }