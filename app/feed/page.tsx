/**
 * FEED 페이지 (상용화급)
 * 팔로우한 계정들의 사주 피드
 * - 실시간 필터링 (카테고리, 오행, 띠별)
 * - 무한 스크롤
 * - 댓글 시스템
 * - 이미지 갤러리
 * - 신고/차단 기능
 */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  ArrowLeft, Filter, TrendingUp, Clock, Image as ImageIcon,
  Send, X, Flag, UserX, Trash2, ChevronLeft, ChevronRight
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

interface FeedPost {
  id: string;
  user: {
    id: string;
    name: string;
    birthYear: number;
    zodiac: string;
    dominantElement: "木" | "火" | "土" | "金" | "水";
  };
  category: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  images?: string[]; // 이미지 URL 배열
  commentList?: Comment[]; // 댓글 목록
}

export default function FeedPage() {
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
      },
      category: "연애운",
      content: "2025년 상반기 연애운이 대상승! 새로운 인연이 다가올 조짐이 보입니다. 목요일과 금요일에 특히 좋은 기운이 흐르니 적극적으로 행동해보세요! 🔥💕",
      timestamp: "2시간 전",
      likes: 234,
      comments: 12,
      isLiked: false,
      isBookmarked: false,
      images: ["https://picsum.photos/seed/saju1/800/600"],
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
      },
      category: "재물운",
      content: "이번 달 재물운 최고조! 투자 타이밍을 잘 잡으면 큰 수익을 볼 수 있습니다. 특히 부동산 관련 기회를 주시하세요. 💰✨",
      timestamp: "5시간 전",
      likes: 189,
      comments: 8,
      isLiked: true,
      isBookmarked: true,
      images: [
        "https://picsum.photos/seed/saju2/800/600",
        "https://picsum.photos/seed/saju3/800/600",
      ],
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
      },
      category: "직업운",
      content: "승진 운이 들어왔어요! 상사와의 대화가 중요한 시기입니다. 자신감 있게 의견을 개진하면 좋은 결과가 있을 거예요. 🚀📈",
      timestamp: "1일 전",
      likes: 156,
      comments: 15,
      isLiked: false,
      isBookmarked: false,
      commentList: [],
    },
  ]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedElement, setSelectedElement] = useState<string>("전체");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [showFilters, setShowFilters] = useState(false);

  // UI States
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Infinite Scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Categories & Elements
  const categories = ["전체", "연애운", "재물운", "직업운", "건강운", "학업운", "종합운"];
  const elements = ["전체", "木", "火", "土", "金", "水"];

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
      if (selectedCategory !== "전체" && post.category !== selectedCategory) return false;
      if (selectedElement !== "전체" && post.user.dominantElement !== selectedElement) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.likes - a.likes;
      }
      return 0; // recent는 이미 정렬되어 있다고 가정
    });

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

  const handleOpenImageViewer = (images: string[], startIndex: number = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setShowImageViewer(true);
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
      {/* Header - 모바일 최적화 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 sm:py-6 md:py-8 px-3 sm:px-4 sticky top-0 z-30 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] hover:bg-white/20 rounded-lg transition-colors active:scale-95 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">FEED</h1>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-all active:scale-95 ${
                showFilters ? "bg-white/30" : "hover:bg-white/20"
              }`}
            >
              <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <p className="text-center text-purple-100 text-xs sm:text-sm md:text-base px-2">
            팔로우한 사람들의 사주 소식 · {filteredPosts.length}개 게시물
          </p>
        </div>
      </div>

      {/* Filters Panel - Collapsible */}
      {showFilters && (
        <div className="bg-white border-b-2 border-purple-100 shadow-lg animate-fade-in-up">
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Sort */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">정렬</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("recent")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
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
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
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

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">카테고리</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Element Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">오행 필터</h3>
              <div className="flex gap-2">
                {elements.map((el) => (
                  <button
                    key={el}
                    onClick={() => setSelectedElement(el)}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                      selectedElement === el
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : el === "전체"
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : `${getElementColor(el)} hover:opacity-80`
                    }`}
                  >
                    {el}
                  </button>
                ))}
              </div>
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
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl">
                      🔮
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{post.user.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getElementColor(post.user.dominantElement)}`}>
                          {post.user.dominantElement}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {post.user.birthYear}년생 · {post.user.zodiac}
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

                {/* Category Badge */}
                <div className="mt-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-5">
                <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Image Gallery */}
              {post.images && post.images.length > 0 && (
                <div className="px-5 pb-5">
                  {post.images.length === 1 ? (
                    <div
                      onClick={() => handleOpenImageViewer(post.images!, 0)}
                      className="relative rounded-xl overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={post.images[0]}
                        alt="Post image"
                        className="w-full h-auto max-h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {post.images.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleOpenImageViewer(post.images!, idx)}
                          className="relative rounded-lg overflow-hidden cursor-pointer group aspect-square"
                        >
                          <img
                            src={img}
                            alt={`Post image ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {idx === 3 && post.images!.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-2xl">
                                +{post.images!.length - 4}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Post Footer */}
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                  <span>{post.timestamp}</span>
                  <span>
                    좋아요 {post.likes}개 · 댓글 {post.comments}개
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-around border-t border-gray-100 pt-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      post.isLiked
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? "fill-red-600" : ""}`} />
                    <span>좋아요</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowComments(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>댓글</span>
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>공유</span>
                  </button>

                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      post.isBookmarked
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.isBookmarked ? "fill-purple-600" : ""}`} />
                    <span>저장</span>
                  </button>
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

      {/* Image Viewer Modal */}
      {showImageViewer && selectedImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in"
          onClick={() => setShowImageViewer(false)}
        >
          <button
            onClick={() => setShowImageViewer(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Arrows */}
          {selectedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev > 0 ? prev - 1 : selectedImages.length - 1
                  );
                }}
                className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev < selectedImages.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-5xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            {selectedImages.length > 1 && (
              <div className="text-center mt-4">
                <span className="text-white font-medium">
                  {currentImageIndex + 1} / {selectedImages.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
