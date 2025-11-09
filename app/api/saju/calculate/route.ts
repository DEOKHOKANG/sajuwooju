/**
 * POST /api/saju/calculate
 * Phase 8.6: Saju Calculation API Endpoint
 * Calculates saju pillars and creates consultation record
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSaju, formatSajuPillar, getElementDistribution, getSajuSummary } from '@/lib/saju-calculator';
import { sajuInputSchema } from '@/lib/validations/saju';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = sajuInputSchema.safeParse(body);

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

    const input = validationResult.data;

    // Calculate saju
    console.log('[Saju Calculate] Calculating saju for:', input.name);
    const sajuResult = calculateSaju(input);

    // Get summary information
    const summary = getSajuSummary(sajuResult.pillars);
    const elementDistribution = getElementDistribution(sajuResult.pillars);

    // Generate unique session ID
    const sessionId = uuidv4();

    // Prepare saju data for storage
    const sajuData = {
      sessionId,
      pillars: sajuResult.pillars,
      summary: {
        pillarsText: summary.pillarsText,
        dominantElement: summary.dominantElement,
        weakElement: summary.weakElement,
        elementDistribution,
      },
      fortunes: sajuResult.fortunes,
      calculatedAt: new Date().toISOString(),
    };

    // Create consultation record
    const consultation = await prisma.consultation.create({
      data: {
        id: uuidv4(),
        sessionId,
        productId: body.productId || null,
        name: input.name,
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        gender: input.gender,
        isLunar: input.isLunar,
        sajuData: JSON.stringify(sajuData),
        status: 'completed',
        userId: body.userId || null,
      },
    });

    console.log(
      `[Saju Calculate] Success. SessionId: ${sessionId}, ConsultationId: ${consultation.id}`
    );

    // Return calculation result
    return NextResponse.json(
      {
        success: true,
        data: {
          sessionId,
          consultationId: consultation.id,
          pillars: {
            year: formatSajuPillar(sajuResult.pillars.year),
            month: formatSajuPillar(sajuResult.pillars.month),
            day: formatSajuPillar(sajuResult.pillars.day),
            time: formatSajuPillar(sajuResult.pillars.time),
          },
          summary: {
            pillarsText: summary.pillarsText,
            dominantElement: summary.dominantElement,
            weakElement: summary.weakElement,
            elementDistribution,
          },
          fortunes: sajuResult.fortunes,
          createdAt: consultation.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/saju/calculate] Error:', error);

    // Handle specific errors
    if (error.message?.includes('lunar')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LUNAR_CONVERSION_ERROR',
            message: '음력 변환 중 오류가 발생했습니다',
          },
        },
        { status: 400 }
      );
    }

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
