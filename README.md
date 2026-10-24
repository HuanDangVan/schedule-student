# 📅 Schedule Student

Ứng dụng quản lý lịch học và công việc cho sinh viên.
**Backend**: Python FastAPI | **Frontend**: React + Vite

---

## 🎯 17 Chức năng chính

1. **Đăng ký tài khoản**: Tạo tài khoản sinh viên mới
2. **Đăng nhập**: Xác thực bằng JWT token
3. **Đăng xuất**: Hủy phiên làm việc
4. **Quản lý thông tin cá nhân**: Cập nhật hồ sơ, đổi mật khẩu
5. **Phân loại công việc**: Danh mục môn học, cá nhân, hoạt động
6. **Thêm công việc**: Tạo mới công việc với hạn chót, mô tả
7. **Sửa công việc**: Cập nhật thông tin chi tiết công việc
8. **Xóa công việc**: Xóa công việc không còn cần thiết
9. **Thiết lập mức độ ưu tiên**: Gán mức ưu tiên (Thấp, Trung bình, Cao, Khẩn cấp)
10. **Đánh dấu hoàn thành**: Chuyển trạng thái hoàn thành / chưa hoàn thành
11. **Xem lịch theo ngày/tuần/tháng**: Giao diện lịch trực quan
12. **Theo dõi tiến độ**: Xem phần trăm hoàn thành theo thời gian thực
13. **Tìm kiếm & lọc công việc**: Tìm theo từ khóa, lọc theo danh mục, trạng thái
14. **Thống kê công việc**: Báo cáo tỷ lệ hoàn thành/chưa hoàn thành
15. **Gợi ý sắp xếp thứ tự công việc**: Gợi ý tối ưu thứ tự thực hiện theo độ ưu tiên và deadline
16. **Nhắc nhở công việc đến hạn**: Thông báo nhắc nhở các công việc sắp tới hạn
17. **Phân tích khả năng hoàn thành**: Dự đoán xác suất hoàn thành công việc đúng hạn

---

## 🚀 Cấu trúc dự án

```
schedule_student/
├── backend/                    # Python FastAPI
│   ├── main.py                 # Entry point, đăng ký tất cả routers
│   ├── database.py             # Kết nối SQLite, get_db()
│   ├── requirements.txt        # Các thư viện phụ thuộc
│   ├── config/                 # Cấu hình hệ thống, biến môi trường
│   ├── models/                 # SQLAlchemy ORM models (User, Task, Category, Reminder)
│   └── api/                    # 12 modules API tương ứng từng chức năng
└── frontend/                   # React + Vite
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── routes/AppRoutes.jsx
        ├── components/         # Layout, Sidebar
        ├── pages/              # 13 trang theo từng chức năng
        └── services/           # Axios API services
```

---

## 🛠️ Cài đặt & Kết nối Cơ sở dữ liệu (SSMS & SQL Server)

1. **Khởi tạo CSDL trong SSMS**:

   - Mở **SQL Server Management Studio (SSMS)** và kết nối tới máy chủ (`localhost` hoặc `.` hoặc `localhost\SQLEXPRESS`).
   - Mở file `database.sql` trong dự án.
   - Nhấn **Execute (F5)** để khởi tạo Database **`QLCVSV`** và toàn bộ các bảng.
2. **Cấu hình môi trường (.env)**:

   - Tạo file `.env` ở thư mục gốc (hoặc sao chép từ `.env.example`):
     ```env
     DATABASE_URL="mssql+pyodbc://LAPTOP-HJVRCNBL%5CSQLEXPRESS/QLCVSV?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
     ```

---

## 💻 Hướng dẫn chạy dự án

### 1. Backend (Python FastAPI)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt toàn bộ thư viện (bao gồm FastAPI, SQLAlchemy, pyodbc, python-dotenv,...)
pip install -r requirements.txt

# Chạy server FastAPI
uvicorn main:app --reload --port 8000
```

- **API Swagger Docs**: http://localhost:8000/docs
- **API Redoc**: http://localhost:8000/redoc

### 2. Frontend (React + Vite)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Khởi động ứng dụng React
npm run dev
```

- **Truy cập giao diện**: http://localhost:5173
