/**
 * 사주랭킹 페이지 (상용화급)
 * 공개된 사주 목록을 랭킹으로 표시
 * 로그인 없이 목록 조회 가능, 상세보기는 로그인 필요
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Eye, Heart, TrendingUp, Filter, Search } from "lucide-react";
import {
  MOCK_RANKING_DATA,
  ELEMENT_COLORS,
  CATEGORY_COLORS,
  CATEGORY_FILTERS,
  ELEMENT_FILTERS,
  SORT_OPTIONS,
  type RankingSaju,
} from "@/lib/ranking-data";

export default function RankingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [rankings, setRankings] = useState<RankingSaju[]>(MOCK_RANKING_DATA);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [elementFilter, setElementFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rank");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 필터링 및 정렬 로직
  useEffect(() => {
    let filtered = [...MOCK_RANKING_DATA];

    // 카테고리 필터
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // 오행 필터
    if (elementFilter !== "all") {
      filtered = filtered.filter((item) => item.dominantElement === elementFilter);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.includes(searchQuery) ||
          item.zodiac.includes(searchQuery) ||
          item.category.includes(searchQuery)
      );
    }

    // 정렬
    switch (sortBy) {
      case "rank":
        filtered.sort((a, b) => a.rank - b.rank);
        break;
      case "views":
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "likes":
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "recent":
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setRankings(filtered);
  }, [categoryFilter, elementFilter, sortBy, searchQuery]);

  const handleCardClick = (id: string) => {
    // TODO: 로그인 체크 로직 추가
    // const isLoggedIn = false; // 실제로는 세션 체크
    // if (!isLoggedIn) {
    //   router.push('/login?redirect=/ranking/' + id);
    //   return;
    // }
    router.push(`/ranking/${id}`);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24 transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4 animate-fade-in-down">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">사주랭킹</h1>
          </div>
          <p className="text-center text-purple-100 text-sm md:text-base">
            공개된 사주를 탐색하고 나의 운세와 비교해보세요
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>총 {MOCK_RANKING_DATA.length}개 사주</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>
                {MOCK_RANKING_DATA.reduce((sum, item) => sum + item.viewCount, 0).toLocaleString()}{" "}
                조회
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm animate-fade-in"
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        <div className="max-w-4xl mx-auto p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 띠, 카테고리로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="flex gap-2">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setCategoryFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    categoryFilter === filter.value
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Element Filters */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
            <span className="text-xs text-gray-500 flex-shrink-0">오행:</span>
            <div className="flex gap-2">
              {ELEMENT_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setElementFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    elementFilter === filter.value
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {rankings.length}개의 사주
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ranking List */}
      <div className="max-w-4xl mx-auto p-4 space-y-4 mt-4">
        {rankings.length === 0 ? (
          <div
            className="text-center py-16 animate-fade-in"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        ) : (
          rankings.map((item, index) => (
            <RankingCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => handleCardClick(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * 랭킹 카드 컴포넌트
 */
interface RankingCardProps {
  item: RankingSaju;
  index: number;
  onClick: () => void;
}

function RankingCard({ item, index, onClick }: RankingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const elementInfo = ELEMENT_COLORS[item.dominantElement];
  const categoryGradient = CATEGORY_COLORS[item.category];

  // Top 3 메달 색상
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-amber-500"; // 금메달
      case 2:
        return "from-gray-300 to-gray-400"; // 은메달
      case 3:
        return "from-orange-400 to-amber-600"; // 동메달
      default:
        return "from-purple-500 to-pink-600";
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer animate-fade-in-up group"
      style={{
        animationDelay: `${0.4 + index * 0.05}s`,
        animationFillMode: "both",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* 랭킹 뱃지 */}
          <div className="flex-shrink-0">
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${getMedalColor(
                item.rank
              )} flex items-center justify-center shadow-lg transition-transform ${
                isHovered ? "scale-110" : ""
              }`}
            >
              <span className="text-white font-bold text-xl">
                {item.rank <= 3 ? (
                  item.rank === 1 ? (
                    "🥇"
                  ) : item.rank === 2 ? (
                    "🥈"
                  ) : (
                    "🥉"
                  )
                ) : (
                  item.rank
                )}
              </span>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 이름 & 카테고리 */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {item.name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${categoryGradient}`}
              >
                {item.category}
              </span>
            </div>

            {/* 정보 */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <span className="text-base">{elementInfo.icon}</span>
                <span className="font-medium">{item.dominantElement}</span>
              </span>
              <span>•</span>
              <span>{item.zodiac}</span>
              <span>•</span>
              <span>{item.birthYear}년생</span>
              <span>•</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  item.isBalanced
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {item.isBalanced ? "균형" : "불균형"}
              </span>
            </div>

            {/* 점수 & 통계 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${categoryGradient} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 ml-2">
                  {item.score}점
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">
                    {item.viewCount.toLocaleString()}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">
                    {item.likeCount.toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* 화살표 아이콘 */}
          <div className="flex-shrink-0 self-center">
            <div
              className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all ${
                isHovered
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110"
                  : "text-gray-400"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 호버 시 하단 강조선 */}
      <div
        className={`h-1 bg-gradient-to-r ${categoryGradient} transition-all ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
