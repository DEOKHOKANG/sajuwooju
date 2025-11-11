/**
 * MATCH 페이지 (상용화급)
 * 사주 궁합 매칭 시스템
 * 연애궁합, 학업궁합, 사업궁합, 결혼궁합
 */

"use client";

import { useState } from "react";
import { Heart, BookOpen, Briefcase, Users, Sparkles, X } from "lucide-react";

type MatchCategory = "연애궁합" | "학업궁합" | "사업궁합" | "결혼궁합";

interface MatchedUser {
  id: string;
  name: string;
  birthYear: number;
  zodiac: string;
  dominantElement: "木" | "火" | "土" | "金" | "水";
  compatibility: number;
}

const MATCH_CATEGORIES: Array<{
  id: string;
  label: MatchCategory;
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

export default function MatchPage() {
  const [selectedCategory, setSelectedCategory] = useState<MatchCategory | null>(null);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Mock: 내 사주 데이터
  const mySaju = {
    name: "김*호",
    birthYear: 1990,
    zodiac: "말띠",
    dominantElement: "火" as const,
  };

  const handleCategorySelect = (category: MatchCategory) => {
    setSelectedCategory(category);
    setShowMatchPopup(true);
    setMatchedUser(null);
    setShowResult(false);
  };

  const handleMatch = () => {
    setIsMatching(true);

    // 애니메이션 효과 후 매칭 결과 생성
    setTimeout(() => {
      const mockMatched: MatchedUser = {
        id: "user" + Math.floor(Math.random() * 1000),
        name: "이*영",
        birthYear: 1992,
        zodiac: "원숭이띠",
        dominantElement: "水",
        compatibility: Math.floor(Math.random() * 30) + 70, // 70-100%
      };

      setMatchedUser(mockMatched);
      setIsMatching(false);
    }, 2000);
  };

  const handleConfirm = () => {
    setShowResult(true);
  };

  const handleClose = () => {
    setShowMatchPopup(false);
    setMatchedUser(null);
    setShowResult(false);
    setIsMatching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">MATCH</h1>
          </div>
          <p className="text-purple-100 text-sm md:text-base">
            나와 궁합이 맞는 사람을 찾아보세요
          </p>
        </div>
      </div>

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
                  {/* Gradient background on hover */}
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

      {/* Match Screen - Split View */}
      {selectedCategory && !showMatchPopup && (
        <div className="fixed inset-0 z-40 flex flex-col bg-gradient-to-b from-purple-50 to-pink-50">
          {/* Top Half - My Saju */}
          <div className="flex-1 flex items-center justify-center border-b-4 border-purple-600 bg-gradient-to-br from-purple-100 to-pink-100">
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
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
            {matchedUser ? (
              <div className="text-center animate-scale-in">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{matchedUser.name}</h3>
                <p className="text-gray-700">{matchedUser.birthYear}년생 · {matchedUser.zodiac}</p>
                <div className="mt-4 px-4 py-2 bg-white/80 rounded-full inline-block">
                  <span className="text-sm font-bold text-pink-600">{matchedUser.dominantElement} 기운</span>
                </div>
              </div>
            ) : (
              <div className="text-center animate-pulse">
                <div className="text-8xl mb-4">❓</div>
                <p className="text-xl font-bold text-gray-700">매칭을 시작하세요</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Match Popup */}
      {showMatchPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {!matchedUser && !isMatching && (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCategory}
                  </h3>
                  <p className="text-gray-600">
                    매칭을 시작하시겠어요?
                  </p>
                </div>

                <button
                  onClick={handleMatch}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  MATCH 시작하기
                </button>
              </>
            )}

            {isMatching && (
              <div className="text-center py-8">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">매칭 중...</h3>
                <p className="text-gray-600">완벽한 궁합을 찾고 있어요</p>
              </div>
            )}

            {matchedUser && !showResult && (
              <>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 animate-bounce">💫</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    매칭 완료!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {matchedUser.name}님과 매칭되었습니다
                  </p>
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                    {matchedUser.compatibility}%
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl animate-pulse"
                >
                  확인하기
                </button>
              </>
            )}

            {showResult && matchedUser && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    궁합 결과
                  </h3>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-4">
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      {matchedUser.compatibility}%
                    </div>
                    <p className="text-gray-700 font-medium">
                      {matchedUser.compatibility >= 90
                        ? "천생연분입니다! 🎉"
                        : matchedUser.compatibility >= 80
                        ? "아주 좋은 궁합이에요! ✨"
                        : "좋은 궁합입니다! 💫"}
                    </p>
                  </div>

                  <div className="text-left space-y-3 mb-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">이름</span>
                      <span className="font-bold text-gray-900">{matchedUser.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">띠</span>
                      <span className="font-bold text-gray-900">{matchedUser.zodiac}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">우세 오행</span>
                      <span className="font-bold text-gray-900">{matchedUser.dominantElement}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all">
                    팔로우하기
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    닫기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
