"""
api/
Chứa toàn bộ các router API, mỗi chức năng được tổ chức trong thư mục riêng biệt.
Mỗi thư mục bao gồm:
  - __init__.py : giải thích chức năng của module
  - router.py   : định nghĩa các endpoints (routes)
  - schemas.py  : Pydantic schemas (mô hình dữ liệu request/response)
  - service.py  : business logic (xử lý nghiệp vụ chính)
"""