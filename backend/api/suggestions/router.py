"""
api/suggestions/router.py
Chức năng 15: Thuật toán gợi ý sắp xếp thứ tự công việc tối ưu theo độ ưu tiên và deadline.
"""
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

try:
    from database import get_db
    from models.cong_viec import CongViec
    from models.goi_y_uu_tien import GoiYUuTien
    from models.nguoi_dung import NguoiDung
    from api.auth.dependencies import get_current_user
    from api.tasks.router import serialize_task
except ImportError:
    from backend.database import get_db
    from backend.models.cong_viec import CongViec
    from backend.models.goi_y_uu_tien import GoiYUuTien
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.dependencies import get_current_user
    from backend.api.tasks.router import serialize_task

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])


def calculate_task_priority(task: CongViec, now: datetime.datetime):
    score = 0.0
    reasons = []

    # 1. Điểm theo Mức độ ưu tiên (0 - 40)
    p_weights = {
        "Khẩn cấp": 40.0,
        "Cao": 30.0,
        "Trung bình": 20.0,
        "Thấp": 10.0
    }
    p_score = p_weights.get(task.MucDoUuTien, 15.0)
    score += p_score
    reasons.append(f"Mức ưu tiên {task.MucDoUuTien} (+{int(p_score)}đ)")

    # 2. Điểm theo Hạn chót (0 - 50)
    if task.HanHoanThanh:
        diff = task.HanHoanThanh - now
        hours_left = diff.total_seconds() / 3600.0

        if hours_left < 0:
            score += 50.0
            reasons.append(f"Đã quá hạn {abs(round(hours_left/24, 1))} ngày! Cần xử lý khẩn cấp (+50đ)")
        elif hours_left <= 24:
            score += 45.0
            reasons.append(f"Chỉ còn {round(hours_left, 1)} giờ nữa là đến hạn chót (+45đ)")
        elif hours_left <= 72:
            score += 30.0
            reasons.append(f"Hạn chót trong vòng 3 ngày tới (+30đ)")
        elif hours_left <= 168:
            score += 15.0
            reasons.append(f"Hạn chót trong tuần này (+15đ)")
        else:
            score += 5.0
            reasons.append(f"Còn nhiều thời gian (+5đ)")
    else:
        score += 5.0
        reasons.append("Chưa đặt hạn hoàn thành (+5đ)")

    # 3. Điểm theo Tiến độ hiện tại (0 - 15)
    if task.TienDo >= 70:
        score += 15.0
        reasons.append(f"Đã đạt {task.TienDo}%, nên tập trung hoàn thiện dứt điểm (+15đ)")
    elif task.TienDo > 0:
        score += 8.0
        reasons.append(f"Đang làm dở {task.TienDo}% (+8đ)")

    return round(score, 1), " • ".join(reasons)


@router.get("", summary="Lấy danh sách gợi ý thứ tự công việc tối ưu")
def get_suggestions(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    # Chỉ xét các công việc chưa hoàn thành
    tasks = db.query(CongViec).filter(
        CongViec.MaNguoiDung == current_user.MaNguoiDung,
        CongViec.TrangThai != "Đã hoàn thành"
    ).all()

    now = datetime.datetime.now()
    scored_tasks = []

    for t in tasks:
        score, reason = calculate_task_priority(t, now)
        scored_tasks.append({
            "task": t,
            "score": score,
            "reason": reason
        })

    # Sắp xếp điểm giảm dần
    scored_tasks.sort(key=lambda x: x["score"], reverse=True)

    results = []
    for rank, item in enumerate(scored_tasks, start=1):
        t = item["task"]
        results.append({
            "ThuTuDeXuat": rank,
            "DiemUuTien": item["score"],
            "LyDoGoiY": item["reason"],
            "task": serialize_task(t)
        })

    return {
        "total_suggestions": len(results),
        "suggestions": results
    }