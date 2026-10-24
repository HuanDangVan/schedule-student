/**
 * LoginPage.template.jsx
 * File Template (HTML/JSX) - Giao diện trang Đăng nhập hoàn chỉnh.
 * Form đăng nhập với username/email và password, xử lý lỗi hiển thị.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPageTemplate({ onLoginSubmit, isLoading }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) { setError("Vui lòng nhập tên đăng nhập."); return; }
    if (!form.password)        { setError("Vui lòng nhập mật khẩu."); return; }
    const err = await onLoginSubmit(form);
    if (err) setError(err);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">📅</div>
        <h1 className="login-title">Đăng nhập</h1>
        <p className="login-subtitle">
          Chào mừng trở lại! Quản lý lịch học của bạn.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="login-error">⚠️ {error}</div>}

          <div className="login-field">
            <label className="login-label" htmlFor="login-username">
              Tên đăng nhập
            </label>
            <input
              id="login-username"
              className="login-input"
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập..."
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              lang="vi"
              autoFocus
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">
              Mật khẩu
            </label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit-btn"
            className="login-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="login-footer">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="login-link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
