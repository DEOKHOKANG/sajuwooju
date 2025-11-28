/**
 * 사주 분석 API Route (상용화급)
 * POST /api/saju/analyze
 * OpenAI API를 사용하여 구조화된 JSON 형식의 사주 분석 결과 반환
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

// 구조화된 사주 분석 결과 타입
interface SajuAnalysisResult {
  summary: {
    title: string;
    overall: string;
    score: number;
  };
  sections: Array<{
    title: string;
    icon: string;
    content: string;
    highlights?: string[];
  }>;
  advice: {
    title: string;
    items: string[];
  };
  luckyInfo: {
    color: string;
    number: string;
    direction: string;
    time: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      name,
      gender,
      calendarType,
      year,
      month,
      day,
      birthHour,
      sajuGanZhi,
      sajuString,
    } = body;

    // 입력 검증
    if (!name || !gender || !year || !month || !day) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // API 키가 없을 경우 Mock 응답 반환 (개발용)
      const mockResult = generateMockStructuredResult(name, category, sajuString);
      return NextResponse.json({
        result: mockResult,
        structured: true,
        timestamp: new Date().toISOString(),
      });
    }

    // 구조화된 응답을 위한 프롬프트
    const systemPrompt = `당신은 30년 경력의 전문 사주명리학자입니다.
사용자의 사주를 분석하여 반드시 아래 JSON 형식으로 응답해주세요.
다른 텍스트 없이 JSON만 반환해주세요.

{
  "summary": {
    "title": "분석 제목 (예: 2024년 종합운세)",
    "overall": "전체 운세 요약 (3-4문장)",
    "score": 75
  },
  "sections": [
    {
      "title": "섹션 제목",
      "icon": "이모지",
      "content": "상세 분석 내용 (3-4문장)",
      "highlights": ["핵심 포인트1", "핵심 포인트2"]
    }
  ],
  "advice": {
    "title": "조언",
    "items": ["조언1", "조언2", "조언3"]
  },
  "luckyInfo": {
    "color": "행운의 색",
    "number": "행운의 숫자",
    "direction": "행운의 방향",
    "time": "행운의 시간대"
  }
}`;

    const userPrompt = `다음 사용자의 사주를 분석해주세요.

## 사용자 정보
- 이름: ${name}
- 성별: ${gender === "male" ? "남성" : "여성"}
- 생년월일: ${year}년 ${month}월 ${day}일 (${calendarType === "solar" ? "양력" : "음력"})
- 태어난 시간: ${birthHour || "모름"}

## 사주팔자
${sajuString || "계산 중"}

## 분석 요청
${getCategoryRequest(category || "comprehensive")}

위 정보를 바탕으로 상세하고 전문적인 사주 분석을 JSON 형식으로 제공해주세요.
sections에는 최소 4개의 분석 섹션을 포함해주세요.
각 섹션의 content는 최소 3문장 이상으로 상세하게 작성해주세요.`;

    // OpenAI API 호출
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API Error:", errorData);

      // Fallback to mock result
      const mockResult = generateMockStructuredResult(name, category, sajuString);
      return NextResponse.json({
        result: mockResult,
        structured: true,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await openaiResponse.json();
    const resultContent = data.choices[0]?.message?.content;

    // JSON 파싱 시도
    let parsedResult: SajuAnalysisResult;
    try {
      parsedResult = JSON.parse(resultContent);
    } catch {
      // JSON 파싱 실패 시 Mock 결과 반환
      const mockResult = generateMockStructuredResult(name, category, sajuString);
      return NextResponse.json({
        result: mockResult,
        structured: true,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      result: parsedResult,
      structured: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Saju analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function getCategoryRequest(category: string): string {
  const requests: { [key: string]: string } = {
    love: "연애운을 중점적으로 분석해주세요. 만남의 가능성, 이상형, 연애 시기, 주의사항을 포함해주세요.",
    wealth: "재물운을 중점적으로 분석해주세요. 수입의 흐름, 투자 운, 재테크 조언, 주의사항을 포함해주세요.",
    career: "직업운을 중점적으로 분석해주세요. 커리어 방향, 적성, 이직 시기, 성공 전략을 포함해주세요.",
    compatibility: "궁합 분석을 해주세요. 상대와의 조화, 장단점, 관계 발전 방향을 포함해주세요.",
    yearly: "올해의 운세를 분석해주세요. 월별 흐름, 중요한 시기, 기회와 위험 요소를 포함해주세요.",
    comprehensive: "종합운세를 분석해주세요. 전반적인 기질, 연애운, 재물운, 직업운, 건강운, 대인관계를 포함해주세요.",
  };
  return requests[category] || requests.comprehensive;
}

/**
 * Mock 구조화된 결과 생성 (개발/테스트용)
 */
function generateMockStructuredResult(name: string, category: string, sajuString: string): SajuAnalysisResult {
  const categoryTitles: { [key: string]: string } = {
    love: "연애운",
    wealth: "재물운",
    career: "직업운",
    compatibility: "궁합",
    yearly: "2024년 연운",
    comprehensive: "종합운세",
  };

  const title = categoryTitles[category] || "종합운세";

  return {
    summary: {
      title: `${name}님의 ${title} 분석`,
      overall: `${name}님의 사주를 분석한 결과, 전반적으로 균형 잡힌 오행 구조를 가지고 계십니다. 특히 목(木)과 화(火)의 기운이 강하여 진취적이고 열정적인 성향을 보이며, 창의성과 리더십이 뛰어난 것이 특징입니다. 올해는 특히 중요한 전환점이 될 수 있으니 신중하게 결정하되 기회를 놓치지 마세요.`,
      score: 78,
    },
    sections: [
      {
        title: "타고난 기질",
        icon: "✨",
        content: "성실하고 끈기 있는 성격으로 목표를 향해 꾸준히 나아가는 스타일입니다. 한번 마음먹은 일은 끝까지 해내는 책임감이 강하며, 주변 사람들에게 신뢰를 주는 타입입니다. 다만 때로는 융통성을 발휘하여 상황에 맞게 대처하는 것도 필요합니다.",
        highlights: ["책임감 강함", "신뢰받는 성격", "목표 지향적"],
      },
      {
        title: "대인관계운",
        icon: "🤝",
        content: "주변 사람들과의 조화를 중시하며, 신뢰를 쌓는 데 능숙합니다. 특히 올해는 새로운 인연을 만날 가능성이 높으며, 이 만남이 인생의 중요한 전환점이 될 수 있습니다. 열린 마음으로 사람들을 대하면 좋은 기회가 찾아올 것입니다.",
        highlights: ["새로운 인연 기대", "신뢰 구축 능력", "조화로운 관계"],
      },
      {
        title: "재물운",
        icon: "💰",
        content: "꾸준한 노력으로 재물을 축적하는 유형입니다. 일확천금보다는 안정적인 재테크가 적합하며, 특히 장기 투자에서 좋은 결과를 기대할 수 있습니다. 올해 하반기에 예상치 못한 수입이 있을 수 있으니 기회를 잘 활용하세요.",
        highlights: ["안정적 재테크", "장기 투자 유리", "하반기 호재"],
      },
      {
        title: "건강운",
        icon: "💪",
        content: "전반적으로 건강한 체질이지만, 과로로 인한 스트레스 관리가 필요합니다. 규칙적인 운동과 충분한 휴식을 취하는 것이 중요하며, 특히 소화기 계통에 신경 쓰시면 좋겠습니다. 정기적인 건강검진도 권장드립니다.",
        highlights: ["스트레스 관리", "규칙적 운동", "충분한 휴식"],
      },
    ],
    advice: {
      title: "인생 조언",
      items: [
        "현재의 방향을 유지하되, 때로는 과감한 도전도 필요합니다",
        "건강 관리에 신경 쓰세요, 특히 하반기에 무리하지 마세요",
        "주변 사람들과의 관계를 소중히 여기세요",
        "새로운 기회가 왔을 때 망설이지 말고 도전하세요",
        "재정 관리는 보수적으로, 큰 투자는 신중하게 결정하세요",
      ],
    },
    luckyInfo: {
      color: "파란색, 녹색",
      number: "3, 8",
      direction: "동쪽",
      time: "오전 9시 ~ 11시",
    },
  };
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
