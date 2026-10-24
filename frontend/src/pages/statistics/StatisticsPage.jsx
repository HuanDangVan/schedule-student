/**
 * pages/statistics/StatisticsPage.jsx
 * Controller thống kê công việc và hiệu suất học tập.
 */
import { useState, useEffect } from "react";
import StatisticsPageTemplate from "./StatisticsPage.template";
import { statisticsService } from "../../services/statisticsService";

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    statisticsService.getStatistics()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Lỗi nạp thống kê:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return <StatisticsPageTemplate stats={stats} isLoading={isLoading} />;
}