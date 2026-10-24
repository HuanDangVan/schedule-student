/**
 * pages/analysis/AnalysisPage.jsx
 * Controller phân tích khả năng hoàn thành và dự đoán rủi ro (Chức năng 17).
 */
import { useState, useEffect } from "react";
import AnalysisPageTemplate from "./AnalysisPage.template";
import { analysisService } from "../../services/analysisService";

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analysisService.getAnalysis()
      .then((res) => setAnalysisData(res.data))
      .catch((err) => console.error("Lỗi nạp phân tích:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return <AnalysisPageTemplate analysisData={analysisData} isLoading={isLoading} />;
}