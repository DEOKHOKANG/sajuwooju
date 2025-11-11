"use client";

import { useState } from "react";
import { Trophy, TrendingUp, Eye, Heart, MessageCircle, Crown, Medal, Award } from "lucide-react";
import { MOCK_RANKINGS, getTopRankings, type RankingEntry } from "@/lib/social-data";
import Link from "next/link";

export function SajuRanking() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

  const categories = ['all', '연애운', '재물운', '직업운'];

  const rankings = selectedCategory === 'all'
    ? getTopRankings(10)
    : MOCK_RANKINGS[selectedCategory] || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-slate-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-slate-300 to-slate-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-violet-400 to-purple-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          사주 랭킹
        </h2>
      </div>

      {/* Info Box */}
      <div className="glass-card p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
        <p className="text-sm text-slate-700">
          🏆 공개된 사주 중 가장 인기있는 사주를 확인하세요!
          <span className="text-xs text-slate-500 block mt-1">
            순위는 조회수, 좋아요, 댓글 수를 종합하여 산정됩니다
          </span>
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                : 'glass-card text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? '🏆 전체' : `${cat}`}
          </button>
        ))}
      </div>

      {/* Rankings List */}
      {rankings.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600">아직 랭킹이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.map((entry) => (
            <div
              key={entry.sajuId}
              className={`glass-card p-4 sm:p-6 hover:shadow-xl transition-all ${
                entry.rank <= 3 ? 'border-2' : ''
              } ${
                entry.rank === 1 ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' :
                entry.rank === 2 ? 'border-slate-400 bg-gradient-to-br from-slate-50 to-slate-100' :
                entry.rank === 3 ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-yellow-50' :
                ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getRankBadgeColor(entry.rank)} flex items-center justify-center shadow-lg`}>
                  {getRankIcon(entry.rank)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                      {entry.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{entry.userName}</p>
                      <p className="text-xs text-slate-500">{entry.date}</p>
                    </div>
                  </div>

                  {/* Saju Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{entry.categoryIcon}</span>
                    <div>
                      <h3 className="font-bold text-slate-800">{entry.sajuTitle}</h3>
                      <p className="text-sm text-slate-600">{entry.category}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-600">
                      <TrendingUp className="w-4 h-4 text-violet-600" />
                      <span className="font-semibold">{entry.score}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Eye className="w-4 h-4" />
                      <span>{entry.viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Heart className="w-4 h-4" />
                      <span>{entry.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{entry.commentCount}</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <Link
                  href={`/share/saju/${entry.sajuId}`}
                  className="flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
                >
                  보기
                </Link>
              </div>

              {/* Top 3 Badge */}
              {entry.rank <= 3 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>
                      {entry.rank === 1 ? '👑 최고 인기 사주!' :
                       entry.rank === 2 ? '🥈 인기 사주 2위' :
                       '🥉 인기 사주 3위'}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="glass-card p-6 text-center bg-gradient-to-br from-violet-100 to-purple-100">
        <p className="font-semibold text-slate-800 mb-2">
          내 사주도 랭킹에 올려보세요!
        </p>
        <p className="text-sm text-slate-600 mb-4">
          사주를 공개 설정하면 다른 사람들이 볼 수 있고 랭킹에도 올라갑니다
        </p>
        <Link
          href="/saju/new"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
        >
          무료 사주 분석 시작하기
        </Link>
      </div>
    </div>
  );
}
