/**
 * pages/reminders/RemindersPage.template.jsx
 * Giao diện Quản lý nhắc nhở công việc đến hạn (Chức năng 16).
 */
import { useState } from "react";
import Layout from "../../components/Layout";
import "./RemindersPage.css";

export default function RemindersPageTemplate({
  reminders,
  tasks,
  onCreateReminder,
  onToggleReminder,
  onDeleteReminder,
  isLoading
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    MaCongViec: tasks[0]?.MaCongViec || "",
    NoiDungNhacNho: "",
    ThoiGianNhacNho: ""
  });

  const openCreateModal = () => {
    setFormData({
      MaCongViec: tasks[0]?.MaCongViec || "",
      NoiDungNhacNho: "",
      ThoiGianNhacNho: ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.NoiDungNhacNho.trim()) {
      alert("Vui lòng nhập nội dung nhắc nhở!");
      return;
    }
    if (!formData.ThoiGianNhacNho) {
      alert("Vui lòng chọn thời gian nhắc!");
      return;
    }

    onCreateReminder({
      MaCongViec: parseInt(formData.MaCongViec) || tasks[0]?.MaCongViec,
      NoiDungNhacNho: formData.NoiDungNhacNho.trim(),
      ThoiGianNhacNho: new Date(formData.ThoiGianNhacNho).toISOString()
    });
    closeModal();
  };

  return (
    <Layout>
      <div className="rem-container">
        {/* Header */}
        <div className="rem-header">
          <div>
            <h1 className="rem-title">Nhắc nhở công việc 🔔</h1>
            <p className="rem-desc">
              Cài đặt chuông thông báo và lời nhắc cho các bài tập, đồ án sắp đến hạn
            </p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>
            ➕ Thêm lời nhắc mới
          </button>
        </div>

        {/* Reminders List */}
        {isLoading ? (
          <div className="empty-rem">Đang nạp danh sách nhắc nhở...</div>
        ) : reminders.length === 0 ? (
          <div className="empty-rem">
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
            <h3>Chưa có lời nhắc nào</h3>
            <p style={{ color: "var(--color-text-muted)", marginTop: 6 }}>
              Nhấn "+ Thêm lời nhắc mới" để không bao giờ bỏ lỡ deadline bài tập!
            </p>
          </div>
        ) : (
          <div className="rem-grid">
            {reminders.map((rem) => {
              const remTime = new Date(rem.ThoiGianNhacNho);
              const isPast = remTime < new Date();

              return (
                <div key={rem.MaNhacNho} className={`rem-card ${rem.DaGui ? "sent" : ""}`}>
                  <div className="rem-card-top">
                    <span className="rem-bell-badge">⏰</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className={`rem-toggle-btn ${rem.DaGui ? "active" : ""}`}
                        onClick={() => onToggleReminder(rem.MaNhacNho)}
                        title="Đổi trạng thái đã nhắc"
                      >
                        {rem.DaGui ? "✓ Đã nhắc" : "⏳ Chưa nhắc"}
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          if (window.confirm("Bạn có chắc chắn muốn xóa lời nhắc này?")) {
                            onDeleteReminder(rem.MaNhacNho);
                          }
                        }}
                        title="Xóa lời nhắc"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="rem-content">{rem.NoiDungNhacNho}</h3>

                  <div className="rem-meta-box">
                    <div className="rem-meta-row">
                      <span>📌 Công việc:</span>
                      <strong>{rem.TenCongViec || "Không xác định"}</strong>
                    </div>
                    <div className="rem-meta-row">
                      <span>⏰ Thời gian nhắc:</span>
                      <strong style={{ color: isPast && !rem.DaGui ? "var(--color-danger)" : "var(--color-text)" }}>
                        {remTime.toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "numeric",
                          year: "numeric"
                        })}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Create Reminder */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">➕ Tạo lời nhắc mới</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Chọn công việc cần nhắc *</label>
                  <select
                    className="form-select"
                    value={formData.MaCongViec}
                    onChange={(e) => setFormData({ ...formData, MaCongViec: e.target.value })}
                    required
                  >
                    {tasks.map((t) => (
                      <option key={t.MaCongViec} value={t.MaCongViec}>
                        {t.TenCongViec} ({t.MucDoUuTien})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Thời gian nhắc *</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.ThoiGianNhacNho}
                    onChange={(e) => setFormData({ ...formData, ThoiGianNhacNho: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nội dung thông báo nhắc nhở *</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Ví dụ: Kiểm tra slide báo cáo trước giờ lên lớp..."
                    value={formData.NoiDungNhacNho}
                    onChange={(e) => setFormData({ ...formData, NoiDungNhacNho: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn-primary">
                    Tạo lời nhắc
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
