/**
 * pages/tasks/TasksPage.template.jsx
 * Giao diện Quản lý công việc sinh viên (CRUD, ưu tiên, hoàn thành, cập nhật tiến độ).
 */
import { useState } from "react";
import Layout from "../../components/Layout";
import "./TasksPage.css";

export default function TasksPageTemplate({
  tasks,
  categories,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onSetPriority,
  onToggleComplete,
  onUpdateProgress,
  isLoading
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    TenCongViec: "",
    MaDanhMuc: "",
    MoTa: "",
    MucDoUuTien: "Trung bình",
    TrangThai: "Chưa làm",
    TienDo: 0,
    NgayBatDau: "",
    HanHoanThanh: "",
    ThoiGianDuKien: 4
  });

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      TenCongViec: "",
      MaDanhMuc: "",
      MoTa: "",
      MucDoUuTien: "Trung bình",
      TrangThai: "Chưa làm",
      TienDo: 0,
      NgayBatDau: "",
      HanHoanThanh: "",
      ThoiGianDuKien: 4
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      TenCongViec: task.TenCongViec,
      MaDanhMuc: task.MaDanhMuc,
      MoTa: task.MoTa || "",
      MucDoUuTien: task.MucDoUuTien || "Trung bình",
      TrangThai: task.TrangThai || "Chưa làm",
      TienDo: task.TienDo || 0,
      NgayBatDau: task.NgayBatDau ? task.NgayBatDau.substring(0, 16) : "",
      HanHoanThanh: task.HanHoanThanh ? task.HanHoanThanh.substring(0, 16) : "",
      ThoiGianDuKien: task.ThoiGianDuKien || 4
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.TenCongViec.trim()) {
      alert("Vui lòng nhập tên công việc!");
      return;
    }
    if (!formData.MaDanhMuc) {
      alert("Vui lòng chọn danh mục cho công việc!");
      return;
    }

    const payload = {
      ...formData,
      MaDanhMuc: parseInt(formData.MaDanhMuc),
      TienDo: parseInt(formData.TienDo) || 0,
      ThoiGianDuKien: parseInt(formData.ThoiGianDuKien) || null,
      NgayBatDau: formData.NgayBatDau ? new Date(formData.NgayBatDau).toISOString() : null,
      HanHoanThanh: formData.HanHoanThanh ? new Date(formData.HanHoanThanh).toISOString() : null
    };

    if (editingTask) {
      onUpdateTask(editingTask.MaCongViec, payload);
    } else {
      onCreateTask(payload);
    }
    closeModal();
  };

  return (
    <Layout>
      <div className="tasks-page-container">
        {/* Header Bar */}
        <div className="tasks-header">
          <div>
            <h1 className="tasks-page-title">Quản lý công việc 📋</h1>
            <p className="tasks-page-desc">
              Theo dõi, lập kế hoạch bài tập, tiểu luận, dự án và việc cần làm
            </p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>
            ➕ Thêm công việc mới
          </button>
        </div>

        {/* Filters Bar */}
        <div className="tasks-filters-bar">
          <div className="filter-group">
            <label className="filter-label">Danh mục:</label>
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.MaDanhMuc} value={c.MaDanhMuc}>
                  {c.TenDanhMuc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Trạng thái:</label>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Chưa làm">Chưa làm</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Quá hạn">Quá hạn</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Mức ưu tiên:</label>
            <select
              className="filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">Tất cả ưu tiên</option>
              <option value="Khẩn cấp">Khẩn cấp</option>
              <option value="Cao">Cao</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thấp">Thấp</option>
            </select>
          </div>

          <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--color-text-muted)" }}>
            Hiển thị: <strong>{tasks.length}</strong> công việc
          </div>
        </div>

        {/* Task Cards Grid */}
        {isLoading ? (
          <div className="empty-tasks">Đang nạp danh sách công việc...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-tasks">
            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
            <h3>Không có công việc nào phù hợp bộ lọc</h3>
            <p style={{ marginTop: 6, color: "var(--color-text-muted)" }}>
              Hãy thử chọn bộ lọc khác hoặc nhấn "+ Thêm công việc mới".
            </p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.MaCongViec} className={`task-card ${task.IsOverdue ? "card-overdue" : ""}`}>
                {/* Top card info */}
                <div className="card-top">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      className={`task-check-circle ${task.TrangThai === "Đã hoàn thành" ? "done" : ""}`}
                      onClick={() => onToggleComplete(task.MaCongViec, task.TrangThai === "Đã hoàn thành")}
                      title="Chuyển trạng thái hoàn thành"
                    >
                      {task.TrangThai === "Đã hoàn thành" ? "✓" : ""}
                    </button>
                    <span className="task-cat-badge">
                      🏷️ {task.TenDanhMuc || "Chung"}
                    </span>
                  </div>

                  {/* Priority selector */}
                  <select
                    className={`badge-priority-select ${
                      task.MucDoUuTien === "Khẩn cấp" ? "khan-cap" :
                      task.MucDoUuTien === "Cao" ? "cao" :
                      task.MucDoUuTien === "Trung bình" ? "trung-binh" : "thap"
                    }`}
                    value={task.MucDoUuTien}
                    onChange={(e) => onSetPriority(task.MaCongViec, e.target.value)}
                    title="Đổi mức ưu tiên"
                  >
                    <option value="Khẩn cấp">Khẩn cấp</option>
                    <option value="Cao">Cao</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                  </select>
                </div>

                {/* Title & Description */}
                <h3 className={`task-card-title ${task.TrangThai === "Đã hoàn thành" ? "striked" : ""}`}>
                  {task.TenCongViec}
                </h3>
                {task.MoTa && <p className="task-card-desc">{task.MoTa}</p>}

                {/* Deadlines & Hours */}
                <div className="task-meta-list">
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span>Hạn: </span>
                    <strong style={{ color: task.IsOverdue ? "var(--color-danger)" : "var(--color-text)" }}>
                      {task.HanHoanThanh
                        ? new Date(task.HanHoanThanh).toLocaleDateString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "numeric",
                            year: "numeric"
                          })
                        : "Không có hạn chót"}
                    </strong>
                    {task.IsOverdue && <span className="overdue-tag">Quá hạn!</span>}
                  </div>
                  {task.ThoiGianDuKien && (
                    <div className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      <span>Dự kiến: <strong>{task.ThoiGianDuKien} giờ</strong></span>
                    </div>
                  )}
                </div>

                {/* Interactive Progress Slider */}
                <div className="task-progress-box">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Tiến độ:</span>
                    <span style={{ fontWeight: 700, color: task.TienDo === 100 ? "var(--color-success)" : "var(--color-primary)" }}>
                      {task.TienDo}% ({task.TrangThai})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="progress-slider"
                    value={task.TienDo}
                    onChange={(e) => onUpdateProgress(task.MaCongViec, parseInt(e.target.value))}
                    title="Kéo thanh trượt để cập nhật tiến độ %"
                  />
                </div>

                {/* Card Actions Footer */}
                <div className="task-card-footer">
                  <button
                    className="btn-card-action edit"
                    onClick={() => openEditModal(task)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn-card-action delete"
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa công việc "${task.TenCongViec}"?`)) {
                        onDeleteTask(task.MaCongViec);
                      }
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Create / Edit */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingTask ? "✏️ Chỉnh sửa công việc" : "➕ Thêm công việc mới"}
                </h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Tên công việc *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Làm bài tập lớn Lập trình Web..."
                    value={formData.TenCongViec}
                    onChange={(e) => setFormData({ ...formData, TenCongViec: e.target.value })}
                    autoCorrect="off"
                    spellCheck={false}
                    lang="vi"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Danh mục *</label>
                    {categories.length === 0 ? (
                      <div style={{
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(255, 183, 77, 0.12)",
                        border: "1px solid rgba(255, 183, 77, 0.4)",
                        color: "var(--color-warning)",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}>
                        ⚠️ Bạn chưa có danh mục nào. Hãy tạo danh mục trước tại trang{" "}
                        <a href="/categories" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "underline" }}>
                          Phân loại
                        </a>.
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        value={formData.MaDanhMuc}
                        onChange={(e) => setFormData({ ...formData, MaDanhMuc: e.target.value })}
                        required
                        style={!formData.MaDanhMuc ? { color: "var(--color-text-muted)" } : {}}
                      >
                        <option value="" disabled>
                          -- Chọn danh mục --
                        </option>
                        {categories.map((c) => (
                          <option key={c.MaDanhMuc} value={c.MaDanhMuc}>
                            {c.TenDanhMuc}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mức độ ưu tiên</label>
                    <select
                      className="form-select"
                      value={formData.MucDoUuTien}
                      onChange={(e) => setFormData({ ...formData, MucDoUuTien: e.target.value })}
                    >
                      <option value="Khẩn cấp">Khẩn cấp</option>
                      <option value="Cao">Cao</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Thấp">Thấp</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Ngày bắt đầu</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.NgayBatDau}
                      onChange={(e) => setFormData({ ...formData, NgayBatDau: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hạn hoàn thành</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.HanHoanThanh}
                      onChange={(e) => setFormData({ ...formData, HanHoanThanh: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Thời gian dự kiến (giờ)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      placeholder="Số giờ (ví dụ: 6)"
                      value={formData.ThoiGianDuKien}
                      onChange={(e) => setFormData({ ...formData, ThoiGianDuKien: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tiến độ hiện tại ({formData.TienDo}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      className="progress-slider"
                      style={{ marginTop: 10 }}
                      value={formData.TienDo}
                      onChange={(e) => setFormData({ ...formData, TienDo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Ghi chú chi tiết yêu cầu, link tài liệu hoặc lưu ý..."
                    value={formData.MoTa}
                    onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                    lang="vi"
                    spellCheck={false}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTask ? "Lưu thay đổi" : "Tạo công việc"}
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
