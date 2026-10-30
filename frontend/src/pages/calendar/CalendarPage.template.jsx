
/**
 * pages/calendar/CalendarPage.template.jsx
 * Giao diện Lịch biểu trực quan: Theo Tháng, Theo Tuần, Theo Ngày.
 * Đã sửa lỗi lệch ngày do chuyển đổi UTC.
 */

import { useState } from "react";
import Layout from "../../components/Layout";
import "./CalendarPage.css";

export default function CalendarPageTemplate({
  events,
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onToggleComplete,
  isLoading
}) {
  const [selectedTask, setSelectedTask] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Chuyển Date thành YYYY-MM-DD theo giờ địa phương
  // Không sử dụng toISOString() vì có thể gây lệch ngày.
  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  // Lấy ngày của một công việc theo dữ liệu ngày từ API
  const getTaskDate = (event) => {
    const dateValue =
      event.HanHoanThanh || event.NgayBatDau || event.date;

    if (!dateValue) return null;

    // Nếu API trả về chuỗi ngày YYYY-MM-DD hoặc datetime
    // thì lấy phần ngày, tránh tự chuyển đổi múi giờ.
    if (typeof dateValue === "string") {
      return dateValue.substring(0, 10);
    }

    // Nếu dữ liệu là đối tượng Date
    if (dateValue instanceof Date && !isNaN(dateValue)) {
      return formatLocalDate(dateValue);
    }

    return null;
  };

  // Lấy các công việc thuộc một ngày
  const getEventsForDate = (dateStr) => {
    return (events || []).filter((event) => {
      return getTaskDate(event) === dateStr;
    });
  };

  // Tính các ngày hiển thị trong lưới tháng
  const getDaysInMonthGrid = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Chuyển thứ trong tuần về chuẩn:
    // Thứ 2 = 0, Thứ 3 = 1, ..., Chủ nhật = 6
    const startingDay = (firstDayOfMonth.getDay() + 6) % 7;

    const daysInMonth = lastDayOfMonth.getDate();
    const days = [];

    // Các ngày thuộc tháng trước
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);

      days.push({
        dayNumber: date.getDate(),
        dateStr: formatLocalDate(date),
        isCurrentMonth: false
      });
    }

    // Các ngày thuộc tháng hiện tại
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);

      days.push({
        dayNumber: d,
        dateStr: formatLocalDate(date),
        isCurrentMonth: true
      });
    }

    // Các ngày thuộc tháng tiếp theo
    const totalSlots = days.length > 35 ? 42 : 35;
    const remaining = totalSlots - days.length;

    for (let r = 1; r <= remaining; r++) {
      const date = new Date(year, month + 1, r);

      days.push({
        dayNumber: r,
        dateStr: formatLocalDate(date),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const daysGrid = getDaysInMonthGrid();

  // Ngày hiện tại theo giờ địa phương
  const todayDateStr = formatLocalDate(new Date());

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12"
  ];

  const dayHeaders = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật"
  ];

  return (
    <Layout>
      <div className="cal-container">

        {/* Thanh điều khiển lịch */}
        <div className="cal-topbar">
          <div className="cal-nav-group">
            <h1 className="cal-title">
              {monthNames[month]} {year}
            </h1>

            <div className="cal-nav-buttons">
              <button
                className="cal-btn-nav"
                onClick={onPrev}
                title="Trước"
              >
                ‹
              </button>

              <button
                className="cal-btn-today"
                onClick={onToday}
              >
                Hôm nay
              </button>

              <button
                className="cal-btn-nav"
                onClick={onNext}
                title="Sau"
              >
                ›
              </button>
            </div>
          </div>

          {/* Chuyển chế độ xem */}
          <div className="cal-view-modes">
            <button
              className={`cal-mode-btn ${view === "month" ? "active" : ""}`}
              onClick={() => onViewChange("month")}
            >
              Tháng
            </button>

            <button
              className={`cal-mode-btn ${view === "week" ? "active" : ""}`}
              onClick={() => onViewChange("week")}
            >
              Tuần
            </button>

            <button
              className={`cal-mode-btn ${view === "day" ? "active" : ""}`}
              onClick={() => onViewChange("day")}
            >
              Ngày
            </button>
          </div>
        </div>

        {/* Chế độ xem theo tháng */}
        {view === "month" && (
          <div className="cal-month-board">

            <div className="cal-day-headers">
              {dayHeaders.map((day, index) => (
                <div
                  key={index}
                  className="cal-day-header-cell"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="cal-grid">
              {daysGrid.map((cell, index) => {
                const isToday = cell.dateStr === todayDateStr;
                const cellEvents = getEventsForDate(cell.dateStr);

                return (
                  <div
                    key={index}
                    className={`cal-cell ${!cell.isCurrentMonth ? "other-month" : ""
                      } ${isToday ? "today-cell" : ""}`}
                  >
                    <div className="cal-cell-header">
                      <span
                        className={`day-number ${isToday ? "today-badge" : ""
                          }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {cellEvents.length > 0 && (
                        <span className="cell-count-tag">
                          {cellEvents.length} việc
                        </span>
                      )}
                    </div>

                    <div className="cal-cell-events">
                      {cellEvents.map((event) => (
                        <div
                          key={event.MaCongViec}
                          className={`cal-event-pill ${event.MucDoUuTien === "Khẩn cấp"
                              ? "pill-urgent"
                              : event.MucDoUuTien === "Cao"
                                ? "pill-high"
                                : event.MucDoUuTien === "Trung bình"
                                  ? "pill-med"
                                  : "pill-low"
                            } ${event.TrangThai === "Đã hoàn thành"
                              ? "pill-done"
                              : ""
                            }`}
                          onClick={() => setSelectedTask(event)}
                          title={`${event.TenCongViec} (${event.TrangThai})`}
                        >
                          <span className="pill-dot"></span>
                          <span className="pill-text">
                            {event.TenCongViec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chế độ xem theo tuần */}
        {view === "week" && (
          <div className="cal-week-board">
            <div className="cal-week-grid">
              {daysGrid.slice(0, 7).map((cell, index) => {
                const cellEvents = getEventsForDate(cell.dateStr);
                const isToday = cell.dateStr === todayDateStr;

                return (
                  <div
                    key={index}
                    className={`cal-week-col ${isToday ? "today-col" : ""
                      }`}
                  >
                    <div className="cal-week-col-header">
                      <span>{dayHeaders[index]}</span>

                      <strong className={isToday ? "today-badge" : ""}>
                        {cell.dayNumber}
                      </strong>
                    </div>

                    <div className="cal-week-col-body">
                      {cellEvents.map((event) => (
                        <div
                          key={event.MaCongViec}
                          className="cal-week-task-card"
                          onClick={() => setSelectedTask(event)}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 4
                            }}
                          >
                            <span className="task-cat-badge">
                              {event.TenDanhMuc}
                            </span>

                            <span
                              className={`badge-priority ${event.MucDoUuTien === "Khẩn cấp"
                                  ? "khan-cap"
                                  : event.MucDoUuTien === "Cao"
                                    ? "cao"
                                    : event.MucDoUuTien === "Trung bình"
                                      ? "trung-binh"
                                      : "thap"
                                }`}
                            >
                              {event.MucDoUuTien}
                            </span>
                          </div>

                          <div className="week-task-title">
                            {event.TenCongViec}
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--color-text-muted)",
                              marginTop: 4
                            }}
                          >
                            Trạng thái: <strong>{event.TrangThai}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chế độ xem theo ngày */}
        {view === "day" && (
          <div className="cal-day-board">
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>
              Danh sách công việc ngày:{" "}
              {currentDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </h2>

            <div className="cal-day-list">
              {getEventsForDate(formatLocalDate(currentDate)).map((event) => (
                <div
                  key={event.MaCongViec}
                  className="cal-day-item"
                  onClick={() => setSelectedTask(event)}
                >
                  <div
                    className="pill-dot"
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "var(--color-primary)"
                    }}
                  ></div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>
                      {event.TenCongViec}
                    </h3>

                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        marginTop: 2
                      }}
                    >
                      🏷️ {event.TenDanhMuc} • Mức ưu tiên:{" "}
                      {event.MucDoUuTien} • Tiến độ: {event.TienDo}%
                    </p>
                  </div>

                  <span className="badge-status dang-lam">
                    {event.TrangThai}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popup chi tiết công việc */}
        {selectedTask && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedTask(null)}
          >
            <div
              className="modal-content"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-header">
                <h3 className="modal-title">
                  Chi tiết công việc
                </h3>

                <button
                  className="modal-close"
                  onClick={() => setSelectedTask(null)}
                >
                  ×
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <span
                    className={`badge-priority ${selectedTask.MucDoUuTien === "Khẩn cấp"
                        ? "khan-cap"
                        : selectedTask.MucDoUuTien === "Cao"
                          ? "cao"
                          : selectedTask.MucDoUuTien === "Trung bình"
                            ? "trung-binh"
                            : "thap"
                      }`}
                  >
                    {selectedTask.MucDoUuTien}
                  </span>

                  <span className="task-cat-badge">
                    🏷️ {selectedTask.TenDanhMuc}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--color-text)"
                  }}
                >
                  {selectedTask.TenCongViec}
                </h2>

                {selectedTask.MoTa && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5
                    }}
                  >
                    {selectedTask.MoTa}
                  </p>
                )}

                <div className="task-meta-list">
                  <div className="meta-item">
                    <span>⏰ Hạn hoàn thành: </span>

                    <strong>
                      {selectedTask.HanHoanThanh
                        ? new Date(
                          selectedTask.HanHoanThanh
                        ).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "numeric",
                          year: "numeric"
                        })
                        : "Không có hạn chót"}
                    </strong>
                  </div>

                  <div className="meta-item">
                    <span>📊 Trạng thái: </span>

                    <strong>
                      {selectedTask.TrangThai} ({selectedTask.TienDo}%)
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 10
                  }}
                >
                  <button
                    className="btn-primary"
                    onClick={() => {
                      onToggleComplete(
                        selectedTask.MaCongViec,
                        selectedTask.TrangThai === "Đã hoàn thành"
                      );

                      setSelectedTask(null);
                    }}
                  >
                    {selectedTask.TrangThai === "Đã hoàn thành"
                      ? "Chuyển thành Chưa hoàn thành"
                      : "Đánh dấu Hoàn thành ✓"}
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedTask(null)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
