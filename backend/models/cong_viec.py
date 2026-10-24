"""
models/cong_viec.py
Model đại diện cho bảng "CongViec" trong cơ sở dữ liệu.
Theo đúng định nghĩa trong database.sql:
- MaCongViec (INT PRIMARY KEY)
- MaNguoiDung (INT FK -> NguoiDung)
- MaDanhMuc (INT FK -> DanhMucCongViec)
- TenCongViec (NVARCHAR(200))
- MoTa (NVARCHAR(1000))
- NgayBatDau (DATETIME)
- HanHoanThanh (DATETIME)
- MucDoUuTien (NVARCHAR(30))
- TrangThai (NVARCHAR(30) DEFAULT 'Chưa làm')
- TienDo (INT DEFAULT 0 CHECK 0..100)
- ThoiGianDuKien (INT)
- ThoiGianThucTe (INT)
- NgayTao (DATETIME)
- NgayCapNhat (DATETIME)
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
import datetime

try:
    from database import Base
except ImportError:
    from backend.database import Base


class CongViec(Base):
    __tablename__ = "CongViec"

    MaCongViec     = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaNguoiDung    = Column(Integer, ForeignKey("NguoiDung.MaNguoiDung"), nullable=False)
    MaDanhMuc      = Column(Integer, ForeignKey("DanhMucCongViec.MaDanhMuc"), nullable=False)
    TenCongViec    = Column(String(200), nullable=False)
    MoTa           = Column(String(1000), nullable=True)
    NgayBatDau     = Column(DateTime, nullable=True)
    HanHoanThanh   = Column(DateTime, nullable=True)
    MucDoUuTien    = Column(String(30), default="Trung bình")
    TrangThai      = Column(String(30), default="Chưa làm")
    TienDo         = Column(Integer, default=0)
    ThoiGianDuKien = Column(Integer, nullable=True)
    ThoiGianThucTe = Column(Integer, nullable=True)
    NgayTao        = Column(DateTime, default=datetime.datetime.utcnow)
    NgayCapNhat    = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    __table_args__ = (
        CheckConstraint("TienDo >= 0 AND TienDo <= 100", name="CK_CongViec_TienDo"),
    )

    # Relationships
    nguoi_dung = relationship("NguoiDung", back_populates="cong_viec")
    danh_muc   = relationship("DanhMucCongViec", back_populates="cong_viec")
    nhac_nho   = relationship("NhacNho", back_populates="cong_viec", cascade="all, delete-orphan")
    goi_y      = relationship("GoiYUuTien", back_populates="cong_viec", cascade="all, delete-orphan")
    phan_tich  = relationship("PhanTichKhaNangHoanThanh", back_populates="cong_viec", cascade="all, delete-orphan")
