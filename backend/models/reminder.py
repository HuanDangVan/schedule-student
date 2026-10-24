"""
models/reminder.py
Đồng bộ với bảng NhacNho trong database.sql.
"""
try:
    from models.nhac_nho import NhacNho
except ImportError:
    from backend.models.nhac_nho import NhacNho

Reminder = NhacNho

__all__ = ["NhacNho", "Reminder"]