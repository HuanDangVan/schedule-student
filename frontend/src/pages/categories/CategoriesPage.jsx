/**
 * pages/categories/CategoriesPage.jsx
 * Controller quản lý danh mục công việc (Chức năng 5).
 */
import { useState, useEffect } from "react";
import CategoriesPageTemplate from "./CategoriesPage.template";
import { categoryService } from "../../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Lỗi nạp danh mục:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (catData) => {
    try {
      await categoryService.createCategory(catData);
      loadCategories();
    } catch (err) {
      alert("Lỗi khi tạo danh mục: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateCategory = async (id, catData) => {
    try {
      await categoryService.updateCategory(id, catData);
      loadCategories();
    } catch (err) {
      alert("Lỗi khi sửa danh mục: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert("Lỗi khi xóa danh mục: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <CategoriesPageTemplate
      categories={categories}
      onCreateCategory={handleCreateCategory}
      onUpdateCategory={handleUpdateCategory}
      onDeleteCategory={handleDeleteCategory}
      isLoading={isLoading}
    />
  );
}