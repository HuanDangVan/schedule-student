/**
 * services/progressService.js
 * API tiến độ công việc và danh mục
 */
import api from "./api";

export const progressService = {
  getOverview:   () => api.get("/progress/overview"),
  getByCategory: () => api.get("/progress/by-category"),
};
