/**
 * services/profileService.js
 * Quản lý hồ sơ cá nhân và đổi mật khẩu
 */
import api from "./api";

export const profileService = {
  getProfile:     ()     => api.get("/profile"),
  updateProfile:  (data) => api.put("/profile", data),
  changePassword: (data) => api.put("/profile/change-password", data),
};
