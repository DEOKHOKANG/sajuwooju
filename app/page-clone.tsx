"use client";

import { MobileHeader } from "@/components/layout/mobile-header";
import { Menu, MessageCircle } from "lucide-react";

/**
 * 사주우주 메인 페이지 - 원본 사이트 Pixel-Perfect 복제
 *
 * 측정 기준:
 * - Body Width: 600px (모바일 중심)
 * - 제목: OnGlyph Saehayan, 20px, 600 weight, #414254
 * - 카드: 330x330px
 * - 색상: 정확한 RGB 값 사용
 */

// 카테고리 데이터
const categories = [
  { icon: "🎫", label: "이벤트", href: "/events" },
  { icon: "💖", label: "궁합", href: "/compatibility" },
  { icon: "🤡", label: "솔로/연애운", href: "/solo" },
  { icon: "💝", label: "이별/재회", href: "/breakup" },
  { icon: "💗", label: "달콤운", href: "/sweet" },
  { icon: "🔔", label: "업신/사대운", href: "/career" },
  { icon: "🍀", label: "신년운세", href: "/newyear" },
  { icon: "📅", label: "월별운세", href: "/monthly" },
  { icon: "💼", label: "취업/직장운", href: "/job" },
  { icon: "🎨", label: "관성/타운", href: "/town" },
];

export default function PageClone() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <MobileHeader />

      {/* 메인 컨텐츠 - 600px 고정 (모바일 중심) */}
      <main className="mx-auto max-w-[600px] px-4 pb-20">

        {/* 히어로 슬라이더 섹션 */}
        <section className="py-8">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {/* 카드 1: 하반기 운세 */}
            <div className="flex-shrink-0 snap-center">
              <div className="relative w-[280px] h-[287px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                  <div className="text-sm mb-2">2025년 하반기</div>
                  <div className="text-xl font-bold mb-4">재물운과 분서운</div>
                  <div className="w-full h-32 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <div className="text-4xl">📊</div>
                  </div>
                  <div className="text-xs">타입 만들기 ⓘ 트릭박스</div>
                </div>
              </div>
            </div>

            {/* 카드 2: 썸사주 */}
            <div className="flex-shrink-0 snap-center">
              <div className="relative w-[280px] h-[287px] rounded-2xl overflow-hidden bg-gradient-to-br from-pink-200 to-pink-400">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="text-xl font-bold text-secondary mb-2">
                    그 사람도 날 좋아할까?
                  </div>
                  <div className="text-2xl font-bold text-secondary mb-4">
                    썸 사주 궁합
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="w-24 h-32 bg-white rounded-xl overflow-hidden">
                      <div className="text-xs p-2">당신님<br/>0월 0일 0시생</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-4xl">❤️</div>
                    </div>
                    <div className="w-24 h-32 bg-white rounded-xl overflow-hidden">
                      <div className="text-xs p-2">상대님<br/>0월 0일 0시생</div>
                    </div>
                  </div>
                  <div className="text-sm">썸타 / 즘 궁합 님께!!</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="py-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🥞</span>
            <h2 className="font-display text-xl font-semibold text-primary">
              카테고리
            </h2>
          </div>

          {/* 아이콘 그리드 2행 5열 */}
          <div className="grid grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <a
                key={idx}
                href={cat.href}
                className="flex flex-col items-center gap-2 p-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl">
                  {cat.icon}
                </div>
                <span className="text-xs text-center text-primary leading-tight">
                  {cat.label}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* 이벤트 배너 */}
        <section className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-xl font-semibold text-primary">
              사주우주 이벤트
            </h2>
          </div>

          <a
            href="/event"
            className="block rounded-2xl bg-muted-100 p-4 hover:bg-muted-200 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl flex-shrink-0">
                😗
              </div>
              <div className="flex-1">
                <div className="font-bold text-primary mb-1">
                  친구 초대하고 3,000원 받기!
                </div>
                <div className="text-sm text-slate-500">
                  5만 명에게 기쁨 전달 이벤트
                </div>
              </div>
              <svg
                className="w-5 h-5 text-slate-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </a>
        </section>

        {/* 월간 랭킹 BEST */}
        <section className="py-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🍷</span>
            <h2 className="font-display text-xl font-semibold text-primary">
              월간 랭킹 BEST
            </h2>
          </div>

          <div className="bg-muted-100 rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-xs text-center p-2">
                  솔로탈출 사주 😊
                </div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-primary mb-1">
                  내 속마음 얼마나 알까?
                </div>
                <div className="text-sm text-primary mb-2">
                  솔로탈출 사주 😊
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-500">⭐ 4.9</span>
                  <span className="text-slate-400">👁️ 조회수 5만+</span>
                </div>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                  54% 할인중
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 채팅 버튼 - 우하단 고정 */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-secondary shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
        aria-label="채팅 상담"
      >
        <MessageCircle className="w-7 h-7" fill="white" />
      </button>
    </div>
  );
}
