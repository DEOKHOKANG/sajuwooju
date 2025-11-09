import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 - 타이트사주',
  description: '요청하신 페이지를 찾을 수 없습니다. 홈으로 돌아가주세요.',
};

/**
 * 404 Not Found 페이지
 * Phase 10.2: Not Found Error Handling
 *
 * Features:
 * - Cosmic-themed 404 page with space theme
 * - Navigation links to main pages
 * - Search/explore suggestions
 * - Responsive mobile-first design
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-space relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* 떠다니는 오브 - 배경 장식 */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-nebula-pink rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cosmic-purple rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" style={{ animationDelay: '-7s' }} />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-nebula-blue rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" style={{ animationDelay: '-14s' }} />

        {/* 별 배경 */}
        <div className="absolute inset-0 stars-background" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* 404 Number with Cosmic Effect */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* 404 텍스트 - 그라디언트 효과 */}
            <div className="text-9xl sm:text-[140px] font-bold text-gradient-nebula text-center leading-none">
              404
            </div>

            {/* 배경 글로우 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cosmic-purple blur-3xl opacity-20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="glass rounded-2xl p-8 mb-8 border border-ui-border text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            페이지를 찾을 수 없습니다
          </h1>

          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            우주 너머로 사라진 페이지입니다.
            <br />
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>

          {/* Space Story */}
          <div className="mt-6 pt-6 border-t border-ui-border">
            <p className="text-xs text-text-tertiary mb-3 uppercase tracking-widest">
              우주의 신호
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-comet-cyan animate-pulse">●</span>
              <p className="text-sm text-text-secondary font-light">
                네비게이션 시스템을 확인하고 다시 시도해주세요
              </p>
              <span className="text-nebula-pink animate-pulse">●</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/"
            className="group relative px-6 py-4 bg-cosmic-purple hover:bg-cosmic-purple/90 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-cosmic-purple/50 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">홈으로 돌아가기</span>
            <span className="relative z-10 text-lg group-hover:translate-x-1 transition-transform">→</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple to-nebula-blue opacity-0 group-hover:opacity-30 transition-opacity" />
          </Link>

          <Link
            href="/menu"
            className="group relative px-6 py-4 glass hover:bg-ui-glass-hover text-text-primary font-semibold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">전체 메뉴</span>
            <span className="relative z-10 text-lg group-hover:translate-x-1 transition-transform">↓</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-comet-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Suggested Pages */}
        <div className="glass rounded-2xl p-6 border border-ui-border">
          <p className="text-xs text-text-tertiary uppercase tracking-widest mb-4 block">
            다른 별들을 탐험해보세요
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Link
              href="/coupons"
              className="group px-3 py-3 rounded-lg bg-space-dark/50 hover:bg-space-navy border border-ui-border hover:border-ui-border-hover text-center transition-all duration-200"
            >
              <span className="text-lg mb-1 block">🎁</span>
              <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                쿠폰함
              </p>
            </Link>

            <Link
              href="/reports"
              className="group px-3 py-3 rounded-lg bg-space-dark/50 hover:bg-space-navy border border-ui-border hover:border-ui-border-hover text-center transition-all duration-200"
            >
              <span className="text-lg mb-1 block">📋</span>
              <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                상담 내역
              </p>
            </Link>

            <Link
              href="/support"
              className="group px-3 py-3 rounded-lg bg-space-dark/50 hover:bg-space-navy border border-ui-border hover:border-ui-border-hover text-center transition-all duration-200"
            >
              <span className="text-lg mb-1 block">💬</span>
              <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                고객센터
              </p>
            </Link>

            <Link
              href="/settings"
              className="group px-3 py-3 rounded-lg bg-space-dark/50 hover:bg-space-navy border border-ui-border hover:border-ui-border-hover text-center transition-all duration-200"
            >
              <span className="text-lg mb-1 block">⚙️</span>
              <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                설정
              </p>
            </Link>

            <Link
              href="/privacy"
              className="group px-3 py-3 rounded-lg bg-space-dark/50 hover:bg-space-navy border border-ui-border hover:border-ui-border-hover text-center transition-all duration-200"
            >
              <span className="text-lg mb-1 block">🔐</span>
              <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                개인정보
              </p>
            </Link>

            <Link
              href="/terms"
              className="group px-3 py-3 rounded-lg bg-space-dark/50 hover:bg-space-navy border border-ui-border hover:border-ui-border-hover text-center transition-all duration-200"
            >
              <span className="text-lg mb-1 block">📜</span>
              <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                이용약관
              </p>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-tertiary">
            <span className="inline-block animate-twinkle">★</span>
            {' '}
            404 - Page Lost in Space
            {' '}
            <span className="inline-block animate-twinkle" style={{ animationDelay: '0.5s' }}>★</span>
          </p>
        </div>
      </div>
    </div>
  );
}
