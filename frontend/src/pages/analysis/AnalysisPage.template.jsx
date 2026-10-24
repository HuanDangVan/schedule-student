/**
 * pages/analysis/AnalysisPage.template.jsx
 * Giao diện Phân tích khả năng hoàn thành và dự đoán rủi ro trễ hạn (Chức năng 17).
 */
import Layout from "../../components/Layout";
import "./AnalysisPage.css";

export default function AnalysisPageTemplate({ analysisData, isLoading }) {
  const summary = analysisData?.summary || {
    total_tasks: 0,
    safe_count: 0,
    warning_count: 0,
    high_risk_count: 0,
    average_probability: 0
  };

  const tasksAnalysis = analysisData?.tasks_analysis || [];

  return (
    <Layout>
      <div className="analysis-container">
        {/* Header */}
        <div>
          <h1 className="analysis-title">Phân tích khả năng hoàn thành 🧠</h1>
          <p className="analysis-desc">
            Dự đoán xác suất hoàn thành bài tập đúng hạn và cảnh báo mức độ rủi ro dựa trên khối lượng công việc
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="analysis-summary-grid">
          <div className="analysis-stat-card">
            <span className="a-label">Xác suất trung bình</span>
            <h2 className="a-value" style={{ color: "var(--color-primary)" }}>
              {summary.average_probability}%
            </h2>
            <span className="a-sub">Khả năng kịp deadline chung</span>
          </div>

          <div className="analysis-stat-card">
            <span className="a-label">An toàn</span>
            <h2 className="a-value" style={{ color: "var(--color-success)" }}>
              {summary.safe_count}
            </h2>
            <span className="a-sub">Đúng tiến độ dự kiến</span>
          </div>

          <div className="analysis-stat-card">
            <span className="a-label">Cần lưu ý</span>
            <h2 className="a-value" style={{ color: "var(--color-warning)" }}>
              {summary.warning_count}
            </h2>
            <span className="a-sub">Cần tăng tốc thời gian học</span>
          </div>

          <div className="analysis-stat-card">
            <span className="a-label">Nguy cơ trễ / Quá hạn</span>
            <h2 className="a-value" style={{ color: "var(--color-danger)" }}>
              {summary.high_risk_count}
            </h2>
            <span className="a-sub">Cần ưu tiên xử lý khẩn cấp</span>
          </div>
        </div>

        {/* Task Analysis Cards Grid */}
        {isLoading ? (
          <div className="empty-analysis">Đang phân tích dữ liệu...</div>
        ) : tasksAnalysis.length === 0 ? (
          <div className="empty-analysis">Chưa có công việc nào để phân tích.</div>
        ) : (
          <div className="analysis-cards-list">
            {tasksAnalysis.map((item) => {
              const isHighRisk = item.MucDoRuiRo === "Rủi ro cao" || item.MucDoRuiRo === "Trễ hạn";
              const isWarning = item.MucDoRuiRo === "Cần lưu ý";
              const isSafe = item.MucDoRuiRo === "An toàn" || item.MucDoRuiRo === "Hoàn thành";

              return (
                <div key={item.MaCongViec} className={`analysis-card ${isHighRisk ? "risk-high" : isWarning ? "risk-warn" : "risk-safe"}`}>
                  <div className="a-card-top">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <h3 className="a-task-title">{item.TenCongViec}</h3>
                        <span className="task-cat-badge">{item.task.TenDanhMuc}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                        Hạn chót: <strong>{item.task.HanHoanThanh ? new Date(item.task.HanHoanThanh).toLocaleDateString("vi-VN") : "Chưa đặt"}</strong> •
                        Mức ưu tiên: <strong>{item.task.MucDoUuTien}</strong>
                      </div>
                    </div>

                    <span className={`risk-badge ${
                      isHighRisk ? "risk-badge-high" : isWarning ? "risk-badge-warn" : "risk-badge-safe"
                    }`}>
                      {item.MucDoRuiRo}
                    </span>
                  </div>

                  {/* Probability Bar */}
                  <div className="a-prob-box">
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>Xác suất hoàn thành đúng hạn:</span>
                      <strong style={{
                        color: isHighRisk ? "var(--color-danger)" : isWarning ? "var(--color-warning)" : "var(--color-success)",
                        fontSize: 15
                      }}>
                        {item.XacSuatHoanThanh}%
                      </strong>
                    </div>
                    <div className="a-prob-bar">
                      <div
                        className="a-prob-fill"
                        style={{
                          width: `${item.XacSuatHoanThanh}%`,
                          background: isHighRisk ? "var(--color-danger)" : isWarning ? "var(--color-warning)" : "var(--color-success)"
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Estimation & Pace Recommendation */}
                  <div className="a-stats-row">
                    <div className="a-metric">
                      <span>Số ngày còn lại:</span>
                      <strong>{item.SoNgayConLai > 0 ? `${item.SoNgayConLai} ngày` : "Hết hạn"}</strong>
                    </div>
                    <div className="a-metric">
                      <span>Khối lượng còn thiếu:</span>
                      <strong>~{item.GioConLaiUocTinh} giờ</strong>
                    </div>
                    <div className="a-metric">
                      <span>Cần dành mỗi ngày:</span>
                      <strong style={{ color: isHighRisk ? "var(--color-danger)" : "var(--color-primary)" }}>
                        {item.GioMoiNgayCanLam} giờ/ngày
                      </strong>
                    </div>
                  </div>

                  {/* Advice Box */}
                  <div className="a-advice-box">
                    <span style={{ fontSize: 16 }}>💡</span>
                    <span>{item.KhuyenNghi}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
