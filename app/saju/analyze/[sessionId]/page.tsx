/**
 * 사주 분석 페이지 (로딩 → 결과)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingAnimation } from "@/components/saju/LoadingAnimation";

export default function AnalyzePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // OpenAI API 호출
        const response = await fetch("/api/saju/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: formData.category,
            input: {
              name: formData.name,
              gender: formData.gender,
              birthDate: formData.birthDate,
              birthTime: formData.birthTime,
              isLunar: formData.isLunar,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "분석 중 오류가 발생했습니다.");
        }

        const result = await response.json();

        // 결과를 LocalStorage에 저장
        const resultData = {
          ...formData,
          result: result.result,
          timestamp: result.timestamp,
          analyzedAt: new Date().toISOString(),
        };

        localStorage.setItem(`${sessionId}-result`, JSON.stringify(resultData));

        // 최소 2초 로딩 애니메이션 표시
        setTimeout(() => {
          setIsAnalyzing(false);
          router.push(`/saju/result/${sessionId}`);
        }, 2000);
      } catch (err) {
        console.error("Analysis error:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
        setIsAnalyzing(false);
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

  if (isAnalyzing) {
    return <LoadingAnimation />;
  }

  return null;
}
