/**
 * vite.config.js
 * Cấu hình Vite dev server cho React frontend.
 * - port: 5173
 * - proxy: forward /api/* đến FastAPI backend (port 8000)
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
