/**
 * services/searchService.js
 * Tìm kiếm & lọc công việc
 */
import api from "./api";

export const searchService = {
  searchTasks: (params) => api.get("/search", { params }),
};
