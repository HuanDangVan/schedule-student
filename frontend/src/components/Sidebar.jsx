/**
 * components/Sidebar.jsx
 * Thanh điều hướng ứng dụng Schedule Student với hiệu ứng hiện đại.
 */
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { profileService } from "../services/profileService";

const navItems = [
  { path: "/", label: "Tổng quan", icon: "🏠" },
  { path: "/tasks", label: "Công việc", icon: "📋" },
  { path: "/calendar", label: "Lịch biểu", icon: "📅" },
  { path: "/categories", label: "Phân loại", icon: "🏷️" },
  { path: "/progress", label: "Tiến độ", icon: "📊" },
  { path: "/statistics", label: "Thống kê", icon: "📈" },
  { path: "/search", label: "Tìm kiếm & Lọc", icon: "🔍" },
  { path: "/suggestions", label: "Gợi ý ưu tiên", icon: "💡" },
  { path: "/reminders", label: "Nhắc nhở", icon: "🔔" },
  { path: "/analysis", label: "Phân tích rủi ro", icon: "🧠" },
  { path: "/profile", label: "Hồ sơ cá nhân", icon: "👤" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Sinh viên");

  useEffect(() => {
    profileService.getProfile()
      .then(res => {
        if (res.data?.HoTen) setUserName(res.data.HoTen);
      })
      .catch(() => { });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <aside style={{
      width: 250,
      minWidth: 250,
      background: "var(--color-surface)",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid var(--color-border)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{
        padding: "24px 20px 20px",
        borderBottom: "1px solid var(--color-border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6C63FF, #48CFB2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 4px 12px rgba(108, 99, 255, 0.4)"
          }}>
            📅
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.3px", margin: 0 }}>
              Schedule Student
            </h1>
            <span style={{ fontSize: 11, color: "var(--color-secondary)", fontWeight: 600 }}>
              Kỳ học 2026-2027
            </span>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div style={{
        flex: 1,
        padding: "16px 12px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 4
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              color: isActive ? "#FFF" : "var(--color-text-secondary)",
              background: isActive ? "linear-gradient(90deg, rgba(108, 99, 255, 0.25), rgba(108, 99, 255, 0.08))" : "transparent",
              borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
              fontWeight: isActive ? 600 : 500,
              fontSize: 13.5,
              transition: "all 0.15s ease",
            })}
          >
            <span style={{ fontSize: 17 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Footer Profile & Logout */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid var(--color-border)",
        background: "rgba(0,0,0,0.15)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6C63FF, #A78BFA)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                Sinh viên
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Đăng xuất"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              fontSize: 16,
              padding: 6,
              borderRadius: 6,
              transition: "color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--color-danger)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}