'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Settings, Menu } from 'lucide-react';

/**
 * Mobile Bottom Navigation
 * 모바일 하단 네비게이션 (원본 사이트 복제)
 */

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/main',
      label: '홈',
      icon: Home,
    },
    {
      href: '/menu',
      label: '메뉴',
      icon: Menu,
    },
    {
      href: '/my',
      label: '마이',
      icon: User,
    },
    {
      href: '/settings',
      label: '설정',
      icon: Settings,
    },
  ];

  // Don't show on landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-cosmic-purple'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
