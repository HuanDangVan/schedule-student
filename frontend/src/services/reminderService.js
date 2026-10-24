/**
 * services/reminderService.js
 * Quản lý nhắc nhở công việc
 */
import api from "./api";

export const reminderService = {
  getReminders:      ()         => api.get("/reminders"),
  getTodayReminders: ()         => api.get("/reminders/today"),
  createReminder:    (data)     => api.post("/reminders", data),
  toggleReminder:    (id)       => api.patch(`/reminders/${id}/toggle`),
  deleteReminder:    (id)       => api.delete(`/reminders/${id}`),
};
