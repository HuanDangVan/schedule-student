/**
 * services/api.js
 * Cấu hình Axios instance dùng chung cho toàn bộ ứng dụng.
 * - baseURL: tự động proxy đến backend FastAPI qua cấu hình Vite
 * - Interceptor request: tự động đính kèm JWT token vào header Authorization
 * - Interceptor response: xử lý lỗi 401 (hết hạn token -> đăng xuất và chuyển hướng đến trang login)
 */
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Gửi kèm token trong mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi response toàn cục
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;