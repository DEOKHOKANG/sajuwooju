"use client";

import { MobileHeader } from "@/components/layout/mobile-header";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCard } from "@/components/product-card";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";
import { MessageCircle } from "lucide-react";
import { IMAGE_MAP } from "@/lib/image-map";
import { FEATURED_PRODUCTS } from "@/lib/products-data";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function Home() {
  const categorySection = useScrollAnimation({ threshold: 0.2 });
  const eventSection = useScrollAnimation({ threshold: 0.2 });
  const productsSection = useScrollAnimation({ threshold: 0.2 });
  const reviewsSection = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />

      <main className="mx-auto w-full max-w-[600px] px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        {/* 히어로 슬라이더 */}
        <section className="py-4 sm:py-6 md:py-8">
          <HeroSlider slides={IMAGE_MAP.hero} autoPlayInterval={3000} pauseOnHover={true} />
        </section>

        {/* 카테고리 */}
        <section ref={categorySection.ref as any} className="py-4 sm:py-6 md:py-8">
          <div className={`flex items-center gap-2 mb-4 sm:mb-6 fade-in ${categorySection.isVisible ? 'visible' : ''}`}>
            <span className="text-xl sm:text-2xl">🥞</span>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-primary">카테고리</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {IMAGE_MAP.categories.map((cat, index) => (
              <Link key={cat.id} href={`/category/${cat.id}`}>
                <div
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-150 ease-out hover:scale-110 hover:opacity-90 ${categorySection.isVisible ? 'stagger-fast' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={cat.label}
                  style={categorySection.isVisible ? { animationDelay: `${index * 30}ms` } : {}}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted flex items-center justify-center overflow-hidden relative" style={{ borderRadius: '50%' }}>
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                        sizes="(max-width: 640px) 48px, 56px"
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl">{cat.icon}</span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs text-center text-primary leading-tight">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 이벤트 배너 */}
        <section ref={eventSection.ref as any} className={`py-3 sm:py-4 fade-in ${eventSection.isVisible ? 'visible' : ''}`}>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">타이트 사주 이벤트</h2>
          <div style={{ borderRadius: '16px' }} className="sm:rounded-[20px] bg-muted-100 p-3 sm:p-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center text-xl sm:text-2xl flex-shrink-0" style={{ borderRadius: '50%' }}>😗</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-primary text-sm sm:text-base truncate">친구 초대하고 3,000원 받기!</div>
                <div className="text-xs sm:text-sm text-slate-400">5만 명에게 기쁨 전달 이벤트</div>
              </div>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </section>

        {/* 추천 상품 (Featured Products) */}
        <section ref={productsSection.ref as any} className={`py-4 sm:py-6 md:py-8 fade-in ${productsSection.isVisible ? 'visible' : ''}`}>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">🍷</span>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-primary">월간 랭킹 BEST</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {FEATURED_PRODUCTS.map((product, index) => (
              <div
                key={product.id}
                className={productsSection.isVisible ? 'stagger-item' : ''}
                style={productsSection.isVisible ? { animationDelay: `${index * 50}ms` } : {}}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* 고객 후기 (Reviews) */}
        <section ref={reviewsSection.ref as any} className={`py-4 sm:py-6 md:py-8 fade-in ${reviewsSection.isVisible ? 'visible' : ''}`}>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">💬</span>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-primary">생생한 후기</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {/* Review 1 */}
            <div className="bg-muted-100 p-4 sm:p-5" style={{ borderRadius: '16px' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center text-lg" style={{ borderRadius: '50%' }}>
                  👤
                </div>
                <div>
                  <div className="font-bold text-primary text-sm">김**</div>
                  <div className="text-xs text-slate-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-sm text-primary leading-relaxed">
                솔로탈출 사주를 받아봤는데 정말 정확해요! 제 성향이랑 연애 스타일을 딱 집어주셔서 놀랐습니다. 조언대로 했더니 정말 좋은 인연을 만났어요 ㅎㅎ
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-muted-100 p-4 sm:p-5" style={{ borderRadius: '16px' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-lg" style={{ borderRadius: '50%' }}>
                  👤
                </div>
                <div>
                  <div className="font-bold text-primary text-sm">이**</div>
                  <div className="text-xs text-slate-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-sm text-primary leading-relaxed">
                재회 사주 봤는데 너무 상세하게 설명해주셔서 감사합니다. 헤어진 이유와 재회 가능성까지 정확하게 알려주셔서 마음을 정리할 수 있었어요.
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-muted-100 p-4 sm:p-5" style={{ borderRadius: '16px' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-lg" style={{ borderRadius: '50%' }}>
                  👤
                </div>
                <div>
                  <div className="font-bold text-primary text-sm">박**</div>
                  <div className="text-xs text-slate-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-sm text-primary leading-relaxed">
                궁합 사주 보고 나서 상대방을 이해하는데 많은 도움이 됐어요. 우리 둘의 성격 차이를 왜 그런지 알게되니까 더 배려할 수 있게 됐습니다!
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <CtaBanner />
      </main>

      {/* Footer */}
      <Footer />

      {/* 채팅 버튼 */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-secondary flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
        style={{ boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)', borderRadius: '50%' }}
        aria-label="채팅"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" fill="white" />
      </button>
    </div>
  );
}
