/**
 * services/suggestionService.js
 * Gợi ý sắp xếp thứ tự ưu tiên
 */
import api from "./api";

export const suggestionService = {
  getSuggestions: () => api.get("/suggestions"),
};
