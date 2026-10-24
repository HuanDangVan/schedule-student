USE master;
GO

IF DB_ID('qlcvsv') IS NOT NULL
BEGIN
    ALTER DATABASE qlcvsv
    SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

    DROP DATABASE qlcvsv;
END
GO

CREATE DATABASE qlcvsv;
GO

USE qlcvsv;
GO


-- BẢNG TÀI KHOẢN

CREATE TABLE TaiKhoan (
    MaTaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    Email VARCHAR(100) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL
);
GO



-- BẢNG NGƯỜI DÙNG

CREATE TABLE NguoiDung (
    MaNguoiDung INT IDENTITY(1,1) PRIMARY KEY,
    MaTaiKhoan INT NOT NULL UNIQUE,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh NVARCHAR(10),
    SoDienThoai VARCHAR(15),
    AnhDaiDien VARCHAR(255),
    NgayTaoTaiKhoan DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_NguoiDung_TaiKhoan
        FOREIGN KEY (MaTaiKhoan)
        REFERENCES TaiKhoan(MaTaiKhoan)
);
GO



-- BẢNG DANH MỤC CÔNG VIỆC

CREATE TABLE DanhMucCongViec (
    MaDanhMuc INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    TenDanhMuc NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(500),
    NgayTao DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_DanhMuc_NguoiDung
        FOREIGN KEY (MaNguoiDung)
        REFERENCES NguoiDung(MaNguoiDung)
);
GO



--  BẢNG CÔNG VIỆC

CREATE TABLE CongViec (
    MaCongViec INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    MaDanhMuc INT NOT NULL,
    TenCongViec NVARCHAR(200) NOT NULL,
    MoTa NVARCHAR(1000),
    NgayBatDau DATETIME,
    HanHoanThanh DATETIME,
    MucDoUuTien NVARCHAR(30),
    TrangThai NVARCHAR(30) DEFAULT N'Chưa làm',
    TienDo INT DEFAULT 0,
    ThoiGianDuKien INT,
    ThoiGianThucTe INT,
    NgayTao DATETIME DEFAULT GETDATE(),
    NgayCapNhat DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_CongViec_NguoiDung
        FOREIGN KEY (MaNguoiDung)
        REFERENCES NguoiDung(MaNguoiDung),

    CONSTRAINT FK_CongViec_DanhMuc
        FOREIGN KEY (MaDanhMuc)
        REFERENCES DanhMucCongViec(MaDanhMuc),

    CONSTRAINT CK_CongViec_TienDo
        CHECK (TienDo BETWEEN 0 AND 100)
);
GO



--  BẢNG NHẮC NHỞ

CREATE TABLE NhacNho (
    MaNhacNho INT IDENTITY(1,1) PRIMARY KEY,
    MaCongViec INT NOT NULL,
    NoiDungNhacNho NVARCHAR(255),
    ThoiGianNhacNho DATETIME NOT NULL,
    TrangThai NVARCHAR(30) DEFAULT N'Chưa nhắc',
    DaGui BIT DEFAULT 0,

    CONSTRAINT FK_NhacNho_CongViec
        FOREIGN KEY (MaCongViec)
        REFERENCES CongViec(MaCongViec)
);
GO



--BẢNG GỢI Ý ƯU TIÊN

CREATE TABLE GoiYUuTien (
    MaGoiY INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    MaCongViec INT NOT NULL,
    DiemUuTien DECIMAL(5,2),
    ThuTuDeXuat INT,
    LyDoGoiY NVARCHAR(1000),
    ThoiGianGoiY DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_GoiY_NguoiDung
        FOREIGN KEY (MaNguoiDung)
        REFERENCES NguoiDung(MaNguoiDung),

    CONSTRAINT FK_GoiY_CongViec
        FOREIGN KEY (MaCongViec)
        REFERENCES CongViec(MaCongViec)
);
GO



--BẢNG PHÂN TÍCH KHẢ NĂNG HOÀN THÀNH

CREATE TABLE PhanTichKhaNangHoanThanh (
    MaPhanTich INT IDENTITY(1,1) PRIMARY KEY,
    MaCongViec INT NOT NULL,
    XacSuatHoanThanh DECIMAL(5,2),
    MucDoRuiRo NVARCHAR(50),
    NgayBatDauKhuyenNghi DATETIME,
    ThoiGianPhanTich DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_PhanTich_CongViec
        FOREIGN KEY (MaCongViec)
        REFERENCES CongViec(MaCongViec)
);
GO
