/**
 * pages/categories/CategoriesPage.template.jsx
 * Giao diện Quản lý phân loại công việc (Chức năng 5).
 */
import { useState } from "react";
import Layout from "../../components/Layout";
import "./CategoriesPage.css";

export default function CategoriesPageTemplate({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isLoading
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ TenDanhMuc: "", MoTa: "" });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ TenDanhMuc: "", MoTa: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({ TenDanhMuc: cat.TenDanhMuc, MoTa: cat.MoTa || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.TenDanhMuc.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }
    if (editingCategory) {
      onUpdateCategory(editingCategory.MaDanhMuc, formData);
    } else {
      onCreateCategory(formData);
    }
    closeModal();
  };

  return (
    <Layout>
      <div className="cat-page-container">
        {/* Header */}
        <div className="cat-header">
          <div>
            <h1 className="cat-title">Phân loại công việc 🏷️</h1>
            <p className="cat-desc">
              Tạo và quản lý các danh mục như Môn học, Đồ án, Hoạt động ngoại khóa và Phát triển cá nhân
            </p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>
            ➕ Thêm danh mục mới
          </button>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="empty-cat">Đang nạp danh sách danh mục...</div>
        ) : categories.length === 0 ? (
          <div className="empty-cat">Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!</div>
        ) : (
          <div className="cat-grid">
            {categories.map((c) => {
              const rate = c.TongSoViec > 0 ? Math.round((c.SoViecHoanThanh / c.TongSoViec) * 100) : 0;
              return (
                <div key={c.MaDanhMuc} className="cat-card">
                  <div className="cat-card-top">
                    <div className="cat-folder-icon">📁</div>
                    <div className="cat-actions">
                      <button className="btn-icon" onClick={() => openEditModal(c)} title="Sửa danh mục">
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${c.TenDanhMuc}"?`)) {
                            onDeleteCategory(c.MaDanhMuc);
                          }
                        }}
                        title="Xóa danh mục"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="cat-name">{c.TenDanhMuc}</h3>
                  <p className="cat-description">
                    {c.MoTa || "Không có mô tả chi tiết."}
                  </p>

                  {/* Progress & Stats */}
                  <div className="cat-stats-box">
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: "var(--color-text-secondary)" }}>Tiến độ hoàn thành:</span>
                      <strong style={{ color: "var(--color-secondary)" }}>{rate}%</strong>
                    </div>
                    <div className="cat-bar">
                      <div className="cat-bar-inner" style={{ width: `${rate}%` }}></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--color-text-muted)" }}>
                      <span>Tổng: <strong>{c.TongSoViec} việc</strong></span>
                      <span>Xong: <strong>{c.SoViecHoanThanh} việc</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Create / Edit */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingCategory ? "✏️ Sửa danh mục" : "➕ Thêm danh mục mới"}
                </h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Tên danh mục *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Môn học chuyên ngành, Hoạt động CLB..."
                    value={formData.TenDanhMuc}
                    onChange={(e) => setFormData({ ...formData, TenDanhMuc: e.target.value })}
                    autoCorrect="off"
                    spellCheck={false}
                    lang="vi"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả danh mục</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Mục đích hoặc các loại bài tập nằm trong danh mục này..."
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
                    {editingCategory ? "Lưu thay đổi" : "Tạo danh mục"}
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
