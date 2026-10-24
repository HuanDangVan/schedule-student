/**
 * services/taskService.js
 * Quản lý công việc: CRUD, ưu tiên, hoàn thành, cập nhật tiến độ %
 */
import api from "./api";

export const taskService = {
  getTasks:       (params)         => api.get("/tasks", { params }),
  getTaskById:   (id)             => api.get(`/tasks/${id}`),
  createTask:     (data)           => api.post("/tasks", data),
  updateTask:     (id, data)       => api.put(`/tasks/${id}`, data),
  deleteTask:     (id)             => api.delete(`/tasks/${id}`),
  setPriority:    (id, MucDoUuTien) => api.patch(`/priority/${id}`, { MucDoUuTien }),
  markComplete:   (id)             => api.patch(`/completion/${id}/complete`),
  markIncomplete: (id)             => api.patch(`/completion/${id}/incomplete`),
  updateProgress: (id, TienDo)     => api.patch(`/tasks/${id}/progress`, { TienDo }),
};