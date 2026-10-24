"""
models/nguoi_dung.py
Model đại diện cho bảng "NguoiDung" trong cơ sở dữ liệu.
Theo đúng định nghĩa trong database.sql:
- MaNguoiDung (INT PRIMARY KEY)
- MaTaiKhoan (INT UNIQUE FK -> TaiKhoan)
- HoTen (NVARCHAR(100))
- NgaySinh (DATE)
- GioiTinh (NVARCHAR(10))
- SoDienThoai (VARCHAR(15))
- AnhDaiDien (VARCHAR(255))
- NgayTaoTaiKhoan (DATETIME)
"""
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

try:
    from database import Base
except ImportError:
    from backend.database import Base


class NguoiDung(Base):
    __tablename__ = "NguoiDung"

    MaNguoiDung     = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaTaiKhoan      = Column(Integer, ForeignKey("TaiKhoan.MaTaiKhoan"), unique=True, nullable=False)
    HoTen           = Column(String(100), nullable=False)
    NgaySinh        = Column(Date, nullable=True)
    GioiTinh        = Column(String(10), nullable=True)
    SoDienThoai     = Column(String(15), nullable=True)
    AnhDaiDien      = Column(String(255), nullable=True)
    NgayTaoTaiKhoan = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    tai_khoan = relationship("TaiKhoan", back_populates="nguoi_dung")
    danh_muc  = relationship("DanhMucCongViec", back_populates="nguoi_dung", cascade="all, delete-orphan")
    cong_viec = relationship("CongViec", back_populates="nguoi_dung", cascade="all, delete-orphan")
    goi_y     = relationship("GoiYUuTien", back_populates="nguoi_dung", cascade="all, delete-orphan")
