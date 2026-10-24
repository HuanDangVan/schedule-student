/**
 * pages/profile/ProfilePage.jsx
 * Controller quản lý hồ sơ cá nhân và đổi mật khẩu (Chức năng 4).
 */
import { useState, useEffect } from "react";
import ProfilePageTemplate from "./ProfilePage.template";
import { profileService } from "../../services/profileService";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await profileService.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Lỗi nạp hồ sơ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (formData) => {
    try {
      const res = await profileService.updateProfile(formData);
      setProfile((prev) => ({ ...prev, ...res.data }));
      return { success: true };
    } catch (err) {
      alert("Lỗi khi cập nhật hồ sơ: " + (err.response?.data?.detail || err.message));
      return { error: err.message };
    }
  };

  const handleChangePassword = async (passData) => {
    try {
      await profileService.changePassword(passData);
      return { success: true };
    } catch (err) {
      return { error: err.response?.data?.detail || "Đổi mật khẩu thất bại" };
    }
  };

  return (
    <ProfilePageTemplate
      profile={profile}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      isLoading={isLoading}
    />
  );
}