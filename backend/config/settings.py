"""
config/settings.py
Tập tin cấu hình trung tâm của ứng dụng.
Chứa: SECRET_KEY, DATABASE_URL, cài đặt JWT, CORS origins,...
"""
try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseModel as BaseSettings
    SettingsConfigDict = None


import os
from pathlib import Path

# Đường dẫn cố định đến database ở thư mục gốc dự án
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = (PROJECT_ROOT / "schedule_student.db").as_posix()


class Settings(BaseSettings):
    app_name: str = "Schedule Student API"
    database_url: str = (
       "mssql+pyodbc://LAPTOP-HJVRCNBL%5CSQLEXPRESS/qlcvsv?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
    )

    if SettingsConfigDict:
        model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    else:
        class Config:
            env_file = ".env"
            extra = "ignore"

settings = Settings()