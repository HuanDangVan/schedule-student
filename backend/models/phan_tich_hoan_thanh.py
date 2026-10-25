
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

try:
    from database import Base
except ImportError:
    from backend.database import Base


class PhanTichKhaNangHoanThanh(Base):
    __tablename__ = "PhanTichKhaNangHoanThanh"

    MaPhanTich = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaCongViec = Column(Integer, ForeignKey("CongViec.MaCongViec"), nullable=False)
    MaNguoiDung = Column(Integer, nullable=True)
    TienDoHienTai = Column(Integer, nullable=True)
    ThoiGianConLai = Column(Integer, nullable=True)
    KhaNangHoanThanh = Column(Numeric, nullable=True)
    KetQuaPhanTich = Column(String, nullable=True)
    ThoiGianPhanTich = Column(DateTime, default=datetime.datetime.utcnow)

    cong_viec = relationship("CongViec", back_populates="phan_tich")
