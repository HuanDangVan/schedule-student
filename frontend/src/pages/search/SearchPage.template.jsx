/**
 * pages/search/SearchPage.template.jsx
 * Giao diện Tìm kiếm và lọc công việc đa tiêu chí (Chức năng 13).
 */
import Layout from "../../components/Layout";
import "./SearchPage.css";

export default function SearchPageTemplate({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  categories,
  results,
  totalResults,
  onSearch,
  onReset,
  onToggleComplete,
  isLoading
}) {
  return (
    <Layout>
      <div className="search-page-container">
        {/* Header */}
        <div>
          <h1 className="search-title">Tìm kiếm & Lọc công việc 🔍</h1>
          <p className="search-desc">
            Tìm nhanh theo từ khóa, lọc theo danh mục, trạng thái và độ ưu tiên
          </p>
        </div>

        {/* Search & Filter Box */}
        <div className="search-box-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
            className="search-input-row"
          >
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Nhập từ khóa tìm kiếm (tên công việc, bài tập, ghi chú)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                lang="vi"
                autoCorrect="off"
                spellCheck={false}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary" style={{ padding: "12px 24px" }}>
              Tìm kiếm
            </button>
          </form>

          {/* Filter Row */}
          <div className="search-filters-grid">
            <div className="search-filter-item">
              <label className="filter-label">Danh mục:</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.MaDanhMuc} value={c.MaDanhMuc}>
                    {c.TenDanhMuc}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-filter-item">
              <label className="filter-label">Trạng thái:</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Quá hạn">Quá hạn</option>
              </select>
            </div>

            <div className="search-filter-item">
              <label className="filter-label">Mức ưu tiên:</label>
              <select
                className="form-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="">Tất cả mức ưu tiên</option>
                <option value="Khẩn cấp">Khẩn cấp</option>
                <option value="Cao">Cao</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Thấp">Thấp</option>
              </select>
            </div>

            <div className="search-filter-item">
              <label className="filter-label">Sắp xếp theo:</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="deadline_asc">Hạn chót gần nhất</option>
                <option value="deadline_desc">Hạn chót xa nhất</option>
                <option value="priority_desc">Mức ưu tiên cao nhất</option>
                <option value="progress_desc">Tiến độ % cao nhất</option>
                <option value="created_desc">Mới tạo gần đây</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              Tìm thấy: <strong>{totalResults}</strong> kết quả phù hợp
            </span>
            <button type="button" className="btn-secondary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={onReset}>
              🔄 Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="empty-results">Đang tìm kiếm...</div>
        ) : results.length === 0 ? (
          <div className="empty-results">
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔎</div>
            <h3>Không tìm thấy công việc nào phù hợp</h3>
            <p style={{ marginTop: 6, color: "var(--color-text-muted)" }}>
              Thử tìm với từ khóa khác hoặc bỏ bớt các tiêu chí lọc.
            </p>
          </div>
        ) : (
          <div className="search-results-list">
            {results.map((task) => (
              <div key={task.MaCongViec} className="search-task-card">
                <button
                  className={`task-check-circle ${task.TrangThai === "Đã hoàn thành" ? "done" : ""}`}
                  onClick={() => onToggleComplete(task.MaCongViec, task.TrangThai === "Đã hoàn thành")}
                  title="Chuyển trạng thái"
                >
                  {task.TrangThai === "Đã hoàn thành" ? "✓" : ""}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h3 className={`task-title-text ${task.TrangThai === "Đã hoàn thành" ? "done" : ""}`}>
                      {task.TenCongViec}
                    </h3>
                    <span className="task-cat-badge">{task.TenDanhMuc}</span>
                    <span className={`badge-priority ${
                      task.MucDoUuTien === "Khẩn cấp" ? "khan-cap" :
                      task.MucDoUuTien === "Cao" ? "cao" :
                      task.MucDoUuTien === "Trung bình" ? "trung-binh" : "thap"
                    }`}>
                      {task.MucDoUuTien}
                    </span>
                  </div>

                  {task.MoTa && <p className="search-task-desc">{task.MoTa}</p>}

                  <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 6 }}>
                    <span>
                      ⏰ Hạn: <strong style={{ color: task.IsOverdue ? "var(--color-danger)" : "var(--color-text)" }}>
                        {task.HanHoanThanh ? new Date(task.HanHoanThanh).toLocaleDateString("vi-VN") : "Không có"}
                      </strong>
                    </span>
                    <span>
                      📊 Trạng thái: <strong>{task.TrangThai}</strong>
                    </span>
                    {task.ThoiGianDuKien && <span>⏱️ Dự kiến: {task.ThoiGianDuKien}h</span>}
                  </div>
                </div>

                <div style={{ textAlign: "right", minWidth: 90 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: task.TienDo === 100 ? "var(--color-success)" : "var(--color-primary)" }}>
                    {task.TienDo}%
                  </span>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Tiến độ</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
