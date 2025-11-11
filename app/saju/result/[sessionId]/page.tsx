/**
 * 사주 결과 페이지
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultHeader } from "@/components/saju/ResultHeader";
import { ResultContent } from "@/components/saju/ResultContent";
import { ShareButtons } from "@/components/saju/ShareButtons";
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

  useEffect(() => {
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
    } catch (err) {
      console.error("Failed to load result:", err);
      setError("결과를 불러오는 중 오류가 발생했습니다.");
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-pink-50">
      {/* Header */}
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

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Saju Board (Four Pillars) */}
        {sajuGanZhi && <SajuBoard ganZhi={sajuGanZhi} />}

        {/* WuXing Analysis (Five Elements) */}
        {wuXingAnalysis && <WuXingAnalysis analysis={wuXingAnalysis} />}

        {/* AI Result Content */}
        <ResultContent result={resultData.result} />
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-4">
        {/* Share Buttons */}
        <ShareButtons
          sessionId={sessionId}
          name={resultData.name}
          category={CATEGORY_CONFIG[resultData.category].title}
        />

        {/* New Analysis Button */}
        <button
          onClick={() => router.push("/saju/new")}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          ✨ 새로운 분석 시작
        </button>
      </div>
    </div>
  );
}
