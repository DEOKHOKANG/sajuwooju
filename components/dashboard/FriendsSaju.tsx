"use client";

import { useState } from "react";
import { Users, Eye, Heart, Lock, MessageCircle, Share2 } from "lucide-react";
import { MOCK_SHARED_SAJU, type SajuAnalysis } from "@/lib/social-data";
import Link from "next/link";

export function FriendsSaju() {
  const [sharedAnalyses, setSharedAnalyses] = useState<SajuAnalysis[]>(MOCK_SHARED_SAJU);

  const viewableAnalyses = sharedAnalyses.filter(a => a.canView);
  const lockedAnalyses = sharedAnalyses.filter(a => !a.canView);

  const handleLike = (id: string) => {
    setSharedAnalyses(sharedAnalyses.map(a =>
      a.id === id ? { ...a, isLiked: !a.isLiked, likeCount: a.isLiked ? a.likeCount - 1 : a.likeCount + 1 } : a
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-violet-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          친구들의 사주 ({viewableAnalyses.length})
        </h2>
      </div>

      {/* Info Box */}
      <div className="glass-card p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
        <p className="text-sm text-slate-700">
          💡 친구가 <span className="font-semibold text-violet-600">공개</span>로 설정한 사주만 볼 수 있습니다
        </p>
      </div>

      {/* Viewable Analyses */}
      {viewableAnalyses.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600">공개된 친구의 사주가 없습니다</p>
          <p className="text-sm text-slate-500 mt-2">
            친구에게 사주 분석을 공유해달라고 요청해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {viewableAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="glass-card p-4 sm:p-6 space-y-4 hover:shadow-lg transition-all"
            >
              {/* User Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold">
                    {analysis.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{analysis.userName}</p>
                    <p className="text-xs text-slate-500">{analysis.date}</p>
                  </div>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-violet-100 text-violet-600 font-medium">
                  {analysis.privacy === 'friends' ? '친구 공개' : '전체 공개'}
                </div>
              </div>

              {/* Content */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-2xl">
                  {analysis.categoryIcon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{analysis.title}</h3>
                  <p className="text-sm text-slate-500">{analysis.category}</p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{analysis.viewCount}</span>
                  </div>
                  <button
                    onClick={() => handleLike(analysis.id)}
                    className={`flex items-center gap-1 transition-colors ${
                      analysis.isLiked ? 'text-red-500' : 'hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${analysis.isLiked ? 'fill-current' : ''}`} />
                    <span>{analysis.likeCount}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-violet-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">댓글</span>
                  </button>
                </div>

                <Link
                  href={`/share/saju/${analysis.id}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked Analyses */}
      {lockedAnalyses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            비공개 사주 ({lockedAnalyses.length})
          </h3>
          <div className="space-y-3">
            {lockedAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="glass-card p-4 bg-slate-50 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold">
                      {analysis.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{analysis.userName}</p>
                      <p className="text-sm text-slate-500">{analysis.category} • 비공개</p>
                    </div>
                  </div>
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
