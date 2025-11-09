'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Bell } from 'lucide-react';

/**
 * Mobile Header
 * 모바일 상단 헤더 (원본 사이트 복제)
 */

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
}

export function MobileHeader({
  title = '사주우주',
  showBack = false,
  showNotification = true,
}: MobileHeaderProps) {
  const pathname = usePathname();

  // Don't show on landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-area-pt">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Left: Back button or logo */}
        <div className="flex items-center w-12">
          {showBack ? (
            <button
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="뒤로 가기"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/main" className="flex items-center">
              <span className="text-lg font-bold bg-gradient-to-r from-cosmic-purple to-nebula-pink bg-clip-text text-transparent">
                사주
              </span>
            </Link>
          )}
        </div>

        {/* Center: Title */}
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900 truncate px-2">
          {title}
        </h1>

        {/* Right: Notification icon */}
        <div className="flex items-center justify-end w-12">
          {showNotification && (
            <button
              className="p-2 -mr-2 text-gray-700 hover:text-gray-900 transition-colors relative"
              aria-label="알림"
            >
              <Bell className="w-6 h-6" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
