/**
 * pages/reminders/RemindersPage.jsx
 * Controller quản lý nhắc nhở công việc (Chức năng 16).
 */
import { useState, useEffect } from "react";
import RemindersPageTemplate from "./RemindersPage.template";
import { reminderService } from "../../services/reminderService";
import { taskService } from "../../services/taskService";

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [remRes, tasksRes] = await Promise.all([
        reminderService.getReminders(),
        taskService.getTasks(),
      ]);
      setReminders(remRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error("Lỗi nạp nhắc nhở:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateReminder = async (data) => {
    try {
      await reminderService.createReminder(data);
      loadData();
    } catch (err) {
      alert("Lỗi khi tạo lời nhắc: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      await reminderService.toggleReminder(id);
      loadData();
    } catch (err) {
      console.error("Lỗi toggle lời nhắc:", err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await reminderService.deleteReminder(id);
      loadData();
    } catch (err) {
      alert("Lỗi khi xóa lời nhắc: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <RemindersPageTemplate
      reminders={reminders}
      tasks={tasks}
      onCreateReminder={handleCreateReminder}
      onToggleReminder={handleToggleReminder}
      onDeleteReminder={handleDeleteReminder}
      isLoading={isLoading}
    />
  );
}