/**
 * MY (Profile) Page - Production Grade
 *
 * Features:
 * - 5-Tab Structure: 개요, 내 FEED, DM, 활동, 설정
 * - DM System: HYPE ranking notifications via DM
 * - My FEED Tab: Manage user's own posts
 * - Activity Tab: Stats and history
 * - Settings Tab: Account management
 */

"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Settings,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  BarChart3,
  Bell,
  Eye,
  Edit,
  Trash2,
  Globe,
  Users as UsersIcon,
  Lock,
  ShieldCheck,
  ArrowLeft,
  Send,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react";

// ========================================
// Types
// ========================================

interface FeedPost {
  id: string;
  category: string;
  categoryEmoji: string;
  userComment: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  hypeCount: number;
  visibility: "public" | "friends" | "private";
  isEligibleForHype: boolean;
}

interface DMMessage {
  id: string;
  type: "system" | "hype_notification" | "user";
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  data?: {
    postId?: string;
    postTitle?: string;
    hypeCount?: number;
    threshold?: number;
  };
}

interface UserStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalHypes: number;
  totalShares: number;
  followers: number;
  following: number;
}

// ========================================
// Main Component
// ========================================

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "feed" | "dm" | "activity" | "settings">("overview");

  // Data States
  const [myPosts, setMyPosts] = useState<FeedPost[]>([]);
  const [dmMessages, setDMMessages] = useState<DMMessage[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalHypes: 0,
    totalShares: 0,
    followers: 0,
    following: 0,
  });

  // UI States
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [selectedDM, setSelectedDM] = useState<DMMessage | null>(null);
  const [showDMDetail, setShowDMDetail] = useState(false);

  // ========================================
  // Mock Data (Replace with API calls)
  // ========================================

  useEffect(() => {
    // Mock: My Posts
    setMyPosts([
      {
        id: "my_post_1",
        category: "연애운",
        categoryEmoji: "💕",
        userComment: "와 진짜 소개팅에서 좋은 분 만났어요! 사주우주 믿고 적극적으로 나갔더니 연락처도 받고 다음 주에 또 만나기로 했어요 🔥💕 감사합니다!",
        timestamp: new Date("2025-01-20T14:30:00"),
        likes: 234,
        comments: 12,
        shares: 45,
        hypeCount: 52,
        visibility: "friends",
        isEligibleForHype: false,
      },
      {
        id: "my_post_2",
        category: "재물운",
        categoryEmoji: "💰",
        userComment: "분석 받고 망설이던 아파트 투자 결정했는데 2주만에 5천만원 올랐습니다 💰 타이밍이 정말 중요하네요. 감사합니다!",
        timestamp: new Date("2025-01-19T09:15:00"),
        likes: 189,
        comments: 8,
        shares: 32,
        hypeCount: 67,
        visibility: "public",
        isEligibleForHype: true,
      },
    ]);

    // Mock: DM Messages
    setDMMessages([
      {
        id: "dm_1",
        type: "hype_notification",
        senderId: "system",
        senderName: "사주우주",
        senderAvatar: "",
        content: "게시물이 HYPE 랭킹 진입 기준을 달성했습니다!",
        timestamp: new Date("2025-01-21T10:30:00"),
        isRead: false,
        data: {
          postId: "my_post_1",
          postTitle: "와 진짜 소개팅에서 좋은 분 만났어요!...",
          hypeCount: 52,
          threshold: 50,
        },
      },
      {
        id: "dm_2",
        type: "system",
        senderId: "system",
        senderName: "사주우주",
        senderAvatar: "",
        content: "환영합니다! 사주우주 MY 페이지입니다. 여기서 내 게시물, DM, 활동 기록을 확인하세요.",
        timestamp: new Date("2025-01-15T08:00:00"),
        isRead: true,
        data: {},
      },
    ]);

    // Mock: User Stats
    setUserStats({
      totalPosts: 2,
      totalLikes: 423,
      totalComments: 20,
      totalHypes: 119,
      totalShares: 77,
      followers: 45,
      following: 32,
    });
  }, []);

  // ========================================
  // Handlers
  // ========================================

  const handleDeletePost = (postId: string) => {
    if (confirm("게시물을 삭제하시겠습니까?")) {
      setMyPosts((prev) => prev.filter((post) => post.id !== postId));
      alert("게시물이 삭제되었습니다.");
    }
  };

  const handleChangeVisibility = (postId: string, newVisibility: "public" | "friends" | "private") => {
    setMyPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, visibility: newVisibility } : post
      )
    );
    alert(`공개 범위가 변경되었습니다: ${newVisibility === "public" ? "전체공개" : newVisibility === "friends" ? "친구공개" : "비공개"}`);
  };

  const handleMarkDMAsRead = (dmId: string) => {
    setDMMessages((prev) =>
      prev.map((dm) => (dm.id === dmId ? { ...dm, isRead: true } : dm))
    );
  };

  const handleAcceptHypePromotion = (postId: string) => {
    setMyPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, visibility: "public", isEligibleForHype: true }
          : post
      )
    );
    alert("🎉 게시물이 HYPE 랭킹에 등록되었습니다!");
    setShowDMDetail(false);
  };

  const handleRejectHypePromotion = () => {
    alert("HYPE 랭킹 진입을 거부했습니다.");
    setShowDMDetail(false);
  };

  const handleSignOut = async () => {
    if (confirm("로그아웃하시겠습니까?")) {
      await signOut({ callbackUrl: "/" });
    }
  };

  // ========================================
  // Auth Check
  // ========================================

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center pt-14">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const user = session.user;
  const unreadDMCount = dmMessages.filter((dm) => !dm.isRead).length;

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24 pt-14">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 sticky top-14 z-40 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-[64px_1fr_64px] sm:grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            {/* Left: Back Button */}
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
              <User className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">MY</h1>
            </div>

            {/* Right: Settings Button */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => setActiveTab("settings")}
                className="active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
              >
                <Settings className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>

          <p className="text-center text-purple-100 text-sm sm:text-base md:text-lg px-2">
            {user?.name || "사용자"}님의 활동 관리
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-[176px] sm:top-[200px] md:top-[232px] z-20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "overview", label: "개요", icon: "📊" },
              { id: "feed", label: "내 FEED", icon: "📝" },
              { id: "dm", label: "DM", icon: "💬", badge: unreadDMCount },
              { id: "activity", label: "활동", icon: "📈" },
              { id: "settings", label: "설정", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all relative ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* ========================================
            Tab: Overview
        ======================================== */}
        {activeTab === "overview" && (
          <>
            {/* Profile Card */}
            <div className="glass-card p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name || "사용자"}</h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      {(user as any)?.role === "premium" ? "프리미엄 회원" : "일반 회원"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{userStats.followers}</p>
                  <p className="text-xs text-gray-600">팔로워</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600">{userStats.following}</p>
                  <p className="text-xs text-gray-600">팔로잉</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{userStats.totalHypes}</p>
                  <p className="text-xs text-gray-600">HYPE</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{userStats.totalPosts}</p>
                <p className="text-sm text-gray-600 mt-1">게시물</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{userStats.totalLikes}</p>
                <p className="text-sm text-gray-600 mt-1">좋아요</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{userStats.totalComments}</p>
                <p className="text-sm text-gray-600 mt-1">댓글</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{userStats.totalShares}</p>
                <p className="text-sm text-gray-600 mt-1">공유</p>
              </div>
            </div>
          </>
        )}

        {/* ========================================
            Tab: My FEED
        ======================================== */}
        {activeTab === "feed" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">내 게시물 ({myPosts.length})</h2>
              <Link
                href="/feed"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                + 새 게시물
              </Link>
            </div>

            {myPosts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-500 mb-4">아직 작성한 게시물이 없습니다</p>
                <Link
                  href="/feed"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                >
                  첫 게시물 작성하기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myPosts.map((post) => (
                  <div key={post.id} className="glass-card p-5 space-y-4">
                    {/* Post Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{post.categoryEmoji}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{post.category}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.timestamp).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPost(post);
                            setShowPostDetail(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm text-gray-800 leading-relaxed">{post.userComment}</p>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
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
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold text-orange-600">
                          HYPE {post.hypeCount}
                        </span>
                      </div>
                    </div>

                    {/* Visibility Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        post.visibility === "public"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : post.visibility === "friends"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}>
                        {post.visibility === "public" && <><Globe className="w-3 h-3" /> 전체공개</>}
                        {post.visibility === "friends" && <><UsersIcon className="w-3 h-3" /> 친구공개</>}
                        {post.visibility === "private" && <><Lock className="w-3 h-3" /> 비공개</>}
                      </div>

                      {post.isEligibleForHype && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border border-orange-200">
                          <ShieldCheck className="w-3 h-3" />
                          HYPE 랭킹 진입
                        </div>
                      )}
                    </div>

                    {/* Change Visibility */}
                    <div className="flex gap-2">
                      {post.visibility !== "public" && (
                        <button
                          onClick={() => handleChangeVisibility(post.id, "public")}
                          className="flex-1 py-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          전체공개로 변경
                        </button>
                      )}
                      {post.visibility !== "friends" && (
                        <button
                          onClick={() => handleChangeVisibility(post.id, "friends")}
                          className="flex-1 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          친구공개로 변경
                        </button>
                      )}
                      {post.visibility !== "private" && (
                        <button
                          onClick={() => handleChangeVisibility(post.id, "private")}
                          className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          비공개로 변경
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ========================================
            Tab: DM (Messages)
        ======================================== */}
        {activeTab === "dm" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                DM ({dmMessages.length})
                {unreadDMCount > 0 && (
                  <span className="ml-2 text-sm text-red-600">
                    ({unreadDMCount}개 읽지 않음)
                  </span>
                )}
              </h2>
            </div>

            {dmMessages.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-500">받은 메시지가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dmMessages.map((dm) => (
                  <button
                    key={dm.id}
                    onClick={() => {
                      setSelectedDM(dm);
                      setShowDMDetail(true);
                      handleMarkDMAsRead(dm.id);
                    }}
                    className={`w-full glass-card p-4 text-left hover:shadow-lg transition-all ${
                      !dm.isRead ? "border-2 border-purple-400" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {dm.type === "system" || dm.type === "hype_notification" ? "🔔" : dm.senderName?.charAt(0) || "U"}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-gray-900 truncate">{dm.senderName}</p>
                          <div className="flex items-center gap-1">
                            {dm.isRead ? (
                              <CheckCheck className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Check className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(dm.timestamp).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{dm.content}</p>

                        {/* HYPE Notification Badge */}
                        {dm.type === "hype_notification" && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                            <TrendingUp className="w-3 h-3 text-orange-600" />
                            <span className="text-xs font-bold text-orange-600">
                              HYPE 랭킹 진입 가능
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ========================================
            Tab: Activity
        ======================================== */}
        {activeTab === "activity" && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">활동 통계</h2>

            <div className="glass-card p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{userStats.totalPosts}</p>
                  <p className="text-sm text-gray-600">총 게시물</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{userStats.totalLikes}</p>
                  <p className="text-sm text-gray-600">받은 좋아요</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{userStats.totalComments}</p>
                  <p className="text-sm text-gray-600">받은 댓글</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{userStats.totalHypes}</p>
                  <p className="text-sm text-gray-600">받은 HYPE</p>
                </div>
              </div>

              {/* Recent Activity (Mock) */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">최근 활동</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>2시간 전 - 게시물에 좋아요 12개 받음</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>5시간 전 - 새 댓글 3개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>1일 전 - HYPE 5개 받음</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================
            Tab: Settings
        ======================================== */}
        {activeTab === "settings" && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">설정</h2>

            <div className="space-y-3">
              <button className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/60 transition-all">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">계정 정보</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/60 transition-all">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">알림 설정</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/60 transition-all">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">개인정보 보호</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full glass-card p-4 flex items-center justify-between hover:bg-red-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-600">로그아웃</span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ========================================
          DM Detail Modal
      ======================================== */}
      {showDMDetail && selectedDM && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowDMDetail(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* DM Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">{selectedDM.senderName}</h2>
                <button
                  onClick={() => setShowDMDetail(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-white/80">
                {new Date(selectedDM.timestamp).toLocaleString("ko-KR")}
              </p>
            </div>

            {/* DM Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-800 leading-relaxed">{selectedDM.content}</p>

              {/* HYPE Notification Actions */}
              {selectedDM.type === "hype_notification" && selectedDM.data && (
                <>
                  {/* Post Preview */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-sm font-bold text-gray-900 mb-2">게시물 내용</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {selectedDM.data.postTitle}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <p className="text-xs text-orange-600 font-medium mb-1">현재 HYPE</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {selectedDM.data.hypeCount}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-xs text-green-600 font-medium mb-1">진입 기준</p>
                      <p className="text-2xl font-bold text-green-700">
                        {selectedDM.data.threshold}
                      </p>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          HYPE 랭킹에 진입하려면
                        </p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          게시물을 <strong className="text-blue-900">전체공개</strong>로 변경하면 HYPE 랭킹에 자동으로 등록됩니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAcceptHypePromotion(selectedDM.data?.postId || "")}
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
                  <p className="text-xs text-gray-500 text-center">
                    💡 내 FEED 탭에서 언제든지 공개 범위를 변경할 수 있습니다
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
