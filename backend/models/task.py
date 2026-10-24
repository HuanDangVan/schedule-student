"""
models/task.py
Đồng bộ với bảng CongViec trong database.sql.
"""
try:
    from models.cong_viec import CongViec
except ImportError:
    from backend.models.cong_viec import CongViec

Task = CongViec

__all__ = ["CongViec", "Task"]