'use client';

import Link from 'next/link';
import { ChevronRight, FileText, Gift, Settings, HelpCircle, FileCheck, Shield, LogOut } from 'lucide-react';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="mx-auto w-full max-w-[600px] px-4 py-3">
          <h1 className="font-display text-lg font-semibold text-primary">
            메뉴
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 pb-20">
        {/* User Info Section */}
        <section className="py-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center text-2xl"
              style={{ borderRadius: '50%' }}
            >
              👤
            </div>
            <div>
              <div className="font-bold text-primary text-lg mb-1">
                사용자님
              </div>
              <div className="text-sm text-slate-400">
                user@example.com
              </div>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="py-4">
          <nav className="space-y-1">
            {/* 내 리포트 */}
            <Link href="/reports">
              <div className="flex items-center justify-between py-4 hover:bg-muted-100 px-3 transition-colors" style={{ borderRadius: '8px' }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">내 리포트</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>

            {/* 쿠폰함 */}
            <Link href="/coupons">
              <div className="flex items-center justify-between py-4 hover:bg-muted-100 px-3 transition-colors" style={{ borderRadius: '8px' }}>
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">쿠폰함</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>

            {/* 계정설정 */}
            <Link href="/settings">
              <div className="flex items-center justify-between py-4 hover:bg-muted-100 px-3 transition-colors" style={{ borderRadius: '8px' }}>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">계정설정</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>

            {/* 고객센터 */}
            <Link href="/support">
              <div className="flex items-center justify-between py-4 hover:bg-muted-100 px-3 transition-colors" style={{ borderRadius: '8px' }}>
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">고객센터</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
          </nav>
        </section>

        {/* Legal Section */}
        <section className="py-4 border-t border-border">
          <nav className="space-y-1">
            {/* 이용약관 */}
            <Link href="/terms">
              <div className="flex items-center justify-between py-4 hover:bg-muted-100 px-3 transition-colors" style={{ borderRadius: '8px' }}>
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600 text-sm">이용약관</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>

            {/* 개인정보처리방침 */}
            <Link href="/privacy">
              <div className="flex items-center justify-between py-4 hover:bg-muted-100 px-3 transition-colors" style={{ borderRadius: '8px' }}>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600 text-sm">개인정보처리방침</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
          </nav>
        </section>

        {/* Logout Button */}
        <section className="py-6">
          <button
            className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">로그아웃</span>
          </button>
        </section>
      </main>
    </div>
  );
}
