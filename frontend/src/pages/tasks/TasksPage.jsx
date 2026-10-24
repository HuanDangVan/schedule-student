/**
 * pages/tasks/TasksPage.jsx
 * Controller quản lý danh sách công việc: CRUD, ưu tiên, tiến độ và bộ lọc.
 */
import { useState, useEffect } from "react";
import TasksPageTemplate from "./TasksPage.template";
import { taskService } from "../../services/taskService";
import { categoryService } from "../../services/categoryService";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filterCategory) params.category_id = filterCategory;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;

      const [tasksRes, catsRes] = await Promise.all([
        taskService.getTasks(params),
        categoryService.getCategories(),
      ]);
      setTasks(tasksRes.data || []);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error("Lỗi nạp tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterCategory, filterStatus, filterPriority]);

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      loadData();
    } catch (err) {
      alert("Lỗi khi thêm công việc: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await taskService.updateTask(taskId, taskData);
      loadData();
    } catch (err) {
      alert("Lỗi khi cập nhật công việc: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      loadData();
    } catch (err) {
      alert("Lỗi khi xóa công việc: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleSetPriority = async (taskId, priority) => {
    try {
      await taskService.setPriority(taskId, priority);
      loadData();
    } catch (err) {
      console.error("Lỗi đổi mức ưu tiên:", err);
    }
  };

  const handleToggleComplete = async (taskId, isCurrentlyCompleted) => {
    try {
      if (isCurrentlyCompleted) {
        await taskService.markIncomplete(taskId);
      } else {
        await taskService.markComplete(taskId);
      }
      loadData();
    } catch (err) {
      console.error("Lỗi chuyển trạng thái hoàn thành:", err);
    }
  };

  const handleUpdateProgress = async (taskId, progress) => {
    try {
      await taskService.updateProgress(taskId, progress);
      // Update local state quickly for responsive slider
      setTasks((prev) =>
        prev.map((t) =>
          t.MaCongViec === taskId
            ? {
                ...t,
                TienDo: progress,
                TrangThai: progress === 100 ? "Đã hoàn thành" : progress > 0 ? "Đang làm" : "Chưa làm"
              }
            : t
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật tiến độ:", err);
    }
  };

  return (
    <TasksPageTemplate
      tasks={tasks}
      categories={categories}
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      filterPriority={filterPriority}
      setFilterPriority={setFilterPriority}
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onSetPriority={handleSetPriority}
      onToggleComplete={handleToggleComplete}
      onUpdateProgress={handleUpdateProgress}
      isLoading={isLoading}
    />
  );
}