
/**
 * vite.config.js
 * Cấu hình Vite cho Schedule Student.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Đường dẫn triển khai trên GitHub Pages
  base: "/schedule-student/",

  plugins: [react()],

  server: {
    port: 5173,

    // Proxy chỉ sử dụng khi chạy frontend trên máy local
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
