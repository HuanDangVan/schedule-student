
"""
models/cong_viec.py
Model đại diện cho bảng CongViec trong cơ sở dữ liệu.
"""

import datetime

from sqlalchemy import (
    Column, Integer, DateTime, ForeignKey,
    CheckConstraint, NVARCHAR
)
from sqlalchemy.orm import relationship

try:
    from database import Base
except ImportError:
    from backend.database import Base


class CongViec(Base):
    __tablename__ = "CongViec"

    MaCongViec = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaNguoiDung = Column(Integer, ForeignKey("NguoiDung.MaNguoiDung"), nullable=False)
    MaDanhMuc = Column(Integer, ForeignKey("DanhMucCongViec.MaDanhMuc"), nullable=False)

    # Dùng NVARCHAR để lưu tiếng Việt Unicode
    TenCongViec = Column(NVARCHAR(200), nullable=False)
    MoTa = Column(NVARCHAR(1000), nullable=True)
    MucDoUuTien = Column(NVARCHAR(30), default="Trung bình")
    TrangThai = Column(NVARCHAR(30), default="Chưa làm")

    NgayBatDau = Column(DateTime, nullable=True)
    HanHoanThanh = Column(DateTime, nullable=True)
    TienDo = Column(Integer, default=0)
    ThoiGianDuKien = Column(Integer, nullable=True)
    ThoiGianThucTe = Column(Integer, nullable=True)
    NgayTao = Column(DateTime, default=datetime.datetime.utcnow)
    NgayCapNhat = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    __table_args__ = (
        CheckConstraint(
            "TienDo >= 0 AND TienDo <= 100",
            name="CK_CongViec_TienDo"
        ),
    )

    nguoi_dung = relationship("NguoiDung", back_populates="cong_viec")
    danh_muc = relationship("DanhMucCongViec", back_populates="cong_viec")
    nhac_nho = relationship(
        "NhacNho",
        back_populates="cong_viec",
        cascade="all, delete-orphan"
    )
    goi_y = relationship(
        "GoiYUuTien",
        back_populates="cong_viec",
        cascade="all, delete-orphan"
    )
    phan_tich = relationship(
        "PhanTichKhaNangHoanThanh",
        back_populates="cong_viec",
        cascade="all, delete-orphan"
    )
