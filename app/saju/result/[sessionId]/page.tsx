/**
 * 사주 결과 페이지 (상용화급)
 * 구조화된 JSON 기반 일관된 디자인 템플릿
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Sparkles,
  Star,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

// 구조화된 결과 타입
interface SajuAnalysisResult {
  summary: {
    title: string;
    overall: string;
    score: number;
  };
  sections: Array<{
    title: string;
    icon: string;
    content: string;
    highlights?: string[];
  }>;
  advice: {
    title: string;
    items: string[];
  };
  luckyInfo: {
    color: string;
    number: string;
    direction: string;
    time: string;
  };
}

interface ResultData {
  name: string;
  gender: string;
  calendarType: string;
  year: number;
  month: number;
  day: number;
  birthHour: string;
  category: string;
  result: SajuAnalysisResult | string;
  structured?: boolean;
  timestamp: string;
}

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadResultData = async () => {
      try {
        const dataStr = localStorage.getItem(`${sessionId}-result`);
        if (!dataStr) {
          setError("결과를 찾을 수 없습니다.");
          return;
        }

        const data: ResultData = JSON.parse(dataStr);
        setResultData(data);
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        console.error("Failed to load result:", err);
        setError("결과를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadResultData();
  }, [sessionId]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/saju/${sessionId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "사주 분석 결과",
          text: `${resultData?.name}님의 사주 분석 결과를 확인해보세요!`,
          url: shareUrl,
        });
      } catch {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😢</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결과 오류</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 구조화된 결과인지 확인
  const isStructured = typeof resultData.result === "object" && resultData.result !== null;

  // 비구조화된 결과 (레거시 지원)
  if (!isStructured) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="mx-auto max-w-[600px] px-4 py-3 flex items-center justify-between">
            <Link href="/">
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="뒤로 가기">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            </Link>
            <h1 className="font-bold text-gray-900">분석 결과</h1>
            <button type="button" onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="공유하기">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>
        <main className="max-w-[600px] mx-auto px-4 py-6 pb-24">
          <div className="bg-white rounded-2xl p-6 shadow-sm whitespace-pre-wrap">
            {resultData.result as string}
          </div>
        </main>
      </div>
    );
  }

  // 여기부터는 구조화된 결과만 처리
  const result = resultData.result as SajuAnalysisResult;

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-[600px] px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="뒤로 가기">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
          <h1 className="font-bold text-gray-900">분석 결과</h1>
          <button type="button" onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="공유하기">
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Share2 className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6 pb-32 space-y-6">
        {/* Summary Card */}
        <section
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{result.summary.title}</h2>
              <p className="text-white/80 text-sm">
                {resultData.year}년 {resultData.month}월 {resultData.day}일생
              </p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 mb-4">
            <span className="text-white/90 font-medium">종합 운세 점수</span>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(result.summary.score / 20)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{result.summary.score}</span>
            </div>
          </div>

          {/* Overall */}
          <p className="text-white/90 leading-relaxed text-sm">
            {result.summary.overall}
          </p>
        </section>

        {/* Analysis Sections */}
        {result.sections.map((section, index) => (
          <section
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>

            {section.highlights && section.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {section.highlights.map((highlight, hIndex) => (
                  <span
                    key={hIndex}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Advice Section */}
        <section
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 animate-fade-in-up"
          style={{ animationDelay: `${0.2 + result.sections.length * 0.1}s` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-amber-900">{result.advice.title}</h3>
          </div>

          <ul className="space-y-3">
            {result.advice.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-amber-800 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Lucky Info Section */}
        <section
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up"
          style={{ animationDelay: `${0.3 + result.sections.length * 0.1}s` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🍀</span>
            <h3 className="text-lg font-bold text-gray-900">행운의 정보</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">🎨</span>
              <p className="text-xs text-gray-500 mb-1">행운의 색</p>
              <p className="font-bold text-gray-900">{result.luckyInfo.color}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">🔢</span>
              <p className="text-xs text-gray-500 mb-1">행운의 숫자</p>
              <p className="font-bold text-gray-900">{result.luckyInfo.number}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">🧭</span>
              <p className="text-xs text-gray-500 mb-1">행운의 방향</p>
              <p className="font-bold text-gray-900">{result.luckyInfo.direction}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">⏰</span>
              <p className="text-xs text-gray-500 mb-1">행운의 시간</p>
              <p className="font-bold text-gray-900">{result.luckyInfo.time}</p>
            </div>
          </div>
        </section>

        {/* User Info Summary */}
        <section className="bg-gray-50 rounded-2xl p-5 animate-fade-in-up">
          <h3 className="text-sm font-medium text-gray-500 mb-3">분석 정보</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">이름</span>
              <span className="font-medium text-gray-900">{resultData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">성별</span>
              <span className="font-medium text-gray-900">
                {resultData.gender === "male" ? "남성" : "여성"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">생년월일</span>
              <span className="font-medium text-gray-900">
                {resultData.year}.{resultData.month}.{resultData.day}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">분석일시</span>
              <span className="font-medium text-gray-900">
                {new Date(resultData.timestamp).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        <div className="max-w-[600px] mx-auto p-4 flex gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? "복사됨!" : "링크 복사"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            새로운 분석
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
