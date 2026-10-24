/**
 * pages/progress/ProgressPage.jsx
 * Controller theo dõi tiến độ công việc theo thời gian thực.
 */
import { useState, useEffect } from "react";
import ProgressPageTemplate from "./ProgressPage.template";
import { progressService } from "../../services/progressService";
import { taskService } from "../../services/taskService";

export default function ProgressPage() {
  const [overview, setOverview] = useState(null);
  const [categoryProgress, setCategoryProgress] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      const [overRes, catRes, tasksRes] = await Promise.all([
        progressService.getOverview(),
        progressService.getByCategory(),
        taskService.getTasks(),
      ]);
      setOverview(overRes.data);
      setCategoryProgress(catRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error("Lỗi nạp tiến độ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const handleUpdateProgress = async (taskId, newProgress) => {
    try {
      await taskService.updateProgress(taskId, newProgress);
      // Cập nhật ngay trên UI mượt mà
      setTasks((prev) =>
        prev.map((t) =>
          t.MaCongViec === taskId
            ? {
                ...t,
                TienDo: newProgress,
                TrangThai: newProgress === 100 ? "Đã hoàn thành" : newProgress > 0 ? "Đang làm" : "Chưa làm"
              }
            : t
        )
      );
      // Nạp lại thống kê nền
      progressService.getOverview().then((res) => setOverview(res.data));
      progressService.getByCategory().then((res) => setCategoryProgress(res.data));
    } catch (err) {
      console.error("Lỗi cập nhật tiến độ:", err);
    }
  };

  return (
    <ProgressPageTemplate
      overview={overview}
      categoryProgress={categoryProgress}
      tasks={tasks}
      onUpdateProgress={handleUpdateProgress}
      isLoading={isLoading}
    />
  );
}