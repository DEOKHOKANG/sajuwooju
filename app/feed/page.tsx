/**
 * FEED 페이지 (상용화급)
 * 팔로우한 사람들의 사주/꿈해몽 결과 공유 피드
 * - 사주/꿈해몽 결과 인용 카드 + 개인 코멘트
 * - HYPE와 동일한 카드 형식
 * - 실시간 필터링 (카테고리별)
 * - 무한 스크롤
 * - 댓글 시스템
 * - 신고/차단 기능
 */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  ArrowLeft, Filter, TrendingUp, Clock, Sparkles,
  Send, X, Flag, UserX, Trash2, CheckCircle, ShieldCheck
} from "lucide-react";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userElement: "木" | "火" | "土" | "金" | "水";
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface QuotedContent {
  type: "사주" | "꿈해몽"; // 인용 타입
  category: string; // 카테고리 (연애운, 재물운 등)
  summary: string; // 결과 요약
  analysisDate: Date; // 분석 날짜
  analysisId?: string; // 분석 ID
  isVerified: boolean; // 인증 여부
}

interface FeedPost {
  id: string;
  user: {
    id: string;
    name: string;
    birthYear: number;
    zodiac: string;
    dominantElement: "木" | "火" | "土" | "金" | "水";
    avatar?: string;
  };
  quotedContent: QuotedContent; // 인용된 사주/꿈해몽 내용
  userComment: string; // 사용자의 코멘트
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  hypeCount: number; // HYPE 투표 수 (좋아요와 별도)
  isLiked: boolean;
  isBookmarked: boolean;
  isHyped: boolean; // HYPE 투표 여부
  visibility: "public" | "friends" | "private"; // 공개 범위
  isEligibleForHype: boolean; // HYPE 랭킹 진입 가능 여부
  commentList?: Comment[]; // 댓글 목록
}

interface HypeNotification {
  id: string;
  postId: string;
  postTitle: string; // 게시물 제목 (코멘트 앞부분)
  hypeCount: number;
  threshold: number; // 진입 기준
  timestamp: Date;
  isRead: boolean;
  isActioned: boolean; // 사용자가 선택했는지 여부
  userChoice?: "accept" | "reject"; // 사용자 선택
}

export default function FeedPage() {
  // HYPE Constants
  const HYPE_THRESHOLD = 50; // 50개 이상 HYPE 받으면 랭킹 진입 가능

  // State Management
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: "1",
      user: {
        id: "user1",
        name: "김*호",
        birthYear: 1990,
        zodiac: "말띠",
        dominantElement: "火",
        avatar: "🔮",
      },
      quotedContent: {
        type: "사주",
        category: "연애운",
        summary: "2025년 상반기 연애운 대상승. 새로운 인연을 만날 가능성이 높으며, 목요일과 금요일에 특히 좋은 기운이 흐릅니다.",
        analysisDate: new Date("2025-01-15"),
        analysisId: "saju_20250115_001",
        isVerified: true,
      },
      userComment: "와 진짜 소개팅에서 좋은 분 만났어요! 사주우주 믿고 적극적으로 나갔더니 연락처도 받고 다음 주에 또 만나기로 했어요 🔥💕 감사합니다!",
      timestamp: new Date("2025-01-20T14:30:00"),
      likes: 234,
      comments: 12,
      shares: 45,
      hypeCount: 45,
      isLiked: false,
      isBookmarked: false,
      isHyped: false,
      visibility: "friends",
      isEligibleForHype: false,
      commentList: [
        {
          id: "c1",
          userId: "commenter1",
          userName: "정*민",
          userElement: "水",
          content: "저도 비슷한 운세 받았어요! 기대됩니다 ✨",
          timestamp: "1시간 전",
          likes: 12,
          isLiked: false,
        },
      ],
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "이*영",
        birthYear: 1988,
        zodiac: "용띠",
        dominantElement: "金",
        avatar: "💫",
      },
      quotedContent: {
        type: "사주",
        category: "재물운",
        summary: "이번 달 재물운 최고조. 투자 타이밍이 좋으며 부동산 관련 기회를 주목하세요. 금전적 성과가 기대됩니다.",
        analysisDate: new Date("2024-12-28"),
        analysisId: "saju_20241228_045",
        isVerified: true,
      },
      userComment: "분석 받고 망설이던 아파트 투자 결정했는데 2주만에 5천만원 올랐습니다 💰 타이밍이 정말 중요하네요. 감사합니다!",
      timestamp: new Date("2025-01-19T09:15:00"),
      likes: 189,
      comments: 8,
      shares: 32,
      hypeCount: 67,
      isLiked: true,
      isBookmarked: true,
      isHyped: true,
      visibility: "public",
      isEligibleForHype: true,
      commentList: [],
    },
    {
      id: "3",
      user: {
        id: "user3",
        name: "박*수",
        birthYear: 1992,
        zodiac: "원숭이띠",
        dominantElement: "木",
        avatar: "✨",
      },
      quotedContent: {
        type: "꿈해몽",
        category: "직업운",
        summary: "용이 승천하는 꿈 - 직장에서의 승진이나 중요한 인정을 받을 길몽입니다. 상사와의 대화가 중요한 계기가 됩니다.",
        analysisDate: new Date("2025-01-10"),
        analysisId: "dream_20250110_023",
        isVerified: true,
      },
      userComment: "꿈 꾸고 일주일 뒤에 팀장님이 저 불러서 프로젝트 리더 맡기셨어요 🚀 꿈해몽이 이렇게 정확할 줄이야... 대박입니다!",
      timestamp: new Date("2025-01-18T16:45:00"),
      likes: 156,
      comments: 15,
      shares: 28,
      hypeCount: 52,
      isLiked: false,
      isBookmarked: false,
      isHyped: false,
      visibility: "friends",
      isEligibleForHype: false,
      commentList: [],
    },
  ]);

  // HYPE Notifications State
  const [hypeNotifications, setHypeNotifications] = useState<HypeNotification[]>([]);
  const [showHypeNotificationModal, setShowHypeNotificationModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<HypeNotification | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all"); // 사주/꿈해몽 필터
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [showFilters, setShowFilters] = useState(false);

  // UI States
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Infinite Scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Categories (HYPE와 동일)
  const categories = [
    { id: "all", name: "전체", emoji: "🌟" },
    { id: "사주", name: "사주", emoji: "🔮" },
    { id: "꿈해몽", name: "꿈해몽", emoji: "💭" },
    { id: "궁합", name: "궁합", emoji: "💕" },
  ];

  // Infinite Scroll Effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  // HYPE Threshold Check Effect
  useEffect(() => {
    feedPosts.forEach((post) => {
      // HYPE 임계값 도달 & 친구공개 상태인 경우
      if (
        post.hypeCount >= HYPE_THRESHOLD &&
        post.visibility === "friends" &&
        !post.isEligibleForHype
      ) {
        // 이미 알림이 있는지 확인
        const existingNotification = hypeNotifications.find(
          (notif) => notif.postId === post.id && !notif.isActioned
        );

        if (!existingNotification) {
          // 새 알림 생성
          const newNotification: HypeNotification = {
            id: `notif_${post.id}_${Date.now()}`,
            postId: post.id,
            postTitle: post.userComment.slice(0, 30) + (post.userComment.length > 30 ? "..." : ""),
            hypeCount: post.hypeCount,
            threshold: HYPE_THRESHOLD,
            timestamp: new Date(),
            isRead: false,
            isActioned: false,
          };

          setHypeNotifications((prev) => [...prev, newNotification]);

          // 알림 모달 자동 표시
          setCurrentNotification(newNotification);
          setShowHypeNotificationModal(true);
        }
      }
    });
  }, [feedPosts, HYPE_THRESHOLD]);

  // Load More Posts (무한 스크롤)
  const loadMorePosts = () => {
    setIsLoading(true);
    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoading(false);
      // 예시: 10페이지 이상이면 더 이상 없음
      if (page >= 10) {
        setHasMore(false);
      }
    }, 1000);
  };

  // Filter Posts
  const filteredPosts = feedPosts
    .filter((post) => {
      if (selectedCategory !== "all" && post.quotedContent.type !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.likes - a.likes;
      }
      // recent는 timestamp 기준
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  };

  // Get category badge color
  const getCategoryColor = (type: string) => {
    const colors = {
      사주: "from-purple-500 to-pink-500",
      꿈해몽: "from-blue-500 to-cyan-500",
      궁합: "from-rose-500 to-pink-500",
    };
    return colors[type as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  // Handlers
  const handleLike = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.commentList) {
          return {
            ...post,
            commentList: post.commentList.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                  }
                : comment
            ),
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      userId: "currentUser",
      userName: "나",
      userElement: "木",
      content: newComment,
      timestamp: "방금 전",
      likes: 0,
      isLiked: false,
    };

    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            commentList: [...(post.commentList || []), newCommentObj],
            comments: post.comments + 1,
          };
        }
        return post;
      })
    );

    setNewComment("");
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.commentList) {
          return {
            ...post,
            commentList: post.commentList.filter((c) => c.id !== commentId),
            comments: post.comments - 1,
          };
        }
        return post;
      })
    );
  };

  const handleReportPost = (postId: string) => {
    alert(`게시물 신고: ${postId}\n신고 기능은 곧 추가됩니다.`);
    setShowActionMenu(null);
  };

  const handleBlockUser = (userId: string, userName: string) => {
    if (confirm(`${userName}님을 차단하시겠습니까?`)) {
      alert(`${userName}님을 차단했습니다.\n차단 기능은 곧 추가됩니다.`);
      setShowActionMenu(null);
    }
  };

  // HYPE Vote Handler
  const handleHype = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isHyped: !post.isHyped,
              hypeCount: post.isHyped ? post.hypeCount - 1 : post.hypeCount + 1,
            }
          : post
      )
    );
  };

  // HYPE Notification Response Handlers
  const handleAcceptHypePromotion = () => {
    if (!currentNotification) return;

    // 게시물 공개 범위를 전체공개로 변경
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === currentNotification.postId
          ? { ...post, visibility: "public", isEligibleForHype: true }
          : post
      )
    );

    // 알림 상태 업데이트
    setHypeNotifications((prev) =>
      prev.map((notif) =>
        notif.id === currentNotification.id
          ? { ...notif, isActioned: true, isRead: true, userChoice: "accept" }
          : notif
      )
    );

    // 성공 메시지
    alert("🎉 게시물이 HYPE 랭킹에 등록되었습니다!");

    // 모달 닫기
    setShowHypeNotificationModal(false);
    setCurrentNotification(null);
  };

  const handleRejectHypePromotion = () => {
    if (!currentNotification) return;

    // 알림 상태만 업데이트 (거부)
    setHypeNotifications((prev) =>
      prev.map((notif) =>
        notif.id === currentNotification.id
          ? { ...notif, isActioned: true, isRead: true, userChoice: "reject" }
          : notif
      )
    );

    // 모달 닫기
    setShowHypeNotificationModal(false);
    setCurrentNotification(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
      {/* Header - 완전한 반응형 최적화 (여백 증가) */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 sticky top-0 z-30 shadow-xl">
        <div className="max-w-4xl mx-auto">
          {/* 3-column 레이아웃: 뒤로가기 | 타이틀 | 필터 */}
          <div className="grid grid-cols-[64px_1fr_64px] sm:grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            {/* Left: Back Button - 더 큰 크기 */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => window.history.back()}
                className="active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            </div>

            {/* Center: Title */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Users className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">FEED</h1>
            </div>

            {/* Right: Filter Button - 더 큰 크기 */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center rounded-xl transition-all ${
                  showFilters ? "bg-white/30" : "hover:bg-white/20"
                }`}
              >
                <Filter className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>

          <p className="text-center text-purple-100 text-sm sm:text-base md:text-lg px-2">
            팔로우한 사람들의 사주 소식 · {filteredPosts.length}개 게시물
          </p>
        </div>
      </div>

      {/* Category Filter - Horizontal Scroll (HYPE 스타일) */}
      <div className="bg-white border-b border-gray-200 sticky top-[96px] sm:top-[112px] md:top-[136px] z-20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Toggle */}
      {showFilters && (
        <div className="bg-white border-b-2 border-purple-100 shadow-lg animate-fade-in-up">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("recent")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  sortBy === "recent"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                최신순
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  sortBy === "popular"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                인기순
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed Posts */}
      <div className="max-w-4xl mx-auto p-4 space-y-4 mt-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {feedPosts.length === 0 ? "아직 팔로우한 사람이 없어요" : "필터 결과가 없습니다"}
            </h3>
            <p className="text-gray-600 mb-6">
              {feedPosts.length === 0
                ? "HYPE 페이지에서 마음에 드는 사주를 팔로우해보세요!"
                : "다른 필터 조건을 선택해보세요"}
            </p>
            {feedPosts.length === 0 && (
              <a
                href="/hype"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                HYPE 보러가기
              </a>
            )}
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
            >
              {/* Post Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl">
                      {post.user.avatar || "🔮"}
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900">{post.user.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getElementColor(post.user.dominantElement)}`}>
                          {post.user.dominantElement}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {post.user.birthYear}년생 · {post.user.zodiac} · {formatTimestamp(post.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* More Button with Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === post.id ? null : post.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Action Menu */}
                    {showActionMenu === post.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-40 min-w-[160px] animate-fade-in-up">
                        <button
                          onClick={() => handleReportPost(post.id)}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                          <Flag className="w-4 h-4" />
                          게시물 신고
                        </button>
                        <button
                          onClick={() => handleBlockUser(post.user.id, post.user.name)}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                          <UserX className="w-4 h-4" />
                          사용자 차단
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quoted Content Card - 인용된 사주/꿈해몽 */}
              <div className="px-4 sm:px-5 pt-3 pb-4">
                <div className={`relative rounded-xl p-4 bg-gradient-to-br ${getCategoryColor(post.quotedContent.type)} overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                  </div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {post.quotedContent.type} 분석 결과
                        </span>
                        {post.quotedContent.isVerified && (
                          <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3 text-white" />
                            <span className="text-xs text-white font-medium">인증됨</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-white/80">
                        {post.quotedContent.category}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-sm sm:text-base text-white font-medium leading-relaxed mb-3">
                      {post.quotedContent.summary}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>
                        분석일: {post.quotedContent.analysisDate.toLocaleDateString("ko-KR")}
                      </span>
                      {post.quotedContent.analysisId && (
                        <span className="font-mono">ID: {post.quotedContent.analysisId.slice(-8)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Comment */}
              <div className="px-4 sm:px-5 pb-4">
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                  {post.userComment}
                </p>
              </div>

              {/* Post Footer */}
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      {post.shares}
                    </span>
                  </div>
                  {/* HYPE Count Display */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-orange-600">
                      HYPE {post.hypeCount}
                    </span>
                  </div>
                </div>

                {/* Actions - 5 columns with HYPE button */}
                <div className="grid grid-cols-5 gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg font-semibold transition-all ${
                      post.isLiked
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? "fill-red-600" : ""}`} />
                    <span className="text-xs">좋아요</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowComments(true);
                    }}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs">댓글</span>
                  </button>

                  <button
                    onClick={() => handleHype(post.id)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg font-semibold transition-all ${
                      post.isHyped
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <TrendingUp className={`w-5 h-5 ${post.isHyped ? "fill-orange-600" : ""}`} />
                    <span className="text-xs">HYPE</span>
                  </button>

                  <button className="flex flex-col items-center gap-1 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs">공유</span>
                  </button>

                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg font-semibold transition-all ${
                      post.isBookmarked
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.isBookmarked ? "fill-purple-600" : ""}`} />
                    <span className="text-xs">저장</span>
                  </button>
                </div>

                {/* Visibility Badge */}
                <div className="mt-3 flex items-center justify-end gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    post.visibility === "public"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : post.visibility === "friends"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}>
                    {post.visibility === "public" && "🌍 전체공개"}
                    {post.visibility === "friends" && "👥 친구공개"}
                    {post.visibility === "private" && "🔒 비공개"}
                  </div>
                  {post.isEligibleForHype && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border border-orange-200">
                      <ShieldCheck className="w-3 h-3" />
                      HYPE 랭킹 진입
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}

        {/* Infinite Scroll Loader */}
        {hasMore && (
          <div ref={observerRef} className="flex items-center justify-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-sm text-gray-600 font-medium">더 많은 게시물 불러오는 중...</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">스크롤하여 더 보기</p>
            )}
          </div>
        )}

        {/* End of Feed */}
        {!hasMore && filteredPosts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 font-medium">모든 게시물을 확인했습니다 ✨</p>
          </div>
        )}
      </div>

      {/* HYPE Promotion Notification Modal */}
      {showHypeNotificationModal && currentNotification && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">
                🎉 HYPE 랭킹 진입 가능!
              </h2>
              <p className="text-center text-sm text-white/90">
                회원님의 게시물이 인기 급상승 중입니다
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Post Preview */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-100">
                <p className="text-sm font-bold text-gray-900 mb-2">게시물 내용</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {currentNotification.postTitle}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <p className="text-xs text-orange-600 font-medium mb-1">현재 HYPE</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {currentNotification.hypeCount}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs text-green-600 font-medium mb-1">진입 기준</p>
                  <p className="text-2xl font-bold text-green-700">
                    {currentNotification.threshold}
                  </p>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      HYPE 랭킹에 진입하려면
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      현재 <strong>친구공개</strong>로 설정되어 있습니다.
                      <strong className="text-blue-900"> 전체공개</strong>로 변경하면 HYPE 랭킹에 자동으로 등록됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAcceptHypePromotion}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl active:scale-98"
                >
                  ✅ 전체공개로 변경하고 HYPE 랭킹 진입
                </button>
                <button
                  onClick={handleRejectHypePromotion}
                  className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all active:scale-98"
                >
                  나중에 결정하기
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                💡 알림함에서 언제든지 다시 확인할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showComments && selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in">
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-t-3xl rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                댓글 {selectedPost.commentList?.length || 0}개
              </h3>
              <button
                onClick={() => {
                  setShowComments(false);
                  setSelectedPost(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedPost.commentList && selectedPost.commentList.length > 0 ? (
                selectedPost.commentList.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {/* Comment Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-sm flex-shrink-0">
                      🔮
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">{comment.userName}</span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getElementColor(comment.userElement)}`}>
                          {comment.userElement}
                        </span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{comment.content}</p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleCommentLike(selectedPost.id, comment.id)}
                          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                            comment.isLiked ? "text-red-600" : "text-gray-600 hover:text-red-600"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? "fill-red-600" : ""}`} />
                          <span>{comment.likes > 0 ? comment.likes : "좋아요"}</span>
                        </button>

                        {comment.userId === "currentUser" && (
                          <button
                            onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>삭제</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">첫 댓글을 남겨보세요!</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    newComment.trim()
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
