"""
models/user.py
Đồng bộ với bảng TaiKhoan và NguoiDung trong database.sql.
"""
try:
    from models.tai_khoan import TaiKhoan
    from models.nguoi_dung import NguoiDung
except ImportError:
    from backend.models.tai_khoan import TaiKhoan
    from backend.models.nguoi_dung import NguoiDung

User = NguoiDung

__all__ = ["TaiKhoan", "NguoiDung", "User"]