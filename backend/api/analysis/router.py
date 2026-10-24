"""
api/analysis/router.py
Chức năng 17: Phân tích khả năng hoàn thành công việc và dự đoán rủi ro.
"""
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

try:
    from database import get_db
    from models.cong_viec import CongViec
    from models.nguoi_dung import NguoiDung
    from api.auth.dependencies import get_current_user
    from api.tasks.router import serialize_task
except ImportError:
    from backend.database import get_db
    from backend.models.cong_viec import CongViec
    from backend.models.nguoi_dung import NguoiDung
    from backend.api.auth.dependencies import get_current_user
    from backend.api.tasks.router import serialize_task

router = APIRouter(prefix="/analysis", tags=["Analysis"])


def analyze_task_completion(task: CongViec, now: datetime.datetime):
    # Thời gian còn lại tính bằng ngày
    if task.TrangThai == "Đã hoàn thành":
        return {
            "MaCongViec": task.MaCongViec,
            "TenCongViec": task.TenCongViec,
            "XacSuatHoanThanh": 100.0,
            "MucDoRuiRo": "Hoàn thành",
            "SoNgayConLai": 0,
            "GioConLaiUocTinh": 0,
            "GioMoiNgayCanLam": 0,
            "KhuyenNghi": "Công việc đã hoàn thành xuất sắc!",
            "task": serialize_task(task)
        }

    est_total_hours = task.ThoiGianDuKien or 8
    remaining_ratio = (100 - task.TienDo) / 100.0
    remaining_hours = max(1.0, est_total_hours * remaining_ratio)

    if not task.HanHoanThanh:
        return {
            "MaCongViec": task.MaCongViec,
            "TenCongViec": task.TenCongViec,
            "XacSuatHoanThanh": 70.0,
            "MucDoRuiRo": "Trung bình",
            "SoNgayConLai": 999,
            "GioConLaiUocTinh": round(remaining_hours, 1),
            "GioMoiNgayCanLam": 1.0,
            "KhuyenNghi": "Chưa đặt hạn hoàn thành. Bạn nên đặt deadline cụ thể để kiểm soát tiến độ tốt hơn.",
            "task": serialize_task(task)
        }

    time_delta = task.HanHoanThanh - now
    days_left = time_delta.total_seconds() / 86400.0

    if days_left <= 0:
        # Đã quá hạn
        prob = max(10.0, round(task.TienDo * 0.4, 1))
        risk = "Trễ hạn"
        advice = f"Công việc đã quá hạn {abs(round(days_left, 1))} ngày! Cần nỗ lực gấp rút hoàn tất ngay hôm nay."
        hrs_per_day = round(remaining_hours, 1)
    else:
        # Số giờ làm việc hợp lý mỗi ngày của sinh viên thường là 2-4 giờ cho một môn/task
        hours_per_day_needed = remaining_hours / max(0.5, days_left)

        if hours_per_day_needed <= 2.0:
            prob = min(98.0, round(90.0 + task.TienDo * 0.08, 1))
            risk = "An toàn"
            advice = f"Tiến độ rất tốt. Chỉ cần dành khoảng {round(hours_per_day_needed, 1)} giờ/ngày là sẽ hoàn thành đúng hạn."
        elif hours_per_day_needed <= 5.0:
            prob = max(40.0, min(80.0, round(75.0 - (hours_per_day_needed - 2.0) * 10.0 + task.TienDo * 0.1, 1)))
            risk = "Cần lưu ý"
            advice = f"Cần tăng tốc! Bạn cần dành ít nhất {round(hours_per_day_needed, 1)} giờ/ngày để không bị trễ hạn."
        else:
            prob = max(15.0, min(45.0, round(45.0 - (hours_per_day_needed - 5.0) * 5.0, 1)))
            risk = "Rủi ro cao"
            advice = f"Nguy cơ trễ hạn cao! Khối lượng còn lại cần {round(remaining_hours, 1)}h mà chỉ còn {round(days_left, 1)} ngày. Hãy ưu tiên làm ngay!"

        hrs_per_day = round(hours_per_day_needed, 1)

    return {
        "MaCongViec": task.MaCongViec,
        "TenCongViec": task.TenCongViec,
        "XacSuatHoanThanh": prob,
        "MucDoRuiRo": risk,
        "SoNgayConLai": round(days_left, 1) if days_left > 0 else 0,
        "GioConLaiUocTinh": round(remaining_hours, 1),
        "GioMoiNgayCanLam": hrs_per_day,
        "KhuyenNghi": advice,
        "task": serialize_task(task)
    }


@router.get("", summary="Phân tích khả năng hoàn thành tất cả công việc")
def get_analysis(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    tasks = db.query(CongViec).filter(
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).all()

    now = datetime.datetime.now()
    analyses = [analyze_task_completion(t, now) for t in tasks]

    # Tổng kết
    total = len(analyses)
    safe_count = sum(1 for a in analyses if a["MucDoRuiRo"] in ["An toàn", "Hoàn thành"])
    warning_count = sum(1 for a in analyses if a["MucDoRuiRo"] == "Cần lưu ý")
    high_risk_count = sum(1 for a in analyses if a["MucDoRuiRo"] in ["Rủi ro cao", "Trễ hạn"])

    avg_prob = round(sum(a["XacSuatHoanThanh"] for a in analyses) / total, 1) if total > 0 else 0

    return {
        "summary": {
            "total_tasks": total,
            "safe_count": safe_count,
            "warning_count": warning_count,
            "high_risk_count": high_risk_count,
            "average_probability": avg_prob
        },
        "tasks_analysis": analyses
    }


@router.get("/{task_id}", summary="Phân tích khả năng hoàn thành một công việc")
def get_task_analysis(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    task = db.query(CongViec).filter(
        CongViec.MaCongViec == task_id,
        CongViec.MaNguoiDung == current_user.MaNguoiDung
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")

    now = datetime.datetime.now()
    return analyze_task_completion(task, now)