'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Bell, Lock, User, Mail, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="mx-auto w-full max-w-[600px] px-4 py-3 flex items-center gap-3">
          <Link href="/menu">
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              style={{ borderRadius: '50%' }}
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
          </Link>
          <h1 className="font-display text-lg font-semibold text-primary">
            계정설정
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 pb-20">
        {/* Account Info Section */}
        <section className="py-6 border-b border-border">
          <h2 className="text-sm font-bold text-primary mb-4">계정 정보</h2>

          <div className="space-y-1">
            {/* Email */}
            <div className="flex items-center justify-between py-3 px-3 hover:bg-muted-100 transition-colors" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-500 mb-0.5">이메일</div>
                  <div className="text-sm font-medium text-primary">user@example.com</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between py-3 px-3 hover:bg-muted-100 transition-colors" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-500 mb-0.5">전화번호</div>
                  <div className="text-sm font-medium text-primary">010-1234-5678</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* Name */}
            <div className="flex items-center justify-between py-3 px-3 hover:bg-muted-100 transition-colors" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-500 mb-0.5">이름</div>
                  <div className="text-sm font-medium text-primary">사용자</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="py-6 border-b border-border">
          <h2 className="text-sm font-bold text-primary mb-4">알림 설정</h2>

          <div className="space-y-1">
            {/* Push Notifications */}
            <div className="flex items-center justify-between py-3 px-3" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-400" />
                <div className="text-sm font-medium text-primary">푸시 알림</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`relative w-12 h-6 transition-colors ${
                  notifications.push ? 'bg-secondary' : 'bg-slate-300'
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ borderRadius: '50%' }}
                />
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between py-3 px-3" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <div className="text-sm font-medium text-primary">이메일 알림</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative w-12 h-6 transition-colors ${
                  notifications.email ? 'bg-secondary' : 'bg-slate-300'
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ borderRadius: '50%' }}
                />
              </button>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between py-3 px-3" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <div className="text-sm font-medium text-primary">SMS 알림</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                className={`relative w-12 h-6 transition-colors ${
                  notifications.sms ? 'bg-secondary' : 'bg-slate-300'
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-transform ${
                    notifications.sms ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ borderRadius: '50%' }}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-6 border-b border-border">
          <h2 className="text-sm font-bold text-primary mb-4">보안</h2>

          <div className="space-y-1">
            {/* Change Password */}
            <button className="w-full flex items-center justify-between py-3 px-3 hover:bg-muted-100 transition-colors" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-slate-400" />
                <div className="text-sm font-medium text-primary">비밀번호 변경</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </section>

        {/* Account Management */}
        <section className="py-6">
          <h2 className="text-sm font-bold text-primary mb-4">계정 관리</h2>

          <button className="w-full py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium" style={{ borderRadius: '8px' }}>
            회원 탈퇴
          </button>
        </section>
      </main>
    </div>
  );
}
