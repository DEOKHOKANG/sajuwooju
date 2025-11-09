/**
 * POST /api/payments/create
 * Phase 8.10: Create payment order
 * 결제 주문 생성 (Toss Payments 결제 시작 전)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderId } from '@/lib/payments/toss-client';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const paymentRequestSchema = z.object({
  productId: z.string().min(1, '상품 ID가 필요합니다'),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  amount: z.number().min(100, '최소 결제 금액은 100원입니다'),
  orderName: z.string().min(1, '주문명이 필요합니다'),
  customerName: z.string().min(2, '고객명이 필요합니다'),
  customerEmail: z.string().email('유효한 이메일이 필요합니다').optional(),
  customerMobilePhone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validationResult = paymentRequestSchema.safeParse(body);

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

    const data = validationResult.data;

    // Generate unique order ID
    const orderId = generateOrderId();

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        id: uuidv4(),
        orderId,
        productId: data.productId,
        userId: data.userId,
        sessionId: data.sessionId,
        amount: data.amount,
        status: 'pending',
        orderName: data.orderName,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerMobilePhone: data.customerMobilePhone,
      },
    });

    console.log(`[Payment Create] OrderId: ${orderId}, Amount: ${data.amount}`);

    // Prepare response for Toss Payments widget
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: payment.orderId,
          amount: payment.amount,
          orderName: payment.orderName,
          customerName: payment.customerName,
          customerEmail: payment.customerEmail,
          customerMobilePhone: payment.customerMobilePhone,
          successUrl: `${siteUrl}/payments/success`,
          failUrl: `${siteUrl}/payments/fail`,
          createdAt: payment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/payments/create] Error:', error);

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
