'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Bell, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

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
  const { data: session, status } = useSession();

  // Don't show on landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass-header backdrop-blur-2xl bg-white/80 border-b border-white/20 shadow-sm safe-area-pt">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Left: Back button or logo */}
        <div className="flex items-center w-12">
          {showBack ? (
            <button
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="뒤로 가기"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/main" className="flex items-center">
              <span className="text-lg font-bold bg-gradient-to-r from-cosmic-purple to-nebula-pink bg-clip-text text-transparent drop-shadow-sm">
                사주
              </span>
            </Link>
          )}
        </div>

        {/* Center: Title */}
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900 truncate px-2 drop-shadow-sm">
          {title}
        </h1>

        {/* Right: Profile/Login button */}
        <div className="flex items-center justify-end gap-2">
          {showNotification && (
            <button
              className="p-2 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 relative"
              aria-label="알림"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
            </button>
          )}

          {/* User Profile / Login */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
            <Link href="/profile" className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cosmic-purple/30 hover:border-cosmic-purple transition-all duration-200 hover:scale-110">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cosmic-purple to-nebula-pink flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="p-2 text-gray-700 hover:text-cosmic-purple transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="로그인"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
