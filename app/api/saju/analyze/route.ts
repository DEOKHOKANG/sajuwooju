/**
 * 사주 분석 API Route
 * POST /api/saju/analyze
 *
 * NOTE: Temporarily disabled - OPENAI_API_KEY not configured for deployment
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'AI 사주 분석 기능은 현재 준비 중입니다',
      },
    },
    { status: 503 }
  );
}

// OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
