'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  MessageCircle,
  Bookmark,
  User,
  Menu,
  Search,
  Bell,
  X
} from 'lucide-react';

/**
 * Mobile App Style Layout
 * 모바일 앱 스타일 레이아웃 - 상단 헤더 + 하단 네비게이션
 *
 * Features:
 * - Fixed top header with logo, hamburger menu, search, notifications
 * - Fixed bottom navigation with 5 main tabs
 * - Mobile-first responsive design
 * - Premium gradient color scheme based on 음양오행
 */

interface MobileAppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
}

// 하단 네비게이션 메뉴 구성
const BOTTOM_NAV_ITEMS = [
  {
    id: 'home',
    label: '홈',
    icon: Home,
    href: '/main',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'saju',
    label: '사주분석',
    icon: Sparkles,
    href: '/saju/new',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'dashboard',
    label: '대시보드',
    icon: MessageCircle,
    href: '/dashboard',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'reports',
    label: '내분석',
    icon: Bookmark,
    href: '/reports',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'profile',
    label: '마이',
    icon: User,
    href: '/profile',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export function MobileAppLayout({
  children,
  showHeader = true,
  showBottomNav = true
}: MobileAppLayoutProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 현재 활성화된 네비게이션 아이템 확인
  const isNavActive = (href: string) => {
    if (href === '/main') return pathname === '/main';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Top Header - Mobile App Style */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Left: Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="메뉴"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Center: Logo */}
            <Link
              href="/main"
              className="absolute left-1/2 -translate-x-1/2 font-display text-xl font-bold"
            >
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                사주우주
              </span>
            </Link>

            {/* Right: Search + Notifications */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="검색"
              >
                <Search className="w-5 h-5 text-white" />
              </button>

              <Link
                href="/dashboard?tab=notifications"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                aria-label="알림"
              >
                <Bell className="w-5 h-5 text-white" />
                {/* 알림 뱃지 */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900" />
              </Link>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {isSearchOpen && (
            <div className="px-4 pb-4 animate-slide-down">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="사주, 궁합, 운세 검색..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>
            </div>
          )}
        </header>
      )}

      {/* Side Menu (Drawer) */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 z-50 animate-slide-in-left overflow-y-auto">
            <div className="p-6">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">메뉴</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <Link
                  href="/main"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>홈</span>
                </Link>
                <Link
                  href="/saju/new"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>사주 분석</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>대시보드</span>
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bookmark className="w-5 h-5" />
                  <span>내 분석 기록</span>
                </Link>

                <div className="border-t border-white/10 my-4" />

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>마이페이지</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>설정</span>
                </Link>
                <Link
                  href="/support"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>고객센터</span>
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`${showHeader ? 'pt-16' : ''} ${showBottomNav ? 'pb-20' : ''} min-h-screen`}>
        {children}
      </main>

      {/* Bottom Navigation - Mobile App Style */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-2">
            <div className="grid grid-cols-5 gap-1">
              {BOTTOM_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = isNavActive(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                      {isActive && (
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r ${item.gradient}`} />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent` : ''}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      <style jsx>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
