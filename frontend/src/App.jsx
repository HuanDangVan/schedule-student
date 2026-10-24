/**
 * App.jsx
 * Root component - định nghĩa toàn bộ routing của ứng dụng.
 * Sử dụng React Router v6 với <Routes> và <Route>.
 *
 * Phân chia bố cục:
 *   - Trang công khai (/login, /register): không có thanh điều hướng (sidebar)
 *   - Trang riêng tư (đã đăng nhập): có sidebar + layout chính
 */
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return <AppRoutes />;
}