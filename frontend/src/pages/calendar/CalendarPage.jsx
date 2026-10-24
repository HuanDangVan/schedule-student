/**
 * pages/calendar/CalendarPage.jsx
 * Controller lịch biểu: nạp sự kiện theo tháng/tuần/ngày, điều hướng thời gian.
 */
import { useState, useEffect } from "react";
import CalendarPageTemplate from "./CalendarPage.template";
import { calendarService } from "../../services/calendarService";
import { taskService } from "../../services/taskService";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isLoading, setIsLoading] = useState(true);

  const loadCalendarEvents = async () => {
    setIsLoading(true);
    try {
      const dateStr = currentDate.toISOString().split("T")[0];
      const res = await calendarService.getCalendar(view, dateStr);
      setEvents(res.data?.events || []);
    } catch (err) {
      console.error("Lỗi nạp lịch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarEvents();
  }, [currentDate, view]);

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "month") d.setMonth(d.getMonth() - 1);
      else if (view === "week") d.setDate(d.getDate() - 7);
      else d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "month") d.setMonth(d.getMonth() + 1);
      else if (view === "week") d.setDate(d.getDate() + 7);
      else d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleToggleComplete = async (taskId, isCurrentlyCompleted) => {
    try {
      if (isCurrentlyCompleted) {
        await taskService.markIncomplete(taskId);
      } else {
        await taskService.markComplete(taskId);
      }
      loadCalendarEvents();
    } catch (err) {
      console.error("Lỗi toggle complete:", err);
    }
  };

  return (
    <CalendarPageTemplate
      events={events}
      currentDate={currentDate}
      view={view}
      onViewChange={setView}
      onPrev={handlePrev}
      onNext={handleNext}
      onToday={handleToday}
      onToggleComplete={handleToggleComplete}
      isLoading={isLoading}
    />
  );
}