/**
 * 사주 분석 API Route
 * POST /api/saju/analyze
 */

import { NextRequest, NextResponse } from "next/server";
import { generateSajuJSON, withRetry } from "@/lib/openai-client";
import {
  SajuInput,
  FortuneCategory,
  PROMPT_GENERATORS,
  CompatibilityInput,
} from "@/lib/prompts";

export const runtime = "edge";
export const maxDuration = 30; // 30초 타임아웃

interface AnalyzeRequest {
  category: FortuneCategory;
  input: SajuInput | CompatibilityInput;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    // Validation
    if (!body.category || !body.input) {
      return NextResponse.json(
        { error: "카테고리와 입력 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 카테고리별 프롬프트 생성
    const promptGenerator = PROMPT_GENERATORS[body.category];
    if (!promptGenerator) {
      return NextResponse.json(
        { error: "유효하지 않은 카테고리입니다." },
        { status: 400 }
      );
    }

    const prompt = promptGenerator(body.input as any);

    // OpenAI API 호출 (재시도 로직 포함)
    const result = await withRetry(() => generateSajuJSON(prompt), 3, 1000);

    // 결과 반환
    return NextResponse.json({
      success: true,
      category: body.category,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Saju Analysis Error:", error);

    // 에러 타입별 처리
    if (error instanceof Error) {
      if (error.message.includes("rate_limit")) {
        return NextResponse.json(
          {
            error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
          },
          { status: 429 }
        );
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            error: "분석 시간이 초과되었습니다. 다시 시도해주세요.",
          },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "사주 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
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
