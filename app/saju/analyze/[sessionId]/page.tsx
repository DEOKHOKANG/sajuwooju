"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { type ContentType } from "@/lib/content-configs";

/**
 * 사주 분석 중 페이지
 * API를 호출하고 결과를 localStorage에 저장한 후 결과 페이지로 이동
 * 컨텐츠 타입별 맞춤 상태 메시지 표시
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
  contentType?: ContentType;
  // 파트너 정보 (궁합/재회 등)
  partnerName?: string;
  partnerGender?: string;
  partnerYear?: number;
  partnerMonth?: number;
  partnerDay?: number;
  partnerBirthHour?: string;
  partnerCalendarType?: string;
  // 추가 입력 필드
  [key: string]: unknown;
}

// 컨텐츠 타입별 상태 메시지
const STATUS_MESSAGES: Record<ContentType, string[]> = {
  "som-compatibility": [
    "두 분의 사주 정보를 준비하고 있습니다...",
    "사주팔자를 계산하고 있습니다...",
    "두 분의 궁합을 분석하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "solo-escape": [
    "사주 정보를 준비하고 있습니다...",
    "연애 기운을 분석하고 있습니다...",
    "솔로탈출 시기를 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "reunion-possibility": [
    "두 분의 사주 정보를 준비하고 있습니다...",
    "과거의 인연을 분석하고 있습니다...",
    "재회 가능성을 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "marriage-compatibility": [
    "두 분의 사주 정보를 준비하고 있습니다...",
    "결혼 궁합을 분석하고 있습니다...",
    "길일을 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "new-year-fortune": [
    "사주 정보를 준비하고 있습니다...",
    "2025년 운세를 분석하고 있습니다...",
    "월별 운세를 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "wealth-fortune": [
    "사주 정보를 준비하고 있습니다...",
    "재물운을 분석하고 있습니다...",
    "돈 벌 시기를 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "career-saju": [
    "사주 정보를 준비하고 있습니다...",
    "적성과 재능을 분석하고 있습니다...",
    "직업운을 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "fact-bomb": [
    "사주 정보를 준비하고 있습니다...",
    "타고난 성향을 분석하고 있습니다...",
    "팩트폭탄을 준비하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "monthly-fortune": [
    "사주 정보를 준비하고 있습니다...",
    "이번 달 운세를 분석하고 있습니다...",
    "행운의 정보를 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "comprehensive": [
    "사주 정보를 준비하고 있습니다...",
    "사주팔자를 계산하고 있습니다...",
    "AI가 운세를 분석하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
  "transfer-love": [
    "사주 정보를 준비하고 있습니다...",
    "환승연애 기운을 분석하고 있습니다...",
    "새로운 인연 시기를 계산하고 있습니다...",
    "결과를 정리하고 있습니다...",
    "분석 완료!",
  ],
};

export default function AnalyzePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("사주 정보를 준비하고 있습니다...");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [, setContentType] = useState<ContentType>("comprehensive");
  const [retryCount, setRetryCount] = useState(0);

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
        const currentContentType = sessionData.contentType || "comprehensive";
        setContentType(currentContentType);

        const messages = STATUS_MESSAGES[currentContentType] || STATUS_MESSAGES.comprehensive;

        setProgress(20);
        setStatusText(messages[0]);

        // 2. 사주 API 호출
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(40);
        setStatusText(messages[1]);

        // API 요청 데이터 구성 (전체 세션 데이터 전달)
        const apiRequestData = {
          contentType: currentContentType,
          category: currentContentType,
          // 기본 사용자 정보
          name: sessionData.name,
          gender: sessionData.gender,
          calendarType: sessionData.calendarType,
          year: sessionData.year,
          month: sessionData.month,
          day: sessionData.day,
          birthHour: sessionData.birthHour,
          // 파트너 정보 (궁합/재회 등)
          partnerName: sessionData.partnerName,
          partnerGender: sessionData.partnerGender,
          partnerYear: sessionData.partnerYear,
          partnerMonth: sessionData.partnerMonth,
          partnerDay: sessionData.partnerDay,
          partnerBirthHour: sessionData.partnerBirthHour,
          partnerCalendarType: sessionData.partnerCalendarType,
          // 추가 필드들
          currentSituation: sessionData.currentSituation,
          separationReason: sessionData.separationReason,
          separationPeriod: sessionData.separationPeriod,
          weddingYear: sessionData.weddingYear,
          targetYear: sessionData.targetYear,
          currentJob: sessionData.currentJob,
          desiredField: sessionData.desiredField,
          targetMonth: sessionData.targetMonth,
        };

        const response = await fetch("/api/saju/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestData),
        });

        setProgress(70);
        setStatusText(messages[2]);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API error response:", errorData);
          throw new Error(errorData.error || "분석 API 호출 실패");
        }

        const data = await response.json();

        // API 응답 검증
        if (!data || !data.result) {
          throw new Error("분석 결과가 비어있습니다.");
        }

        setProgress(90);
        setStatusText(messages[3]);

        // 3. 결과를 localStorage에 저장 (전체 세션 데이터 포함)
        const resultData = {
          // 기본 정보
          name: sessionData.name,
          gender: sessionData.gender,
          calendarType: sessionData.calendarType,
          year: sessionData.year,
          month: sessionData.month,
          day: sessionData.day,
          birthHour: sessionData.birthHour,
          // 컨텐츠 타입
          contentType: currentContentType,
          category: currentContentType,
          productId: sessionData.productId,
          productTitle: sessionData.productTitle,
          // 파트너 정보
          partnerName: sessionData.partnerName,
          partnerGender: sessionData.partnerGender,
          partnerYear: sessionData.partnerYear,
          partnerMonth: sessionData.partnerMonth,
          partnerDay: sessionData.partnerDay,
          partnerBirthHour: sessionData.partnerBirthHour,
          partnerCalendarType: sessionData.partnerCalendarType,
          // 추가 필드들
          currentSituation: sessionData.currentSituation,
          separationReason: sessionData.separationReason,
          separationPeriod: sessionData.separationPeriod,
          weddingYear: sessionData.weddingYear,
          targetYear: sessionData.targetYear,
          currentJob: sessionData.currentJob,
          desiredField: sessionData.desiredField,
          targetMonth: sessionData.targetMonth,
          // API 결과
          result: data.result,
          structured: data.structured,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem(`${sessionId}-result`, JSON.stringify(resultData));

        setProgress(100);
        setStatusText(messages[4]);

        // 4. 결과 페이지로 이동
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push(`/saju/result/${sessionId}`);
      } catch (err) {
        console.error("Analysis error:", err);
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
        setError(errorMessage);
        setErrorCode(`ERROR_${Date.now().toString(36).toUpperCase()}`);
      }
    };

    analyzeAndRedirect();
  }, [sessionId, router, retryCount]);

  const handleRetry = () => {
    setError(null);
    setErrorCode(null);
    setProgress(0);
    setStatusText("사주 정보를 준비하고 있습니다...");
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">오류가 발생했습니다</h2>
          <p className="text-white/70 mb-4">일시적인 우주 장애가 발생했습니다. 잠시 후 다시 시도해주세요.</p>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
            >
              <span>다시 시도</span>
              <span>🔄</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>홈으로 돌아가기</span>
              <span>→</span>
            </button>
          </div>

          <div className="text-xs text-white/30 space-y-1">
            <p>문제가 계속되면 도움을 받으세요.</p>
            <div className="flex justify-center gap-2">
              <a href="/support" className="underline hover:text-white/50">고객센터</a>
              <span>•</span>
              <a href="/privacy" className="underline hover:text-white/50">개인정보</a>
              <span>•</span>
              <a href="/terms" className="underline hover:text-white/50">이용약관</a>
            </div>
            {errorCode && <p className="mt-2 font-mono">{errorCode}</p>}
          </div>
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
