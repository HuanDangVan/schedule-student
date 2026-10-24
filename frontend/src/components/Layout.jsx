/**
 * components/Layout.jsx
 * Khung giao diện chính cho các trang nội bộ.
 */
import Sidebar from "./Sidebar";

export default function Layout({ children, activeTitle = "" }) {
  const todayStr = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Top Header */}
        <header style={{
          height: 60,
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              📅 Hôm nay:
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>
              {todayStr}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(45, 212, 191, 0.12)",
              color: "var(--color-secondary)",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-secondary)", display: "inline-block" }}></span>
              Hệ thống đồng bộ trực tuyến
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}