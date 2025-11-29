/**
 * 사주 결과 페이지 (상용화급)
 * 컨텐츠 타입별 맞춤 디자인 템플릿
 */

"use client";

import { useEffect, useState, useMemo } from "react";
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
  Heart,
  TrendingUp,
  Calendar,
  Users,
  Briefcase,
  Zap,
  RefreshCcw,
} from "lucide-react";
import { getContentConfig, type ContentType } from "@/lib/content-configs";

// 컨텐츠 타입별 결과 인터페이스
interface BaseResult {
  summary: {
    title: string;
    overall: string;
    score?: number;
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
  luckyInfo?: {
    color: string;
    number: string;
    direction: string;
    time: string;
  };
}

// 궁합 결과
interface CompatibilityResult extends BaseResult {
  compatibilityScore: number;
  matchAnalysis: {
    overall: string;
    strengths: string[];
    challenges: string[];
  };
}

// 재회 가능성 결과
interface ReunionResult extends BaseResult {
  reunionScore: number;
  timing: {
    bestPeriod: string;
    reason: string;
  };
  strategy: string[];
}

// 신년운세 결과
interface NewYearResult extends BaseResult {
  yearScore: number;
  monthlyFortune: Array<{
    month: number;
    fortune: string;
    rating: number;
  }>;
  yearKeywords: string[];
}

// 재물운 결과
interface WealthResult extends BaseResult {
  wealthScore: number;
  bestPeriods: string[];
  investmentAdvice: string;
  wealthTips: string[];
}

// 직업운 결과
interface CareerResult extends BaseResult {
  careerScore: number;
  suitableFields: string[];
  talents: string[];
  careerAdvice: string;
}

// 팩트폭탄 결과
interface FactBombResult extends BaseResult {
  factBombs: Array<{
    title: string;
    content: string;
    intensity: number;
  }>;
  personalityTraits: string[];
}

type AnalysisResult = BaseResult | CompatibilityResult | ReunionResult | NewYearResult | WealthResult | CareerResult | FactBombResult;

interface ResultData {
  name: string;
  gender: string;
  calendarType: string;
  year: number;
  month: number;
  day: number;
  birthHour: string;
  category: string;
  contentType?: ContentType;
  productTitle?: string;
  // 파트너 정보
  partnerName?: string;
  partnerGender?: string;
  partnerYear?: number;
  partnerMonth?: number;
  partnerDay?: number;
  // 결과
  result: AnalysisResult | string;
  structured?: boolean;
  timestamp: string;
}

// 컨텐츠 타입별 테마 설정
const CONTENT_THEMES: Record<ContentType, {
  gradient: string;
  bgGradient: string;
  accentColor: string;
  icon: React.ReactNode;
  scoreLabel: string;
}> = {
  "som-compatibility": {
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 via-white to-rose-50",
    accentColor: "pink",
    icon: <Heart className="w-6 h-6" />,
    scoreLabel: "궁합 점수",
  },
  "solo-escape": {
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-50 via-white to-orange-50",
    accentColor: "red",
    icon: <Heart className="w-6 h-6" />,
    scoreLabel: "연애운 점수",
  },
  "reunion-possibility": {
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 via-white to-pink-50",
    accentColor: "purple",
    icon: <RefreshCcw className="w-6 h-6" />,
    scoreLabel: "재회 가능성",
  },
  "marriage-compatibility": {
    gradient: "from-rose-500 to-red-500",
    bgGradient: "from-rose-50 via-white to-red-50",
    accentColor: "rose",
    icon: <Users className="w-6 h-6" />,
    scoreLabel: "결혼 궁합",
  },
  "new-year-fortune": {
    gradient: "from-amber-500 to-yellow-500",
    bgGradient: "from-amber-50 via-white to-yellow-50",
    accentColor: "amber",
    icon: <Calendar className="w-6 h-6" />,
    scoreLabel: "2025년 운세",
  },
  "wealth-fortune": {
    gradient: "from-emerald-500 to-green-500",
    bgGradient: "from-emerald-50 via-white to-green-50",
    accentColor: "emerald",
    icon: <TrendingUp className="w-6 h-6" />,
    scoreLabel: "재물운 점수",
  },
  "career-saju": {
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 via-white to-indigo-50",
    accentColor: "blue",
    icon: <Briefcase className="w-6 h-6" />,
    scoreLabel: "직업운 점수",
  },
  "fact-bomb": {
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 via-white to-red-50",
    accentColor: "orange",
    icon: <Zap className="w-6 h-6" />,
    scoreLabel: "팩트력",
  },
  "monthly-fortune": {
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-50 via-white to-blue-50",
    accentColor: "cyan",
    icon: <Calendar className="w-6 h-6" />,
    scoreLabel: "이번 달 운세",
  },
  "comprehensive": {
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 via-white to-pink-50",
    accentColor: "purple",
    icon: <Sparkles className="w-6 h-6" />,
    scoreLabel: "종합 운세",
  },
  "transfer-love": {
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 via-white to-purple-50",
    accentColor: "violet",
    icon: <Heart className="w-6 h-6" />,
    scoreLabel: "환승연애 점수",
  },
};

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // 컨텐츠 타입과 테마
  const contentType = (resultData?.contentType || resultData?.category || "comprehensive") as ContentType;
  const theme = CONTENT_THEMES[contentType] || CONTENT_THEMES.comprehensive;
  const contentConfig = useMemo(() => getContentConfig(contentType), [contentType]);

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
          title: resultData?.productTitle || "사주 분석 결과",
          text: `${resultData?.name}님의 ${contentConfig?.name || "사주"} 분석 결과를 확인해보세요!`,
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
            type="button"
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
      <div className={`min-h-screen bg-gradient-to-b ${theme.bgGradient}`}>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="mx-auto max-w-[600px] px-4 py-3 flex items-center justify-between">
            <Link href="/">
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="뒤로 가기">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            </Link>
            <h1 className="font-bold text-gray-900">{contentConfig?.name || "분석 결과"}</h1>
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

  const result = resultData.result as AnalysisResult;
  const score = result.summary.score ||
    (result as CompatibilityResult).compatibilityScore ||
    (result as ReunionResult).reunionScore ||
    (result as NewYearResult).yearScore ||
    (result as WealthResult).wealthScore ||
    (result as CareerResult).careerScore ||
    75;

  // 컨텐츠 타입별 특수 섹션 렌더링
  const renderContentSpecificSections = () => {
    switch (contentType) {
      case "som-compatibility":
      case "marriage-compatibility": {
        const compatResult = result as CompatibilityResult;
        if (compatResult.matchAnalysis) {
          return (
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💕</span>
                <h3 className="text-lg font-bold text-gray-900">궁합 분석</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{compatResult.matchAnalysis.overall}</p>

              {compatResult.matchAnalysis.strengths?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-700 mb-2">💚 강점</h4>
                  <div className="flex flex-wrap gap-2">
                    {compatResult.matchAnalysis.strengths.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {compatResult.matchAnalysis.challenges?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-orange-700 mb-2">🔥 주의할 점</h4>
                  <div className="flex flex-wrap gap-2">
                    {compatResult.matchAnalysis.challenges.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        }
        return null;
      }

      case "reunion-possibility": {
        const reunionResult = result as ReunionResult;
        return (
          <>
            {reunionResult.timing && (
              <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⏰</span>
                  <h3 className="text-lg font-bold text-purple-900">최적의 재회 시기</h3>
                </div>
                <div className="bg-white/70 rounded-xl p-4 mb-3">
                  <p className="text-xl font-bold text-purple-700">{reunionResult.timing.bestPeriod}</p>
                </div>
                <p className="text-purple-700 text-sm leading-relaxed">{reunionResult.timing.reason}</p>
              </section>
            )}

            {reunionResult.strategy?.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📋</span>
                  <h3 className="text-lg font-bold text-gray-900">재회 전략</h3>
                </div>
                <ul className="space-y-3">
                  {reunionResult.strategy.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        );
      }

      case "new-year-fortune": {
        const yearResult = result as NewYearResult;
        return (
          <>
            {yearResult.yearKeywords?.length > 0 && (
              <section className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-bold text-amber-900">2025년 키워드</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {yearResult.yearKeywords.map((keyword, i) => (
                    <span key={i} className="px-4 py-2 bg-white/70 text-amber-800 font-medium rounded-full border border-amber-200">
                      #{keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {yearResult.monthlyFortune?.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-lg font-bold text-gray-900">월별 운세</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {yearResult.monthlyFortune.map((m) => (
                    <div key={m.month} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-sm text-gray-500 mb-1">{m.month}월</p>
                      <div className="flex justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= m.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{m.fortune}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        );
      }

      case "wealth-fortune": {
        const wealthResult = result as WealthResult;
        return (
          <>
            {wealthResult.bestPeriods?.length > 0 && (
              <section className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💰</span>
                  <h3 className="text-lg font-bold text-emerald-900">돈 들어오는 시기</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wealthResult.bestPeriods.map((period, i) => (
                    <span key={i} className="px-4 py-2 bg-white/70 text-emerald-800 font-medium rounded-full border border-emerald-200">
                      {period}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {wealthResult.investmentAdvice && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📈</span>
                  <h3 className="text-lg font-bold text-gray-900">투자 조언</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{wealthResult.investmentAdvice}</p>
              </section>
            )}

            {wealthResult.wealthTips?.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💡</span>
                  <h3 className="text-lg font-bold text-gray-900">재물운 팁</h3>
                </div>
                <ul className="space-y-2">
                  {wealthResult.wealthTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        );
      }

      case "career-saju": {
        const careerResult = result as CareerResult;
        return (
          <>
            {careerResult.talents?.length > 0 && (
              <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⭐</span>
                  <h3 className="text-lg font-bold text-blue-900">타고난 재능</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {careerResult.talents.map((talent, i) => (
                    <span key={i} className="px-4 py-2 bg-white/70 text-blue-800 font-medium rounded-full border border-blue-200">
                      {talent}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {careerResult.suitableFields?.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💼</span>
                  <h3 className="text-lg font-bold text-gray-900">적합한 직업 분야</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {careerResult.suitableFields.map((field, i) => (
                    <div key={i} className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-blue-800 font-medium">{field}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {careerResult.careerAdvice && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📝</span>
                  <h3 className="text-lg font-bold text-gray-900">커리어 조언</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{careerResult.careerAdvice}</p>
              </section>
            )}
          </>
        );
      }

      case "fact-bomb": {
        const factResult = result as FactBombResult;
        return (
          <>
            {factResult.factBombs?.length > 0 && (
              <section className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💣</span>
                  <h3 className="text-lg font-bold text-gray-900">팩트폭탄</h3>
                </div>
                {factResult.factBombs.map((bomb, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-5 border ${
                      bomb.intensity >= 4
                        ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
                        : bomb.intensity >= 3
                        ? "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200"
                        : "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{bomb.title}</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <span
                            key={level}
                            className={`text-lg ${level <= bomb.intensity ? "" : "opacity-30"}`}
                          >
                            💥
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{bomb.content}</p>
                  </div>
                ))}
              </section>
            )}

            {factResult.personalityTraits?.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎭</span>
                  <h3 className="text-lg font-bold text-gray-900">성격 키워드</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {factResult.personalityTraits.map((trait, i) => (
                    <span key={i} className="px-4 py-2 bg-orange-50 text-orange-800 font-medium rounded-full border border-orange-200">
                      #{trait}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </>
        );
      }

      default:
        return null;
    }
  };

  // 파트너 정보 표시 여부
  const showPartnerInfo = (contentType === "som-compatibility" ||
    contentType === "marriage-compatibility" ||
    contentType === "reunion-possibility") && resultData.partnerName;

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} transition-opacity duration-700 ${
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
          <h1 className="font-bold text-gray-900">{contentConfig?.name || "분석 결과"}</h1>
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
        {/* Summary Card - 컨텐츠별 테마 적용 */}
        <section
          className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-6 text-white shadow-xl animate-fade-in-up`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              {theme.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold">{result.summary.title}</h2>
              <p className="text-white/80 text-sm">
                {showPartnerInfo
                  ? `${resultData.name} & ${resultData.partnerName}`
                  : `${resultData.year}년 ${resultData.month}월 ${resultData.day}일생`
                }
              </p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 mb-4">
            <span className="text-white/90 font-medium">{theme.scoreLabel}</span>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(score / 20)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{score}</span>
            </div>
          </div>

          {/* Overall */}
          <p className="text-white/90 leading-relaxed text-sm">
            {result.summary.overall}
          </p>
        </section>

        {/* Content-Specific Sections */}
        {renderContentSpecificSections()}

        {/* General Analysis Sections */}
        {result.sections?.map((section, index) => (
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
                    className={`px-3 py-1 bg-${theme.accentColor}-50 text-${theme.accentColor}-700 text-sm rounded-full font-medium`}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Advice Section */}
        {result.advice && (
          <section
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 animate-fade-in-up"
            style={{ animationDelay: `${0.2 + (result.sections?.length || 0) * 0.1}s` }}
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
        )}

        {/* Lucky Info Section */}
        {result.luckyInfo && (
          <section
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up"
            style={{ animationDelay: `${0.3 + (result.sections?.length || 0) * 0.1}s` }}
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
        )}

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
            {showPartnerInfo && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">상대방</span>
                  <span className="font-medium text-gray-900">{resultData.partnerName}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-500">상대방 생년월일</span>
                  <span className="font-medium text-gray-900">
                    {resultData.partnerYear}.{resultData.partnerMonth}.{resultData.partnerDay}
                  </span>
                </div>
              </>
            )}
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
            className={`flex-1 py-3 bg-gradient-to-r ${theme.gradient} text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all`}
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
