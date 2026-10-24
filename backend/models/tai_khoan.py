"""
models/tai_khoan.py
Model đại diện cho bảng "TaiKhoan" trong cơ sở dữ liệu.
Theo đúng định nghĩa trong database.sql:
- MaTaiKhoan (INT IDENTITY / PRIMARY KEY)
- Email (VARCHAR(100) UNIQUE NOT NULL)
- MatKhau (VARCHAR(255) NOT NULL)
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

try:
    from database import Base
except ImportError:
    from backend.database import Base


class TaiKhoan(Base):
    __tablename__ = "TaiKhoan"

    MaTaiKhoan = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Email      = Column(String(100), unique=True, index=True, nullable=False)
    MatKhau    = Column(String(255), nullable=False)

    # Quan hệ 1 - 1 với NguoiDung
    nguoi_dung = relationship("NguoiDung", back_populates="tai_khoan", uselist=False, cascade="all, delete-orphan")
