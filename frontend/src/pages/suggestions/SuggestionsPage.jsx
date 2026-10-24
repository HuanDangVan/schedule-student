/**
 * pages/suggestions/SuggestionsPage.jsx
 * Controller gợi ý sắp xếp thứ tự công việc tối ưu (Chức năng 15).
 */
import { useState, useEffect } from "react";
import SuggestionsPageTemplate from "./SuggestionsPage.template";
import { suggestionService } from "../../services/suggestionService";
import { taskService } from "../../services/taskService";

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const res = await suggestionService.getSuggestions();
      setSuggestions(res.data?.suggestions || []);
    } catch (err) {
      console.error("Lỗi nạp gợi ý:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleToggleComplete = async (taskId) => {
    try {
      await taskService.markComplete(taskId);
      loadSuggestions();
    } catch (err) {
      console.error("Lỗi đánh dấu hoàn thành:", err);
    }
  };

  return (
    <SuggestionsPageTemplate
      suggestions={suggestions}
      onToggleComplete={handleToggleComplete}
      isLoading={isLoading}
    />
  );
}