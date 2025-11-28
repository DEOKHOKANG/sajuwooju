/**
 * 사주 분석 페이지 (상용화급)
 * 로딩 애니메이션 → AI 분석 → 결과 페이지
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AnalysisLoading } from "@/components/saju/AnalysisLoading";
import { getSajuGanZhi, formatSajuString } from "@/lib/lunar-calendar";

export default function AnalyzePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const analyzeSaju = async () => {
      try {
        // LocalStorage에서 사용자 입력 데이터 가져오기
        const formDataStr = localStorage.getItem(sessionId);
        if (!formDataStr) {
          setError("입력 데이터를 찾을 수 없습니다.");
          return;
        }

        const formData = JSON.parse(formDataStr);
        setUserName(formData.name);

        // 프로그레스 시뮬레이션 시작 (0% → 20%)
        setProgress(10);

        // 사주 간지 계산
        const ganZhi = getSajuGanZhi(
          formData.year,
          formData.month,
          formData.day,
          formData.calendarType,
          formData.birthHour
        );

        if (!ganZhi) {
          setError("사주 계산 중 오류가 발생했습니다.");
          return;
        }

        const sajuString = formatSajuString(ganZhi);

        // 프로그레스 업데이트 (20% → 40%)
        setProgress(30);

        // OpenAI API 호출
        const response = await fetch("/api/saju/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: formData.category,
            name: formData.name,
            gender: formData.gender,
            calendarType: formData.calendarType,
            year: formData.year,
            month: formData.month,
            day: formData.day,
            birthHour: formData.birthHour,
            sajuGanZhi: ganZhi,
            sajuString: sajuString,
          }),
        });

        // 프로그레스 업데이트 (40% → 70%)
        setProgress(60);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "분석 중 오류가 발생했습니다.");
        }

        const result = await response.json();

        // 프로그레스 업데이트 (70% → 90%)
        setProgress(85);

        // 결과를 LocalStorage에 저장
        const resultData = {
          ...formData,
          result: result.result,
          timestamp: result.timestamp,
          analyzedAt: new Date().toISOString(),
        };

        localStorage.setItem(`${sessionId}-result`, JSON.stringify(resultData));

        // 프로그레스 완료 (90% → 100%)
        setProgress(100);

        // 잠시 대기 후 결과 페이지로 이동
        setTimeout(() => {
          router.push(`/saju/result/${sessionId}`);
        }, 1000);
      } catch (err) {
        console.error("Analysis error:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      }
    };

    analyzeSaju();
  }, [sessionId, router]);

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
            분석 오류
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/saju/new")}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            처음부터 다시 시작
          </button>
        </div>
      </div>
    );
  }

  // 분석 중일 때 로딩 애니메이션 표시
  if (!error) {
    return (
      <AnalysisLoading
        progress={progress}
        estimatedTime={30}
        userName={userName}
      />
    );
  }

  return null;
}
