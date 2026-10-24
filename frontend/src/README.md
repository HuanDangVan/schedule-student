# Frontend - Schedule Student

## Cấu trúc thư mục

```
src/
├── main.jsx          # Entry point - render App vào DOM
├── App.jsx           # Root component
├── index.css         # Global styles, biến CSS
│
├── routes/
│   └── AppRoutes.jsx # TẤT CẢ các routes định nghĩa tại đây
│
├── components/       # Component dùng chung
│   ├── Layout.jsx    # Layout với sidebar (dùng cho trang private)
│   └── Sidebar.jsx   # Thanh điều hướng bên trái
│
├── services/         # Giao tiếp với backend API
│   ├── api.js              # Axios instance (token, xử lý lỗi)
│   ├── authService.js      # API xác thực (login, register, logout)
│   ├── taskService.js      # API công việc (CRUD, priority, complete)
│   ├── calendarService.js  # API lịch (day, week, month)
│   └── statisticsService.js# API thống kê, tiến độ, tìm kiếm, gợi ý
│
└── pages/            # 13 trang chức năng
    ├── auth/         # Đăng nhập & Đăng ký (không dùng Layout)
    ├── dashboard/    # Tổng quan nhanh
    ├── profile/      # Quản lý hồ sơ cá nhân (Chức năng 4)
    ├── categories/   # Phân loại công việc (Chức năng 5)
    ├── tasks/        # Quản lý công việc (Chức năng 6, 7, 8, 9, 10)
    ├── calendar/     # Xem lịch ngày/tuần/tháng (Chức năng 11)
    ├── progress/     # Theo dõi tiến độ (Chức năng 12)
    ├── search/       # Tìm kiếm & Lọc (Chức năng 13)
    ├── statistics/   # Thống kê hoàn thành/chưa hoàn thành (Chức năng 14)
    ├── suggestions/  # Gợi ý sắp xếp thứ tự ưu tiên (Chức năng 15)
    ├── reminders/    # Nhắc nhở công việc đến hạn (Chức năng 16)
    └── analysis/     # Phân tích khả năng hoàn thành (Chức năng 17)
```
