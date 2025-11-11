"use client";

import { useState } from "react";
import { Sparkles, Lock, Users, Globe, Share2, Eye, Heart, Copy, Check } from "lucide-react";
import { MOCK_MY_SAJU, type SajuAnalysis, type SajuPrivacyLevel } from "@/lib/social-data";
import Link from "next/link";

export function MySaju() {
  const [analyses, setAnalyses] = useState<SajuAnalysis[]>(MOCK_MY_SAJU);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handlePrivacyChange = (id: string, privacy: SajuPrivacyLevel) => {
    setAnalyses(analyses.map(a =>
      a.id === id ? { ...a, privacy } : a
    ));
  };

  const handleCopyShareLink = (analysis: SajuAnalysis) => {
    const shareUrl = `${window.location.origin}/share/saju/${analysis.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(analysis.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPrivacyIcon = (privacy: SajuPrivacyLevel) => {
    switch (privacy) {
      case 'private': return <Lock className="w-4 h-4" />;
      case 'friends': return <Users className="w-4 h-4" />;
      case 'public': return <Globe className="w-4 h-4" />;
    }
  };

  const getPrivacyLabel = (privacy: SajuPrivacyLevel) => {
    switch (privacy) {
      case 'private': return '나만 보기';
      case 'friends': return '친구 공개';
      case 'public': return '전체 공개';
    }
  };

  const getPrivacyColor = (privacy: SajuPrivacyLevel) => {
    switch (privacy) {
      case 'private': return 'text-slate-600 bg-slate-100';
      case 'friends': return 'text-violet-600 bg-violet-100';
      case 'public': return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-violet-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          내 사주 분석 ({analyses.length})
        </h2>
      </div>

      {/* Analyses List */}
      {analyses.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600">아직 사주 분석 내역이 없습니다</p>
          <Link
            href="/saju/new"
            className="inline-block mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
          >
            첫 사주 분석 시작하기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="glass-card p-4 sm:p-6 space-y-4 hover:shadow-lg transition-all"
            >
              {/* Top Row: Category & Privacy */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-2xl">
                    {analysis.categoryIcon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{analysis.title}</h3>
                    <p className="text-sm text-slate-500">{analysis.category} • {analysis.date}</p>
                  </div>
                </div>

                {/* Privacy Dropdown */}
                <div className="relative group">
                  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${getPrivacyColor(analysis.privacy)} transition-all`}>
                    {getPrivacyIcon(analysis.privacy)}
                    <span>{getPrivacyLabel(analysis.privacy)}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-40 glass-card p-2 space-y-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={() => handlePrivacyChange(analysis.id, 'private')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-slate-700 transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      <span>나만 보기</span>
                    </button>
                    <button
                      onClick={() => handlePrivacyChange(analysis.id, 'friends')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-violet-100 text-sm text-violet-700 transition-all"
                    >
                      <Users className="w-4 h-4" />
                      <span>친구 공개</span>
                    </button>
                    <button
                      onClick={() => handlePrivacyChange(analysis.id, 'public')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 text-sm text-blue-700 transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      <span>전체 공개</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{analysis.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{analysis.likeCount}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/saju/result/${analysis.id}`}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium text-center hover:from-violet-600 hover:to-purple-600 transition-all"
                >
                  자세히 보기
                </Link>
                <button
                  onClick={() => handleCopyShareLink(analysis)}
                  className="px-4 py-2 rounded-xl border border-violet-300 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-all flex items-center gap-2"
                >
                  {copiedId === analysis.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">복사됨</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">공유</span>
                    </>
                  )}
                </button>
              </div>

              {/* Share Link Preview (when friends/public) */}
              {analysis.privacy !== 'private' && (
                <div className="p-3 rounded-lg bg-violet-50 border border-violet-200">
                  <p className="text-xs text-violet-700 font-medium mb-1">
                    {analysis.privacy === 'friends' ? '친구들에게' : '모든 사람에게'} 공유됨
                  </p>
                  <p className="text-xs text-slate-500">
                    이 사주 분석이 {analysis.privacy === 'friends' ? '친구들' : '누구나'}에게 보입니다
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
