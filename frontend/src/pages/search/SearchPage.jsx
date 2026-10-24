/**
 * pages/search/SearchPage.jsx
 * Controller tìm kiếm và lọc công việc đa tiêu chí (Chức năng 13).
 */
import { useState, useEffect } from "react";
import SearchPageTemplate from "./SearchPage.template";
import { searchService } from "../../services/searchService";
import { categoryService } from "../../services/categoryService";
import { taskService } from "../../services/taskService";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [sortBy, setSortBy] = useState("deadline_asc");

  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data || []));
  }, []);

  // Perform search
  const executeSearch = async () => {
    setIsLoading(true);
    try {
      const params = {
        q: searchQuery || undefined,
        category_id: selectedCategory || undefined,
        status: selectedStatus || undefined,
        priority: selectedPriority || undefined,
        sort_by: sortBy,
      };
      const res = await searchService.searchTasks(params);
      setResults(res.data?.results || []);
      setTotalResults(res.data?.total_results || 0);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [selectedCategory, selectedStatus, selectedPriority, sortBy]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSelectedPriority("");
    setSortBy("deadline_asc");
  };

  const handleToggleComplete = async (taskId, isCurrentlyCompleted) => {
    try {
      if (isCurrentlyCompleted) {
        await taskService.markIncomplete(taskId);
      } else {
        await taskService.markComplete(taskId);
      }
      executeSearch();
    } catch (err) {
      console.error("Lỗi toggle complete:", err);
    }
  };

  return (
    <SearchPageTemplate
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      selectedStatus={selectedStatus}
      setSelectedStatus={setSelectedStatus}
      selectedPriority={selectedPriority}
      setSelectedPriority={setSelectedPriority}
      sortBy={sortBy}
      setSortBy={setSortBy}
      categories={categories}
      results={results}
      totalResults={totalResults}
      onSearch={executeSearch}
      onReset={handleReset}
      onToggleComplete={handleToggleComplete}
      isLoading={isLoading}
    />
  );
}