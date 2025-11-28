/**
 * MATCH 페이지 (상용화급 - 모바일 최적화 완료)
 * 사주 궁합 매칭 시스템 - Production Grade
 * - 정교한 오행 궁합 알고리즘
 * - 매칭 히스토리 관리
 * - 상세한 궁합 분석
 * - 완벽한 UX 플로우
 * - 소형/대형 모바일 반응형 최적화
 */

"use client";

import { useState, useEffect } from "react";
import { Heart, BookOpen, Briefcase, Users, Sparkles, X, TrendingUp, Clock, RotateCcw, ArrowLeft, Info, Home } from "lucide-react";
import {
  calculateCompatibility,
  generateRandomUser,
  type Element,
  type MatchType
} from "@/lib/saju-compatibility";

interface MatchedUser {
  id: string;
  name: string;
  birthYear: number;
  zodiac: string;
  dominantElement: Element;
}

interface MatchHistory {
  id: string;
  user: MatchedUser;
  category: MatchType;
  compatibility: number;
  timestamp: Date;
}

interface CompatibilityDetail {
  overall: number;
  breakdown: {
    elementHarmony: number;
    zodiacHarmony: number;
    personalityMatch: number;
    energyBalance: number;
  };
  strengths: string[];
  challenges: string[];
  advice: string[];
  luckyActivities: string[];
}

const MATCH_CATEGORIES: Array<{
  id: string;
  label: MatchType;
  icon: typeof Heart;
  gradient: string;
  description: string;
}> = [
  {
    id: "love",
    label: "연애궁합",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    description: "사랑의 케미를 확인하세요",
  },
  {
    id: "study",
    label: "학업궁합",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
    description: "함께 공부할 파트너를 찾아보세요",
  },
  {
    id: "business",
    label: "사업궁합",
    icon: Briefcase,
    gradient: "from-amber-500 to-orange-500",
    description: "비즈니스 파트너를 매칭하세요",
  },
  {
    id: "marriage",
    label: "결혼궁합",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
    description: "운명의 상대를 만나보세요",
  },
];

const ELEMENT_COLORS: Record<Element, string> = {
  "木": "text-emerald-600 bg-emerald-50",
  "火": "text-red-600 bg-red-50",
  "土": "text-amber-600 bg-amber-50",
  "金": "text-yellow-700 bg-yellow-50",
  "水": "text-blue-600 bg-blue-50",
};

export default function MatchPage() {
  const [selectedCategory, setSelectedCategory] = useState<MatchType | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);
  const [compatibilityDetail, setCompatibilityDetail] = useState<CompatibilityDetail | null>(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [canRematch, setCanRematch] = useState(true);
  const [lastMatchTime, setLastMatchTime] = useState<Date | null>(null);

  // Mock: 내 사주 데이터
  const mySaju = {
    name: "김*호",
    birthYear: 1990,
    zodiac: "말띠",
    dominantElement: "火" as Element,
  };

  // LocalStorage에서 매칭 히스토리 로드
  useEffect(() => {
    const stored = localStorage.getItem("match-history");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMatchHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      })));
    }

    const lastMatch = localStorage.getItem("last-match-time");
    if (lastMatch) {
      const lastTime = new Date(lastMatch);
      setLastMatchTime(lastTime);

      // 10초 쿨다운 체크
      const now = new Date();
      const diff = now.getTime() - lastTime.getTime();
      if (diff < 10000) {
        setCanRematch(false);
        setTimeout(() => setCanRematch(true), 10000 - diff);
      }
    }
  }, []);

  // 매칭 히스토리 저장
  const saveMatchHistory = (match: MatchHistory) => {
    const updated = [match, ...matchHistory].slice(0, 20); // 최대 20개
    setMatchHistory(updated);
    localStorage.setItem("match-history", JSON.stringify(updated));
  };

  const handleCategorySelect = (category: MatchType) => {
    setSelectedCategory(category);
    setMatchedUser(null);
    setCompatibilityDetail(null);
    setShowDetailPage(false);
  };

  const handleMatch = () => {
    if (!canRematch) {
      return;
    }

    if (!selectedCategory) return;

    setIsMatching(true);
    setMatchingProgress(0);

    // 프로그레스 바 애니메이션
    const progressInterval = setInterval(() => {
      setMatchingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    // 매칭 프로세스 (2초 후 결과)
    setTimeout(() => {
      clearInterval(progressInterval);
      setMatchingProgress(100);

      // 무작위 사용자 생성
      const randomProfile = generateRandomUser();
      const matched: MatchedUser = {
        id: "user" + Math.floor(Math.random() * 10000),
        ...randomProfile,
      };

      // 궁합 계산
      const compatibility = calculateCompatibility(mySaju, randomProfile, selectedCategory);

      setMatchedUser(matched);
      setCompatibilityDetail(compatibility);
      setIsMatching(false);
      setMatchingProgress(0);

      // 매칭 히스토리 저장
      const match: MatchHistory = {
        id: matched.id + Date.now(),
        user: matched,
        category: selectedCategory,
        compatibility: compatibility.overall,
        timestamp: new Date(),
      };
      saveMatchHistory(match);

      // 쿨다운 설정
      const now = new Date();
      setLastMatchTime(now);
      setCanRematch(false);
      localStorage.setItem("last-match-time", now.toISOString());
      setTimeout(() => setCanRematch(true), 10000); // 10초 쿨다운
    }, 2000);
  };

  const handleRematch = () => {
    if (!canRematch) {
      return;
    }
    setMatchedUser(null);
    setCompatibilityDetail(null);
    setShowDetailPage(false);
  };

  const handleBackToCategory = () => {
    setSelectedCategory(null);
    setMatchedUser(null);
    setCompatibilityDetail(null);
    setShowDetailPage(false);
  };

  const handleViewDetail = () => {
    setShowDetailPage(true);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-amber-600";
    return "text-gray-600";
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 90) return "천생연분";
    if (score >= 80) return "아주 좋음";
    if (score >= 70) return "좋음";
    if (score >= 60) return "보통";
    return "노력 필요";
  };

  const getCompatibilityBgGradient = (score: number) => {
    if (score >= 90) return "from-emerald-400 to-emerald-600";
    if (score >= 80) return "from-blue-400 to-blue-600";
    if (score >= 70) return "from-amber-400 to-amber-600";
    return "from-gray-400 to-gray-600";
  };

  // 상세보기 페이지
  if (showDetailPage && matchedUser && compatibilityDetail && selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-40 sm:pb-48">
        {/* Header with Back Button - 완전한 모바일 최적화 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 sm:py-6 px-4 sm:px-6 sticky top-0 z-30 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <button
                onClick={() => setShowDetailPage(false)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 min-h-[48px] px-4 rounded-xl shadow-lg font-bold text-sm sm:text-base"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>돌아가기</span>
              </button>

              <button
                onClick={handleBackToCategory}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 min-h-[48px] px-4 rounded-xl shadow-lg font-bold text-sm sm:text-base"
              >
                <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>홈</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">상세 궁합 분석</h1>
            <p className="text-purple-100 text-xs sm:text-sm text-center mt-2">{selectedCategory}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 sm:p-5 space-y-5 sm:space-y-6 mt-4 sm:mt-6">
          {/* Overall Score - 모바일 최적화 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-lg">
            <div className={`text-4xl sm:text-5xl md:text-6xl font-bold ${getCompatibilityColor(compatibilityDetail.overall)} mb-2 sm:mb-3`}>
              {compatibilityDetail.overall}%
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium mb-3 sm:mb-4 px-2">
              {compatibilityDetail.overall >= 90
                ? "천생연분입니다! 🎉"
                : compatibilityDetail.overall >= 80
                ? "아주 좋은 궁합이에요! ✨"
                : compatibilityDetail.overall >= 70
                ? "좋은 궁합입니다! 💫"
                : "서로 노력하면 좋아질 거예요! 💪"}
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">나</p>
                <p className="font-bold text-sm sm:text-base text-gray-900">{mySaju.name}</p>
                <p className="text-xs text-gray-600">{mySaju.zodiac}</p>
              </div>
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">상대</p>
                <p className="font-bold text-sm sm:text-base text-gray-900">{matchedUser.name}</p>
                <p className="text-xs text-gray-600">{matchedUser.zodiac}</p>
              </div>
            </div>
          </div>

          {/* Breakdown - 모바일 최적화 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              세부 분석
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                { label: "오행 조화", value: compatibilityDetail.breakdown.elementHarmony, icon: "🔥" },
                { label: "띠 궁합", value: compatibilityDetail.breakdown.zodiacHarmony, icon: "🐉" },
                { label: "성격 궁합", value: compatibilityDetail.breakdown.personalityMatch, icon: "💫" },
                { label: "에너지 균형", value: compatibilityDetail.breakdown.energyBalance, icon: "⚡" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-lg">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className={`text-base sm:text-lg font-bold ${getCompatibilityColor(item.value)}`}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getCompatibilityBgGradient(item.value)} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Info - 모바일 최적화 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">매칭 정보</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-200">
                <span className="text-xs sm:text-sm text-gray-600">이름</span>
                <span className="font-bold text-sm sm:text-base text-gray-900">{matchedUser.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-200">
                <span className="text-xs sm:text-sm text-gray-600">띠</span>
                <span className="font-bold text-sm sm:text-base text-gray-900">{matchedUser.zodiac}</span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-200">
                <span className="text-xs sm:text-sm text-gray-600">출생년도</span>
                <span className="font-bold text-sm sm:text-base text-gray-900">{matchedUser.birthYear}년</span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3">
                <span className="text-xs sm:text-sm text-gray-600">우세 오행</span>
                <span className={`font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm ${ELEMENT_COLORS[matchedUser.dominantElement]}`}>
                  {matchedUser.dominantElement}
                </span>
              </div>
            </div>
          </div>

          {/* Strengths - 모바일 최적화 */}
          {compatibilityDetail.strengths.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 mb-2 sm:mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                강점
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {compatibilityDetail.strengths.map((strength, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-emerald-800 flex items-start gap-2 sm:gap-3 leading-relaxed">
                    <span className="text-emerald-600 text-base sm:text-lg flex-shrink-0">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges - 모바일 최적화 */}
          {compatibilityDetail.challenges.length > 0 && (
            <div className="bg-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-2 sm:mb-3">⚠️ 주의사항</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {compatibilityDetail.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-amber-800 flex items-start gap-2 sm:gap-3 leading-relaxed">
                    <span className="text-amber-600 text-base sm:text-lg flex-shrink-0">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advice - 모바일 최적화 */}
          {compatibilityDetail.advice.length > 0 && (
            <div className="bg-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-2 sm:mb-3">💡 조언</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {compatibilityDetail.advice.map((tip, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-blue-800 flex items-start gap-2 sm:gap-3 leading-relaxed">
                    <span className="text-blue-600 text-base sm:text-lg flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lucky Activities - 모바일 최적화 */}
          {compatibilityDetail.luckyActivities.length > 0 && (
            <div className="bg-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-2 sm:mb-3">🍀 추천 활동</h3>
              <div className="flex flex-wrap gap-2">
                {compatibilityDetail.luckyActivities.map((activity, idx) => (
                  <span key={idx} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-200 text-purple-900 text-xs sm:text-sm font-medium rounded-full">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - 완전한 모바일 최적화 & 고정 */}
          <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-5 bg-white/98 backdrop-blur-xl border-t-2 border-purple-200 shadow-2xl z-30">
            <div className="max-w-4xl mx-auto space-y-3">
              <button
                onClick={() => {
                  // TODO: 팔로우 기능 구현
                  alert('팔로우 기능은 곧 추가됩니다! 🎉');
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base sm:text-lg rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl active:scale-95 min-h-[56px] flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                팔로우하기
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDetailPage(false)}
                  className="py-3.5 bg-white text-gray-700 font-bold text-sm sm:text-base rounded-xl hover:bg-gray-50 transition-all shadow-lg active:scale-95 border-2 border-gray-300 min-h-[52px] flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  돌아가기
                </button>
                <button
                  onClick={() => {
                    setShowDetailPage(false);
                    handleRematch();
                  }}
                  disabled={!canRematch}
                  className={`py-3.5 font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg active:scale-95 border-2 min-h-[52px] flex items-center justify-center gap-2 ${
                    canRematch
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300 hover:from-purple-200 hover:to-pink-200"
                      : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  <RotateCcw className="w-5 h-5" />
                  재매칭
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24 pt-14">
      {/* Header - 완전한 반응형 최적화 (여백 증가) */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 shadow-lg sticky top-14 z-40">
        <div className="max-w-4xl mx-auto">
          {/* 3-column 레이아웃: 뒤로가기 | 타이틀 | 히스토리 */}
          <div className="grid grid-cols-[64px_1fr_64px] sm:grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            {/* Left: Back Button - 더 큰 크기 */}
            <div className="flex items-center justify-start">
              {selectedCategory ? (
                <button
                  onClick={handleBackToCategory}
                  className="active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
                </button>
              ) : (
                <button
                  onClick={() => window.history.back()}
                  className="active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
                </button>
              )}
            </div>

            {/* Center: Title */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Heart className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">MATCH</h1>
            </div>

            {/* Right: History Button or Spacer */}
            <div className="flex items-center justify-end">
              {!selectedCategory && matchHistory.length > 0 ? (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-3 sm:py-3.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm sm:text-base font-medium active:scale-95 min-h-[56px]"
                >
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">히스토리</span>
                  <span className="sm:hidden">{matchHistory.length}</span>
                </button>
              ) : (
                <div className="min-w-[56px]"></div>
              )}
            </div>
          </div>

          <p className="text-purple-100 text-sm sm:text-base md:text-lg text-center px-2">
            {selectedCategory ? selectedCategory : "나와 궁합이 맞는 사람을 찾아보세요"}
          </p>
        </div>
      </div>

      {/* Match History - 모바일 최적화 */}
      {showHistory && matchHistory.length > 0 && !selectedCategory && (
        <div className="max-w-4xl mx-auto p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">매칭 히스토리 ({matchHistory.length})</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[60vh] overflow-y-auto">
              {matchHistory.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors active:bg-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white flex-shrink-0 text-lg sm:text-xl">
                      ✨
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{match.user.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{match.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className={`text-base sm:text-lg font-bold ${getCompatibilityColor(match.compatibility)}`}>
                      {match.compatibility}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {match.timestamp.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Selection - 모바일 최적화 */}
      {!selectedCategory && (
        <div className="max-w-4xl mx-auto p-3 sm:p-4 mt-4 sm:mt-6 md:mt-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center px-2">
            어떤 궁합을 확인하시겠어요?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {MATCH_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.label)}
                  className="group relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white border-2 border-gray-200 hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up active:scale-100 min-h-[100px] sm:min-h-[120px]"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                >
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-0.5 sm:mb-1">
                          {category.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Split Screen - 2분할 화면 - 모바일 최적화 */}
      {selectedCategory && !isMatching && (
        <div className="fixed inset-0 z-40 flex flex-col bg-gradient-to-b from-purple-50 to-pink-50" style={{ top: '0px' }}>
          {/* Top Half - My Saju - 모바일 최적화 */}
          <div className="flex-1 flex items-center justify-center border-b-2 sm:border-b-4 border-purple-600 bg-gradient-to-br from-purple-100 to-pink-100 pt-16 sm:pt-20 md:pt-24 px-4">
            <div className="text-center animate-fade-in">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🔮</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{mySaju.name}</h3>
              <p className="text-sm sm:text-base text-gray-700">{mySaju.birthYear}년생 · {mySaju.zodiac}</p>
              <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 rounded-full inline-block">
                <span className="text-xs sm:text-sm font-bold text-purple-600">{mySaju.dominantElement} 기운</span>
              </div>
            </div>
          </div>

          {/* Bottom Half - Matched User or Question Mark - 완전한 모바일 최적화 */}
          <div className="flex-1 flex flex-col items-center justify-start bg-gradient-to-br from-pink-100 to-purple-100 pt-6 sm:pt-12 pb-8 sm:pb-16 px-4 overflow-y-auto">
            {matchedUser && compatibilityDetail ? (
              <div className="text-center animate-scale-in w-full max-w-sm sm:max-w-md px-3 sm:px-4">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">✨</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{matchedUser.name}</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">{matchedUser.birthYear}년생 · {matchedUser.zodiac}</p>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 rounded-full inline-block mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-bold text-pink-600">{matchedUser.dominantElement} 기운</span>
                </div>

                {/* 궁합 점수 표시 - 모바일 최적화 */}
                <div className="bg-white/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl mb-4 sm:mb-6 backdrop-blur">
                  <div className={`text-4xl sm:text-5xl font-bold ${getCompatibilityColor(compatibilityDetail.overall)} mb-1 sm:mb-2`}>
                    {compatibilityDetail.overall}%
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {getCompatibilityLabel(compatibilityDetail.overall)}
                  </p>
                </div>

                {/* 버튼들 - 완전한 모바일 최적화 (더 큰 간격과 높이) */}
                <div className="space-y-3 sm:space-y-4 w-full">
                  <button
                    onClick={handleViewDetail}
                    className="w-full py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95 min-h-[56px]"
                  >
                    <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                    상세보기
                  </button>

                  {/* 3개 버튼 - 더 큰 높이와 명확한 간격 */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <button
                      onClick={handleRematch}
                      disabled={!canRematch}
                      className={`py-3 sm:py-4 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm active:scale-95 min-h-[72px] sm:min-h-[80px] ${
                        canRematch
                          ? "bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border-2 border-gray-200"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300"
                      }`}
                    >
                      <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-semibold">재매칭</span>
                    </button>
                    <button
                      onClick={() => {
                        // TODO: 팔로우 기능 구현
                        alert('팔로우 기능은 곧 추가됩니다! 🎉');
                      }}
                      className="py-3 sm:py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl active:scale-95 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm min-h-[72px] sm:min-h-[80px] border-2 border-purple-200 hover:border-purple-300"
                    >
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-semibold">팔로우</span>
                    </button>
                    <button
                      onClick={handleBackToCategory}
                      className="py-3 sm:py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl active:scale-95 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm min-h-[72px] sm:min-h-[80px] border-2 border-gray-200"
                    >
                      <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-semibold">홈</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center w-full max-w-sm sm:max-w-md px-3 sm:px-4">
                <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-pulse">❓</div>
                <p className="text-lg sm:text-xl font-bold text-gray-700 mb-6 sm:mb-8">매칭을 시작하세요</p>

                {/* MATCH 버튼 - 모바일 최적화 */}
                <button
                  onClick={handleMatch}
                  disabled={!canRematch}
                  className={`w-full py-4 sm:py-5 text-white font-bold text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl transition-all shadow-2xl min-h-[56px] sm:min-h-[64px] ${
                    canRematch
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 active:scale-95"
                      : "bg-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {canRematch ? "✨ MATCH 시작하기" : `잠시 후 다시 시도하세요`}
                </button>

                {!canRematch && lastMatchTime && (
                  <div className="mt-3 sm:mt-4">
                    <div className="inline-block px-4 py-2 bg-white/80 rounded-full shadow-sm">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">
                        10초 쿨다운 중... ⏱️
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Matching Animation Overlay - 모바일 최적화 */}
      {isMatching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">매칭 중...</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">음양오행 궁합을 분석하고 있어요</p>

            {/* Progress Bar - 모바일 최적화 */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${matchingProgress}%` }}
              />
            </div>
            <p className="text-sm sm:text-base font-bold text-gray-600">{matchingProgress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
