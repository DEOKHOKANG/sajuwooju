/**
 * POST /api/consultations
 * Create a new consultation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createConsultationSchema } from '@/lib/validations/saju';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createConsultationSchema.safeParse(body);

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

    // Create consultation in database
    const consultation = await prisma.consultation.create({
      data: {
        id: uuidv4(),
        userId: data.userId,
        sessionId: data.sessionId,
        productId: data.productId,
        name: data.name,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        gender: data.gender,
        isLunar: data.isLunar,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: consultation.id,
          sessionId: consultation.sessionId,
          status: consultation.status,
          createdAt: consultation.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/consultations] Error:', error);

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
 * GET /api/consultations
 * Get consultations list (with pagination and filters)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    // Get total count
    const totalCount = await prisma.consultation.count({ where });

    // Get paginated results
    const consultations = await prisma.consultation.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        sessionId: true,
        name: true,
        birthDate: true,
        status: true,
        createdAt: true,
        productId: true,
      },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      success: true,
      data: consultations,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('[GET /api/consultations] Error:', error);

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
