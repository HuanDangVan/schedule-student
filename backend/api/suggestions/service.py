"""
api/suggestions/service.py
Business logic cho module gợi ý.
  - get_prioritized_tasks(): sắp xếp task theo thuật toán:
      1. Urgent tasks sắp đến hạn
      2. High priority tasks
      3. Medium/Low priority theo due_date
"""
# TODO: Triển khai logic nghiệp vụ tại đây