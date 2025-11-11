/**
 * 사주 결과 페이지 (상용화급)
 * 부드러운 애니메이션과 에러 바운더리 적용
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultHeader } from "@/components/saju/ResultHeader";
import { ResultContent } from "@/components/saju/ResultContent";
import { ShareButtons } from "@/components/saju/ShareButtons";
import { PublicToggle } from "@/components/saju/PublicToggle";
import { SajuBoard } from "@/components/saju/SajuBoard";
import { WuXingAnalysis } from "@/components/saju/WuXingAnalysis";
import { SajuResultData } from "@/lib/types/saju-result";
import { CATEGORY_CONFIG } from "@/lib/types/saju-result";
import { addToHistory } from "@/lib/saju-history";
import { getSajuGanZhi, analyzeWuXing, SajuGanZhi, WuXingAnalysis as WuXingAnalysisType } from "@/lib/lunar-calendar";

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [resultData, setResultData] = useState<SajuResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sajuGanZhi, setSajuGanZhi] = useState<SajuGanZhi | null>(null);
  const [wuXingAnalysis, setWuXingAnalysis] = useState<WuXingAnalysisType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadResultData = async () => {
      try {
        // LocalStorage에서 결과 데이터 가져오기
        const dataStr = localStorage.getItem(`${sessionId}-result`);
        if (!dataStr) {
          setError("결과를 찾을 수 없습니다.");
          return;
        }

        const data: SajuResultData = JSON.parse(dataStr);
        setResultData(data);

        // 사주 간지 계산
        const ganZhi = getSajuGanZhi(
          data.year,
          data.month,
          data.day,
          data.calendarType,
          data.birthHour
        );

        if (ganZhi) {
          setSajuGanZhi(ganZhi);
          // 오행 분석
          const analysis = analyzeWuXing(ganZhi);
          setWuXingAnalysis(analysis);
        }

        // 히스토리에 추가
        addToHistory(data, sessionId);

        // 부드러운 fade-in 애니메이션
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        console.error("Failed to load result:", err);
        setError(err instanceof Error ? err.message : "결과를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadResultData();
  }, [sessionId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            결과 오류
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/saju/new")}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            새로운 분석 시작
          </button>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-white via-purple-50 to-pink-50 transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <div className="animate-fade-in-down">
        <ResultHeader
          name={resultData.name}
          category={resultData.category}
          calendarType={resultData.calendarType}
          year={resultData.year}
          month={resultData.month}
          day={resultData.day}
          birthHour={resultData.birthHour}
          gender={resultData.gender}
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Saju Board (Four Pillars) - 순차적 애니메이션 */}
        {sajuGanZhi && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <SajuBoard ganZhi={sajuGanZhi} />
          </div>
        )}

        {/* WuXing Analysis (Five Elements) - 순차적 애니메이션 */}
        {wuXingAnalysis && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            <WuXingAnalysis analysis={wuXingAnalysis} />
          </div>
        )}

        {/* AI Result Content - 순차적 애니메이션 */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
          <ResultContent result={resultData.result} />
        </div>
      </div>

      {/* Action Buttons - 순차적 애니메이션 */}
      <div
        className="max-w-4xl mx-auto px-4 pb-12 space-y-4 animate-fade-in-up"
        style={{ animationDelay: "0.8s", animationFillMode: "both" }}
      >
        {/* Public Toggle */}
        <PublicToggle
          sessionId={sessionId}
          onToggle={(isPublic) => {
            console.log("Public setting changed:", isPublic);
            // TODO: 백엔드 API 연동 시 여기서 서버에 저장
          }}
        />

        {/* Share Buttons */}
        <ShareButtons
          sessionId={sessionId}
          name={resultData.name}
          category={CATEGORY_CONFIG[resultData.category].title}
        />

        {/* New Analysis Button */}
        <button
          onClick={() => router.push("/saju/new")}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          ✨ 새로운 분석 시작
        </button>
      </div>
    </div>
  );
}
