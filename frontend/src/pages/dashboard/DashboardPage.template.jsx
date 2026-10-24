/**
 * pages/dashboard/DashboardPage.template.jsx
 * Giao diện Dashboard tổng quan sống động, hiện đại cho sinh viên.
 */
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import "./DashboardPage.css";

export default function DashboardPageTemplate({
  stats,
  tasks,
  suggestions,
  todayReminders,
  categories,
  onToggleComplete,
  isLoading
}) {
  const summary = stats?.summary || {
    total: 0,
    completed: 0,
    in_progress: 0,
    overdue: 0,
    completion_rate: 0
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Banner Welcome */}
        <div className="dashboard-banner">
          <div>
            <span className="banner-badge">Học kỳ 1 • Năm 2026</span>
            <h1 className="banner-title">Xin chào, sinh viên! 👋</h1>
            <p className="banner-subtitle">
              Bạn có <strong>{summary.in_progress}</strong> công việc đang tiến hành và <strong>{summary.overdue}</strong> công việc cần xử lý gấp.
            </p>
          </div>
          <div className="banner-actions">
            <Link to="/tasks" className="btn-primary">
              ➕ Thêm công việc
            </Link>
            <Link to="/calendar" className="btn-secondary">
              📅 Xem lịch biểu
            </Link>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(108, 99, 255, 0.15)", color: "#8B85FF" }}>
              📋
            </div>
            <div className="stat-info">
              <span className="stat-label">Tổng công việc</span>
              <h2 className="stat-value">{summary.total}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(45, 212, 191, 0.15)", color: "#2DD4BF" }}>
              ✅
            </div>
            <div className="stat-info">
              <span className="stat-label">Đã hoàn thành</span>
              <h2 className="stat-value">{summary.completed}</h2>
              <span className="stat-sub" style={{ color: "#2DD4BF" }}>
                {summary.completion_rate}% tỷ lệ xong
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8" }}>
              ⚡
            </div>
            <div className="stat-info">
              <span className="stat-label">Đang thực hiện</span>
              <h2 className="stat-value">{summary.in_progress}</h2>
              <span className="stat-sub">Đang xử lý</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(255, 82, 82, 0.15)", color: "#FF5252" }}>
              ⚠️
            </div>
            <div className="stat-info">
              <span className="stat-label">Cần chú ý / Quá hạn</span>
              <h2 className="stat-value">{summary.overdue}</h2>
              <span className="stat-sub" style={{ color: summary.overdue > 0 ? "#FF5252" : "var(--color-text-muted)" }}>
                {summary.overdue > 0 ? "Cần hoàn tất ngay!" : "Không có việc quá hạn"}
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Main Content */}
        <div className="dashboard-columns">
          {/* Left Column: Urgent Suggestions & Upcoming Tasks */}
          <div className="col-main">
            {/* Suggestions Card */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>💡</span>
                  <h3 className="dash-card-title">Việc nên ưu tiên làm ngay</h3>
                </div>
                <Link to="/suggestions" className="dash-link">Xem tất cả gợi ý →</Link>
              </div>

              {suggestions && suggestions.length > 0 ? (
                <div className="suggestions-list">
                  {suggestions.slice(0, 3).map((item) => (
                    <div key={item.task.MaCongViec} className="suggestion-item">
                      <div className="rank-badge">#{item.ThuTuDeXuat}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span className="task-title-text">{item.task.TenCongViec}</span>
                          <span className={`badge-priority ${item.task.MucDoUuTien === "Khẩn cấp" ? "khan-cap" :
                              item.task.MucDoUuTien === "Cao" ? "cao" :
                                item.task.MucDoUuTien === "Trung bình" ? "trung-binh" : "thap"
                            }`}>
                            {item.task.MucDoUuTien}
                          </span>
                        </div>
                        <div className="suggestion-reason">
                          {item.LyDoGoiY}
                        </div>
                      </div>
                      <button
                        onClick={() => onToggleComplete(item.task.MaCongViec, item.task.TrangThai === "Đã hoàn thành")}
                        className="btn-complete-quick"
                        title="Đánh dấu hoàn thành"
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">Không có công việc nào cần ưu tiên gấp!</div>
              )}
            </div>

            {/* Tasks List */}
            <div className="dash-card" style={{ marginTop: 20 }}>
              <div className="dash-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📋</span>
                  <h3 className="dash-card-title">Danh sách công việc gần đây</h3>
                </div>
                <Link to="/tasks" className="dash-link">Quản lý toàn bộ →</Link>
              </div>

              {tasks && tasks.length > 0 ? (
                <div className="task-mini-table">
                  {tasks.slice(0, 5).map((t) => (
                    <div key={t.MaCongViec} className="task-mini-row">
                      <button
                        className={`checkbox-circle ${t.TrangThai === "Đã hoàn thành" ? "checked" : ""}`}
                        onClick={() => onToggleComplete(t.MaCongViec, t.TrangThai === "Đã hoàn thành")}
                      >
                        {t.TrangThai === "Đã hoàn thành" ? "✓" : ""}
                      </button>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={`mini-task-name ${t.TrangThai === "Đã hoàn thành" ? "done" : ""}`}>
                          {t.TenCongViec}
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                          <span>🏷️ {t.TenDanhMuc || "Chung"}</span>
                          {t.HanHoanThanh && (
                            <span style={{ color: t.IsOverdue ? "var(--color-danger)" : "inherit" }}>
                              ⏰ {new Date(t.HanHoanThanh).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="progress-mini-bar" title={`Tiến độ ${t.TienDo}%`}>
                          <div
                            className="progress-mini-fill"
                            style={{
                              width: `${t.TienDo}%`,
                              background: t.TienDo === 100 ? "var(--color-success)" : "var(--color-primary)"
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, minWidth: 32, textAlign: "right" }}>
                          {t.TienDo}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">Chưa có công việc nào. Nhấn Thêm công việc để bắt đầu!</div>
              )}
            </div>
          </div>

          {/* Right Column: Today Reminders & Categories Progress */}
          <div className="col-side">
            {/* Today Reminders */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🔔</span>
                  <h3 className="dash-card-title">Nhắc nhở hôm nay</h3>
                </div>
                <Link to="/reminders" className="dash-link">Xem tất cả →</Link>
              </div>

              {todayReminders && todayReminders.length > 0 ? (
                <div className="reminders-mini-list">
                  {todayReminders.map((rem) => (
                    <div key={rem.MaNhacNho} className="reminder-mini-item">
                      <span className="bell-badge">⏰</span>
                      <div style={{ flex: 1 }}>
                        <div className="rem-text">{rem.NoiDungNhacNho}</div>
                        <div className="rem-sub">Việc: {rem.TenCongViec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: "16px 0" }}>
                  Không có lời nhắc nào cho hôm nay!
                </div>
              )}
            </div>

            {/* Categories Overview */}
            <div className="dash-card" style={{ marginTop: 20 }}>
              <div className="dash-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📊</span>
                  <h3 className="dash-card-title">Tiến độ theo danh mục</h3>
                </div>
                <Link to="/progress" className="dash-link">Chi tiết →</Link>
              </div>

              <div className="cat-progress-list">
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <div key={c.MaDanhMuc} className="cat-progress-item">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                        <span style={{ fontWeight: 600 }}>{c.TenDanhMuc}</span>
                        <span style={{ color: "var(--color-text-muted)" }}>
                          {c.SoViecHoanThanh} / {c.TongSoViec} việc
                        </span>
                      </div>
                      <div className="cat-bar-bg">
                        <div
                          className="cat-bar-fill"
                          style={{
                            width: `${c.TongSoViec > 0 ? (c.SoViecHoanThanh / c.TongSoViec) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">Chưa có danh mục nào</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
