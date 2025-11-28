"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, Share2, Lock, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { MOCK_MY_SAJU, MOCK_SHARED_SAJU } from "@/lib/social-data";

/**
 * 사주 공유 링크 페이지
 * 친구가 공유한 사주를 보고, 결제를 유도하는 페이지
 */
export default function SharedSajuPage() {
  const params = useParams();
  const id = params?.id as string;

  // Mock: Find saju by ID
  const allSaju = [...MOCK_MY_SAJU, ...MOCK_SHARED_SAJU];
  const saju = allSaju.find(s => s.id === id);

  const [isLiked, setIsLiked] = useState(saju?.isLiked || false);
  const [likeCount, setLikeCount] = useState(saju?.likeCount || 0);

  if (!saju) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 pt-20 pb-24 flex items-center justify-center px-4">
        <div className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">사주를 찾을 수 없습니다</h1>
          <p className="text-slate-600 mb-6">삭제되었거나 존재하지 않는 사주입니다</p>
          <Link
            href="/main"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="glass-card p-6 sm:p-8 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
              {saju.userName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{saju.userName}</p>
              <p className="text-sm text-slate-500">{saju.date}</p>
            </div>
          </div>

          {/* Category & Title */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-3xl">
              {saju.categoryIcon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{saju.title}</h1>
              <p className="text-lg text-slate-600">{saju.category}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">{saju.viewCount} 조회</span>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">공유</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">사주 분석 결과</h2>

          {/* Preview Content */}
          <div className="space-y-4 text-slate-700">
            <p className="leading-relaxed">
              {saju.userName}님의 {saju.category} 분석 결과입니다.
              이 분석은 음양오행의 원리를 기반으로 한 상세한 운세 해석을 담고 있습니다.
            </p>

            {/* Blurred Content */}
            <div className="relative">
              <div className="space-y-3 blur-sm select-none">
                <p>전체적인 운세는 상승세를 타고 있으며, 특히 인간관계에서 좋은 기운이 감지됩니다...</p>
                <p>이번 달은 새로운 시작을 위한 좋은 시기입니다. 특히 상반기에는...</p>
                <p>주의해야 할 점은 감정의 기복이 클 수 있다는 점입니다...</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white">
                <div className="text-center p-6">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-violet-600" />
                  <p className="font-semibold text-slate-800 mb-2">전체 내용을 보려면 로그인하세요</p>
                  <p className="text-sm text-slate-600">무료로 나만의 사주 분석도 받아보세요!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA: Premium Features */}
        <div className="glass-card p-6 sm:p-8 bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-violet-300">
          <div className="text-center space-y-6">
            <div>
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-violet-600" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                나도 사주 분석 받기
              </h2>
              <p className="text-slate-700">
                AI가 분석하는 정확한 사주 운세를 무료로 경험해보세요
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/80 p-4 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 text-sm">정확한 AI 분석</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 text-sm">친구와 공유</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 text-sm">무제한 분석</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/signin"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold text-lg hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/main"
                className="px-8 py-4 rounded-xl bg-white text-violet-600 font-semibold border-2 border-violet-300 hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
              >
                더 알아보기
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              회원가입 시 첫 3회 무료 분석 제공
            </p>
          </div>
        </div>

        {/* Related Services */}
        <div className="glass-card p-6 sm:p-8">
          <h3 className="font-bold text-slate-800 mb-4">다른 사주 서비스도 확인해보세요</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['💕 연애운', '💰 재물운', '💼 직업운', '🌟 종합분석'].map((service, i) => (
              <Link
                key={i}
                href="/main"
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-center"
              >
                <p className="text-2xl mb-2">{service.split(' ')[0]}</p>
                <p className="text-sm font-medium text-slate-700">{service.split(' ')[1]}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
