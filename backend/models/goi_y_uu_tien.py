"""
models/goi_y_uu_tien.py
Model đại diện cho bảng "GoiYUuTien" trong cơ sở dữ liệu.
Theo đúng định nghĩa trong database.sql:
- MaGoiY (INT PRIMARY KEY)
- MaNguoiDung (INT FK -> NguoiDung)
- MaCongViec (INT FK -> CongViec)
- DiemUuTien (DECIMAL / FLOAT)
- ThuTuDeXuat (INT)
- LyDoGoiY (NVARCHAR(1000))
- ThoiGianGoiY (DATETIME)
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

try:
    from database import Base
except ImportError:
    from backend.database import Base


class GoiYUuTien(Base):
    __tablename__ = "GoiYUuTien"

    MaGoiY       = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaNguoiDung  = Column(Integer, ForeignKey("NguoiDung.MaNguoiDung"), nullable=False)
    MaCongViec   = Column(Integer, ForeignKey("CongViec.MaCongViec"), nullable=False)
    DiemUuTien   = Column(Float, nullable=True)
    ThuTuDeXuat  = Column(Integer, nullable=True)
    LyDoGoiY     = Column(String(1000), nullable=True)
    ThoiGianGoiY = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    nguoi_dung = relationship("NguoiDung", back_populates="goi_y")
    cong_viec  = relationship("CongViec", back_populates="goi_y")
