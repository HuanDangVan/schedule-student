/**
 * pages/calendar/CalendarPage.template.jsx
 * Giao diện Lịch biểu trực quan: Theo Tháng, Theo Tuần, Theo Ngày (Chức năng 11).
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

  // Helper tính các ngày trong tháng cho Month View Grid
  const getDaysInMonthGrid = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Thứ trong tuần của ngày 1 (0: CN, 1: T2, ..., 6: T7). Chuyển sang chuẩn T2 = 0, CN = 6
    let startingDay = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];
    // Các ngày của tháng trước để lấp đầy hàng đầu
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthLastDay - i,
        dateStr: new Date(year, month - 1, prevMonthLastDay - i).toISOString().split("T")[0],
        isCurrentMonth: false
      });
    }

    // Các ngày trong tháng này
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        dayNumber: d,
        dateStr: new Date(year, month, d).toISOString().split("T")[0],
        isCurrentMonth: true
      });
    }

    // Các ngày tháng sau để lấp đầy lưới 35 hoặc 42 ô
    const totalSlots = days.length > 35 ? 42 : 35;
    const remaining = totalSlots - days.length;
    for (let r = 1; r <= remaining; r++) {
      days.push({
        dayNumber: r,
        dateStr: new Date(year, month + 1, r).toISOString().split("T")[0],
        isCurrentMonth: false
      });
    }

    return days;
  };

  const daysGrid = getDaysInMonthGrid();
  const todayDateStr = new Date().toISOString().split("T")[0];

  const getEventsForDate = (dateStr) => {
    return events.filter((e) => {
      const d = e.HanHoanThanh || e.NgayBatDau || e.date;
      return d && d.startsWith(dateStr);
    });
  };

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  const dayHeaders = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  return (
    <Layout>
      <div className="cal-container">
        {/* Calendar Controls Bar */}
        <div className="cal-topbar">
          <div className="cal-nav-group">
            <h1 className="cal-title">
              {monthNames[month]} {year}
            </h1>
            <div className="cal-nav-buttons">
              <button className="cal-btn-nav" onClick={onPrev} title="Trước">‹</button>
              <button className="cal-btn-today" onClick={onToday}>Hôm nay</button>
              <button className="cal-btn-nav" onClick={onNext} title="Sau">›</button>
            </div>
          </div>

          {/* View Mode Switcher */}
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

        {/* View Mode Content */}
        {view === "month" && (
          <div className="cal-month-board">
            {/* Day Header Row */}
            <div className="cal-day-headers">
              {dayHeaders.map((dh, i) => (
                <div key={i} className="cal-day-header-cell">
                  {dh}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="cal-grid">
              {daysGrid.map((cell, idx) => {
                const isToday = cell.dateStr === todayDateStr;
                const cellEvents = getEventsForDate(cell.dateStr);

                return (
                  <div
                    key={idx}
                    className={`cal-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${isToday ? "today-cell" : ""}`}
                  >
                    <div className="cal-cell-header">
                      <span className={`day-number ${isToday ? "today-badge" : ""}`}>
                        {cell.dayNumber}
                      </span>
                      {cellEvents.length > 0 && (
                        <span className="cell-count-tag">{cellEvents.length} việc</span>
                      )}
                    </div>

                    <div className="cal-cell-events">
                      {cellEvents.map((ev) => (
                        <div
                          key={ev.MaCongViec}
                          className={`cal-event-pill ${
                            ev.MucDoUuTien === "Khẩn cấp" ? "pill-urgent" :
                            ev.MucDoUuTien === "Cao" ? "pill-high" :
                            ev.MucDoUuTien === "Trung bình" ? "pill-med" : "pill-low"
                          } ${ev.TrangThai === "Đã hoàn thành" ? "pill-done" : ""}`}
                          onClick={() => setSelectedTask(ev)}
                          title={`${ev.TenCongViec} (${ev.TrangThai})`}
                        >
                          <span className="pill-dot"></span>
                          <span className="pill-text">{ev.TenCongViec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="cal-week-board">
            <div className="cal-week-grid">
              {daysGrid.slice(0, 7).map((cell, idx) => {
                const cellEvents = getEventsForDate(cell.dateStr);
                const isToday = cell.dateStr === todayDateStr;

                return (
                  <div key={idx} className={`cal-week-col ${isToday ? "today-col" : ""}`}>
                    <div className="cal-week-col-header">
                      <span>{dayHeaders[idx]}</span>
                      <strong className={isToday ? "today-badge" : ""}>{cell.dayNumber}</strong>
                    </div>
                    <div className="cal-week-col-body">
                      {cellEvents.map((ev) => (
                        <div
                          key={ev.MaCongViec}
                          className="cal-week-task-card"
                          onClick={() => setSelectedTask(ev)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span className="task-cat-badge">{ev.TenDanhMuc}</span>
                            <span className={`badge-priority ${
                              ev.MucDoUuTien === "Khẩn cấp" ? "khan-cap" :
                              ev.MucDoUuTien === "Cao" ? "cao" :
                              ev.MucDoUuTien === "Trung bình" ? "trung-binh" : "thap"
                            }`}>
                              {ev.MucDoUuTien}
                            </span>
                          </div>
                          <div className="week-task-title">{ev.TenCongViec}</div>
                          <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
                            Trạng thái: <strong>{ev.TrangThai}</strong>
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

        {view === "day" && (
          <div className="cal-day-board">
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>
              Danh sách công việc ngày: {currentDate.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </h2>
            <div className="cal-day-list">
              {getEventsForDate(currentDate.toISOString().split("T")[0]).map((ev) => (
                <div key={ev.MaCongViec} className="cal-day-item" onClick={() => setSelectedTask(ev)}>
                  <div className="pill-dot" style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-primary)" }}></div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{ev.TenCongViec}</h3>
                    <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
                      🏷️ {ev.TenDanhMuc} • Mức ưu tiên: {ev.MucDoUuTien} • Tiến độ: {ev.TienDo}%
                    </p>
                  </div>
                  <span className="badge-status dang-lam">{ev.TrangThai}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Details Popup Modal */}
        {selectedTask && (
          <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Chi tiết công việc</h3>
                <button className="modal-close" onClick={() => setSelectedTask(null)}>×</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className={`badge-priority ${
                    selectedTask.MucDoUuTien === "Khẩn cấp" ? "khan-cap" :
                    selectedTask.MucDoUuTien === "Cao" ? "cao" :
                    selectedTask.MucDoUuTien === "Trung bình" ? "trung-binh" : "thap"
                  }`}>
                    {selectedTask.MucDoUuTien}
                  </span>
                  <span className="task-cat-badge">
                    🏷️ {selectedTask.TenDanhMuc}
                  </span>
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text)" }}>
                  {selectedTask.TenCongViec}
                </h2>

                {selectedTask.MoTa && (
                  <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    {selectedTask.MoTa}
                  </p>
                )}

                <div className="task-meta-list">
                  <div className="meta-item">
                    <span>⏰ Hạn hoàn thành: </span>
                    <strong>
                      {selectedTask.HanHoanThanh
                        ? new Date(selectedTask.HanHoanThanh).toLocaleDateString("vi-VN", {
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
                    <strong>{selectedTask.TrangThai} ({selectedTask.TienDo}%)</strong>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      onToggleComplete(selectedTask.MaCongViec, selectedTask.TrangThai === "Đã hoàn thành");
                      setSelectedTask(null);
                    }}
                  >
                    {selectedTask.TrangThai === "Đã hoàn thành" ? "Chuyển thành Chưa hoàn thành" : "Đánh dấu Hoàn thành ✓"}
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedTask(null)}>
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
