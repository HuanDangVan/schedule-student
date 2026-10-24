"""
api/tasks/router.py
CRUD công việc sinh viên (Chức năng 6, 7, 8, 9, 10).
"""
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

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

router = APIRouter(prefix="/tasks", tags=["Tasks"])


class TaskCreate(BaseModel):
    TenCongViec: str
    MaDanhMuc: int
    MoTa: str | None = None
    NgayBatDau: datetime.datetime | None = None
    HanHoanThanh: datetime.datetime | None = None
    MucDoUuTien: str = "Trung bình"
    TrangThai: str = "Chưa làm"
    TienDo: int = 0
    ThoiGianDuKien: int | None = None
    ThoiGianThucTe: int | None = None


class TaskUpdate(BaseModel):
    TenCongViec: str | None = None
    MaDanhMuc: int | None = None
    MoTa: str | None = None
    NgayBatDau: datetime.datetime | None = None
    HanHoanThanh: datetime.datetime | None = None
    MucDoUuTien: str | None = None
    TrangThai: str | None = None
    TienDo: int | None = None
    ThoiGianDuKien: int | None = None
    ThoiGianThucTe: int | None = None


class ProgressUpdate(BaseModel):
    TienDo: int


def serialize_task(t: CongViec, cat_name: str = ""):
    return {
        "MaCongViec": t.MaCongViec,
        "MaNguoiDung": t.MaNguoiDung,
        "MaDanhMuc": t.MaDanhMuc,
        "TenDanhMuc": cat_name or (t.danh_muc.TenDanhMuc if t.danh_muc else ""),
        "TenCongViec": t.TenCongViec,
        "MoTa": t.MoTa,
        "NgayBatDau": t.NgayBatDau.isoformat() if t.NgayBatDau else None,
        "HanHoanThanh": t.HanHoanThanh.isoformat() if t.HanHoanThanh else None,
        "MucDoUuTien": t.MucDoUuTien,
        "TrangThai": t.TrangThai,
        "TienDo": t.TienDo,
        "ThoiGianDuKien": t.ThoiGianDuKien,
        "ThoiGianThucTe": t.ThoiGianThucTe,
        "NgayTao": t.NgayTao.isoformat() if t.NgayTao else None,
        "NgayCapNhat": t.NgayCapNhat.isoformat() if t.NgayCapNhat else None,
        "IsOverdue": bool(
            t.HanHoanThanh and t.HanHoanThanh < datetime.datetime.now() and t.TrangThai != "Đã hoàn thành"
        )
    }


@router.get("", summary="Lấy danh sách công việc")
def get_tasks(
    category_id: int | None = None,
    status_filter: str | None = Query(None, alias="status"),
    priority: str | None = None,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    query = db.query(CongViec).filter(CongViec.MaNguoiDung == current_user.MaNguoiDung)

    if category_id:
        query = query.filter(CongViec.MaDanhMuc == category_id)
    if status_filter:
        query = query.filter(CongViec.TrangThai == status_filter)
    if priority:
        query = query.filter(CongViec.MucDoUuTien == priority)

    tasks = query.order_by(asc(CongViec.HanHoanThanh)).all()
    return [serialize_task(t) for t in tasks]


@router.post("", summary="Thêm công việc mới")
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    if not payload.TenCongViec.strip():
        raise HTTPException(status_code=400, detail="Tên công việc không được để trống")

    # Kiểm tra danh mục
    cat = db.query(DanhMucCongViec).filter(
        DanhMucCongViec.MaDanhMuc == payload.MaDanhMuc,
        DanhMucCongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not cat:
        # Nếu chưa có danh mục, lấy danh mục đầu tiên của user hoặc tạo mới
        cat = db.query(DanhMucCongViec).filter(DanhMucCongViec.MaNguoiDung == current_user.MaNguoiDung).first()
        if not cat:
            cat = DanhMucCongViec(MaNguoiDung=current_user.MaNguoiDung, TenDanhMuc="Mặc định")
            db.add(cat)
            db.commit()
            db.refresh(cat)
        payload.MaDanhMuc = cat.MaDanhMuc

    trang_thai = payload.TrangThai
    if payload.TienDo == 100:
        trang_thai = "Đã hoàn thành"
    elif payload.TienDo > 0 and trang_thai == "Chưa làm":
        trang_thai = "Đang làm"

    task = CongViec(
        MaNguoiDung=current_user.MaNguoiDung,
        MaDanhMuc=payload.MaDanhMuc,
        TenCongViec=payload.TenCongViec.strip(),
        MoTa=payload.MoTa,
        NgayBatDau=payload.NgayBatDau,
        HanHoanThanh=payload.HanHoanThanh,
        MucDoUuTien=payload.MucDoUuTien or "Trung bình",
        TrangThai=trang_thai,
        TienDo=max(0, min(100, payload.TienDo)),
        ThoiGianDuKien=payload.ThoiGianDuKien,
        ThoiGianThucTe=payload.ThoiGianThucTe
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return serialize_task(task, cat.TenDanhMuc)


@router.get("/{task_id}", summary="Xem chi tiết công việc")
def get_task(
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
    return serialize_task(task)


@router.put("/{task_id}", summary="Cập nhật công việc")
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    task = db.query(CongViec).filter(
        CongViec.MaCongViec == task_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")

    if payload.TenCongViec is not None:
        task.TenCongViec = payload.TenCongViec.strip()
    if payload.MaDanhMuc is not None:
        task.MaDanhMuc = payload.MaDanhMuc
    if payload.MoTa is not None:
        task.MoTa = payload.MoTa
    if payload.NgayBatDau is not None:
        task.NgayBatDau = payload.NgayBatDau
    if payload.HanHoanThanh is not None:
        task.HanHoanThanh = payload.HanHoanThanh
    if payload.MucDoUuTien is not None:
        task.MucDoUuTien = payload.MucDoUuTien
    if payload.TienDo is not None:
        task.TienDo = max(0, min(100, payload.TienDo))
        if task.TienDo == 100:
            task.TrangThai = "Đã hoàn thành"
        elif task.TienDo > 0 and task.TrangThai == "Chưa làm":
            task.TrangThai = "Đang làm"
    if payload.TrangThai is not None:
        task.TrangThai = payload.TrangThai
        if task.TrangThai == "Đã hoàn thành":
            task.TienDo = 100
    if payload.ThoiGianDuKien is not None:
        task.ThoiGianDuKien = payload.ThoiGianDuKien
    if payload.ThoiGianThucTe is not None:
        task.ThoiGianThucTe = payload.ThoiGianThucTe

    task.NgayCapNhat = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)
    return serialize_task(task)


@router.delete("/{task_id}", summary="Xóa công việc")
def delete_task(
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

    db.delete(task)
    db.commit()
    return {"message": "Đã xóa công việc thành công", "MaCongViec": task_id}


@router.patch("/{task_id}/progress", summary="Cập nhật tiến độ %")
def update_task_progress(
    task_id: int,
    payload: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    task = db.query(CongViec).filter(
        CongViec.MaCongViec == task_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")

    progress = max(0, min(100, payload.TienDo))
    task.TienDo = progress
    if progress == 100:
        task.TrangThai = "Đã hoàn thành"
    elif progress > 0 and task.TrangThai == "Chưa làm":
        task.TrangThai = "Đang làm"
    elif progress == 0 and task.TrangThai == "Đã hoàn thành":
        task.TrangThai = "Chưa làm"

    task.NgayCapNhat = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)
    return serialize_task(task)