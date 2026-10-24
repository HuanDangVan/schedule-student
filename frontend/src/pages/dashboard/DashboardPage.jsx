/**
 * pages/dashboard/DashboardPage.jsx
 * Controller nạp dữ liệu thống kê, việc làm, gợi ý và nhắc nhở hôm nay.
 */
import { useState, useEffect } from "react";
import DashboardPageTemplate from "./DashboardPage.template";
import { statisticsService } from "../../services/statisticsService";
import { taskService } from "../../services/taskService";
import { suggestionService } from "../../services/suggestionService";
import { reminderService } from "../../services/reminderService";
import { categoryService } from "../../services/categoryService";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [todayReminders, setTodayReminders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [statsRes, tasksRes, sugRes, remRes, catRes] = await Promise.all([
        statisticsService.getStatistics().catch(() => ({ data: null })),
        taskService.getTasks().catch(() => ({ data: [] })),
        suggestionService.getSuggestions().catch(() => ({ data: { suggestions: [] } })),
        reminderService.getTodayReminders().catch(() => ({ data: [] })),
        categoryService.getCategories().catch(() => ({ data: [] })),
      ]);

      setStats(statsRes.data);
      setTasks(tasksRes.data || []);
      setSuggestions(sugRes.data?.suggestions || []);
      setTodayReminders(remRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error("Lỗi nạp dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleComplete = async (taskId, isCurrentlyCompleted) => {
    try {
      if (isCurrentlyCompleted) {
        await taskService.markIncomplete(taskId);
      } else {
        await taskService.markComplete(taskId);
      }
      loadDashboardData();
    } catch (err) {
      console.error("Lỗi toggle complete:", err);
    }
  };

  return (
    <DashboardPageTemplate
      stats={stats}
      tasks={tasks}
      suggestions={suggestions}
      todayReminders={todayReminders}
      categories={categories}
      onToggleComplete={handleToggleComplete}
      isLoading={isLoading}
    />
  );
}