/**
 * HYPE 페이지 (상용화급 - 스토리 게시판)
 * 사주우주 예측이 적중한 실제 경험담 공유 및 HYPE 투표
 * - 사주/꿈해몽/궁합/이별/재회 카테고리
 * - 예측 vs 실제 결과 스토리
 * - HYPE 투표 및 실시간 랭킹
 * - 인증 시스템 (내 사주/꿈해몽 분석 연동)
 * - 완벽한 모바일 최적화
 */

"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Clock, Heart, MessageCircle, Share2, Eye, Award, X, Calendar, CheckCircle, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

interface VerificationInfo {
  isVerified: boolean; // 인증 여부
  verifiedAt?: Date; // 인증 날짜
  analysisId?: string; // 연동된 사주/꿈해몽 분석 ID
  analysisType?: "사주" | "꿈해몽"; // 분석 타입
  verificationScore?: number; // 인증 점수 (0-100, AI가 원본 분석과 비교)
}

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
  verification: VerificationInfo; // 인증 정보
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

const MAX_DAILY_HYPE = 10; // 하루 최대 HYPE 개수
const MAX_HISTORY = 50; // 최대 히스토리 개수

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
      verification: {
        isVerified: true,
        verifiedAt: new Date('2024-12-01'),
        analysisId: "saju_20241201_001",
        analysisType: "사주",
        verificationScore: 98,
      },
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
      verification: {
        isVerified: true,
        verifiedAt: new Date('2025-02-10'),
        analysisId: "dream_20250210_002",
        analysisType: "꿈해몽",
        verificationScore: 92,
      },
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
      verification: {
        isVerified: true,
        verifiedAt: new Date('2024-01-05'),
        analysisId: "saju_20240105_003",
        analysisType: "사주",
        verificationScore: 100,
      },
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
      verification: {
        isVerified: true,
        verifiedAt: new Date('2024-03-20'),
        analysisId: "saju_20240320_004",
        analysisType: "사주",
        verificationScore: 95,
      },
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
      verification: {
        isVerified: true,
        verifiedAt: new Date('2023-05-10'),
        analysisId: "saju_20230510_005",
        analysisType: "사주",
        verificationScore: 97,
      },
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
      verification: {
        isVerified: true,
        verifiedAt: new Date('2025-02-01'),
        analysisId: "saju_20250201_006",
        analysisType: "사주",
        verificationScore: 90,
      },
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
      accuracyRate: 94,
      verification: {
        isVerified: true,
        verifiedAt: new Date('2024-08-15'),
        analysisId: "dream_20240815_007",
        analysisType: "꿈해몽",
        verificationScore: 96,
      },
    },
  ]);

  // Load HYPE history and daily limit from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('hypeHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHypeHistory(parsedHistory.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      })));
    }

    const savedLimit = localStorage.getItem('dailyHypeLimit');
    if (savedLimit) {
      const parsedLimit = JSON.parse(savedLimit);
      const today = new Date().toISOString().split('T')[0];

      // Reset if it's a new day
      if (parsedLimit.date === today) {
        setDailyLimit(parsedLimit);
      } else {
        const newLimit = {
          date: today,
          hypeCount: 0,
          maxHype: MAX_DAILY_HYPE,
        };
        setDailyLimit(newLimit);
        localStorage.setItem('dailyHypeLimit', JSON.stringify(newLimit));
      }
    }
  }, []);

  const handleHype = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    // Check daily limit
    if (dailyLimit.hypeCount >= dailyLimit.maxHype && !story.isHyped) {
      alert(`오늘의 HYPE 한도(${MAX_DAILY_HYPE}개)를 모두 사용했습니다! 내일 다시 시도해주세요.`);
      return;
    }

    // Toggle HYPE
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        const newIsHyped = !s.isHyped;

        // Update daily limit
        if (newIsHyped) {
          const newLimit = { ...dailyLimit, hypeCount: dailyLimit.hypeCount + 1 };
          setDailyLimit(newLimit);
          localStorage.setItem('dailyHypeLimit', JSON.stringify(newLimit));

          // Add to history
          const newHistory = [
            {
              id: `h_${Date.now()}`,
              storyId: s.id,
              storyTitle: s.title,
              timestamp: new Date(),
            },
            ...hypeHistory
          ].slice(0, MAX_HISTORY);

          setHypeHistory(newHistory);
          localStorage.setItem('hypeHistory', JSON.stringify(newHistory));
        } else {
          const newLimit = { ...dailyLimit, hypeCount: Math.max(0, dailyLimit.hypeCount - 1) };
          setDailyLimit(newLimit);
          localStorage.setItem('dailyHypeLimit', JSON.stringify(newLimit));

          // Remove from history
          const newHistory = hypeHistory.filter(h => h.storyId !== storyId);
          setHypeHistory(newHistory);
          localStorage.setItem('hypeHistory', JSON.stringify(newHistory));
        }

        return {
          ...s,
          isHyped: newIsHyped,
          hypeCount: newIsHyped ? s.hypeCount + 1 : s.hypeCount - 1,
        };
      }
      return s;
    }));
  };

  const handleStoryClick = (story: HypeStory) => {
    // Increment view count
    setStories(prev => prev.map(s =>
      s.id === story.id ? { ...s, viewCount: s.viewCount + 1 } : s
    ));

    setSelectedStory(story);
    setShowStoryDetail(true);
  };

  const categories = ["all", "사주", "꿈해몽", "궁합", "이별", "재회"];
  const filteredStories = selectedCategory === "all"
    ? stories
    : stories.filter(s => s.category === selectedCategory);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      "사주": "🔮",
      "꿈해몽": "💭",
      "궁합": "💑",
      "이별": "💔",
      "재회": "💕",
    };
    return emojis[category as keyof typeof emojis] || "✨";
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  // 인증 배지 렌더링
  const VerificationBadge = ({ verification }: { verification: VerificationInfo }) => {
    if (!verification.isVerified) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          <AlertCircle className="w-3 h-3" />
          <span>미인증</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-md">
        <ShieldCheck className="w-3 h-3" />
        <span>{verification.analysisType} 인증</span>
      </div>
    );
  };

  // Story detail page
  if (showStoryDetail && selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 sm:py-6 px-4 sm:px-6 sticky top-0 z-30 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setShowStoryDetail(false)}
              className="flex items-center gap-2 mb-3 sm:mb-4 text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
              <span className="font-medium">닫기</span>
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">스토리 상세</h1>
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 mt-4 sm:mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6">
            {/* Rank & Title */}
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${
                selectedStory.rank <= 3
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {getMedalEmoji(selectedStory.rank)}
              </div>

              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {selectedStory.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                    {getCategoryEmoji(selectedStory.category)} {selectedStory.category}
                  </span>
                  <VerificationBadge verification={selectedStory.verification} />
                  {selectedStory.accuracyRate && selectedStory.accuracyRate >= 90 && (
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {selectedStory.accuracyRate}%
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedStory.author.name} · {getTimeAgo(selectedStory.timestamp)}
                </p>
              </div>
            </div>

            {/* 인증 정보 상세 */}
            {selectedStory.verification.isVerified && (
              <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-blue-900">인증 완료</h3>
                </div>
                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed mb-2">
                  이 스토리는 사주우주의 <strong>{selectedStory.verification.analysisType}</strong> 분석 결과와 연동되어 인증되었습니다.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-blue-700">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    인증일: {selectedStory.verification.verifiedAt?.toLocaleDateString('ko-KR')}
                  </span>
                  {selectedStory.verification.verificationScore && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      신뢰도: {selectedStory.verification.verificationScore}%
                    </span>
                  )}
                </div>
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
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 mb-5">
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
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => handleHype(selectedStory.id)}
                disabled={dailyLimit.hypeCount >= dailyLimit.maxHype && !selectedStory.isHyped}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
                  selectedStory.isHyped
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                    : dailyLimit.hypeCount >= dailyLimit.maxHype
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200"
                }`}
              >
                <Zap className={`w-5 h-5 ${selectedStory.isHyped ? "fill-white" : ""}`} />
                <span>HYPE {selectedStory.hypeCount.toLocaleString()}</span>
              </button>

              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">댓글</span>
              </button>

              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">공유</span>
              </button>
            </div>
          </div>

          {/* TODO: Comments section */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-5 sm:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">댓글 {selectedStory.commentCount}개</h3>
            <p className="text-sm text-gray-600 text-center py-8">댓글 기능은 곧 추가됩니다!</p>
          </div>
        </div>
      </div>
    );
  }

  // Main story list page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 sm:py-8 px-4 sticky top-0 z-30 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">HYPE</h1>
            </div>

            {/* Spacer for alignment */}
            <div className="min-w-[44px]"></div>
          </div>

          <p className="text-center text-purple-100 text-xs sm:text-sm md:text-base mb-3">
            사주우주 예측이 현실이 된 생생한 경험담
          </p>

          {/* Daily limit indicator */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Zap className="w-4 h-4" />
            <span>오늘의 HYPE: {dailyLimit.hypeCount} / {dailyLimit.maxHype}</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
            >
              {cat === "all" ? "전체" : `${getCategoryEmoji(cat)} ${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Story List */}
      <div className="max-w-4xl mx-auto px-4 space-y-4 pb-8">
        {filteredStories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${
                  story.rank <= 3
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {getMedalEmoji(story.rank)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      {getCategoryEmoji(story.category)} {story.category}
                    </span>
                    <VerificationBadge verification={story.verification} />
                    {story.accuracyRate && story.accuracyRate >= 90 && (
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {story.accuracyRate}%
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                    {story.title}
                  </h3>

                  {/* Reality preview */}
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                    {story.reality}
                  </p>

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

                    {/* HYPE Button */}
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
      <button
        onClick={() => alert('게시글 작성 기능은 곧 추가됩니다! 🎉')}
        className="fixed bottom-24 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-20"
      >
        <span className="text-2xl sm:text-3xl">✏️</span>
      </button>
    </div>
  );
}
