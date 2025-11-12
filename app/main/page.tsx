"use client";

import { MobileHeader } from "@/components/layout/mobile-header";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCardWooju } from "@/components/product-card-wooju";
import { Footer } from "@/components/footer";
import { MessageCircle, Sparkles, Star, Moon, Zap } from "lucide-react";
import { IMAGE_MAP } from "@/lib/image-map";
import { FEATURED_PRODUCTS_WOOJU } from "@/lib/products-data-wooju";
import { PLANETS_DATA } from "@/lib/planets-data";
import { SAJU_SERVICES } from "@/lib/services-data";
import { FEATURES, TESTIMONIALS } from "@/lib/features-testimonials-data";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useMemo, useState, useEffect } from "react";

// 커머스 스타일 컴포넌트들
import { HotDealCountdown } from "@/components/home/HotDealCountdown";
import { BestsellerUrgent } from "@/components/home/BestsellerUrgent";
import { PurchaseToast } from "@/components/home/PurchaseToast";

// Rebranded Category to Planet mapping with enhanced data
const CATEGORY_PLANETS = [
  {
    id: 1,
    name: "이벤트",
    planet: "태양",
    icon: "🌟",
    description: "특별한 혜택",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    id: 2,
    name: "궁합",
    planet: "금성",
    icon: "💫",
    element: "金",
    description: "운명의 인연",
    gradient: "from-pink-400 to-rose-500"
  },
  {
    id: 3,
    name: "솔로/연애",
    planet: "화성",
    icon: "🔥",
    element: "火",
    description: "사랑의 시작",
    gradient: "from-red-400 to-pink-500"
  },
  {
    id: 4,
    name: "이별/재회",
    planet: "명왕성",
    icon: "💔",
    element: "土",
    description: "관계의 회복",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    id: 5,
    name: "직장/취업",
    planet: "토성",
    icon: "💼",
    element: "土",
    description: "성공의 길",
    gradient: "from-amber-500 to-yellow-600"
  },
  {
    id: 6,
    name: "재물/사업",
    planet: "목성",
    icon: "💰",
    element: "木",
    description: "부의 흐름",
    gradient: "from-green-400 to-emerald-500"
  },
  {
    id: 7,
    name: "건강",
    planet: "수성",
    icon: "⚕️",
    element: "水",
    description: "생명의 에너지",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    id: 8,
    name: "월별운세",
    planet: "해왕성",
    icon: "🌊",
    element: "水",
    description: "시간의 흐름",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    id: 9,
    name: "종합운",
    planet: "천왕성",
    icon: "🌀",
    element: "水",
    description: "전체 운세",
    gradient: "from-violet-400 to-purple-500"
  },
  {
    id: 10,
    name: "타로",
    planet: "지구",
    icon: "🔮",
    element: "土",
    description: "신비의 계시",
    gradient: "from-indigo-400 to-purple-500"
  },
  {
    id: 11,
    name: "작명",
    planet: "달",
    icon: "🌙",
    description: "이름의 의미",
    gradient: "from-slate-400 to-gray-500"
  },
  {
    id: 12,
    name: "꿈 해몽",
    planet: "해왕성",
    icon: "💭",
    element: "水",
    description: "꿈의 메시지",
    gradient: "from-purple-400 to-indigo-500"
  },
];

/**
 * Main Saju Content Page - REBRANDED VERSION
 * Premium cosmic-themed fortune-telling experience
 * 프리미엄 우주 테마 사주 서비스
 */
export default function MainPage() {
  const heroSection = useScrollAnimation({ threshold: 0.1 });
  const servicesSection = useScrollAnimation({ threshold: 0.2 });
  const featuresSection = useScrollAnimation({ threshold: 0.2 });
  const testimonialsSection = useScrollAnimation({ threshold: 0.2 });
  const categorySection = useScrollAnimation({ threshold: 0.2 });
  const eventSection = useScrollAnimation({ threshold: 0.2 });
  const productsSection = useScrollAnimation({ threshold: 0.2 });
  const ctaSection = useScrollAnimation({ threshold: 0.2 });

  // Generate 50 stars with consistent random positions (memoized to prevent re-renders)
  const stars = useMemo(() => {
    const colors = ['text-star-gold', 'text-cosmic-purple', 'text-nebula-pink', 'text-white'];
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2-6px
      top: Math.random() * 100, // 0-100%
      left: Math.random() * 100, // 0-100%
      delay: Math.random() * 3, // 0-3s
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  // Fetch products from API with fallback to hardcoded data
  const [products, setProducts] = useState(FEATURED_PRODUCTS_WOOJU);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // State for BirthDateQuickModal
  const [showBirthDateModal, setShowBirthDateModal] = useState(false);

  // Handler for birth date submission
  const handleBirthDateComplete = (birthDate: string, calendarType: "solar" | "lunar") => {
    console.log("Birth date submitted:", birthDate, calendarType);
    // Could trigger personalized recommendations refresh here
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoadingProducts(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match FEATURED_PRODUCTS_WOOJU structure
          const transformedProducts = data.map((product: any) => ({
            id: parseInt(product.id),
            title: product.name,
            subtitle: product.description,
            image: product.imageUrl,
            rating: product.rating || 4.8,
            reviews: product.views || 1234,
            views: product.views || 1234,
            discount: product.discount || 10,
            categoryIds: Array.isArray(product.categoryIds) ? product.categoryIds : [1],
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products, using fallback data:', error);
        // Keep using FEATURED_PRODUCTS_WOOJU as fallback
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />

      <main className="mx-auto w-full max-w-[600px] px-3 sm:px-4 lg:px-8 pb-20 sm:pb-24">

        {/* 📸 프리미엄 롤링 배너 - 최상단 */}
        <section className="pt-12 pb-5 sm:pt-16 sm:pb-6">
          <HeroSlider slides={IMAGE_MAP.hero} autoPlayInterval={4000} pauseOnHover={true} />
        </section>

        {/* 🔥 긴급 핫딜 카운트다운 */}
        <section className="pb-4 sm:pb-6">
          <HotDealCountdown
            title="연애운 프리미엄 사주"
            originalPrice={29000}
            discountPrice={9900}
            discountRate={66}
            productId={1}
          />
        </section>

        {/* 🏆 베스트셀러 긴급 구매 유도 */}
        <BestsellerUrgent />

        {/* 전문 상담 카테고리 섹션 */}
        <section
          ref={categorySection.ref as any}
          className={`py-8 sm:py-12 fade-in ${categorySection.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cosmic-purple/10 to-nebula-pink/10 rounded-full border border-cosmic-purple/20 mb-4">
              <Star className="w-4 h-4 text-cosmic-purple" />
              <span className="text-sm font-medium text-gray-700">분야별 전문 상담</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              운세 카테고리
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              전문가의 깊이 있는 해석으로 당신의 운명을 읽습니다
            </p>
          </div>

          {/* Premium Grid Layout - 12개 카테고리 균일 배치 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
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

          {/* Five Elements Legend - Enhanced Glassmorphism */}
          <div className="mt-10 p-6 backdrop-blur-2xl bg-white/70 rounded-2xl border border-white/40 shadow-lg hover:bg-white/80 hover:shadow-xl transition-all duration-300">
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
            className="group relative rounded-3xl p-6 sm:p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl backdrop-blur-2xl bg-white/70 border border-white/40"
          >
            {/* Animated gradient overlay on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, #7B68EE, #FF6EC7, #FFD700)',
            }} />

            {/* Animated gradient border glow */}
            <div className="absolute inset-0 rounded-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{
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
            {products.map((product, index) => (
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

        {/* Features Section - 3 Key Features */}
        <section
          ref={featuresSection.ref as any}
          className={`py-8 sm:py-12 fade-in ${featuresSection.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full border border-violet-200 mb-4">
              <Zap className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-gray-700">왜 사주우주인가?</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              프리미엄 서비스 특징
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              AI 기술과 전통 명리학의 완벽한 조화
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.id}
                className={`group relative p-6 sm:p-8 rounded-2xl backdrop-blur-2xl bg-white/90 border border-white/60 shadow-lg hover:bg-white hover:shadow-2xl hover:border-white/80 transition-all duration-500 hover:-translate-y-2 ${featuresSection.isVisible ? 'stagger-item' : ''}`}
                style={featuresSection.isVisible ? { animationDelay: `${index * 100}ms` } : {}}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />

                <div className="relative z-10 text-center space-y-4">
                  {/* Icon */}
                  <div className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section - User Reviews */}
        <section
          ref={testimonialsSection.ref as any}
          className={`py-8 sm:py-12 fade-in ${testimonialsSection.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200 mb-4">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-gray-700">실제 이용자 후기</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              만족도 98% 이상
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              이미 50,000명이 경험한 정확한 사주 분석
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`p-6 sm:p-8 rounded-2xl backdrop-blur-2xl bg-white/90 border border-white/60 shadow-lg hover:bg-white hover:shadow-2xl hover:border-white/80 transition-all duration-500 hover:-translate-y-2 ${testimonialsSection.isVisible ? 'stagger-item' : ''}`}
                style={testimonialsSection.isVisible ? { animationDelay: `${index * 100}ms` } : {}}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>

                  <div className="flex-1">
                    {/* Name */}
                    <div className="font-bold text-gray-900">{testimonial.name}</div>

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-800 font-medium leading-relaxed mb-4">
                  "{testimonial.comment}"
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-full bg-violet-100 text-violet-700 font-medium">
                    {testimonial.service}
                  </span>
                  <span>{testimonial.date}</span>
                </div>
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

      {/* 💬 실시간 구매 알림 토스트 */}
      <PurchaseToast />

      {/* Floating Chat Button - Enhanced with Glassmorphism */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 sm:w-18 sm:h-18 backdrop-blur-xl bg-gradient-to-br from-cosmic-purple/90 via-purple-600/90 to-nebula-pink/90 border border-white/30 text-white rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="채팅 상담"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse shadow-lg">
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
