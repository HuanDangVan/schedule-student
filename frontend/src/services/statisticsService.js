/**
 * services/statisticsService.js
 * Các hàm gọi API thống kê và phân tích:
 *   - getStatistics(from, to) : GET /api/statistics  -> Thống kê công việc
 *   - getProgress()           : GET /api/progress    -> Theo dõi tiến độ
 *   - getSuggestions()        : GET /api/suggestions -> Gợi ý sắp xếp thứ tự ưu tiên
 *   - getAnalysis()           : GET /api/analysis    -> Phân tích khả năng hoàn thành
 *   - search(params)          : GET /api/search      -> Tìm kiếm & lọc
 *   - getReminders()          : GET /api/reminders   -> Danh sách nhắc nhở
 */
import api from "./api";

export const statisticsService = {
  getStatistics:  (from, to) => api.get("/statistics", { params: { from, to } }),
  getProgress:    ()         => api.get("/progress"),
  getSuggestions: ()         => api.get("/suggestions"),
  getAnalysis:    ()         => api.get("/analysis"),
  search:         (params)   => api.get("/search", { params }),
  getReminders:   ()         => api.get("/reminders"),
};