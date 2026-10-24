"""
models/phan_tich_hoan_thanh.py
Model đại diện cho bảng "PhanTichKhaNangHoanThanh" trong cơ sở dữ liệu.
Theo đúng định nghĩa trong database.sql:
- MaPhanTich (INT PRIMARY KEY)
- MaCongViec (INT FK -> CongViec)
- XacSuatHoanThanh (DECIMAL / FLOAT)
- MucDoRuiRo (NVARCHAR(50))
- NgayBatDauKhuyenNghi (DATETIME)
- ThoiGianPhanTich (DATETIME)
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

try:
    from database import Base
except ImportError:
    from backend.database import Base


class PhanTichKhaNangHoanThanh(Base):
    __tablename__ = "PhanTichKhaNangHoanThanh"

    MaPhanTich           = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaCongViec          = Column(Integer, ForeignKey("CongViec.MaCongViec"), nullable=False)
    XacSuatHoanThanh     = Column(Float, nullable=True)
    MucDoRuiRo           = Column(String(50), nullable=True)
    NgayBatDauKhuyenNghi = Column(DateTime, nullable=True)
    ThoiGianPhanTich     = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship
    cong_viec = relationship("CongViec", back_populates="phan_tich")
