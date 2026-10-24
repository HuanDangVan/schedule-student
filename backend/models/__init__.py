"""
models/
Chứa toàn bộ SQLAlchemy ORM models (khớp 100% với file database.sql).
- tai_khoan.py            : Model TaiKhoan
- nguoi_dung.py           : Model NguoiDung
- danh_muc_cong_viec.py   : Model DanhMucCongViec
- cong_viec.py            : Model CongViec
- nhac_nho.py             : Model NhacNho
- goi_y_uu_tien.py        : Model GoiYUuTien
- phan_tich_hoan_thanh.py : Model PhanTichKhaNangHoanThanh
"""
try:
    from models.tai_khoan import TaiKhoan
    from models.nguoi_dung import NguoiDung
    from models.danh_muc_cong_viec import DanhMucCongViec
    from models.cong_viec import CongViec
    from models.nhac_nho import NhacNho
    from models.goi_y_uu_tien import GoiYUuTien
    from models.phan_tich_hoan_thanh import PhanTichKhaNangHoanThanh
except ImportError:
    from backend.models.tai_khoan import TaiKhoan
    from backend.models.nguoi_dung import NguoiDung
    from backend.models.danh_muc_cong_viec import DanhMucCongViec
    from backend.models.cong_viec import CongViec
    from backend.models.nhac_nho import NhacNho
    from backend.models.goi_y_uu_tien import GoiYUuTien
    from backend.models.phan_tich_hoan_thanh import PhanTichKhaNangHoanThanh

# Giữ alias tương thích nếu cần
User = NguoiDung
Task = CongViec
Category = DanhMucCongViec
Reminder = NhacNho

__all__ = [
    "TaiKhoan",
    "NguoiDung",
    "DanhMucCongViec",
    "CongViec",
    "NhacNho",
    "GoiYUuTien",
    "PhanTichKhaNangHoanThanh",
    "User",
    "Task",
    "Category",
    "Reminder",
]