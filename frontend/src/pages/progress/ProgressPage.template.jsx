/**
 * pages/progress/ProgressPage.template.jsx
 * Giao diện Theo dõi tiến độ công việc theo thời gian thực (Chức năng 12).
 */
import Layout from "../../components/Layout";
import "./ProgressPage.css";

export default function ProgressPageTemplate({
  overview,
  categoryProgress,
  tasks,
  onUpdateProgress,
  isLoading
}) {
  const o = overview || {
    total_tasks: 0,
    completed: 0,
    in_progress: 0,
    not_started: 0,
    overdue: 0,
    average_progress: 0,
    completion_rate: 0
  };

  return (
    <Layout>
      <div className="prog-container">
        {/* Header */}
        <div>
          <h1 className="prog-title">Theo dõi tiến độ 📊</h1>
          <p className="prog-desc">
            Cập nhật và theo dõi tỷ lệ phần trăm hoàn thành bài học, tiểu luận và dự án sinh viên
          </p>
        </div>

        {/* Big Progress Highlight Card */}
        <div className="prog-highlight-card">
          <div className="gauge-circle-box">
            <svg viewBox="0 0 100 100" className="gauge-svg">
              <circle cx="50" cy="50" r="42" className="gauge-bg" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="gauge-fill"
                strokeDasharray={`${(o.completion_rate * 264) / 100} 264`}
              />
            </svg>
            <div className="gauge-text">
              <span className="gauge-percent">{o.completion_rate}%</span>
              <span className="gauge-label">Hoàn thành</span>
            </div>
          </div>

          <div className="prog-highlight-details">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Tỷ lệ hoàn thành tổng thể
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 16 }}>
              Tiến độ trung bình của tất cả các bài tập hiện tại là <strong>{o.average_progress}%</strong>.
            </p>

            <div className="prog-pills-row">
              <div className="prog-pill">
                <span className="pill-num" style={{ color: "var(--color-success)" }}>{o.completed}</span>
                <span className="pill-name">Đã xong (100%)</span>
              </div>
              <div className="prog-pill">
                <span className="pill-num" style={{ color: "var(--color-primary)" }}>{o.in_progress}</span>
                <span className="pill-name">Đang làm (1-99%)</span>
              </div>
              <div className="prog-pill">
                <span className="pill-num" style={{ color: "var(--color-text-muted)" }}>{o.not_started}</span>
                <span className="pill-name">Chưa bắt đầu (0%)</span>
              </div>
              <div className="prog-pill">
                <span className="pill-num" style={{ color: "var(--color-danger)" }}>{o.overdue}</span>
                <span className="pill-name">Quá hạn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="prog-card">
          <h3 className="prog-card-title">Tiến độ theo Danh mục môn học / Hoạt động</h3>
          <div className="cat-breakdown-grid">
            {categoryProgress.map((cat) => (
              <div key={cat.MaDanhMuc} className="cat-breakdown-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <strong style={{ fontSize: 14 }}>{cat.TenDanhMuc}</strong>
                  <span style={{ fontWeight: 700, color: "var(--color-secondary)" }}>
                    {cat.TyLeHoanThanh}%
                  </span>
                </div>
                <div className="prog-bar-track">
                  <div className="prog-bar-fill" style={{ width: `${cat.TyLeHoanThanh}%` }}></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--color-text-muted)" }}>
                  <span>{cat.SoViecHoanThanh} / {cat.TongSoViec} việc xong</span>
                  <span>ĐTB: {cat.TienDoTrungBinh}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Slider Task Progress List */}
        <div className="prog-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 className="prog-card-title">Kéo để cập nhật tiến độ công việc theo thời gian thực</h3>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              * Di chuyển thanh trượt để tự động lưu tiến độ mới
            </span>
          </div>

          <div className="live-tasks-list">
            {tasks.map((t) => (
              <div key={t.MaCongViec} className="live-task-item">
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ fontSize: 14.5 }}>{t.TenCongViec}</strong>
                    <span className="task-cat-badge">{t.TenDanhMuc}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>
                    Hạn: {t.HanHoanThanh ? new Date(t.HanHoanThanh).toLocaleDateString("vi-VN") : "Không có"} •
                    Trạng thái: <strong style={{ color: t.TienDo === 100 ? "var(--color-success)" : "var(--color-primary)" }}>{t.TrangThai}</strong>
                  </div>
                </div>

                <div className="slider-control-box">
                  <span className="slider-percent-badge">{t.TienDo}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="progress-slider live-slider"
                    value={t.TienDo}
                    onChange={(e) => onUpdateProgress(t.MaCongViec, parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
