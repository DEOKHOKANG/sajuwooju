/**
 * HYPE 페이지 (상용화급 - 스토리 게시판)
 * 사주우주 예측이 적중한 실제 경험담 공유 및 HYPE 투표
 * - 사주/꿈해몽/궁합/이별/재회 카테고리
 * - 예측 vs 실제 결과 스토리
 * - HYPE 투표 및 실시간 랭킹
 * - 완벽한 모바일 최적화
 */

"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Clock, Heart, MessageCircle, Share2, Eye, Award, X, Calendar, CheckCircle } from "lucide-react";

interface HypeStory {
  id: string;
  rank: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: "사주" | "꿈해몽" | "궁합" | "이별" | "재회";
  title: string;
  prediction: string; // 예측 내용
  reality: string; // 실제 일어난 일
  predictionDate: Date; // 예측 날짜
  realityDate: Date; // 실제 발생 날짜
  hypeCount: number;
  viewCount: number;
  commentCount: number;
  isHyped: boolean;
  timestamp: Date;
  thumbnail?: string;
  accuracyRate?: number; // 적중률 (0-100)
}

interface HypeHistory {
  id: string;
  storyId: string;
  storyTitle: string;
  timestamp: Date;
}

interface DailyLimit {
  date: string;
  hypeCount: number;
  maxHype: number;
}

const CATEGORIES = [
  { id: "all", label: "전체", icon: "🌟", gradient: "from-purple-500 to-pink-500" },
  { id: "사주", label: "사주", icon: "✨", gradient: "from-violet-500 to-purple-500" },
  { id: "꿈해몽", label: "꿈해몽", icon: "💭", gradient: "from-blue-500 to-cyan-500" },
  { id: "궁합", label: "궁합", icon: "💕", gradient: "from-pink-500 to-rose-500" },
  { id: "이별", label: "이별", icon: "💔", gradient: "from-gray-500 to-slate-500" },
  { id: "재회", label: "재회", icon: "💝", gradient: "from-green-500 to-emerald-500" },
];

const MAX_DAILY_HYPE = 10;

export default function HypePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStory, setSelectedStory] = useState<HypeStory | null>(null);
  const [showStoryDetail, setShowStoryDetail] = useState(false);
  const [hypeHistory, setHypeHistory] = useState<HypeHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dailyLimit, setDailyLimit] = useState<DailyLimit>({
    date: new Date().toISOString().split('T')[0],
    hypeCount: 0,
    maxHype: MAX_DAILY_HYPE,
  });

  const [stories, setStories] = useState<HypeStory[]>([
    {
      id: "1",
      rank: 1,
      author: { id: "u1", name: "김*호", avatar: "🔮" },
      category: "사주",
      title: "사주에서 본 승진운이 정확히 맞았어요!",
      prediction: "2025년 3월에 직장에서 큰 기회가 온다고 했는데...",
      reality: "정말로 3월 15일에 팀장 승진 제안을 받았습니다! 연봉도 30% 인상되었어요.",
      predictionDate: new Date('2024-12-01'),
      realityDate: new Date('2025-03-15'),
      hypeCount: 2847,
      viewCount: 12453,
      commentCount: 234,
      isHyped: false,
      timestamp: new Date('2025-03-16'),
      accuracyRate: 98,
    },
    {
      id: "2",
      rank: 2,
      author: { id: "u2", name: "이*영", avatar: "💫" },
      category: "꿈해몽",
      title: "꿈에서 본 용이 로또 당첨을 예고했어요",
      prediction: "꿈에 황금빛 용이 나타나서 숫자 7, 14, 23, 31, 42, 45를 알려줬어요",
      reality: "믿고 샀는데 5등 당첨! 다음엔 1등 노려봅니다 ㅋㅋ",
      predictionDate: new Date('2025-02-10'),
      realityDate: new Date('2025-02-17'),
      hypeCount: 2156,
      viewCount: 9821,
      commentCount: 189,
      isHyped: true,
      timestamp: new Date('2025-02-18'),
      accuracyRate: 85,
    },
    {
      id: "3",
      rank: 3,
      author: { id: "u3", name: "박*수", avatar: "🌙" },
      category: "궁합",
      title: "궁합 분석 후 1년 만에 결혼했습니다",
      prediction: "우리 궁합이 95점! 올해 안에 결혼까지 간다고 했어요",
      reality: "8개월 연애 후 프러포즈 받고 12월에 결혼식 올렸습니다 💒",
      predictionDate: new Date('2024-01-05'),
      realityDate: new Date('2024-12-24'),
      hypeCount: 1923,
      viewCount: 8234,
      commentCount: 156,
      isHyped: false,
      timestamp: new Date('2024-12-25'),
      accuracyRate: 100,
    },
    {
      id: "4",
      rank: 4,
      author: { id: "u4", name: "최*민", avatar: "⭐" },
      category: "이별",
      title: "헤어질 거라던 사주 풀이가 맞았어요...",
      prediction: "올해 6월경 큰 갈등으로 이별할 수 있다고 경고받았는데",
      reality: "정말 6월 중순에 가치관 차이로 헤어졌습니다. 미리 알았으면 준비라도 했을 텐데...",
      predictionDate: new Date('2024-03-20'),
      realityDate: new Date('2024-06-18'),
      hypeCount: 1687,
      viewCount: 7123,
      commentCount: 134,
      isHyped: false,
      timestamp: new Date('2024-06-20'),
      accuracyRate: 92,
    },
    {
      id: "5",
      rank: 5,
      author: { id: "u5", name: "정*아", avatar: "🎀" },
      category: "재회",
      title: "헤어진 지 2년 만에 재회 성공!",
      prediction: "사주에서 2년 후 운명적 재회가 있다고 했는데",
      reality: "우연히 같은 회사에 입사하게 되어 다시 만났고, 지금은 결혼 준비 중입니다 ❤️",
      predictionDate: new Date('2023-05-10'),
      realityDate: new Date('2025-05-20'),
      hypeCount: 1542,
      viewCount: 6789,
      commentCount: 98,
      isHyped: true,
      timestamp: new Date('2025-05-21'),
      accuracyRate: 95,
    },
    {
      id: "6",
      rank: 6,
      author: { id: "u6", name: "강*진", avatar: "🌠" },
      category: "사주",
      title: "재물운 상승 예측이 정확했어요",
      prediction: "4월에 투자 관련 좋은 기회가 온다",
      reality: "친구가 추천한 주식이 2배 올랐습니다!",
      predictionDate: new Date('2025-02-01'),
      realityDate: new Date('2025-04-10'),
      hypeCount: 1234,
      viewCount: 5432,
      commentCount: 76,
      isHyped: false,
      timestamp: new Date('2025-04-11'),
      accuracyRate: 88,
    },
    {
      id: "7",
      rank: 7,
      author: { id: "u7", name: "윤*희", avatar: "✨" },
      category: "꿈해몽",
      title: "임신 꿈이 정말 임신으로 이어졌어요",
      prediction: "꿈에 아기가 나타났고, 3개월 내 임신 가능성",
      reality: "2개월 후 임신 확인! 지금 건강한 아기 키우고 있어요 👶",
      predictionDate: new Date('2024-08-15'),
      realityDate: new Date('2024-10-20'),
      hypeCount: 987,
      viewCount: 4321,
      commentCount: 54,
      isHyped: false,
      timestamp: new Date('2024-10-21'),
      accuracyRate: 100,
    },
  ]);

  // LocalStorage 로드
  useEffect(() => {
    const storedHistory = localStorage.getItem("hype-story-history");
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
      if (parsed.date !== today) {
        const newLimit = { date: today, hypeCount: 0, maxHype: MAX_DAILY_HYPE };
        setDailyLimit(newLimit);
        localStorage.setItem("daily-hype-limit", JSON.stringify(newLimit));
      } else {
        setDailyLimit(parsed);
      }
    }
  }, []);

  // 필터링된 스토리
  const filteredStories = selectedCategory === "all"
    ? stories
    : stories.filter(story => story.category === selectedCategory);

  const handleHype = (storyId: string) => {
    if (dailyLimit.hypeCount >= dailyLimit.maxHype) {
      alert(`오늘의 HYPE 한도(${MAX_DAILY_HYPE}개)를 모두 사용했습니다! 내일 다시 시도해주세요. 🔥`);
      return;
    }

    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const isAdding = !story.isHyped;

    setStories(prev =>
      prev.map(s =>
        s.id === storyId
          ? { ...s, isHyped: !s.isHyped, hypeCount: s.isHyped ? s.hypeCount - 1 : s.hypeCount + 1 }
          : s
      )
    );

    if (isAdding) {
      const newLimit = { ...dailyLimit, hypeCount: dailyLimit.hypeCount + 1 };
      setDailyLimit(newLimit);
      localStorage.setItem("daily-hype-limit", JSON.stringify(newLimit));

      const newHistory: HypeHistory = {
        id: Date.now().toString(),
        storyId: story.id,
        storyTitle: story.title,
        timestamp: new Date(),
      };
      const updated = [newHistory, ...hypeHistory].slice(0, 50);
      setHypeHistory(updated);
      localStorage.setItem("hype-story-history", JSON.stringify(updated));
    }
  };

  const handleStoryClick = (story: HypeStory) => {
    setSelectedStory(story);
    setShowStoryDetail(true);
    // 조회수 증가
    setStories(prev =>
      prev.map(s => s.id === story.id ? { ...s, viewCount: s.viewCount + 1 } : s)
    );
  };

  const getCategoryEmoji = (category: string) => {
    const emoji = CATEGORIES.find(c => c.id === category || c.label === category);
    return emoji?.icon || "🌟";
  };

  const getTimeDiff = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "방금 전";
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    return `${Math.floor(days / 30)}개월 전`;
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}위`;
  };

  // 상세 스토리 페이지
  if (showStoryDetail && selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 sm:py-6 px-4 sm:px-6 sticky top-0 z-30 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowStoryDetail(false)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 min-h-[48px] px-4 rounded-xl shadow-lg font-bold text-sm sm:text-base"
              >
                <X className="w-5 h-5" />
                <span>닫기</span>
              </button>
              <span className="text-sm font-medium">{getCategoryEmoji(selectedStory.category)} {selectedStory.category}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-5 mt-4">
          {/* Story Card */}
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6">
            {/* Rank & Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-lg">
                {getMedalEmoji(selectedStory.rank)}
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedStory.title}</h1>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    {selectedStory.author.avatar} {selectedStory.author.name}
                  </span>
                  <span>•</span>
                  <span>{getTimeDiff(selectedStory.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Accuracy Rate */}
            {selectedStory.accuracyRate && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-green-900">예측 적중률: {selectedStory.accuracyRate}%</span>
              </div>
            )}

            {/* Prediction */}
            <div className="mb-5 p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-purple-900">
                  예측 ({selectedStory.predictionDate.toLocaleDateString('ko-KR')})
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">
                {selectedStory.prediction}
              </p>
            </div>

            {/* Reality */}
            <div className="mb-5 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-900">
                  실제 일어난 일 ({selectedStory.realityDate.toLocaleDateString('ko-KR')})
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                {selectedStory.reality}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedStory.viewCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {selectedStory.commentCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-bold text-gray-900">{selectedStory.hypeCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleHype(selectedStory.id)}
                disabled={dailyLimit.hypeCount >= dailyLimit.maxHype && !selectedStory.isHyped}
                className={`py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg min-h-[52px] flex items-center justify-center gap-2 ${
                  selectedStory.isHyped
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                    : dailyLimit.hypeCount >= dailyLimit.maxHype
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200 border-2 border-amber-200"
                }`}
              >
                <Zap className={`w-5 h-5 ${selectedStory.isHyped ? "fill-white" : ""}`} />
                <span>{selectedStory.isHyped ? "HYPED" : "HYPE"}</span>
              </button>
              <button className="py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50 transition-all shadow-lg min-h-[52px] flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>공유</span>
              </button>
            </div>
          </div>

          {/* Comments Section (TODO) */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-3">댓글 {selectedStory.commentCount}</h3>
            <p className="text-sm text-gray-600 text-center py-8">댓글 기능은 곧 추가됩니다! 💬</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 sm:py-6 md:py-8 px-4 sm:px-6 shadow-2xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">HYPE</h1>
          </div>
          <p className="text-center text-purple-100 text-xs sm:text-sm md:text-base mb-4">
            예측이 현실이 된 생생한 스토리
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredStories.length}개 스토리</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="w-4 h-4" />
              <span>{stories.reduce((sum, s) => sum + s.hypeCount, 0).toLocaleString()} HYPE</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1 bg-white/20 rounded-full">
              <Award className="w-4 h-4" />
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
              <button onClick={() => setShowHistory(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(70vh-64px)] p-4 space-y-2">
              {hypeHistory.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.storyTitle}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.timestamp.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="sticky top-[112px] sm:top-[128px] md:top-[144px] z-20 bg-white/98 backdrop-blur-xl border-b-2 border-gray-200 shadow-md">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-md min-h-[40px] flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg scale-105`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories */}
      <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4 mt-4">
        {filteredStories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                {/* Rank */}
                <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${
                  story.rank <= 3
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {getMedalEmoji(story.rank)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      {getCategoryEmoji(story.category)} {story.category}
                    </span>
                    {story.accuracyRate && story.accuracyRate >= 90 && (
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {story.accuracyRate}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                    {story.reality}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      {story.author.avatar} {story.author.name}
                    </span>
                    <span>•</span>
                    <span>{getTimeDiff(story.timestamp)}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {story.viewCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {story.commentCount}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHype(story.id);
                      }}
                      disabled={dailyLimit.hypeCount >= dailyLimit.maxHype && !story.isHyped}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all min-h-[40px] ${
                        story.isHyped
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : dailyLimit.hypeCount >= dailyLimit.maxHype
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200"
                      }`}
                    >
                      <Zap className={`w-4 h-4 ${story.isHyped ? "fill-white" : ""}`} />
                      <span>{story.hypeCount.toLocaleString()}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Write Button (TODO) */}
      <button className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-20">
        <span className="text-2xl sm:text-3xl">✍️</span>
      </button>
    </div>
  );
}
