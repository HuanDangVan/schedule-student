"""
models/nhac_nho.py
Model đại diện cho bảng "NhacNho" trong cơ sở dữ liệu.
Theo đúng định nghĩa trong database.sql:
- MaNhacNho (INT PRIMARY KEY)
- MaCongViec (INT FK -> CongViec)
- NoiDungNhacNho (NVARCHAR(255))
- ThoiGianNhacNho (DATETIME NOT NULL)
- TrangThai (NVARCHAR(30) DEFAULT 'Chưa nhắc')
- DaGui (BOOLEAN / BIT DEFAULT 0)
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

try:
    from database import Base
except ImportError:
    from backend.database import Base


class NhacNho(Base):
    __tablename__ = "NhacNho"

    MaNhacNho       = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaCongViec      = Column(Integer, ForeignKey("CongViec.MaCongViec"), nullable=False)
    NoiDungNhacNho  = Column(String(255), nullable=True)
    ThoiGianNhacNho = Column(DateTime, nullable=False)
    TrangThai       = Column(String(30), default="Chưa nhắc")
    DaGui           = Column(Boolean, default=False)

    # Relationship
    cong_viec = relationship("CongViec", back_populates="nhac_nho")
