"""
main.py - Entry point của FastAPI backend
Khởi tạo ứng dụng FastAPI, đăng ký tất cả routers, cấu hình CORS.

Chạy server: uvicorn main:app --reload --port 8000
API docs:    http://localhost:8000/docs
"""
import os
import sys
import logging

# Đảm bảo đường dẫn backend nằm trong sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

try:
    from database import Base, engine
    import models  # Đảm bảo các model được nạp để Base.metadata nhận diện
    from config.settings import settings
except ImportError:
    from backend.database import Base, engine
    from backend import models
    from backend.config.settings import settings

# ─── Cấu hình logging ───────────────────────────────────────────────
logger = logging.getLogger("schedule_student")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(
    "\033[1m%(asctime)s\033[0m | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S"
))
logger.addHandler(handler)

# ─── Kiểm tra kết nối CSDL ──────────────────────────────────────────
def check_database_connection():
    """Kiểm tra kết nối đến cơ sở dữ liệu và log kết quả."""
    try:
        with engine.connect() as conn:
            # Lấy tên database đang kết nối
            if settings.database_url.startswith("mssql"):
                db_name = conn.execute(text("SELECT DB_NAME()")).scalar()
                db_type = "SQL Server"
            else:
                db_name = settings.database_url.split("/")[-1]
                db_type = "SQLite"

            # Đếm số bảng trong database
            if settings.database_url.startswith("mssql"):
                table_count = conn.execute(
                    text("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'")
                ).scalar()
            else:
                table_count = conn.execute(
                    text("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
                ).scalar()

        logger.info("\033[92m✅ KẾT NỐI CSDL THÀNH CÔNG!\033[0m")
        logger.info(f"   📦 Loại CSDL   : {db_type}")
        logger.info(f"   🗄️  Database    : {db_name}")
        logger.info(f"   📋 Số bảng     : {table_count}")
        return True
    except Exception as e:
        logger.error(f"\033[91m❌ KẾT NỐI CSDL THẤT BẠI!\033[0m")
        logger.error(f"   🔗 URL: {settings.database_url}")
        logger.error(f"   💥 Lỗi: {e}")
        return False

# Thực hiện kiểm tra kết nối khi khởi động
logger.info("=" * 55)
logger.info("\033[96m🚀 KHỞI ĐỘNG SCHEDULE STUDENT BACKEND...\033[0m")
logger.info("=" * 55)

db_connected = check_database_connection()

# Tạo các bảng trong database (nếu chưa có)
if db_connected:
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("\033[92m✅ Đồng bộ bảng (metadata) thành công!\033[0m")
    except Exception as e:
        logger.error(f"\033[91m❌ Lỗi đồng bộ bảng: {e}\033[0m")
else:
    logger.warning("\033[93m⚠️  Bỏ qua đồng bộ bảng do không kết nối được CSDL.\033[0m")

app = FastAPI(
    title="Schedule Student API",
    description="API quản lý lịch học và công việc cho sinh viên",
    version="1.0.0"
)

# Cấu hình CORS - cho phép React frontend kết nối
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import tất cả routers
from api.auth.router        import router as auth_router
from api.profile.router     import router as profile_router
from api.categories.router  import router as categories_router
from api.tasks.router       import router as tasks_router
from api.priority.router    import router as priority_router
from api.completion.router  import router as completion_router
from api.calendar.router    import router as calendar_router
from api.progress.router    import router as progress_router
from api.search.router      import router as search_router
from api.statistics.router  import router as statistics_router
from api.suggestions.router import router as suggestions_router
from api.reminders.router   import router as reminders_router
from api.analysis.router    import router as analysis_router

# Đăng ký tất cả routers với prefix /api
app.include_router(auth_router,        prefix="/api")
app.include_router(profile_router,     prefix="/api")
app.include_router(categories_router,  prefix="/api")
app.include_router(tasks_router,       prefix="/api")
app.include_router(priority_router,    prefix="/api")
app.include_router(completion_router,  prefix="/api")
app.include_router(calendar_router,    prefix="/api")
app.include_router(progress_router,    prefix="/api")
app.include_router(search_router,      prefix="/api")
app.include_router(statistics_router,  prefix="/api")
app.include_router(suggestions_router, prefix="/api")
app.include_router(reminders_router,   prefix="/api")
app.include_router(analysis_router,    prefix="/api")

# Log hoàn tất khởi động
if db_connected:
    logger.info("\033[92m" + "=" * 55 + "\033[0m")
    logger.info("\033[92m✅ BACKEND KHỞI ĐỘNG THÀNH CÔNG!\033[0m")
    logger.info(f"   📖 API Docs : http://localhost:8000/docs")
    logger.info(f"   🌐 Frontend : http://localhost:5173")
    logger.info("\033[92m" + "=" * 55 + "\033[0m")
else:
    logger.error("\033[91m" + "=" * 55 + "\033[0m")
    logger.error("\033[91m❌ BACKEND KHỞI ĐỘNG THẤT BẠI - Kiểm tra lại CSDL!\033[0m")
    logger.error("\033[91m" + "=" * 55 + "\033[0m")


@app.get("/", tags=["Root"])
def root():
    """Kiểm tra tình trạng hoạt động của máy chủ (Health check)."""
    return {
        "status": "ok" if db_connected else "error",
        "message": "Schedule Student API đang hoạt động bình thường" if db_connected
                   else "Backend hoạt động nhưng CSDL không kết nối được",
        "database": "connected" if db_connected else "disconnected",
        "docs": "/docs"
    }