"""
api/categories/router.py
Quản lý danh mục công việc (Chức năng 5: Phân loại công việc)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

try:
    from database import get_db
    from models.danh_muc_cong_viec import DanhMucCongViec
    from models.cong_viec import CongViec
    from models.nguoi_dung import NguoiDung
    from api.auth.dependencies import get_current_user
except ImportError:
    from backend.database import get_db
    from backend.models.danh_muc_cong_viec import DanhMucCongViec
    from backend.models.cong_viec import CongViec
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/categories", tags=["Categories"])


class CategoryCreate(BaseModel):
    TenDanhMuc: str
    MoTa: str | None = None


class CategoryUpdate(BaseModel):
    TenDanhMuc: str | None = None
    MoTa: str | None = None


@router.get("", summary="Lấy danh sách danh mục của người dùng")
def get_categories(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    categories = db.query(DanhMucCongViec).filter(
        DanhMucCongViec.MaNguoiDung == current_user.MaNguoiDung
    ).all()

    result = []
    for cat in categories:
        task_count = db.query(CongViec).filter(CongViec.MaDanhMuc == cat.MaDanhMuc).count()
        completed_count = db.query(CongViec).filter(
            CongViec.MaDanhMuc == cat.MaDanhMuc,
            CongViec.TrangThai == "Đã hoàn thành"
        ).count()

        result.append({
            "MaDanhMuc": cat.MaDanhMuc,
            "TenDanhMuc": cat.TenDanhMuc,
            "MoTa": cat.MoTa,
            "NgayTao": cat.NgayTao.isoformat() if cat.NgayTao else None,
            "TongSoViec": task_count,
            "SoViecHoanThanh": completed_count
        })

    return result


@router.post("", summary="Thêm danh mục mới")
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    if not payload.TenDanhMuc or not payload.TenDanhMuc.strip():
        raise HTTPException(status_code=400, detail="Tên danh mục không được để trống")

    cat = DanhMucCongViec(
        MaNguoiDung=current_user.MaNguoiDung,
        TenDanhMuc=payload.TenDanhMuc.strip(),
        MoTa=payload.MoTa.strip() if payload.MoTa else None
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {
        "MaDanhMuc": cat.MaDanhMuc,
        "TenDanhMuc": cat.TenDanhMuc,
        "MoTa": cat.MoTa,
        "TongSoViec": 0,
        "SoViecHoanThanh": 0,
        "message": "Tạo danh mục thành công"
    }


@router.put("/{category_id}", summary="Cập nhật danh mục")
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    cat = db.query(DanhMucCongViec).filter(
        DanhMucCongViec.MaDanhMuc == category_id,
        DanhMucCongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")

    if payload.TenDanhMuc is not None:
        cat.TenDanhMuc = payload.TenDanhMuc.strip()
    if payload.MoTa is not None:
        cat.MoTa = payload.MoTa.strip()

    db.commit()
    db.refresh(cat)
    return {
        "MaDanhMuc": cat.MaDanhMuc,
        "TenDanhMuc": cat.TenDanhMuc,
        "MoTa": cat.MoTa,
        "message": "Cập nhật danh mục thành công"
    }


@router.delete("/{category_id}", summary="Xóa danh mục")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    cat = db.query(DanhMucCongViec).filter(
        DanhMucCongViec.MaDanhMuc == category_id,
        DanhMucCongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")

    # Kiểm tra xem có công việc thuộc danh mục không
    has_tasks = db.query(CongViec).filter(CongViec.MaDanhMuc == category_id).first()
    if has_tasks:
        # Xóa các công việc liên quan hoặc chặn xóa
        tasks = db.query(CongViec).filter(CongViec.MaDanhMuc == category_id).all()
        for t in tasks:
            db.delete(t)

    db.delete(cat)
    db.commit()
    return {"message": "Đã xóa danh mục thành công", "MaDanhMuc": category_id}