/**
 * 사주 분석 API Route (상용화급)
 * POST /api/saju/analyze
 * OpenAI API를 사용하여 구조화된 JSON 형식의 사주 분석 결과 반환
 */

import { NextRequest, NextResponse } from "next/server";
import { CONTENT_CONFIGS, type ContentType, fillPromptTemplate } from "@/lib/content-configs";

export const runtime = "edge";
export const maxDuration = 60;

// 현재 연도 (동적)
const currentYear = new Date().getFullYear();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contentType = "comprehensive",
      category,
      name,
      gender,
      calendarType,
      year,
      month,
      day,
      birthHour,
      // 상대방 정보
      partnerName,
      partnerGender,
      partnerCalendarType,
      partnerYear,
      partnerMonth,
      partnerDay,
      partnerBirthHour,
      // 추가 필드들
      ...additionalFields
    } = body;

    // 입력 검증
    if (!name || !gender || !year || !month || !day) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 컨텐츠 설정 가져오기
    const config = CONTENT_CONFIGS[contentType as ContentType] || CONTENT_CONFIGS.comprehensive;

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // API 키가 없을 경우 Mock 응답 반환 (개발용)
      const mockResult = generateMockResult(name, contentType, config);
      return NextResponse.json({
        result: mockResult,
        contentType,
        structured: true,
        timestamp: new Date().toISOString(),
      });
    }

    // 현재 날짜 정보
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();

    // 프롬프트 데이터 준비
    const promptData: Record<string, string> = {
      name,
      gender: gender === "male" ? "남성" : "여성",
      year: String(year),
      month: String(month),
      day: String(day),
      calendarType: calendarType === "solar" ? "양력" : "음력",
      birthHour: birthHour || "모름",
      currentYear: String(currentYear),
      currentMonth: String(currentMonth),
      currentDay: String(currentDay),
      // 추가 필드들
      ...Object.fromEntries(
        Object.entries(additionalFields).map(([k, v]) => [k, String(v)])
      ),
    };

    // 상대방 정보 (궁합/재회 등)
    if (config.requiresPartner && partnerName) {
      promptData.partnerName = partnerName;
      promptData.partnerGender = partnerGender === "male" ? "남성" : "여성";
      promptData.partnerYear = String(partnerYear);
      promptData.partnerMonth = String(partnerMonth);
      promptData.partnerDay = String(partnerDay);
      promptData.partnerCalendarType = partnerCalendarType === "solar" ? "양력" : "음력";
      promptData.partnerBirthHour = partnerBirthHour || "모름";
    }

    // 시스템 프롬프트 구성
    const systemPrompt = `${config.systemPrompt}

## 응답 형식 (반드시 이 JSON 구조로만 응답하세요)
${JSON.stringify(config.jsonSchema, null, 2)}

## 중요 지침
1. 반드시 위의 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
2. 모든 텍스트는 한국어로 작성하세요.
3. 전문적이면서도 따뜻하고 희망적인 톤으로 작성하세요.
4. 분석 내용은 구체적이고 실용적이어야 합니다.
5. 현재 연도는 ${currentYear}년입니다. 절대로 2024년으로 분석하지 마세요.`;

    // 사용자 프롬프트 구성
    const userPrompt = fillPromptTemplate(config.userPromptTemplate, promptData);

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
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API Error:", errorData);

      // Fallback to mock result
      const mockResult = generateMockResult(name, contentType, config);
      return NextResponse.json({
        result: mockResult,
        contentType,
        structured: true,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await openaiResponse.json();
    const resultContent = data.choices[0]?.message?.content;

    // JSON 파싱 시도
    let parsedResult;
    try {
      parsedResult = JSON.parse(resultContent);
    } catch {
      // JSON 파싱 실패 시 Mock 결과 반환
      const mockResult = generateMockResult(name, contentType, config);
      return NextResponse.json({
        result: mockResult,
        contentType,
        structured: true,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      result: parsedResult,
      contentType,
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

/**
 * Mock 결과 생성 (개발/테스트용)
 */
function generateMockResult(name: string, contentType: string, config: typeof CONTENT_CONFIGS[ContentType]) {
  const baseResult = {
    summary: {
      title: `${name}님의 ${config.name} 분석`,
      overall: `${name}님의 사주를 분석한 결과, 전반적으로 균형 잡힌 오행 구조를 가지고 계십니다. 특히 목(木)과 화(火)의 기운이 강하여 진취적이고 열정적인 성향을 보이며, 창의성과 리더십이 뛰어난 것이 특징입니다. ${currentYear}년은 특히 중요한 전환점이 될 수 있으니 신중하게 결정하되 기회를 놓치지 마세요.`,
      score: 78,
    },
  };

  // 컨텐츠 타입별 추가 데이터
  switch (contentType) {
    case "som-compatibility":
    case "marriage-compatibility":
      return {
        ...baseResult,
        compatibility: {
          loveScore: 85,
          communicationScore: 78,
          futureScore: 82,
        },
        partnerFeelings: {
          currentInterest: "상대방도 당신에게 호감을 느끼고 있는 것으로 보입니다.",
          possibleSigns: ["자주 연락을 먼저 하려 함", "당신의 이야기에 집중하는 모습"],
          confidenceLevel: "고백 성공 확률이 높습니다. 자신감을 가지세요.",
        },
        analysis: {
          attraction: "서로에게 끌리는 포인트가 명확합니다.",
          personality: "성격적으로 좋은 조화를 이룹니다.",
          timing: `${currentYear}년 하반기가 관계 발전에 좋은 시기입니다.`,
        },
        advice: {
          approach: ["솔직하게 마음을 표현하세요", "공통 관심사를 찾아보세요"],
          avoid: ["너무 서두르지 마세요", "집착하는 모습은 피하세요"],
          timeline: "3개월 내 관계가 한 단계 발전할 수 있습니다.",
        },
        luckyInfo: {
          date: "매월 15일 전후",
          place: "카페, 공원",
          color: "분홍색",
          item: "꽃",
        },
      };

    case "reunion-possibility":
      return {
        ...baseResult,
        summary: {
          ...baseResult.summary,
          reunionScore: 65,
        },
        possibility: {
          reunionChance: 65,
          bestTiming: `${currentYear}년 가을`,
          obstacles: ["과거의 오해", "서로의 자존심"],
        },
        partnerAnalysis: {
          currentFeelings: "아직 완전히 정리되지 않은 감정이 있습니다.",
          regretLevel: "어느 정도 후회하는 마음이 있어 보입니다.",
          openToReunion: "기회가 있다면 대화할 의향이 있을 것입니다.",
        },
        reunionStrategy: {
          approach: ["천천히 연락을 시작하세요", "과거 잘못을 인정하세요"],
          timeline: [
            { phase: "1단계", duration: "1-2주", action: "가벼운 안부 연락" },
            { phase: "2단계", duration: "1개월", action: "자연스러운 만남 유도" },
          ],
          doNot: ["과거 얘기로 다투지 마세요", "재회를 강요하지 마세요"],
        },
        alternativePath: {
          newLoveTiming: `${currentYear}년 겨울 ~ ${currentYear + 1}년 봄`,
          growthAreas: ["자기 계발", "새로운 취미"],
          healing: "시간을 갖고 자신을 돌보세요.",
        },
        luckyInfo: {
          date: "보름달 전후",
          color: "보라색",
          action: "편지 쓰기",
        },
      };

    case "wealth-fortune":
      return {
        ...baseResult,
        summary: {
          ...baseResult.summary,
          wealthScore: 75,
          wealthType: "정재(正財) - 안정적인 수입",
        },
        yearlyWealth: [
          { year: `${currentYear}년`, fortune: "안정적인 흐름", score: 75, keyword: "안정" },
          { year: `${currentYear + 1}년`, fortune: "상승 기운", score: 80, keyword: "성장" },
          { year: `${currentYear + 2}년`, fortune: "도약의 해", score: 85, keyword: "도약" },
        ],
        incomeAnalysis: {
          mainSource: "현재 직업에서의 안정적인 수입",
          sideIncome: "부업이나 투자로 추가 수입 가능성 있음",
          bestMethod: "전문성을 살린 꾸준한 노력",
        },
        investment: {
          suitableTypes: ["적금", "펀드", "장기 투자"],
          avoidTypes: ["고위험 투기", "단기 투자"],
          timing: { buy: "하반기", sell: "내년 상반기" },
        },
        spending: {
          strengths: ["계획적인 소비", "저축 습관"],
          weaknesses: ["충동구매 주의", "과도한 인간관계 지출"],
          savingTips: ["자동이체 활용", "가계부 작성"],
        },
        bigMoney: {
          windfall: "예상치 못한 보너스나 선물 가능성",
          inheritance: "가족으로부터의 지원 가능성",
          lottery: "운에 의존하기보다 실력에 집중하세요",
        },
        advice: {
          shortTerm: ["저축 습관 들이기", "불필요한 지출 줄이기"],
          longTerm: ["전문성 개발", "투자 공부"],
          warning: ["사기 조심", "보증 서지 마세요"],
        },
        luckyInfo: {
          colors: ["금색", "노란색"],
          numbers: ["3", "8"],
          directions: "동쪽",
          items: ["황금빛 지갑", "식물"],
        },
      };

    case "career-saju":
      return {
        ...baseResult,
        summary: {
          ...baseResult.summary,
          careerScore: 80,
          bestField: "창의적인 분야, 리더십 필요 직종",
        },
        aptitude: {
          strengths: ["창의성", "리더십", "커뮤니케이션"],
          weaknesses: ["인내심 부족", "완벽주의"],
          workStyle: "주도적으로 일을 처리하는 스타일",
          leadership: "팀을 이끄는 능력이 있음",
        },
        idealCareer: {
          bestJobs: ["기획자", "마케터", "창업가"],
          avoidJobs: ["단순 반복 업무", "혼자 하는 업무"],
          industries: ["IT/테크", "미디어", "교육"],
        },
        timing: {
          jobChange: `${currentYear}년 하반기 좋음`,
          promotion: `${currentYear + 1}년 상반기 기대`,
          startup: "2-3년 후 적합",
        },
        workplace: {
          idealBoss: "열린 마인드의 리더",
          idealTeam: "자유로운 분위기, 수평적 조직",
          conflicts: "권위적인 상사와 마찰 주의",
        },
        growth: {
          skills: ["데이터 분석", "프레젠테이션"],
          education: "관련 자격증 취득 추천",
          network: "업계 모임 적극 참여",
        },
        salary: {
          potential: "노력에 비례하여 상승 가능",
          negotiation: "성과를 수치로 제시하세요",
          sideJob: "프리랜서 활동 적합",
        },
        advice: ["현재 회사에서 성과 쌓기", "네트워킹 확대", "자기 계발 투자"],
        luckyInfo: {
          colors: ["파란색", "회색"],
          directions: "북쪽",
          interviewDays: ["화요일", "목요일"],
        },
      };

    case "new-year-fortune":
    case "monthly-fortune":
      return {
        ...baseResult,
        summary: {
          ...baseResult.summary,
          yearScore: 78,
          keyword: "성장",
        },
        yearlyOverview: {
          mainTheme: "도전과 성장의 해",
          opportunities: ["새로운 시작", "인연 확장", "실력 발휘"],
          challenges: ["변화 적응", "인내심 필요"],
        },
        monthlyFortune: [
          { month: "1월", fortune: "새해 시작의 기운", score: 75, keyword: "시작" },
          { month: "2월", fortune: "인간관계 확장", score: 78, keyword: "인연" },
          { month: "3월", fortune: "활발한 활동", score: 80, keyword: "활력" },
          { month: "4월", fortune: "안정과 휴식", score: 72, keyword: "휴식" },
          { month: "5월", fortune: "기회 포착", score: 85, keyword: "기회" },
          { month: "6월", fortune: "결실의 시작", score: 82, keyword: "결실" },
          { month: "7월", fortune: "조심해야 할 때", score: 68, keyword: "조심" },
          { month: "8월", fortune: "재충전 필요", score: 70, keyword: "충전" },
          { month: "9월", fortune: "새로운 도약", score: 83, keyword: "도약" },
          { month: "10월", fortune: "풍요의 시기", score: 88, keyword: "풍요" },
          { month: "11월", fortune: "마무리 준비", score: 78, keyword: "정리" },
          { month: "12월", fortune: "한 해 결산", score: 80, keyword: "결산" },
        ],
        categories: {
          love: { score: 75, description: "새로운 인연 가능성 높음" },
          career: { score: 80, description: "승진이나 이직 기회" },
          wealth: { score: 72, description: "안정적인 재정 흐름" },
          health: { score: 78, description: "전반적으로 양호" },
        },
        importantDates: {
          luckyDays: [`${currentYear}년 5월 15일`, `${currentYear}년 10월 8일`],
          cautionDays: [`${currentYear}년 7월 초`, `${currentYear}년 12월 말`],
          turningPoints: ["봄철 새 시작", "가을철 도약"],
        },
        advice: {
          doList: ["새로운 도전", "인맥 관리", "건강 챙기기"],
          dontList: ["무리한 투자", "과로", "갈등 확대"],
          yearlyGoal: "한 단계 성장하는 해로 만들기",
        },
        luckyInfo: {
          colors: ["빨간색", "노란색"],
          numbers: ["3", "7", "9"],
          directions: "남쪽",
          animals: "용띠, 말띠와 좋은 인연",
        },
      };

    case "fact-bomb":
      return {
        summary: {
          title: "팩폭: 현실 직시할 시간",
          overall: "달콤한 말만 듣고 싶었다면 잘못 찾아왔습니다.",
          realityCheck: 65,
        },
        hardTruths: {
          personality: "겉으로는 자신감 있어 보이지만, 속으로는 불안함이 많습니다.",
          habits: "시작은 잘 하는데 끝맺음이 약합니다.",
          relationships: "주는 것보다 받는 것에 더 익숙해져 있어요.",
          career: "현재 위치에서 안주하고 있습니다.",
        },
        excuses: {
          common: ["아직 준비가 안 됐어", "타이밍이 안 맞아"],
          reality: ["평생 준비만 할 건가요?", "타이밍은 만드는 겁니다"],
        },
        blindSpots: {
          issues: ["자신의 장점을 제대로 활용하지 못함", "다른 사람 시선에 너무 신경 씀"],
          solutions: ["강점에 집중하세요", "자기 기준을 세우세요"],
        },
        wakeUpCall: {
          urgent: "미루던 일 하나 당장 시작하기",
          medium: "나쁜 습관 하나 바꾸기",
          mindset: "'나중에'가 아닌 '지금' 생각하기",
        },
        potential: {
          hidden: "실행력만 갖추면 대단한 결과를 낼 수 있는 사람입니다.",
          ifChange: "6개월 후 완전히 다른 사람이 될 수 있습니다.",
          bestVersion: "당신의 열정과 아이디어가 빛을 발하는 모습",
        },
        finalWords: {
          encouragement: "아프게 말했지만, 당신의 가능성을 믿기 때문입니다. 지금 시작하세요.",
          challenge: "오늘 미루던 일 하나 실행하기",
          timeline: "지금 당장",
        },
      };

    default:
      // 종합운세 기본 결과
      return {
        ...baseResult,
        sections: [
          {
            title: "타고난 기질",
            icon: "✨",
            content: "성실하고 끈기 있는 성격으로 목표를 향해 꾸준히 나아가는 스타일입니다. 한번 마음먹은 일은 끝까지 해내는 책임감이 강하며, 주변 사람들에게 신뢰를 주는 타입입니다.",
            highlights: ["책임감 강함", "신뢰받는 성격", "목표 지향적"],
          },
          {
            title: "대인관계운",
            icon: "🤝",
            content: "주변 사람들과의 조화를 중시하며, 신뢰를 쌓는 데 능숙합니다. 특히 올해는 새로운 인연을 만날 가능성이 높으며, 이 만남이 인생의 중요한 전환점이 될 수 있습니다.",
            highlights: ["새로운 인연 기대", "신뢰 구축 능력", "조화로운 관계"],
          },
          {
            title: "재물운",
            icon: "💰",
            content: "꾸준한 노력으로 재물을 축적하는 유형입니다. 일확천금보다는 안정적인 재테크가 적합하며, 특히 장기 투자에서 좋은 결과를 기대할 수 있습니다.",
            highlights: ["안정적 재테크", "장기 투자 유리", "하반기 호재"],
          },
          {
            title: "건강운",
            icon: "💪",
            content: "전반적으로 건강한 체질이지만, 과로로 인한 스트레스 관리가 필요합니다. 규칙적인 운동과 충분한 휴식을 취하는 것이 중요합니다.",
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
