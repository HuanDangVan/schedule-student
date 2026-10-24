/**
 * pages/statistics/StatisticsPage.template.jsx
 * Giao diện Thống kê và báo cáo hiệu suất học tập (Chức năng 14).
 */
import Layout from "../../components/Layout";
import "./StatisticsPage.css";

export default function StatisticsPageTemplate({ stats, isLoading }) {
  const summary = stats?.summary || {
    total: 0,
    completed: 0,
    in_progress: 0,
    not_started: 0,
    overdue: 0,
    completion_rate: 0,
    total_estimated_hours: 0,
    total_actual_hours: 0
  };

  const priorityCounts = stats?.by_priority || {
    "Khẩn cấp": 0,
    "Cao": 0,
    "Trung bình": 0,
    "Thấp": 0
  };

  const categoryStats = stats?.by_category || [];
  const efficiencyScore = stats?.efficiency_score || 0;

  return (
    <Layout>
      <div className="stats-container">
        {/* Header */}
        <div>
          <h1 className="stats-main-title">Báo cáo & Thống kê 📈</h1>
          <p className="stats-main-desc">
            Phân tích tỷ lệ hoàn thành công việc, phân bố độ ưu tiên và thời gian học tập
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="stats-cards-row">
          <div className="stat-box">
            <span className="stat-box-label">Tổng bài tập / việc</span>
            <h2 className="stat-box-value">{summary.total}</h2>
            <div className="stat-box-footer">Tất cả danh mục</div>
          </div>

          <div className="stat-box">
            <span className="stat-box-label">Tỷ lệ hoàn thành</span>
            <h2 className="stat-box-value" style={{ color: "var(--color-secondary)" }}>
              {summary.completion_rate}%
            </h2>
            <div className="stat-box-footer">
              {summary.completed} / {summary.total} đã xong
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-label">Điểm hiệu suất</span>
            <h2 className="stat-box-value" style={{ color: "var(--color-primary)" }}>
              {efficiencyScore} / 100
            </h2>
            <div className="stat-box-footer">Dựa trên tốc độ & deadline</div>
          </div>

          <div className="stat-box">
            <span className="stat-box-label">Số việc trễ hạn</span>
            <h2 className="stat-box-value" style={{ color: summary.overdue > 0 ? "var(--color-danger)" : "var(--color-text-muted)" }}>
              {summary.overdue}
            </h2>
            <div className="stat-box-footer">
              {summary.overdue > 0 ? "Cần hoàn tất ngay!" : "Không có việc trễ"}
            </div>
          </div>
        </div>

        {/* Two Charts Section */}
        <div className="stats-charts-grid">
          {/* Chart 1: Priority Distribution */}
          <div className="chart-card">
            <h3 className="chart-title">Phân bố theo mức độ ưu tiên</h3>
            <p className="chart-subtitle">Tỷ trọng công việc theo mức độ quan trọng</p>

            <div className="priority-bars-list">
              {[
                { label: "Khẩn cấp", count: priorityCounts["Khẩn cấp"], color: "var(--color-danger)" },
                { label: "Cao", count: priorityCounts["Cao"], color: "var(--color-warning)" },
                { label: "Trung bình", count: priorityCounts["Trung bình"], color: "var(--color-info)" },
                { label: "Thấp", count: priorityCounts["Thấp"], color: "#94A3B8" }
              ].map((item) => {
                const percent = summary.total > 0 ? Math.round((item.count / summary.total) * 100) : 0;
                return (
                  <div key={item.label} className="pbar-item">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{item.label}</span>
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        <strong>{item.count}</strong> việc ({percent}%)
                      </span>
                    </div>
                    <div className="pbar-track">
                      <div
                        className="pbar-fill"
                        style={{ width: `${percent}%`, background: item.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Category Breakdown */}
          <div className="chart-card">
            <h3 className="chart-title">Tiến độ theo từng danh mục</h3>
            <p className="chart-subtitle">Tỷ lệ hoàn thành công việc ở các môn học và hoạt động</p>

            <div className="cat-bars-list">
              {categoryStats.map((c) => (
                <div key={c.name} className="pbar-item">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: "var(--color-secondary)", fontWeight: 700 }}>
                      {c.rate}% ({c.completed}/{c.total})
                    </span>
                  </div>
                  <div className="pbar-track">
                    <div
                      className="pbar-fill"
                      style={{
                        width: `${c.rate}%`,
                        background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))"
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Study Box */}
        <div className="study-time-card">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 36 }}>⏱️</div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Thống kê thời lượng học tập</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 13.5, marginTop: 2 }}>
                Tổng thời gian dự kiến: <strong>{summary.total_estimated_hours} giờ</strong> • Đã thực hiện: <strong>{summary.total_actual_hours} giờ</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
