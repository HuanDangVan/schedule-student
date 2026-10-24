
"""
database.py
Kết nối cơ sở dữ liệu SQL Server hoặc SQLite thông qua SQLAlchemy.
Cung cấp engine, SessionLocal, Base và get_db().
"""

import os
import sys

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from config.settings import settings
except ImportError:
    from backend.config.settings import settings


database_url = settings.database_url

if database_url.startswith("mssql+pyodbc://"):
    odbc_connection_string = (
        r"DRIVER={ODBC Driver 17 for SQL Server};"
        r"SERVER=LAPTOP-HJVRCNBL\SQLEXPRESS;"
        r"DATABASE=qlcvsv;"
        r"Trusted_Connection=yes;"
        r"Connection Timeout=5"
    )

    connection_url = URL.create(
        "mssql+pyodbc",
        query={"odbc_connect": odbc_connection_string}
    )

    engine = create_engine(connection_url)
else:
    connect_args = (
        {"check_same_thread": False}
        if database_url.startswith("sqlite")
        else {}
    )

    engine = create_engine(
        database_url,
        connect_args=connect_args
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    """Tạo session DB cho mỗi request và tự động đóng sau khi hoàn tất."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
