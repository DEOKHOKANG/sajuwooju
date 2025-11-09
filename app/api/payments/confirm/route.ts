/**
 * POST /api/payments/confirm
 * Phase 8.10: Confirm payment with Toss Payments
 * Toss Payments 결제 승인 처리
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
        message: '결제 승인 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}
