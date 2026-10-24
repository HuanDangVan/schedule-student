/**
 * pages/auth/LoginPage.jsx
 * Xử lý đăng nhập với Email / Tên đăng nhập và Mật khẩu.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPageTemplate from "./LoginPage.template";
import { authService } from "../../services/authService";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (credentials) => {
    setIsLoading(true);
    try {
      const payload = {
        Email: credentials.Email || credentials.username,
        MatKhau: credentials.MatKhau || credentials.password
      };
      const response = await authService.login(payload);
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
      }
      navigate("/");
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Email hoặc mật khẩu không chính xác.";
      return msg;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPageTemplate
      onLoginSubmit={handleLoginSubmit}
      isLoading={isLoading}
    />
  );
}