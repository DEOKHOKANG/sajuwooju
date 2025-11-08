'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MobileAppLayout } from '@/components/layout/MobileAppLayout';
import {
  Sparkles,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';

/**
 * Pre-Login Main Page
 * 비로그인 메인 페이지 - 사주우주 서비스 소개 및 CTA
 *
 * Features:
 * - World-class design with gradient system
 * - Mobile-first responsive layout
 * - Premium glassmorphism effects
 * - Clear value propositions
 * - Strong CTAs for user signup
 */

// 사주 서비스 카테고리 (음양오행 기반)
const SAJU_SERVICES = [
  {
    id: 'love',
    title: '연애운',
    description: 'AI가 분석하는 당신의 사랑 운명',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    element: '火',
  },
  {
    id: 'wealth',
    title: '재물운',
    description: '금전운과 재물의 흐름을 파악하세요',
    icon: TrendingUp,
    gradient: 'from-amber-500 to-orange-600',
    element: '金',
  },
  {
    id: 'career',
    title: '직업운',
    description: '당신에게 맞는 진로와 적성 분석',
    icon: Zap,
    gradient: 'from-violet-500 to-purple-600',
    element: '木',
  },
  {
    id: 'compatibility',
    title: '궁합',
    description: '두 사람의 사주 궁합을 확인하세요',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-600',
    element: '水',
  },
  {
    id: 'yearly',
    title: '연운',
    description: '올해의 운세와 흐름 파악',
    icon: Calendar,
    gradient: 'from-emerald-500 to-teal-600',
    element: '土',
  },
  {
    id: 'premium',
    title: '종합 분석',
    description: '모든 영역의 심층 사주 분석',
    icon: Star,
    gradient: 'from-indigo-500 to-purple-600',
    element: '五行',
  },
];

// 주요 기능 소개
const FEATURES = [
  {
    title: 'AI 기반 사주 분석',
    description: '최신 AI 기술로 정확하고 깊이 있는 사주 해석을 제공합니다',
    icon: Sparkles,
  },
  {
    title: '실시간 운세',
    description: '매일 업데이트되는 오늘의 운세를 확인하세요',
    icon: Zap,
  },
  {
    title: '무제한 분석',
    description: '원하는 만큼 사주를 분석하고 저장할 수 있습니다',
    icon: Star,
  },
];

// 사용자 후기 (Mock)
const TESTIMONIALS = [
  {
    name: '김지은',
    rating: 5,
    comment: '정말 정확한 분석에 놀랐어요! AI가 이렇게 깊이 있게 봐줄 줄 몰랐습니다.',
  },
  {
    name: '박민수',
    rating: 5,
    comment: '다른 사주 앱들과는 차원이 다릅니다. 디자인도 너무 예쁘고 사용하기 편해요.',
  },
  {
    name: '이서연',
    rating: 5,
    comment: '궁합 분석이 정말 도움됐어요. 연애할 때 참고하면 좋을 것 같아요!',
  },
];

export default function MainPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MobileHeader />

      <main className="mx-auto w-full max-w-[600px] px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">

        {/* Premium Hero Section */}
        <section
          ref={heroSection.ref as any}
          className={`relative py-12 sm:py-16 md:py-20 overflow-hidden fade-in ${heroSection.isVisible ? 'visible' : ''}`}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Floating orbs */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-star-gold/20 to-transparent rounded-full blur-2xl animate-float" />
            <div className="absolute top-40 right-10 w-40 h-40 bg-gradient-to-br from-cosmic-purple/20 to-transparent rounded-full blur-2xl animate-float-delayed" />
            <div className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-br from-nebula-pink/20 to-transparent rounded-full blur-2xl animate-float-slow" />

            {/* Twinkling stars */}
            <Star className="absolute top-16 right-24 w-4 h-4 text-star-gold animate-twinkle" style={{ animationDelay: '0s' }} />
            <Star className="absolute top-32 left-16 w-3 h-3 text-cosmic-purple animate-twinkle" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-24 right-16 w-5 h-5 text-nebula-pink animate-twinkle" style={{ animationDelay: '1s' }} />
            <Moon className="absolute top-1/2 left-8 w-4 h-4 text-slate-400 animate-twinkle" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="relative z-10 text-center space-y-6 sm:space-y-8">
            {/* Main Heading with enhanced typography */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-star-gold/10 via-cosmic-purple/10 to-nebula-pink/10 rounded-full border border-star-gold/20 backdrop-blur-sm mb-4">
                <Sparkles className="w-4 h-4 text-star-gold" />
                <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink bg-clip-text text-transparent">
                  AI 기반 정밀 사주 분석
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                우주의 법칙으로 읽는
                <br />
                <span className="bg-gradient-to-r from-star-gold via-cosmic-purple to-nebula-pink bg-clip-text text-transparent animate-glow-pulse inline-block transform hover:scale-105 transition-transform duration-300">
                  나의 운명
                </span>
              </h1>
            </div>

            {/* Enhanced subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              태양계 9개 행성과 음양오행이 만나
              <br />
              <span className="text-gray-900 font-semibold">당신만의 우주적 운명을 해석</span>합니다
            </p>

            {/* Premium CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="group relative bg-gradient-to-r from-star-gold via-amber-500 to-star-gold bg-size-200 bg-pos-0 hover:bg-pos-100 text-space-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] hover:scale-105 transition-all duration-500 overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  <span>내 운명 탐험하기</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 pt-6 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>실시간 상담</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-star-gold fill-star-gold" />
                <span>평점 4.9/5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">50,000+</span>
                <span>이용자</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-star-gold/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-star-gold rounded-full animate-scroll-down" />
            </div>
          </div>
        </section>

        {/* Premium Slider Section */}
        <section className="py-6 sm:py-8">
          <HeroSlider slides={IMAGE_MAP.hero} autoPlayInterval={4000} pauseOnHover={true} />
        </section>

        {/* Redesigned Categories Section */}
        <section
          ref={categorySection.ref as any}
          className={`py-8 sm:py-12 fade-in ${categorySection.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cosmic-purple/10 to-nebula-pink/10 rounded-full border border-cosmic-purple/20 mb-4">
              <Star className="w-4 h-4 text-cosmic-purple" />
              <span className="text-sm font-medium text-gray-700">행성별 전문 상담</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              행성 카테고리
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              각 행성의 에너지로 당신의 운명을 읽습니다
            </p>
          </div>

          {/* Premium Grid Layout */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORY_PLANETS.map((cat, index) => {
              const planetData = PLANETS_DATA.find(p => p.name === cat.planet);
              const bgColor = planetData?.color || '#7B68EE';

              return (
                <Link key={cat.id} href={`/category/${cat.id}`}>
                  <div
                    className={`group flex flex-col items-center gap-3 cursor-pointer transition-all duration-500 hover:-translate-y-2 ${categorySection.isVisible ? 'stagger-fast' : ''}`}
                    style={categorySection.isVisible ? { animationDelay: `${index * 40}ms` } : {}}
                  >
                    {/* Premium Planet Card */}
                    <div className="relative">
                      {/* Glow ring */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                        style={{
                          background: `radial-gradient(circle, ${bgColor}66, transparent)`,
                        }}
                      />

                      {/* Planet circle */}
                      <div
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${bgColor}dd, ${bgColor}88)`,
                          boxShadow: `0 4px 20px ${bgColor}44, inset 0 0 20px ${bgColor}22`
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                          {cat.icon}
                        </span>

                        {/* Orbital ring */}
                        <div
                          className="absolute inset-0 border-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ borderColor: `${bgColor}66` }}
                        />
                      </div>

                      {/* Element badge */}
                      {cat.element && (
                        <div
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                          style={{ background: bgColor }}
                        >
                          {cat.element}
                        </div>
                      )}
                    </div>

                    {/* Category info */}
                    <div className="text-center space-y-1">
                      <div className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-star-gold group-hover:via-cosmic-purple group-hover:to-nebula-pink group-hover:bg-clip-text transition-all duration-300">
                        {cat.name}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        {cat.description}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Five Elements Legend - Enhanced */}
          <div className="mt-10 p-6 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl border border-gray-200/50">
            <div className="text-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">음양오행 (五行)</h3>
              <p className="text-xs text-gray-500">우주의 다섯 가지 근본 에너지</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }} />
                <span className="font-medium text-gray-700">木</span>
                <span className="text-gray-500">나무</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #DC143C, #FF6347)' }} />
                <span className="font-medium text-gray-700">火</span>
                <span className="text-gray-500">불</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #DAA520, #F4A460)' }} />
                <span className="font-medium text-gray-700">土</span>
                <span className="text-gray-500">흙</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }} />
                <span className="font-medium text-gray-700">金</span>
                <span className="text-gray-500">쇠</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #4FD0E7, #00BFFF)' }} />
                <span className="font-medium text-gray-700">水</span>
                <span className="text-gray-500">물</span>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Event Banner */}
        <section
          ref={eventSection.ref as any}
          className={`py-6 sm:py-8 fade-in ${eventSection.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              🌠 사주우주 이벤트
            </h2>
            <p className="text-sm text-gray-600">특별한 혜택을 놓치지 마세요</p>
          </div>

          <div
            className="group relative rounded-3xl p-6 sm:p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(123, 104, 238, 0.15) 0%, rgba(255, 110, 199, 0.15) 50%, rgba(255, 215, 0, 0.15) 100%)',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
            }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, #7B68EE, #FF6EC7, #FFD700)',
              filter: 'blur(20px)',
              zIndex: -1,
            }} />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4 sm:gap-6">
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-star-gold via-amber-400 to-yellow-500 flex items-center justify-center text-3xl sm:text-4xl rounded-2xl shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                ✨
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                  친구 초대하고 3,000원 받기!
                </div>
                <div className="text-sm sm:text-base text-gray-700">
                  5만 명에게 기쁨 전달 이벤트
                </div>
                <div className="mt-2 inline-flex items-center gap-2 text-xs text-cosmic-purple font-medium">
                  <span>자세히 보기</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <Star className="absolute top-4 right-4 w-6 h-6 text-star-gold opacity-50 animate-spin-slow" />
            <Sparkles className="absolute bottom-4 right-8 w-5 h-5 text-nebula-pink opacity-50 animate-pulse" />
          </div>
        </section>

        {/* Premium Products Section */}
        <section
          ref={productsSection.ref as any}
          className={`py-8 sm:py-12 fade-in ${productsSection.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-star-gold/30 mb-4">
              <Star className="w-4 h-4 text-star-gold fill-star-gold" />
              <span className="text-sm font-medium text-gray-700">가장 인기 있는 상담</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ⭐ 월간 랭킹 BEST
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              많은 분들이 선택한 프리미엄 상담
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {FEATURED_PRODUCTS_WOOJU.map((product, index) => (
              <div
                key={product.id}
                className={productsSection.isVisible ? 'stagger-item' : ''}
                style={productsSection.isVisible ? { animationDelay: `${index * 60}ms` } : {}}
              >
                <ProductCardWooju product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Premium CTA Section */}
        <section
          ref={ctaSection.ref as any}
          className={`py-10 sm:py-14 fade-in ${ctaSection.isVisible ? 'visible' : ''}`}
        >
          <div
            className="relative rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 text-center overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(123, 104, 238, 0.2) 0%, rgba(255, 110, 199, 0.2) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 60px rgba(123, 104, 238, 0.3)',
            }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-star-gold/0 via-star-gold/10 to-star-gold/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Floating stars */}
            <Star className="absolute top-6 left-6 w-5 h-5 text-star-gold animate-twinkle" />
            <Sparkles className="absolute top-10 right-10 w-6 h-6 text-nebula-pink animate-twinkle" style={{ animationDelay: '0.3s' }} />
            <Moon className="absolute bottom-10 left-16 w-5 h-5 text-cosmic-purple animate-twinkle" style={{ animationDelay: '0.6s' }} />
            <Star className="absolute bottom-6 right-6 w-4 h-4 text-star-gold animate-twinkle" style={{ animationDelay: '0.9s' }} />

            <div className="relative z-10 space-y-6">
              <div className="text-4xl sm:text-5xl mb-4">🌌</div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
                우주의 신비를 경험하세요
              </h3>

              <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto leading-relaxed">
                AI 기반 정밀 사주 분석으로
                <br />
                <span className="font-semibold text-gray-900">당신의 운명을 탐험</span>하세요
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button className="group/btn relative bg-gradient-to-r from-star-gold via-amber-500 to-star-gold bg-size-200 bg-pos-0 hover:bg-pos-100 text-space-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.7)] hover:scale-105 transition-all duration-500">
                  <span className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    <span>지금 시작하기</span>
                  </span>
                </button>

                <button className="px-6 py-3 rounded-full font-medium text-sm sm:text-base text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:scale-105">
                  더 알아보기
                </button>
              </div>

              {/* Value props */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% 개인정보 보호</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>24시간 상담 가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>전문가 검증</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chat Button - Enhanced */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-cosmic-purple via-purple-600 to-nebula-pink text-white rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 group"
        aria-label="채팅 상담"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">
          N
        </div>
      </button>

      {/* Additional custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .bg-size-200 {
          background-size: 200% auto;
        }

        .bg-pos-0 {
          background-position: 0% center;
        }

        .bg-pos-100 {
          background-position: 100% center;
        }
      `}</style>
    </div>
  );
}
