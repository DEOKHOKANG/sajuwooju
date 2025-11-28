"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles } from "lucide-react";

/**
 * 사주 분석 중 페이지
 * API를 호출하고 결과를 localStorage에 저장한 후 결과 페이지로 이동
 */

interface SessionData {
  name: string;
  gender: string;
  calendarType: string;
  year: number;
  month: number;
  day: number;
  birthHour: string;
  productId?: number;
  productTitle?: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("사주 정보를 준비하고 있습니다...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeAndRedirect = async () => {
      try {
        // 1. localStorage에서 세션 데이터 가져오기
        const sessionDataStr = localStorage.getItem(sessionId);
        if (!sessionDataStr) {
          setError("세션 정보를 찾을 수 없습니다.");
          return;
        }

        const sessionData: SessionData = JSON.parse(sessionDataStr);
        setProgress(20);
        setStatusText("생년월일 정보를 분석하고 있습니다...");

        // 2. 사주 API 호출
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(40);
        setStatusText("사주팔자를 계산하고 있습니다...");

        const response = await fetch("/api/saju/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: "comprehensive",
            name: sessionData.name,
            gender: sessionData.gender,
            calendarType: sessionData.calendarType,
            year: sessionData.year,
            month: sessionData.month,
            day: sessionData.day,
            birthHour: sessionData.birthHour,
          }),
        });

        setProgress(70);
        setStatusText("AI가 운세를 분석하고 있습니다...");

        if (!response.ok) {
          throw new Error("분석 API 호출 실패");
        }

        const data = await response.json();
        setProgress(90);
        setStatusText("결과를 정리하고 있습니다...");

        // 3. 결과를 localStorage에 저장
        const resultData = {
          name: sessionData.name,
          gender: sessionData.gender,
          calendarType: sessionData.calendarType,
          year: sessionData.year,
          month: sessionData.month,
          day: sessionData.day,
          birthHour: sessionData.birthHour,
          category: "comprehensive",
          result: data.result,
          structured: data.structured,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem(`${sessionId}-result`, JSON.stringify(resultData));

        setProgress(100);
        setStatusText("분석 완료!");

        // 4. 결과 페이지로 이동
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push(`/saju/result/${sessionId}`);
      } catch (err) {
        console.error("Analysis error:", err);
        setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    };

    analyzeAndRedirect();
  }, [sessionId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😢</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">오류 발생</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-2xl">
          {/* Animated Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-spin" style={{ animationDuration: "8s" }} />
            <div className="absolute inset-2 rounded-full border-4 border-pink-500/30 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
            <div className="absolute inset-4 rounded-full border-4 border-indigo-500/30 animate-spin" style={{ animationDuration: "4s" }} />

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Status Text */}
          <h2 className="text-2xl font-bold text-white mb-2">사주 분석 중</h2>
          <p className="text-white/70 mb-8 min-h-[24px]">{statusText}</p>

          {/* Progress Bar */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>

          {/* Progress Percentage */}
          <p className="text-white/50 text-sm">{progress}% 완료</p>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            💫 잠시만 기다려주세요. AI가 당신의 사주를 분석하고 있습니다.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
