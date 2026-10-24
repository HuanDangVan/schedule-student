"""
seeder.py - Khởi tạo dữ liệu mẫu cho sinh viên nếu chưa có
"""
import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text

try:
    from database import SessionLocal
    from models.tai_khoan import TaiKhoan
    from models.nguoi_dung import NguoiDung
    from models.danh_muc_cong_viec import DanhMucCongViec
    from models.cong_viec import CongViec
    from models.nhac_nho import NhacNho
    from models.goi_y_uu_tien import GoiYUuTien
    from models.phan_tich_hoan_thanh import PhanTichKhaNangHoanThanh
except ImportError:
    from backend.database import SessionLocal
    from backend.models.tai_khoan import TaiKhoan
    from backend.models.nguoi_dung import NguoiDung
    from backend.models.danh_muc_cong_viec import DanhMucCongViec
    from backend.models.cong_viec import CongViec
    from backend.models.nhac_nho import NhacNho
    from backend.models.goi_y_uu_tien import GoiYUuTien
    from backend.models.phan_tich_hoan_thanh import PhanTichKhaNangHoanThanh


def seed_data():
    db: Session = SessionLocal()
    try:
        # Kiểm tra xem đã có người dùng nào chưa
        user_count = db.query(NguoiDung).count()
        if user_count > 0:
            user = db.query(NguoiDung).first()
        else:
            # Tạo tài khoản và người dùng mặc định
            tk = TaiKhoan(
                Email="sinhvien@schedule.edu.vn",
                MatKhau="123456"
            )
            db.add(tk)
            db.commit()
            db.refresh(tk)

            user = NguoiDung(
                MaTaiKhoan=tk.MaTaiKhoan,
                HoTen="Nguyễn Văn Hướng",
                NgaySinh=datetime.date(2003, 5, 15),
                GioiTinh="Nam",
                SoDienThoai="0987654321",
                AnhDaiDien="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Kiểm tra danh mục
        cat_count = db.query(DanhMucCongViec).filter(DanhMucCongViec.MaNguoiDung == user.MaNguoiDung).count()
        if cat_count == 0:
            categories_data = [
                ("Môn học chuyên ngành", "Các bài tập, tiểu luận, ôn thi các môn học trong kỳ"),
                ("Dự án & Bài tập lớn", "Đồ án nhóm, bài tập lớn lập trình và nghiên cứu"),
                ("Hoạt động ngoại khóa", "Sinh hoạt câu lạc bộ, hội thảo, thể thao"),
                ("Phát triển cá nhân", "Học tiếng Anh, kỹ năng mềm, đọc sách chuyên môn")
            ]
            cats = []
            for name, desc in categories_data:
                c = DanhMucCongViec(
                    MaNguoiDung=user.MaNguoiDung,
                    TenDanhMuc=name,
                    MoTa=desc
                )
                db.add(c)
                cats.append(c)
            db.commit()
            for c in cats:
                db.refresh(c)

            # Thêm công việc mẫu
            now = datetime.datetime.now()
            tasks_data = [
                (
                    cats[1].MaDanhMuc,
                    "Nộp báo cáo bài tập lớn Lập trình Web",
                    "Hoàn thiện code giao diện React và viết tài liệu hướng dẫn sử dụng hệ thống",
                    now - datetime.timedelta(days=3),
                    now + datetime.timedelta(days=2, hours=4),
                    "Khẩn cấp",
                    "Đang làm",
                    75,
                    12,
                    8
                ),
                (
                    cats[0].MaDanhMuc,
                    "Ôn tập thi giữa kỳ Cấu trúc dữ liệu & Giải thuật",
                    "Luyện giải các thuật toán cây nhị phân, đồ thị Dijkstra và sắp xếp nhanh",
                    now - datetime.timedelta(days=1),
                    now + datetime.timedelta(days=3),
                    "Cao",
                    "Đang làm",
                    40,
                    15,
                    5
                ),
                (
                    cats[0].MaDanhMuc,
                    "Làm bài tập trắc nghiệm Toán rời rạc tuần 6",
                    "Nộp qua cổng LMS trước 23:59 chủ nhật tuần này",
                    now,
                    now + datetime.timedelta(days=1),
                    "Cao",
                    "Chưa làm",
                    0,
                    4,
                    0
                ),
                (
                    cats[2].MaDanhMuc,
                    "Họp chuẩn bị Workshop Công nghệ CLB IT",
                    "Lên danh sách diễn giả và chuẩn bị phòng lab số 302",
                    now - datetime.timedelta(days=5),
                    now - datetime.timedelta(days=1),
                    "Trung bình",
                    "Đã hoàn thành",
                    100,
                    6,
                    6
                ),
                (
                    cats[3].MaDanhMuc,
                    "Luyện nghe TOEIC Part 3 & 4 mỗi tối",
                    "Luyện 2 test nghe trên trang web ôn thi chứng chỉ",
                    now,
                    now + datetime.timedelta(days=6),
                    "Thấp",
                    "Đang làm",
                    20,
                    10,
                    2
                ),
                (
                    cats[0].MaDanhMuc,
                    "Đọc trước slide chương Kiến trúc bộ nhớ",
                    "Ghi chép các khái niệm Cache L1, L2 và RAM",
                    now + datetime.timedelta(days=1),
                    now + datetime.timedelta(days=8),
                    "Trung bình",
                    "Chưa làm",
                    0,
                    5,
                    0
                ),
            ]

            created_tasks = []
            for cat_id, title, desc, start_dt, end_dt, priority, status_val, progress, est_hrs, act_hrs in tasks_data:
                t = CongViec(
                    MaNguoiDung=user.MaNguoiDung,
                    MaDanhMuc=cat_id,
                    TenCongViec=title,
                    MoTa=desc,
                    NgayBatDau=start_dt,
                    HanHoanThanh=end_dt,
                    MucDoUuTien=priority,
                    TrangThai=status_val,
                    TienDo=progress,
                    ThoiGianDuKien=est_hrs,
                    ThoiGianThucTe=act_hrs
                )
                db.add(t)
                created_tasks.append(t)
            db.commit()
            for t in created_tasks:
                db.refresh(t)

            # Tạo nhắc nhở mẫu
            if len(created_tasks) > 0:
                t1 = created_tasks[0]
                r1 = NhacNho(
                    MaCongViec=t1.MaCongViec,
                    NoiDungNhacNho="Hạn chót nộp báo cáo Web trong 48h tới, kiểm tra lại slide!",
                    ThoiGianNhacNho=now + datetime.timedelta(hours=12),
                    TrangThai="Chưa nhắc",
                    DaGui=False
                )
                t2 = created_tasks[2]
                r2 = NhacNho(
                    MaCongViec=t2.MaCongViec,
                    NoiDungNhacNho="Đừng quên làm bài tập trắc nghiệm Toán rời rạc tối nay!",
                    ThoiGianNhacNho=now + datetime.timedelta(hours=4),
                    TrangThai="Chưa nhắc",
                    DaGui=False
                )
                db.add_all([r1, r2])
                db.commit()

        print("Seed data completed successfully!")
    except Exception as e:
        db.rollback()
        print("Error during seed:", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
