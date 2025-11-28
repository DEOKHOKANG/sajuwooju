'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gift } from 'lucide-react';

interface Coupon {
  id: number;
  title: string;
  discount: string;
  description: string;
  expiryDate: string;
  isExpired: boolean;
}

const MOCK_COUPONS: Coupon[] = [
  {
    id: 1,
    title: '신규 가입 축하',
    discount: '3,000원',
    description: '전체 상품 3,000원 할인',
    expiryDate: '2025.12.31',
    isExpired: false,
  },
  {
    id: 2,
    title: '이벤트 쿠폰',
    discount: '20%',
    description: '특정 상품 20% 할인',
    expiryDate: '2025.11.30',
    isExpired: false,
  },
  {
    id: 3,
    title: '생일 축하 쿠폰',
    discount: '5,000원',
    description: '전체 상품 5,000원 할인',
    expiryDate: '2024.10.31',
    isExpired: true,
  },
];

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'expired'>('available');

  const availableCoupons = MOCK_COUPONS.filter(c => !c.isExpired);
  const expiredCoupons = MOCK_COUPONS.filter(c => c.isExpired);
  const displayedCoupons = activeTab === 'available' ? availableCoupons : expiredCoupons;

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
            내 쿠폰
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-border bg-white sticky top-[57px] z-40">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'available'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-slate-400'
            }`}
          >
            사용가능 ({availableCoupons.length})
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'expired'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-slate-400'
            }`}
          >
            만료됨 ({expiredCoupons.length})
          </button>
        </div>

        {/* Coupon List */}
        <div className="px-4 py-6">
          {displayedCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Gift className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-400 text-sm">
                {activeTab === 'available'
                  ? '사용 가능한 쿠폰이 없습니다'
                  : '만료된 쿠폰이 없습니다'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`bg-gradient-to-r p-4 ${
                    coupon.isExpired
                      ? 'from-slate-100 to-slate-50 opacity-60'
                      : 'from-pink-50 to-purple-50'
                  }`}
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-primary text-lg mb-1">
                        {coupon.discount}
                      </div>
                      <div className="font-medium text-primary text-sm mb-1">
                        {coupon.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {coupon.description}
                      </div>
                    </div>
                    {!coupon.isExpired && (
                      <button
                        className="px-4 py-2 bg-secondary text-white text-xs font-medium hover:bg-secondary/90 transition-colors"
                        style={{ borderRadius: '6px' }}
                      >
                        사용하기
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    유효기간: {coupon.expiryDate}까지
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
