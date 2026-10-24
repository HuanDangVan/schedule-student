/**
 * pages/profile/ProfilePage.template.jsx
 * Giao diện Quản lý hồ sơ cá nhân và đổi mật khẩu (Chức năng 4).
 */
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "./ProfilePage.css";

export default function ProfilePageTemplate({
  profile,
  onUpdateProfile,
  onChangePassword,
  isLoading
}) {
  const [profileForm, setProfileForm] = useState({
    HoTen: "",
    SoDienThoai: "",
    GioiTinh: "Nam",
    NgaySinh: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    MatKhauCu: "",
    MatKhauMoi: "",
    ConfirmMatKhauMoi: ""
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (profile) {
      setProfileForm({
        HoTen: profile.HoTen || "",
        SoDienThoai: profile.SoDienThoai || "",
        GioiTinh: profile.GioiTinh || "Nam",
        NgaySinh: profile.NgaySinh || ""
      });
    }
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const res = await onUpdateProfile(profileForm);
    if (res?.success) {
      setProfileMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setProfileMessage(""), 3000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!passwordForm.MatKhauCu) {
      setPasswordError("Vui lòng nhập mật khẩu cũ!");
      return;
    }
    if (passwordForm.MatKhauMoi.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    if (passwordForm.MatKhauMoi !== passwordForm.ConfirmMatKhauMoi) {
      setPasswordError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const res = await onChangePassword({
      MatKhauCu: passwordForm.MatKhauCu,
      MatKhauMoi: passwordForm.MatKhauMoi
    });

    if (res?.error) {
      setPasswordError(res.error);
    } else {
      setPasswordMessage("Đổi mật khẩu thành công!");
      setPasswordForm({ MatKhauCu: "", MatKhauMoi: "", ConfirmMatKhauMoi: "" });
      setTimeout(() => setPasswordMessage(""), 3000);
    }
  };

  return (
    <Layout>
      <div className="profile-container">
        {/* Header */}
        <div>
          <h1 className="profile-title">Hồ sơ cá nhân 👤</h1>
          <p className="profile-desc">
            Quản lý thông tin tài khoản sinh viên, cập nhật số điện thoại và đổi mật khẩu
          </p>
        </div>

        {/* Profile Card Header */}
        <div className="profile-hero-card">
          <div className="profile-avatar-large">
            {profile?.HoTen ? profile.HoTen.charAt(0).toUpperCase() : "S"}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{profile?.HoTen || "Sinh viên"}</h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginTop: 2 }}>
              ✉️ {profile?.Email} • 📞 {profile?.SoDienThoai || "Chưa cập nhật SĐT"}
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <span className="profile-stat-badge">
                📋 Tổng số việc: <strong>{profile?.TongSoViec || 0}</strong>
              </span>
              <span className="profile-stat-badge" style={{ color: "var(--color-secondary)" }}>
                ✅ Đã hoàn thành: <strong>{profile?.SoViecHoanThanh || 0}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Two Forms Grid */}
        <div className="profile-forms-grid">
          {/* Edit Profile Form */}
          <div className="profile-form-card">
            <h3 className="form-card-title">Cập nhật thông tin sinh viên</h3>

            {profileMessage && (
              <div className="profile-alert success">
                ✅ {profileMessage}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.HoTen}
                  onChange={(e) => setProfileForm({ ...profileForm, HoTen: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email tài khoản</label>
                <input
                  type="email"
                  className="form-input"
                  value={profile?.Email || ""}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profileForm.SoDienThoai}
                    onChange={(e) => setProfileForm({ ...profileForm, SoDienThoai: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={profileForm.GioiTinh}
                    onChange={(e) => setProfileForm({ ...profileForm, GioiTinh: e.target.value })}
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
                  type="date"
                  className="form-input"
                  value={profileForm.NgaySinh}
                  onChange={(e) => setProfileForm({ ...profileForm, NgaySinh: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>
                Lưu thay đổi hồ sơ
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="profile-form-card">
            <h3 className="form-card-title">Đổi mật khẩu tài khoản</h3>

            {passwordError && (
              <div className="profile-alert error">
                ⚠️ {passwordError}
              </div>
            )}
            {passwordMessage && (
              <div className="profile-alert success">
                ✅ {passwordMessage}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Nhập mật khẩu đang dùng"
                  value={passwordForm.MatKhauCu}
                  onChange={(e) => setPasswordForm({ ...passwordForm, MatKhauCu: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu mới *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Tối thiểu 6 ký tự"
                  value={passwordForm.MatKhauMoi}
                  onChange={(e) => setPasswordForm({ ...passwordForm, MatKhauMoi: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordForm.ConfirmMatKhauMoi}
                  onChange={(e) => setPasswordForm({ ...passwordForm, ConfirmMatKhauMoi: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-secondary" style={{ marginTop: 10 }}>
                Cập nhật mật khẩu mới
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
