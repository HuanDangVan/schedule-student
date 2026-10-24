/**
 * pages/suggestions/SuggestionsPage.template.jsx
 * Giao diện Gợi ý sắp xếp thứ tự công việc thông minh (Chức năng 15).
 */
import Layout from "../../components/Layout";
import "./SuggestionsPage.css";

export default function SuggestionsPageTemplate({
  suggestions,
  onToggleComplete,
  isLoading
}) {
  return (
    <Layout>
      <div className="sug-container">
        {/* Header */}
        <div>
          <h1 className="sug-title">Gợi ý thứ tự công việc 💡</h1>
          <p className="sug-desc">
            Hệ thống phân tích thông minh tự động sắp xếp thứ tự công việc tối ưu theo độ ưu tiên, hạn chót và tiến độ
          </p>
        </div>

        {/* Info Banner */}
        <div className="sug-banner">
          <div style={{ fontSize: 32 }}>🎯</div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Chiến lược thực hiện đề xuất
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
              Tập trung giải quyết dứt điểm công việc xếp hạng <strong>#1</strong> và <strong>#2</strong> trước khi bắt đầu các nhiệm vụ mới. Điều này giúp giảm áp lực deadline và tăng điểm hiệu suất.
            </p>
          </div>
        </div>

        {/* Suggestions List */}
        {isLoading ? (
          <div className="empty-sug">Đang tính toán thứ tự ưu tiên...</div>
        ) : suggestions.length === 0 ? (
          <div className="empty-sug">
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
            <h3>Tuyệt vời! Bạn không còn công việc nào tồn đọng!</h3>
            <p style={{ color: "var(--color-text-muted)", marginTop: 6 }}>
              Tất cả các công việc đã được hoàn thành hoặc chưa có bài tập mới.
            </p>
          </div>
        ) : (
          <div className="sug-list">
            {suggestions.map((item) => {
              const t = item.task;
              return (
                <div key={t.MaCongViec} className="sug-card">
                  {/* Rank Badge */}
                  <div className={`sug-rank-badge rank-${item.ThuTuDeXuat <= 3 ? item.ThuTuDeXuat : "other"}`}>
                    <span style={{ fontSize: 11 }}>ƯU TIÊN</span>
                    <strong style={{ fontSize: 20 }}>#{item.ThuTuDeXuat}</strong>
                  </div>

                  {/* Task Main Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <h3 className="sug-task-title">{t.TenCongViec}</h3>
                      <span className="task-cat-badge">{t.TenDanhMuc}</span>
                      <span className={`badge-priority ${
                        t.MucDoUuTien === "Khẩn cấp" ? "khan-cap" :
                        t.MucDoUuTien === "Cao" ? "cao" :
                        t.MucDoUuTien === "Trung bình" ? "trung-binh" : "thap"
                      }`}>
                        {t.MucDoUuTien}
                      </span>
                    </div>

                    {t.MoTa && <p className="sug-task-desc">{t.MoTa}</p>}

                    {/* Reason Highlight */}
                    <div className="sug-reason-pill">
                      <span style={{ fontSize: 14 }}>🔍 Lý do đề xuất:</span>
                      <strong>{item.LyDoGoiY}</strong>
                    </div>

                    <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 8 }}>
                      <span>
                        ⏰ Hạn chót: <strong style={{ color: t.IsOverdue ? "var(--color-danger)" : "var(--color-text)" }}>
                          {t.HanHoanThanh
                            ? new Date(t.HanHoanThanh).toLocaleDateString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "numeric"
                              })
                            : "Không có"}
                        </strong>
                      </span>
                      <span>Tiến độ: <strong>{t.TienDo}%</strong></span>
                      {t.ThoiGianDuKien && <span>Dự kiến: <strong>{t.ThoiGianDuKien}h</strong></span>}
                    </div>
                  </div>

                  {/* Action & Score */}
                  <div className="sug-action-col">
                    <div className="score-tag">
                      <span className="score-num">{item.DiemUuTien}</span>
                      <span className="score-label">Điểm số</span>
                    </div>

                    <button
                      className="btn-primary"
                      style={{ padding: "8px 16px", fontSize: 13 }}
                      onClick={() => onToggleComplete(t.MaCongViec)}
                    >
                      ✓ Hoàn thành
                    </button>
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
