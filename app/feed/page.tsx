/**
 * FEED 페이지 (상용화급)
 * 팔로우한 계정들의 사주 피드
 */

"use client";

import { useState } from "react";
import { Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";

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
}

export default function FeedPage() {
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
    },
  ]);

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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Users className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">FEED</h1>
          </div>
          <p className="text-center text-purple-100 text-sm md:text-base">
            팔로우한 사람들의 사주 소식
          </p>
        </div>
      </div>

      {/* Feed Posts */}
      <div className="max-w-4xl mx-auto p-4 space-y-4 mt-4">
        {feedPosts.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">아직 팔로우한 사람이 없어요</h3>
            <p className="text-gray-600 mb-6">
              HYPE 페이지에서 마음에 드는 사주를 팔로우해보세요!
            </p>
            <a
              href="/hype"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              HYPE 보러가기
            </a>
          </div>
        ) : (
          feedPosts.map((post, index) => (
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

                  {/* More Button */}
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
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

                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
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
      </div>
    </div>
  );
}
