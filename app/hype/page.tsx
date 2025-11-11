/**
 * HYPE 페이지 (상용화급 - 완전한 모바일 최적화)
 * 사주 컨셉별 랭킹 & HYPE 시스템
 * - 완벽한 모바일 UX/UI
 * - 상세 프로필 페이지
 * - HYPE 히스토리 관리
 * - 실시간 애니메이션
 * - 게임화 요소 (일일 한도, 보상)
 */

"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, User, Heart, Info, X, Clock, Award, ChevronUp, ChevronDown, Sparkles } from "lucide-react";

interface HypeUser {
  id: string;
  rank: number;
  prevRank?: number; // 이전 랭킹 (변동 표시용)
  name: string;
  birthYear: number;
  zodiac: string;
  dominantElement: "木" | "火" | "土" | "金" | "水";
  concept: string;
  hypeCount: number;
  isFollowing: boolean;
  isHyped: boolean;
  bio?: string; // 자기소개
  achievements?: string[]; // 업적
}

interface HypeHistory {
  id: string;
  userId: string;
  userName: string;
  concept: string;
  timestamp: Date;
}

interface DailyLimit {
  date: string;
  hypeCount: number;
  maxHype: number;
}

const CONCEPTS = [
  { id: "all", label: "전체", gradient: "from-purple-500 to-pink-500" },
  { id: "lucky", label: "대박운", gradient: "from-amber-500 to-orange-500" },
  { id: "love", label: "연애운", gradient: "from-pink-500 to-rose-500" },
  { id: "wealth", label: "재물운", gradient: "from-green-500 to-emerald-500" },
  { id: "career", label: "직업운", gradient: "from-blue-500 to-cyan-500" },
  { id: "health", label: "건강운", gradient: "from-teal-500 to-green-500" },
];

const MAX_DAILY_HYPE = 10; // 일일 HYPE 한도

export default function HypePage() {
  const [selectedConcept, setSelectedConcept] = useState("all");
  const [selectedUser, setSelectedUser] = useState<HypeUser | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [hypeHistory, setHypeHistory] = useState<HypeHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dailyLimit, setDailyLimit] = useState<DailyLimit>({
    date: new Date().toISOString().split('T')[0],
    hypeCount: 0,
    maxHype: MAX_DAILY_HYPE,
  });
  const [rankings, setRankings] = useState<HypeUser[]>([
    {
      id: "1",
      rank: 1,
      prevRank: 2,
      name: "김*호",
      birthYear: 1990,
      zodiac: "말띠",
      dominantElement: "火",
      concept: "대박운",
      hypeCount: 15234,
      isFollowing: false,
      isHyped: false,
      bio: "2025년 최고의 대박운! 사업 성공률 95%",
      achievements: ["🏆 1위 달성", "🔥 연속 30일 1위", "⚡ HYPE 1만 돌파"],
    },
    {
      id: "2",
      rank: 2,
      prevRank: 1,
      name: "이*영",
      birthYear: 1988,
      zodiac: "용띠",
      dominantElement: "金",
      concept: "재물운",
      hypeCount: 13892,
      isFollowing: false,
      isHyped: false,
      bio: "금 기운이 최고조! 투자 성공률 90%",
      achievements: ["💰 재물운 마스터", "⭐ TOP 3 연속 60일"],
    },
    {
      id: "3",
      rank: 3,
      prevRank: 3,
      name: "박*수",
      birthYear: 1992,
      zodiac: "원숭이띠",
      dominantElement: "木",
      concept: "직업운",
      hypeCount: 12456,
      isFollowing: true,
      isHyped: true,
      bio: "승진운 대폭발! 커리어 상승세",
      achievements: ["📈 직업운 TOP", "🎯 HYPE 1만 달성"],
    },
    {
      id: "4",
      rank: 4,
      prevRank: 5,
      name: "최*민",
      birthYear: 1995,
      zodiac: "돼지띠",
      dominantElement: "水",
      concept: "연애운",
      hypeCount: 11234,
      isFollowing: false,
      isHyped: false,
      bio: "연애운 상승! 새로운 인연의 시작",
      achievements: ["💕 연애운 스타", "🌟 신규 진입"],
    },
    {
      id: "5",
      rank: 5,
      prevRank: 4,
      name: "정*아",
      birthYear: 1991,
      zodiac: "양띠",
      dominantElement: "土",
      concept: "건강운",
      hypeCount: 10567,
      isFollowing: false,
      isHyped: false,
      bio: "건강 에너지 충만! 활력 넘치는 한 해",
      achievements: ["🍀 건강운 TOP 5"],
    },
    {
      id: "6",
      rank: 6,
      prevRank: 7,
      name: "강*진",
      birthYear: 1993,
      zodiac: "닭띠",
      dominantElement: "金",
      concept: "대박운",
      hypeCount: 9876,
      isFollowing: false,
      isHyped: false,
      bio: "금전운 급상승 중",
      achievements: [],
    },
    {
      id: "7",
      rank: 7,
      prevRank: 6,
      name: "윤*희",
      birthYear: 1989,
      zodiac: "뱀띠",
      dominantElement: "火",
      concept: "연애운",
      hypeCount: 8765,
      isFollowing: false,
      isHyped: false,
      bio: "열정적인 사랑의 기운",
    },
    {
      id: "8",
      rank: 8,
      prevRank: 8,
      name: "조*우",
      birthYear: 1994,
      zodiac: "개띠",
      dominantElement: "土",
      concept: "직업운",
      hypeCount: 7654,
      isFollowing: false,
      isHyped: false,
      bio: "안정적인 커리어 발전",
    },
  ]);

  // LocalStorage 로드
  useEffect(() => {
    const storedHistory = localStorage.getItem("hype-history");
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      setHypeHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      })));
    }

    const storedLimit = localStorage.getItem("daily-hype-limit");
    if (storedLimit) {
      const parsed = JSON.parse(storedLimit);
      const today = new Date().toISOString().split('T')[0];

      // 날짜가 바뀌었으면 리셋
      if (parsed.date !== today) {
        const newLimit = {
          date: today,
          hypeCount: 0,
          maxHype: MAX_DAILY_HYPE,
        };
        setDailyLimit(newLimit);
        localStorage.setItem("daily-hype-limit", JSON.stringify(newLimit));
      } else {
        setDailyLimit(parsed);
      }
    }
  }, []);

  // 필터링된 랭킹
  const filteredRankings = selectedConcept === "all"
    ? rankings
    : rankings.filter(user => {
        const conceptMap: Record<string, string[]> = {
          "lucky": ["대박운"],
          "love": ["연애운"],
          "wealth": ["재물운"],
          "career": ["직업운"],
          "health": ["건강운"],
        };
        return conceptMap[selectedConcept]?.includes(user.concept);
      });

  const handleHype = (userId: string) => {
    // 일일 한도 체크
    if (dailyLimit.hypeCount >= dailyLimit.maxHype) {
      alert(`오늘의 HYPE 한도(${MAX_DAILY_HYPE}개)를 모두 사용했습니다! 내일 다시 시도해주세요. 🔥`);
      return;
    }

    const user = rankings.find(u => u.id === userId);
    if (!user) return;

    // HYPE 토글
    const isAdding = !user.isHyped;

    setRankings((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isHyped: !u.isHyped,
              hypeCount: u.isHyped ? u.hypeCount - 1 : u.hypeCount + 1,
            }
          : u
      )
    );

    // 일일 한도 업데이트 (HYPE 추가 시에만)
    if (isAdding) {
      const newLimit = {
        ...dailyLimit,
        hypeCount: dailyLimit.hypeCount + 1,
      };
      setDailyLimit(newLimit);
      localStorage.setItem("daily-hype-limit", JSON.stringify(newLimit));

      // 히스토리 저장
      const newHistory: HypeHistory = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        concept: user.concept,
        timestamp: new Date(),
      };
      const updated = [newHistory, ...hypeHistory].slice(0, 50); // 최대 50개
      setHypeHistory(updated);
      localStorage.setItem("hype-history", JSON.stringify(updated));
    }
  };

  const handleFollow = (userId: string) => {
    setRankings((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const handleUserClick = (user: HypeUser) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getRankChange = (user: HypeUser) => {
    if (!user.prevRank) return null;
    const change = user.prevRank - user.rank;
    if (change > 0) return { type: "up", value: change };
    if (change < 0) return { type: "down", value: Math.abs(change) };
    return { type: "same", value: 0 };
  };

  const getElementColor = (element: string) => {
    const colors = {
      木: "text-emerald-600 bg-emerald-50",
      火: "text-red-600 bg-red-50",
      土: "text-amber-600 bg-amber-50",
      金: "text-yellow-700 bg-yellow-50",
      水: "text-blue-600 bg-blue-50",
    };
    return colors[element as keyof typeof colors] || "text-gray-600 bg-gray-50";
  };

  // 사용자 상세 페이지
  if (showUserDetail && selectedUser) {
    const rankChange = getRankChange(selectedUser);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-40">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 sm:py-6 px-4 sm:px-6 sticky top-0 z-30 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowUserDetail(false)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 min-h-[48px] px-4 rounded-xl shadow-lg font-bold text-sm sm:text-base"
              >
                <X className="w-5 h-5" />
                <span>닫기</span>
              </button>
              <span className="text-sm font-medium">프로필</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-5 mt-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              {/* Rank Badge */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 ${
                selectedUser.rank <= 3
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {getMedalEmoji(selectedUser.rank)}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                  {rankChange && rankChange.type !== "same" && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      rankChange.type === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {rankChange.type === "up" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {rankChange.value}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getElementColor(selectedUser.dominantElement)}`}>
                    {selectedUser.dominantElement}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    {selectedUser.concept}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{selectedUser.birthYear}년생 · {selectedUser.zodiac}</p>
              </div>
            </div>

            {/* Bio */}
            {selectedUser.bio && (
              <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-800 leading-relaxed">{selectedUser.bio}</p>
              </div>
            )}

            {/* HYPE Count */}
            <div className="flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl mb-6">
              <Zap className="w-8 h-8 text-amber-500" />
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{selectedUser.hypeCount.toLocaleString()}</p>
                <p className="text-xs text-gray-600 font-medium">HYPE</p>
              </div>
            </div>

            {/* Achievements */}
            {selectedUser.achievements && selectedUser.achievements.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">업적</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.achievements.map((achievement, idx) => (
                    <span key={idx} className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 text-sm font-medium rounded-lg">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => handleHype(selectedUser.id)}
                disabled={dailyLimit.hypeCount >= dailyLimit.maxHype && !selectedUser.isHyped}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-lg min-h-[56px] flex items-center justify-center gap-2 ${
                  selectedUser.isHyped
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                    : dailyLimit.hypeCount >= dailyLimit.maxHype
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200"
                }`}
              >
                <Zap className={`w-5 h-5 ${selectedUser.isHyped ? "fill-white" : ""}`} />
                <span>{selectedUser.isHyped ? "HYPED" : "HYPE 보내기"}</span>
              </button>

              <button
                onClick={() => handleFollow(selectedUser.id)}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-lg min-h-[56px] flex items-center justify-center gap-2 ${
                  selectedUser.isFollowing
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    : "bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50"
                }`}
              >
                {selectedUser.isFollowing ? (
                  <>
                    <Heart className="w-5 h-5 fill-white" />
                    <span>팔로잉</span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span>팔로우</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
      {/* Header - 완전한 모바일 최적화 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 sm:py-6 md:py-8 px-4 sm:px-6 shadow-2xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">HYPE</h1>
          </div>
          <p className="text-center text-purple-100 text-xs sm:text-sm md:text-base mb-4">
            사주 랭킹에 HYPE를 보내보세요
          </p>

          {/* Stats & Daily Limit */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredRankings.length}명</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="w-4 h-4" />
              <span>{rankings.reduce((sum, u) => sum + u.hypeCount, 0).toLocaleString()} HYPE</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1 bg-white/20 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">{dailyLimit.hypeCount}/{dailyLimit.maxHype}</span>
            </div>
            {hypeHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors active:scale-95 min-h-[32px]"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden xs:inline">히스토리</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* HYPE History Modal */}
      {showHistory && hypeHistory.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">HYPE 히스토리</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(70vh-64px)] p-4 space-y-2">
              {hypeHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{item.userName}</p>
                    <p className="text-xs text-gray-600">{item.concept}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.timestamp.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Concept Filter - 완전한 모바일 최적화 */}
      <div className="sticky top-[112px] sm:top-[128px] md:top-[144px] z-20 bg-white/98 backdrop-blur-xl border-b-2 border-gray-200 shadow-md">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CONCEPTS.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-md min-h-[40px] ${
                  selectedConcept === concept.id
                    ? `bg-gradient-to-r ${concept.gradient} text-white shadow-lg scale-105`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                }`}
              >
                {concept.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings - 완전한 모바일 최적화 */}
      <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4 mt-4">
        {filteredRankings.map((user, index) => {
          const rankChange = getRankChange(user);

          return (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Rank Badge - 모바일 최적화 */}
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl ${
                      user.rank <= 3
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {getMedalEmoji(user.rank)}
                    </div>
                    {rankChange && rankChange.type !== "same" && (
                      <div className={`mt-1 flex items-center justify-center gap-0.5 text-xs font-bold ${
                        rankChange.type === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {rankChange.type === "up" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        <span>{rankChange.value}</span>
                      </div>
                    )}
                  </div>

                  {/* User Info - 모바일 최적화 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => handleUserClick(user)}
                        className="text-lg sm:text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors flex items-center gap-1"
                      >
                        {user.name}
                        <Info className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getElementColor(user.dominantElement)}`}>
                        {user.dominantElement}
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {user.concept}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                      <span>{user.birthYear}년생</span>
                      <span>•</span>
                      <span>{user.zodiac}</span>
                    </div>

                    {/* HYPE Count - 애니메이션 */}
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        {user.hypeCount.toLocaleString()} HYPE
                      </span>
                    </div>

                    {/* Actions - 완전한 모바일 최적화 */}
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleHype(user.id)}
                        disabled={dailyLimit.hypeCount >= dailyLimit.maxHype && !user.isHyped}
                        className={`flex-1 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 min-h-[48px] sm:min-h-[52px] flex items-center justify-center gap-1.5 ${
                          user.isHyped
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl"
                            : dailyLimit.hypeCount >= dailyLimit.maxHype
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200 border-2 border-amber-200"
                        }`}
                      >
                        <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${user.isHyped ? "fill-white" : ""}`} />
                        <span>{user.isHyped ? "HYPED" : "HYPE"}</span>
                      </button>

                      <button
                        onClick={() => handleFollow(user.id)}
                        className={`flex-1 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 min-h-[48px] sm:min-h-[52px] flex items-center justify-center gap-1.5 ${
                          user.isFollowing
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                            : "bg-white text-purple-600 hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-300"
                        }`}
                      >
                        {user.isFollowing ? (
                          <>
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                            <span>팔로잉</span>
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>팔로우</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Line */}
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
