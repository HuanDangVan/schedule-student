"""
models/danh_muc_cong_viec.py
Model đại diện cho bảng "DanhMucCongViec" trong cơ sở dữ liệu.
Theo đúng định nghĩa trong database.sql:
- MaDanhMuc (INT PRIMARY KEY)
- MaNguoiDung (INT FK -> NguoiDung)
- TenDanhMuc (NVARCHAR(100))
- MoTa (NVARCHAR(500))
- NgayTao (DATETIME)
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

try:
    from database import Base
except ImportError:
    from backend.database import Base


class DanhMucCongViec(Base):
    __tablename__ = "DanhMucCongViec"

    MaDanhMuc   = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaNguoiDung = Column(Integer, ForeignKey("NguoiDung.MaNguoiDung"), nullable=False)
    TenDanhMuc  = Column(String(100), nullable=False)
    MoTa        = Column(String(500), nullable=True)
    NgayTao     = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    nguoi_dung = relationship("NguoiDung", back_populates="danh_muc")
    cong_viec  = relationship("CongViec", back_populates="danh_muc")
