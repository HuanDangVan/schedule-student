/**
 * pages/auth/RegisterPage.jsx
 * Controller đăng ký tài khoản sinh viên mới.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterPageTemplate from "./RegisterPage.template";
import { authService } from "../../services/authService";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
      }
      setTimeout(() => {
        navigate("/");
      }, 1000);
      return { success: true };
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Không nhận được phản hồi từ máy chủ.";

      return { error: typeof msg === "string" ? msg : JSON.stringify(msg) };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterPageTemplate
      onRegisterSubmit={handleRegisterSubmit}
      isLoading={isLoading}
    />
  );
}