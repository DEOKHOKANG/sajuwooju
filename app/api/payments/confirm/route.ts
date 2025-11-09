/**
 * POST /api/payments/confirm
 * Phase 8.10: Confirm payment with Toss Payments
 * Toss Payments 결제 승인 처리
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { approveTossPayment } from '@/lib/payments/toss-client';
import { z } from 'zod';

const confirmRequestSchema = z.object({
  paymentKey: z.string().min(1, 'paymentKey가 필요합니다'),
  orderId: z.string().min(1, 'orderId가 필요합니다'),
  amount: z.number().min(100, '결제 금액이 필요합니다'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validationResult = confirmRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '입력 데이터가 올바르지 않습니다',
            details: validationResult.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { paymentKey, orderId, amount } = validationResult.data;

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: '결제 정보를 찾을 수 없습니다',
          },
        },
        { status: 404 }
      );
    }

    // Verify amount
    if (payment.amount !== amount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AMOUNT_MISMATCH',
            message: '결제 금액이 일치하지 않습니다',
          },
        },
        { status: 400 }
      );
    }

    // Check if already approved
    if (payment.status === 'done') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ALREADY_APPROVED',
            message: '이미 승인된 결제입니다',
          },
        },
        { status: 400 }
      );
    }

    try {
      // Call Toss Payments API for approval
      console.log(`[Payment Confirm] OrderId: ${orderId}, Amount: ${amount}`);

      const tossResponse = await approveTossPayment({
        paymentKey,
        orderId,
        amount,
      });

      // Update payment record
      const updatedPayment = await prisma.payment.update({
        where: { orderId },
        data: {
          paymentKey: tossResponse.paymentKey,
          status: 'done',
          method: tossResponse.method,
          approvedAt: new Date(tossResponse.approvedAt),
          metadata: JSON.stringify({
            tossResponse: {
              type: tossResponse.type,
              currency: tossResponse.currency,
              totalAmount: tossResponse.totalAmount,
              balanceAmount: tossResponse.balanceAmount,
              card: tossResponse.card,
              virtualAccount: tossResponse.virtualAccount,
              transfer: tossResponse.transfer,
              mobilePhone: tossResponse.mobilePhone,
            },
          }),
        },
      });

      console.log(
        `[Payment Confirm Success] OrderId: ${orderId}, PaymentKey: ${paymentKey}`
      );

      return NextResponse.json({
        success: true,
        data: {
          orderId: updatedPayment.orderId,
          paymentKey: updatedPayment.paymentKey,
          amount: updatedPayment.amount,
          status: updatedPayment.status,
          method: updatedPayment.method,
          approvedAt: updatedPayment.approvedAt,
        },
      });
    } catch (tossError: any) {
      // Toss API error
      console.error('[Payment Confirm - Toss API Error]', tossError);

      // Update payment as failed
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'failed',
          failureCode: tossError.code || 'UNKNOWN',
          failureMessage: tossError.message || '결제 승인 실패',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PAYMENT_APPROVAL_FAILED',
            message: tossError.message || '결제 승인에 실패했습니다',
          },
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[POST /api/payments/confirm] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생했습니다',
        },
      },
      { status: 500 }
    );
  }
}
