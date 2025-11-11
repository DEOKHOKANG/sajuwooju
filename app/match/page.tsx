/**
 * MATCH 페이지 (상용화급 - 완전 리뉴얼)
 * 사주 궁합 매칭 시스템 - Production Grade
 * - 정교한 오행 궁합 알고리즘
 * - 매칭 히스토리 관리
 * - 상세한 궁합 분석
 * - 2분할 화면에서 버튼 제공
 * - 상세보기 전용 페이지
 */

"use client";

import { useState, useEffect } from "react";
import { Heart, BookOpen, Briefcase, Users, Sparkles, X, TrendingUp, Clock, RotateCcw, ArrowLeft, Info } from "lucide-react";
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
      alert("잠시 후 다시 시도해주세요 (10초 쿨다운)");
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
      alert("잠시 후 다시 시도해주세요 (10초 쿨다운)");
      return;
    }
    setMatchedUser(null);
    setCompatibilityDetail(null);
    setShowDetailPage(false);
  };

  const handleBack = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
        {/* Header with Back Button */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-4 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setShowDetailPage(false)}
              className="flex items-center gap-2 mb-4 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>돌아가기</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-center">상세 궁합 분석</h1>
            <p className="text-purple-100 text-sm text-center mt-2">{selectedCategory}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 text-center shadow-lg">
            <div className={`text-6xl font-bold ${getCompatibilityColor(compatibilityDetail.overall)} mb-3`}>
              {compatibilityDetail.overall}%
            </div>
            <p className="text-xl text-gray-700 font-medium mb-4">
              {compatibilityDetail.overall >= 90
                ? "천생연분입니다! 🎉"
                : compatibilityDetail.overall >= 80
                ? "아주 좋은 궁합이에요! ✨"
                : compatibilityDetail.overall >= 70
                ? "좋은 궁합입니다! 💫"
                : "서로 노력하면 좋아질 거예요! 💪"}
            </p>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">나</p>
                <p className="font-bold text-gray-900">{mySaju.name}</p>
                <p className="text-xs text-gray-600">{mySaju.zodiac}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">상대</p>
                <p className="font-bold text-gray-900">{matchedUser.name}</p>
                <p className="text-xs text-gray-600">{matchedUser.zodiac}</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              세부 분석
            </h3>
            <div className="space-y-4">
              {[
                { label: "오행 조화", value: compatibilityDetail.breakdown.elementHarmony, icon: "🔥" },
                { label: "띠 궁합", value: compatibilityDetail.breakdown.zodiacHarmony, icon: "🐉" },
                { label: "성격 궁합", value: compatibilityDetail.breakdown.personalityMatch, icon: "💫" },
                { label: "에너지 균형", value: compatibilityDetail.breakdown.energyBalance, icon: "⚡" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.label}
                    </span>
                    <span className={`text-lg font-bold ${getCompatibilityColor(item.value)}`}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getCompatibilityBgGradient(item.value)} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">매칭 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">이름</span>
                <span className="font-bold text-gray-900">{matchedUser.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">띠</span>
                <span className="font-bold text-gray-900">{matchedUser.zodiac}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">출생년도</span>
                <span className="font-bold text-gray-900">{matchedUser.birthYear}년</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">우세 오행</span>
                <span className={`font-bold px-3 py-1.5 rounded-full text-sm ${ELEMENT_COLORS[matchedUser.dominantElement]}`}>
                  {matchedUser.dominantElement}
                </span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {compatibilityDetail.strengths.length > 0 && (
            <div className="bg-emerald-50 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                강점
              </h3>
              <ul className="space-y-2">
                {compatibilityDetail.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-emerald-800 flex items-start gap-3 leading-relaxed">
                    <span className="text-emerald-600 text-lg">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges */}
          {compatibilityDetail.challenges.length > 0 && (
            <div className="bg-amber-50 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-amber-900 mb-3">⚠️ 주의사항</h3>
              <ul className="space-y-2">
                {compatibilityDetail.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex items-start gap-3 leading-relaxed">
                    <span className="text-amber-600 text-lg">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advice */}
          {compatibilityDetail.advice.length > 0 && (
            <div className="bg-blue-50 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-3">💡 조언</h3>
              <ul className="space-y-2">
                {compatibilityDetail.advice.map((tip, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex items-start gap-3 leading-relaxed">
                    <span className="text-blue-600 text-lg">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lucky Activities */}
          {compatibilityDetail.luckyActivities.length > 0 && (
            <div className="bg-purple-50 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-purple-900 mb-3">🍀 추천 활동</h3>
              <div className="flex flex-wrap gap-2">
                {compatibilityDetail.luckyActivities.map((activity, idx) => (
                  <span key={idx} className="px-4 py-2 bg-purple-200 text-purple-900 text-sm font-medium rounded-full">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 sticky bottom-4">
            <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl">
              팔로우하기
            </button>
            <button
              onClick={() => setShowDetailPage(false)}
              className="w-full py-4 bg-white text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all shadow-md"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <button onClick={handleBack} className="mr-2">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <Heart className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">MATCH</h1>
            </div>
            {!selectedCategory && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                <Clock className="w-4 h-4" />
                <span>히스토리</span>
              </button>
            )}
          </div>
          <p className="text-purple-100 text-sm md:text-base text-center">
            {selectedCategory ? selectedCategory : "나와 궁합이 맞는 사람을 찾아보세요"}
          </p>
        </div>
      </div>

      {/* Match History */}
      {showHistory && matchHistory.length > 0 && !selectedCategory && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">매칭 히스토리</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {matchHistory.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white">
                      ✨
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{match.user.name}</p>
                      <p className="text-xs text-gray-600">{match.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getCompatibilityColor(match.compatibility)}`}>
                      {match.compatibility}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {match.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Selection */}
      {!selectedCategory && (
        <div className="max-w-4xl mx-auto p-4 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            어떤 궁합을 확인하시겠어요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MATCH_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.label)}
                  className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                          {category.label}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300">
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

      {/* Split Screen - 2분할 화면 */}
      {selectedCategory && !isMatching && (
        <div className="fixed inset-0 z-40 flex flex-col bg-gradient-to-b from-purple-50 to-pink-50" style={{ top: '0px' }}>
          {/* Top Half - My Saju */}
          <div className="flex-1 flex items-center justify-center border-b-4 border-purple-600 bg-gradient-to-br from-purple-100 to-pink-100 pt-24">
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{mySaju.name}</h3>
              <p className="text-gray-700">{mySaju.birthYear}년생 · {mySaju.zodiac}</p>
              <div className="mt-4 px-4 py-2 bg-white/80 rounded-full inline-block">
                <span className="text-sm font-bold text-purple-600">{mySaju.dominantElement} 기운</span>
              </div>
            </div>
          </div>

          {/* Bottom Half - Matched User or Question Mark */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 pb-12">
            {matchedUser && compatibilityDetail ? (
              <div className="text-center animate-scale-in w-full max-w-md px-4">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{matchedUser.name}</h3>
                <p className="text-gray-700 mb-4">{matchedUser.birthYear}년생 · {matchedUser.zodiac}</p>
                <div className="px-4 py-2 bg-white/80 rounded-full inline-block mb-6">
                  <span className="text-sm font-bold text-pink-600">{matchedUser.dominantElement} 기운</span>
                </div>

                {/* 궁합 점수 표시 */}
                <div className="bg-white/90 rounded-3xl p-6 shadow-xl mb-6 backdrop-blur">
                  <div className={`text-5xl font-bold ${getCompatibilityColor(compatibilityDetail.overall)} mb-2`}>
                    {compatibilityDetail.overall}%
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {getCompatibilityLabel(compatibilityDetail.overall)}
                  </p>
                </div>

                {/* 버튼들 */}
                <div className="space-y-3 w-full">
                  <button
                    onClick={handleViewDetail}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Info className="w-5 h-5" />
                    상세보기
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleRematch}
                      disabled={!canRematch}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        canRematch
                          ? "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>재매칭</span>
                    </button>
                    <button className="py-3 px-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all shadow-md">
                      팔로우
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center animate-pulse w-full max-w-md px-4">
                <div className="text-8xl mb-6">❓</div>
                <p className="text-xl font-bold text-gray-700 mb-8">매칭을 시작하세요</p>

                {/* MATCH 버튼 */}
                <button
                  onClick={handleMatch}
                  disabled={!canRematch}
                  className={`w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-2xl transition-all shadow-2xl ${
                    canRematch
                      ? "hover:from-purple-600 hover:to-pink-600 hover:scale-105 active:scale-95"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {canRematch ? "✨ MATCH 시작하기" : "잠시 후 다시 시도하세요"}
                </button>

                {!canRematch && lastMatchTime && (
                  <p className="text-sm text-gray-600 mt-3">
                    10초 쿨다운 중...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Matching Animation Overlay */}
      {isMatching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">매칭 중...</h3>
            <p className="text-gray-600 mb-6">음양오행 궁합을 분석하고 있어요</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${matchingProgress}%` }}
              />
            </div>
            <p className="text-sm font-bold text-gray-600">{matchingProgress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
