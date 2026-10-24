/**
 * services/analysisService.js
 * Phân tích khả năng hoàn thành và rủi ro trễ hạn
 */
import api from "./api";

export const analysisService = {
  getAnalysis:     ()   => api.get("/analysis"),
  getTaskAnalysis: (id) => api.get(`/analysis/${id}`),
};
