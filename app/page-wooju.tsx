"use client";

import { MobileHeader } from "@/components/layout/mobile-header";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCardWooju } from "@/components/product-card-wooju";
import { Footer } from "@/components/footer";
import { MessageCircle } from "lucide-react";
import { IMAGE_MAP } from "@/lib/image-map";
import { FEATURED_PRODUCTS_WOOJU } from "@/lib/products-data-wooju";
import { PLANETS_DATA } from "@/lib/planets-data";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import dynamic from "next/dynamic";

// 3D Components (SSR disabled)
const SpaceCanvas = dynamic(() => import("@/components/3d/SpaceCanvas").then(mod => mod.SpaceCanvas), { ssr: false });
const Sun = dynamic(() => import("@/components/3d/Sun").then(mod => mod.Sun), { ssr: false });
const Planet = dynamic(() => import("@/components/3d/Planet").then(mod => mod.Planet), { ssr: false });

// Category to Planet mapping
const CATEGORY_PLANETS = [
  { id: 1, name: "이벤트", planet: "태양", icon: "🌟" },
  { id: 2, name: "궁합", planet: "금성", icon: "💫", element: "金" },
  { id: 3, name: "솔로/연애", planet: "화성", icon: "🔥", element: "火" },
  { id: 4, name: "이별/재회", planet: "명왕성", icon: "💔", element: "土" },
  { id: 5, name: "직장/취업", planet: "토성", icon: "💼", element: "土" },
  { id: 6, name: "재물/사업", planet: "목성", icon: "💰", element: "木" },
  { id: 7, name: "건강", planet: "수성", icon: "⚕️", element: "水" },
  { id: 8, name: "월별운세", planet: "해왕성", icon: "🌊", element: "水" },
  { id: 9, name: "종합운", planet: "천왕성", icon: "🌀", element: "水" },
  { id: 10, name: "타로", planet: "지구", icon: "🔮", element: "土" },
  { id: 11, name: "작명", planet: "달", icon: "🌙" },
];

export default function HomeWooju() {
  const categorySection = useScrollAnimation({ threshold: 0.2 });
  const eventSection = useScrollAnimation({ threshold: 0.2 });
  const productsSection = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen bg-space-black">
      <MobileHeader />

      <main className="mx-auto w-full max-w-[600px] px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        {/* Cosmic Hero Section */}
        <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
          {/* Background Stars */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-1 h-1 bg-star-gold rounded-full animate-twinkle" />
            <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-10 left-20 w-1 h-1 bg-cosmic-purple rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-10 w-1 h-1 bg-star-gold rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="relative z-10 text-center space-y-4 sm:space-y-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              우주의 법칙으로 읽는
              <br />
              <span className="bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink bg-clip-text text-transparent animate-glow-pulse">
                나의 운명
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
              태양계 9개 행성과 음양오행이 만나
              <br />
              당신의 사주를 해석합니다
            </p>

            <button className="bg-gradient-to-r from-star-gold to-amber-400 text-space-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-glow hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:scale-105 transition-all duration-300">
              <span className="flex items-center gap-2">
                <span>🪐</span>
                <span>우주로 떠나기</span>
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-star-gold opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* 히어로 슬라이더 */}
        <section className="py-4 sm:py-6 md:py-8">
          <HeroSlider slides={IMAGE_MAP.hero} autoPlayInterval={3000} pauseOnHover={true} />
        </section>

        {/* 카테고리 - Cosmic Theme */}
        <section ref={categorySection.ref as any} className="py-4 sm:py-6 md:py-8">
          <div className={`flex items-center gap-2 mb-4 sm:mb-6 fade-in ${categorySection.isVisible ? 'visible' : ''}`}>
            <span className="text-xl sm:text-2xl">🌌</span>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-white">행성 카테고리</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORY_PLANETS.map((cat, index) => {
              const planetData = PLANETS_DATA.find(p => p.name === cat.planet);
              const bgColor = planetData?.color || '#7B68EE';

              return (
                <Link key={cat.id} href={`/category/${cat.id}`}>
                  <div
                    className={`flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-300 hover:scale-110 group ${categorySection.isVisible ? 'stagger-fast' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={cat.name}
                    style={categorySection.isVisible ? { animationDelay: `${index * 30}ms` } : {}}
                  >
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:shadow-glow transition-all duration-300 relative overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${bgColor}dd, ${bgColor}88)`,
                        boxShadow: `0 0 20px ${bgColor}44`
                      }}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${bgColor}ff, transparent)`,
                          filter: 'blur(8px)'
                        }}
                      />
                      <span className="relative z-10">{cat.icon}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-center text-slate-200 leading-tight font-medium">
                      {cat.name}
                    </span>
                    {cat.element && (
                      <span className="text-[8px] text-slate-400">
                        {cat.element}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Five Elements Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#FF8C00' }} />
              木 (나무)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#DC143C' }} />
              火 (불)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#DAA520' }} />
              土 (흙)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#FFD700' }} />
              金 (쇠)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#4FD0E7' }} />
              水 (물)
            </span>
          </div>
        </section>

        {/* 이벤트 배너 - Cosmic Theme */}
        <section ref={eventSection.ref as any} className={`py-3 sm:py-4 fade-in ${eventSection.isVisible ? 'visible' : ''}`}>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">🌠 사주우주 이벤트</h2>
          <div
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(123, 104, 238, 0.2) 0%, rgba(255, 110, 199, 0.2) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(123, 104, 238, 0.3)'
            }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/0 via-cosmic-purple/10 to-nebula-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-star-gold to-amber-400 flex items-center justify-center text-2xl sm:text-3xl rounded-full flex-shrink-0 shadow-glow">
                ✨
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm sm:text-base">친구 초대하고 3,000원 받기!</div>
                <div className="text-xs sm:text-sm text-slate-300">5만 명에게 기쁨 전달 이벤트</div>
              </div>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-star-gold flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </section>

        {/* 추천 상품 (Featured Products) - Cosmic Theme */}
        <section ref={productsSection.ref as any} className={`py-4 sm:py-6 md:py-8 fade-in ${productsSection.isVisible ? 'visible' : ''}`}>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">⭐</span>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-white">월간 랭킹 BEST</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {FEATURED_PRODUCTS_WOOJU.map((product, index) => (
              <div
                key={product.id}
                className={productsSection.isVisible ? 'stagger-item' : ''}
                style={productsSection.isVisible ? { animationDelay: `${index * 50}ms` } : {}}
              >
                <ProductCardWooju product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner - Cosmic Theme */}
        <section className="py-6 sm:py-8">
          <div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(123, 104, 238, 0.3) 0%, rgba(255, 110, 199, 0.3) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 40px rgba(123, 104, 238, 0.4)'
            }}
          >
            {/* Animated stars */}
            <div className="absolute top-4 left-4 w-1 h-1 bg-star-gold rounded-full animate-twinkle" />
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-8 left-12 w-1 h-1 bg-cosmic-purple rounded-full animate-twinkle" style={{ animationDelay: '0.6s' }} />

            <div className="relative z-10 space-y-4">
              <div className="text-3xl sm:text-4xl mb-2">🌌</div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                우주의 신비를 경험하세요
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                AI 기반 정밀 사주 분석으로 당신의 운명을 탐험하세요
              </p>
              <button className="mt-4 bg-gradient-to-r from-star-gold to-amber-400 text-space-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-glow hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:scale-105 transition-all duration-300">
                지금 시작하기
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chat Button - Cosmic Theme */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cosmic-purple to-nebula-pink text-white rounded-full shadow-lg hover:shadow-glow flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        aria-label="채팅 상담"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </div>
  );
}
