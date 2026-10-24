/**
 * services/categoryService.js
 * Quản lý danh mục môn học, dự án, hoạt động
 */
import api from "./api";

export const categoryService = {
  getCategories:   ()         => api.get("/categories"),
  createCategory: (data)     => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id)       => api.delete(`/categories/${id}`),
};
