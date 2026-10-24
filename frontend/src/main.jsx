/**
 * main.jsx
 * Điểm khởi chạy (Entry point) của ứng dụng React.
 * Render root component <App /> vào thẻ div#root trong index.html.
 * Bọc trong <BrowserRouter> để kích hoạt React Router.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);