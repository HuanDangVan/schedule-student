
"""
models/danh_muc_cong_viec.py
Model đại diện cho bảng "DanhMucCongViec" trong cơ sở dữ liệu.
"""
from sqlalchemy import Column, Integer, Unicode, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

try:
    from database import Base
except ImportError:
    from backend.database import Base


class DanhMucCongViec(Base):
    __tablename__ = "DanhMucCongViec"

    MaDanhMuc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaNguoiDung = Column(Integer, ForeignKey("NguoiDung.MaNguoiDung"), nullable=False)
    TenDanhMuc = Column(Unicode(100), nullable=False)
    MoTa = Column(Unicode(500), nullable=True)
    NgayTao = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    nguoi_dung = relationship("NguoiDung", back_populates="danh_muc")
    cong_viec = relationship("CongViec", back_populates="danh_muc")
