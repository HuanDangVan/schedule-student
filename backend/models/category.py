"""
models/category.py
Đồng bộ với bảng DanhMucCongViec trong database.sql.
"""
try:
    from models.danh_muc_cong_viec import DanhMucCongViec
except ImportError:
    from backend.models.danh_muc_cong_viec import DanhMucCongViec

Category = DanhMucCongViec

__all__ = ["DanhMucCongViec", "Category"]