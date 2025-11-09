/**
 * GET /api/consultations/[id]
 * Get a specific consultation by ID or sessionId
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by id first, then by sessionId
    let consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      // Try sessionId
      consultation = await prisma.consultation.findUnique({
        where: { sessionId: id },
      });
    }

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

    // Parse sajuData if exists
    let sajuData = null;
    if (consultation.sajuData) {
      try {
        sajuData = JSON.parse(consultation.sajuData);
      } catch {
        // If parsing fails, leave as null
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: consultation.id,
        sessionId: consultation.sessionId,
        userId: consultation.userId,
        productId: consultation.productId,
        name: consultation.name,
        birthDate: consultation.birthDate,
        birthTime: consultation.birthTime,
        gender: consultation.gender,
        isLunar: consultation.isLunar,
        status: consultation.status,
        sajuData,
        createdAt: consultation.createdAt,
        updatedAt: consultation.updatedAt,
      },
    });
  } catch (error) {
    console.error('[GET /api/consultations/[id]] Error:', error);

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
 * PATCH /api/consultations/[id]
 * Update a consultation (mainly for updating sajuData and status)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { sajuData, status } = body;

    // Build update data
    const updateData: any = {};
    if (sajuData) {
      updateData.sajuData = typeof sajuData === 'string' ? sajuData : JSON.stringify(sajuData);
    }
    if (status) {
      updateData.status = status;
    }

    // Update consultation
    const consultation = await prisma.consultation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: consultation.id,
        sessionId: consultation.sessionId,
        status: consultation.status,
        updatedAt: consultation.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('[PATCH /api/consultations/[id]] Error:', error);

    if (error.code === 'P2025') {
      // Prisma "Record not found" error
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
