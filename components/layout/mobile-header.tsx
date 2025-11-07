"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

/**
 * 모바일 헤더 - 원본 사이트 정확 복제
 * 측정값:
 * - 높이: ~60px
 * - 로고: 좌측, 16px 여백
 * - 햄버거: 우측, 16px 여백
 * - 배경: white
 */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex h-[60px] items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            {/* 이모지 아이콘 (실제로는 이미지 사용) */}
            <span className="text-3xl">😗</span>
          </div>
          <span className="font-display text-base font-medium text-primary">
            타이트 사주
          </span>
        </Link>

        {/* 햄버거 메뉴 */}
        <Link href="/menu">
          <button
            className="p-2"
            aria-label="메뉴 열기"
          >
            <Menu className="w-6 h-6 text-primary" strokeWidth={2} />
          </button>
        </Link>
      </div>
    </header>
  );
}
