/**
 * services/calendarService.js
 * Hàm gọi API xem lịch theo ngày / tuần / tháng:
 *   - getCalendar(view, date) : GET /api/calendar?view=...&date=...
 */
import api from "./api";

export const calendarService = {
  getCalendar: (view, date) => api.get("/calendar", { params: { view, date } }),
};