/**
 * routes/AppRoutes.jsx
 * Dinh nghia TAT CA routes cua ung dung tai mot cho.
 * De dang xem toan bo cau truc dieu huong.
 *
 * Public routes  (khong can dang nhap): /login, /register
 * Private routes (can dang nhap):       tat ca routes con lai
 */
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Private pages
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import TasksPage from "../pages/tasks/TasksPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import ProgressPage from "../pages/progress/ProgressPage";
import SearchPage from "../pages/search/SearchPage";
import StatisticsPage from "../pages/statistics/StatisticsPage";
import SuggestionsPage from "../pages/suggestions/SuggestionsPage";
import RemindersPage from "../pages/reminders/RemindersPage";
import AnalysisPage from "../pages/analysis/AnalysisPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ===== PRIVATE ROUTES ===== */}
      {/* Dashboard - trang chu tong quan */}
      <Route path="/" element={<DashboardPage />} />

      {/* Chuc nang 4: Thong tin ca nhan */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Chuc nang 5: Phan loai cong viec */}
      <Route path="/categories" element={<CategoriesPage />} />

      {/* Chuc nang 6,7,8,9,10: Quan ly cong viec */}
      <Route path="/tasks" element={<TasksPage />} />

      {/* Chuc nang 11: Xem lich */}
      <Route path="/calendar" element={<CalendarPage />} />

      {/* Chuc nang 12: Theo doi tien do */}
      <Route path="/progress" element={<ProgressPage />} />

      {/* Chuc nang 13: Tim kiem & loc */}
      <Route path="/search" element={<SearchPage />} />

      {/* Chuc nang 14: Thong ke */}
      <Route path="/statistics" element={<StatisticsPage />} />

      {/* Chuc nang 15: Goi y uu tien */}
      <Route path="/suggestions" element={<SuggestionsPage />} />

      {/* Chuc nang 16: Nhac nho */}
      <Route path="/reminders" element={<RemindersPage />} />

      {/* Chuc nang 17: Phan tich hoan thanh */}
      <Route path="/analysis" element={<AnalysisPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}