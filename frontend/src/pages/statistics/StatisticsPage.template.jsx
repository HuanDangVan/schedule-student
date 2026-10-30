
/**
 * pages/statistics/StatisticsPage.template.jsx
 * Giao diện Thống kê và báo cáo hiệu suất học tập (Chức năng 14).
 */
import Layout from "../../components/Layout";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import "./StatisticsPage.css";

const PRIORITY_COLORS = {
  "Khẩn cấp": "#EF4444",
  "Cao": "#F59E0B",
  "Trung bình": "#3B82F6",
  "Thấp": "#94A3B8"
};

const COMPLETION_COLORS = ["#10B981", "#E5E7EB"];

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

  // Biểu đồ tỷ lệ hoàn thành
  const completionRate = Math.min(
    100,
    Math.max(0, Number(summary.completion_rate) || 0)
  );

  const completionData = [
    { name: "Đã hoàn thành", value: completionRate },
    { name: "Chưa hoàn thành", value: 100 - completionRate }
  ];

  // Biểu đồ phân bố mức độ ưu tiên
  const priorityData = Object.entries(priorityCounts).map(
    ([name, value]) => ({
      name,
      value: Number(value) || 0
    })
  );

  const hasPriorityData = priorityData.some(item => item.value > 0);

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
          {/* Tổng công việc */}
          <div className="stat-box">
            <span className="stat-box-label">Tổng bài tập / việc</span>
            <h2 className="stat-box-value">{summary.total}</h2>
            <div className="stat-box-footer">Tất cả danh mục</div>
          </div>

          {/* Biểu đồ tỷ lệ hoàn thành */}
          <div className="stat-box">
            <span className="stat-box-label">Tỷ lệ hoàn thành</span>

            <div style={{ width: "100%", height: 130, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {completionData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COMPLETION_COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>

              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  pointerEvents: "none"
                }}
              >
                <div style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--color-secondary)"
                }}>
                  {completionRate}%
                </div>
              </div>
            </div>

            <div className="stat-box-footer">
              {summary.completed} / {summary.total} đã xong
            </div>
          </div>

          {/* Điểm hiệu suất */}
          <div className="stat-box">
            <span className="stat-box-label">Điểm hiệu suất</span>
            <h2 className="stat-box-value" style={{ color: "var(--color-primary)" }}>
              {efficiencyScore} / 100
            </h2>
            <div className="stat-box-footer">Dựa trên tốc độ & deadline</div>
          </div>

          {/* Công việc trễ hạn */}
          <div className="stat-box">
            <span className="stat-box-label">Số việc trễ hạn</span>
            <h2
              className="stat-box-value"
              style={{
                color: summary.overdue > 0
                  ? "var(--color-danger)"
                  : "var(--color-text-muted)"
              }}
            >
              {summary.overdue}
            </h2>
            <div className="stat-box-footer">
              {summary.overdue > 0 ? "Cần hoàn tất ngay!" : "Không có việc trễ"}
            </div>
          </div>
        </div>

        {/* Hai biểu đồ và tiến độ danh mục nằm song song */}
        <div className="stats-charts-grid">

          {/* Biểu đồ phân bố mức độ ưu tiên */}
          <div className="chart-card">
            <h3 className="chart-title">Phân bố theo mức độ ưu tiên</h3>
            <p className="chart-subtitle">
              Tỷ trọng công việc theo mức độ quan trọng
            </p>

            <div style={{ width: "100%", height: 280 }}>
              {hasPriorityData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {priorityData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={PRIORITY_COLORS[entry.name] || "#94A3B8"}
                        />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => `${value} công việc`} />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-muted)",
                  fontSize: 14
                }}>
                  Chưa có công việc để thống kê
                </div>
              )}
            </div>
          </div>

          {/* Tiến độ theo từng danh mục */}
          <div className="chart-card">
            <h3 className="chart-title">Tiến độ theo từng danh mục</h3>
            <p className="chart-subtitle">
              Tỷ lệ hoàn thành công việc ở các môn học và hoạt động
            </p>

            <div className="cat-bars-list">
              {categoryStats.map((c) => (
                <div key={c.name} className="pbar-item">
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 13
                  }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{
                      color: "var(--color-secondary)",
                      fontWeight: 700
                    }}>
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
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>
                Thống kê thời lượng học tập
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 13.5, marginTop: 2 }}>
                Tổng thời gian dự kiến: <strong>{summary.total_estimated_hours} giờ</strong>
                {" "}• Đã thực hiện: <strong>{summary.total_actual_hours} giờ</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
