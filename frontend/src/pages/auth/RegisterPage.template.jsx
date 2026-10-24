/**
 * RegisterPage.template.jsx
 * Biểu mẫu đăng ký tài khoản sinh viên đầy đủ và đẹp mắt.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPageTemplate({ onRegisterSubmit, isLoading }) {
  const [form, setForm] = useState({
    Email: "",
    MatKhau: "",
    ConfirmMatKhau: "",
    HoTen: "",
    SoDienThoai: "",
    GioiTinh: "Nam",
    NgaySinh: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Email.trim() || !form.MatKhau || !form.HoTen.trim()) {
      setError("Vui lòng điền đầy đủ Email, Mật khẩu và Họ tên.");
      return;
    }
    if (form.MatKhau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (form.MatKhau !== form.ConfirmMatKhau) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    const res = await onRegisterSubmit({
      Email: form.Email.trim(),
      MatKhau: form.MatKhau,
      HoTen: form.HoTen.trim(),
      SoDienThoai: form.SoDienThoai.trim() || null,
      GioiTinh: form.GioiTinh,
      NgaySinh: form.NgaySinh || null
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card" style={{ maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
          <h1 className="register-title">Đăng ký tài khoản</h1>
          <p className="register-subtitle">
            Hệ thống quản lý lịch học và công việc sinh viên
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 82, 82, 0.15)",
            border: "1px solid rgba(255, 82, 82, 0.3)",
            color: "var(--color-danger)",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 16
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "rgba(45, 212, 191, 0.15)",
            border: "1px solid rgba(45, 212, 191, 0.3)",
            color: "var(--color-secondary)",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 16
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Họ và tên sinh viên *</label>
            <input
              className="form-input"
              type="text"
              name="HoTen"
              placeholder="Ví dụ: Nguyễn Văn An"
              value={form.HoTen}
              onChange={handleChange}
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
              lang="vi"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email trường / cá nhân *</label>
            <input
              className="form-input"
              type="email"
              name="Email"
              placeholder="sinhvien@example.edu.vn"
              value={form.Email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input
                className="form-input"
                type="password"
                name="MatKhau"
                placeholder="Ít nhất 6 ký tự"
                value={form.MatKhau}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu *</label>
              <input
                className="form-input"
                type="password"
                name="ConfirmMatKhau"
                placeholder="Nhập lại mật khẩu"
                value={form.ConfirmMatKhau}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-input"
                type="tel"
                name="SoDienThoai"
                placeholder="0987..."
                value={form.SoDienThoai}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select
                className="form-select"
                name="GioiTinh"
                value={form.GioiTinh}
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ngày sinh</label>
            <input
              className="form-input"
              type="date"
              name="NgaySinh"
              value={form.NgaySinh}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: 8, padding: 12 }}
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <p className="register-footer" style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--color-text-muted)" }}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
