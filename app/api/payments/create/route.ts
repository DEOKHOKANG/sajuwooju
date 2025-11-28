/**
 * POST /api/payments/create
 * Phase 8.10: Create payment order
 * 결제 주문 생성 (Toss Payments 결제 시작 전)
 *
 * NOTE: Temporarily disabled - Prisma not configured for deployment
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: '결제 생성 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}
