/**
 * POST /api/ai/analyze
 * Phase 8.9: AI Analysis API Endpoint
 * Analyzes saju data using OpenAI and returns structured fortune analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeSajuWithAI } from '@/lib/ai/openai-client';
import { AIAnalysisRequest, SajuCategory } from '@/lib/types/openai';
import { z } from 'zod';

// Validation schema for AI analysis request
const aiAnalysisRequestSchema = z.object({
  consultationId: z.string().uuid('유효한 상담 ID가 아닙니다'),
  category: z.enum([
    'wealth',
    'love',
    'health',
    'breakup_recovery',
    'marriage',
    'new_relationship',
    'career',
    'education',
    'business',
    'investment',
    'relocation',
    'feng_shui',
  ] as const),
  partnerData: z
    .object({
      name: z.string(),
      birthDate: z.string().transform((str) => new Date(str)),
      birthTime: z.number().min(0).max(23),
      gender: z.enum(['male', 'female']),
      isLunar: z.boolean(),
      pillars: z.object({
        year: z.object({ heaven: z.string(), earth: z.string() }),
        month: z.object({ heaven: z.string(), earth: z.string() }),
        day: z.object({ heaven: z.string(), earth: z.string() }),
        time: z.object({ heaven: z.string(), earth: z.string() }),
      }),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = aiAnalysisRequestSchema.safeParse(body);

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

    const { consultationId, category, partnerData } = validationResult.data;

    // Get consultation from database
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '상담 내역을 찾을 수 없습니다',
          },
        },
        { status: 404 }
      );
    }

    // Check if consultation already has saju data
    if (!consultation.sajuData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INCOMPLETE_DATA',
            message: '사주 계산이 완료되지 않았습니다. 먼저 사주를 계산해주세요.',
          },
        },
        { status: 400 }
      );
    }

    // Parse saju data
    let sajuData;
    try {
      sajuData = JSON.parse(consultation.sajuData);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_DATA',
            message: '사주 데이터가 올바르지 않습니다',
          },
        },
        { status: 400 }
      );
    }

    // Prepare AI analysis request
    const aiRequest: AIAnalysisRequest = {
      category: category as SajuCategory,
      sajuData: {
        name: consultation.name,
        birthDate: consultation.birthDate,
        birthTime: consultation.birthTime,
        gender: consultation.gender as 'male' | 'female',
        isLunar: consultation.isLunar,
        pillars: sajuData.pillars,
      },
      partnerData: partnerData,
    };

    // Call OpenAI API
    console.log(`[AI Analysis] Starting analysis for category: ${category}, consultation: ${consultationId}`);

    const analysisResult = await analyzeSajuWithAI(aiRequest);

    console.log(
      `[AI Analysis] Completed. Tokens used: ${analysisResult.metadata.tokens}, Model: ${analysisResult.metadata.model}`
    );

    // Update consultation with analysis result (append to existing sajuData)
    const updatedSajuData = {
      ...sajuData,
      analyses: {
        ...(sajuData.analyses || {}),
        [category]: {
          ...analysisResult.analysis,
          generatedAt: analysisResult.metadata.generatedAt,
          model: analysisResult.metadata.model,
          tokens: analysisResult.metadata.tokens,
        },
      },
    };

    await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        sajuData: JSON.stringify(updatedSajuData),
        status: 'completed',
      },
    });

    // Return analysis result
    return NextResponse.json({
      success: true,
      data: {
        category: analysisResult.category,
        analysis: analysisResult.analysis,
        metadata: {
          consultationId,
          generatedAt: analysisResult.metadata.generatedAt,
          model: analysisResult.metadata.model,
          tokens: analysisResult.metadata.tokens,
        },
      },
    });
  } catch (error: any) {
    console.error('[POST /api/ai/analyze] Error:', error);

    // Handle OpenAI API errors
    if (error.message?.includes('OpenAI API Error')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_API_ERROR',
            message: 'AI 분석 중 오류가 발생했습니다',
            details: error.message,
          },
        },
        { status: 502 }
      );
    }

    // Handle rate limit errors
    if (error.status === 429) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
          },
        },
        { status: 429 }
      );
    }

    // Handle insufficient credits
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INSUFFICIENT_CREDITS',
            message: '서비스 크레딧이 부족합니다. 관리자에게 문의해주세요.',
          },
        },
        { status: 503 }
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

/**
 * GET /api/ai/analyze?consultationId={id}&category={category}
 * Get cached AI analysis result for a consultation
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const consultationId = searchParams.get('consultationId');
    const category = searchParams.get('category');

    if (!consultationId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'consultationId가 필요합니다',
          },
        },
        { status: 400 }
      );
    }

    // Get consultation
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '상담 내역을 찾을 수 없습니다',
          },
        },
        { status: 404 }
      );
    }

    if (!consultation.sajuData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_DATA',
            message: '사주 데이터가 없습니다',
          },
        },
        { status: 404 }
      );
    }

    const sajuData = JSON.parse(consultation.sajuData);

    // If category specified, return only that category's analysis
    if (category) {
      const analysis = sajuData.analyses?.[category];

      if (!analysis) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: `${category} 분석 결과를 찾을 수 없습니다`,
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          category,
          analysis,
        },
      });
    }

    // Return all analyses
    return NextResponse.json({
      success: true,
      data: {
        consultationId,
        analyses: sajuData.analyses || {},
      },
    });
  } catch (error) {
    console.error('[GET /api/ai/analyze] Error:', error);

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
