/**
 * services/authService.js
 * Các hàm gọi API liên quan đến xác thực tài khoản:
 *   - register(data) : POST /api/auth/register  -> Đăng ký tài khoản
 *   - login(data)    : POST /api/auth/login     -> Đăng nhập, lưu token vào localStorage
 *   - logout()       : POST /api/auth/logout    -> Đăng xuất, xóa token
 */
import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login",    data),
  logout:   ()     => api.post("/auth/logout"),
};