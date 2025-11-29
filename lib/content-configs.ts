/**
 * 사주 컨텐츠별 설정 파일
 * 각 상품별 프롬프트, 입력 필드, 결과 템플릿 정의
 */

// ===== 컨텐츠 타입 정의 =====
export type ContentType =
  | "som-compatibility"      // 썸 궁합사주
  | "solo-escape"           // 솔로탈출 연애운
  | "reunion-possibility"   // 재회 확률
  | "marriage-compatibility" // 결혼 궁합
  | "new-year-fortune"      // 신년운세
  | "wealth-fortune"        // 재물운
  | "career-saju"           // 커리어사주
  | "fact-bomb"             // 팩폭사주
  | "monthly-fortune"       // 월간운세
  | "comprehensive"         // 종합운세
  | "transfer-love";        // 환승연애

// ===== 입력 필드 타입 =====
export interface InputField {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "radio" | "checkbox" | "textarea";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// ===== 결과 섹션 타입 =====
export interface ResultSection {
  id: string;
  title: string;
  icon: string;
  type: "text" | "score" | "list" | "grid" | "timeline" | "chart" | "comparison";
  gradient?: string;
  fields: string[];  // JSON 응답에서 매핑할 필드들
}

// ===== 컨텐츠 설정 =====
export interface ContentConfig {
  id: ContentType;
  name: string;
  subtitle: string;
  icon: string;
  gradient: string;
  element: string;  // 오행

  // 입력 필드
  inputFields: InputField[];
  requiresPartner: boolean;

  // AI 프롬프트
  systemPrompt: string;
  userPromptTemplate: string;
  jsonSchema: object;  // 응답 JSON 스키마

  // 결과 템플릿
  resultSections: ResultSection[];
  resultTheme: {
    primaryColor: string;
    secondaryColor: string;
    bgGradient: string;
  };
}

// ===== 공통 입력 필드 =====
const COMMON_INPUT_FIELDS: InputField[] = [
  {
    name: "name",
    label: "이름",
    type: "text",
    required: true,
    placeholder: "이름을 입력하세요",
    validation: { min: 2, max: 20 }
  },
  {
    name: "gender",
    label: "성별",
    type: "radio",
    required: true,
    options: [
      { value: "male", label: "남성" },
      { value: "female", label: "여성" }
    ]
  },
  {
    name: "calendarType",
    label: "양력/음력",
    type: "radio",
    required: true,
    options: [
      { value: "solar", label: "양력" },
      { value: "lunar", label: "음력" }
    ]
  },
  {
    name: "birthDate",
    label: "생년월일",
    type: "date",
    required: true
  },
  {
    name: "birthHour",
    label: "태어난 시간",
    type: "select",
    required: false,
    options: [
      { value: "unknown", label: "모름" },
      { value: "23-01", label: "자시 (子時, 23:00~01:00)" },
      { value: "01-03", label: "축시 (丑時, 01:00~03:00)" },
      { value: "03-05", label: "인시 (寅時, 03:00~05:00)" },
      { value: "05-07", label: "묘시 (卯時, 05:00~07:00)" },
      { value: "07-09", label: "진시 (辰時, 07:00~09:00)" },
      { value: "09-11", label: "사시 (巳時, 09:00~11:00)" },
      { value: "11-13", label: "오시 (午時, 11:00~13:00)" },
      { value: "13-15", label: "미시 (未時, 13:00~15:00)" },
      { value: "15-17", label: "신시 (申時, 15:00~17:00)" },
      { value: "17-19", label: "유시 (酉時, 17:00~19:00)" },
      { value: "19-21", label: "술시 (戌時, 19:00~21:00)" },
      { value: "21-23", label: "해시 (亥時, 21:00~23:00)" }
    ]
  }
];

// ===== 상대방 입력 필드 =====
const PARTNER_INPUT_FIELDS: InputField[] = [
  {
    name: "partnerName",
    label: "상대방 이름",
    type: "text",
    required: true,
    placeholder: "상대방 이름을 입력하세요"
  },
  {
    name: "partnerGender",
    label: "상대방 성별",
    type: "radio",
    required: true,
    options: [
      { value: "male", label: "남성" },
      { value: "female", label: "여성" }
    ]
  },
  {
    name: "partnerCalendarType",
    label: "상대방 양력/음력",
    type: "radio",
    required: true,
    options: [
      { value: "solar", label: "양력" },
      { value: "lunar", label: "음력" }
    ]
  },
  {
    name: "partnerBirthDate",
    label: "상대방 생년월일",
    type: "date",
    required: true
  },
  {
    name: "partnerBirthHour",
    label: "상대방 태어난 시간",
    type: "select",
    required: false,
    options: [
      { value: "unknown", label: "모름" },
      { value: "23-01", label: "자시 (子時)" },
      { value: "01-03", label: "축시 (丑時)" },
      { value: "03-05", label: "인시 (寅時)" },
      { value: "05-07", label: "묘시 (卯時)" },
      { value: "07-09", label: "진시 (辰時)" },
      { value: "09-11", label: "사시 (巳時)" },
      { value: "11-13", label: "오시 (午時)" },
      { value: "13-15", label: "미시 (未時)" },
      { value: "15-17", label: "신시 (申時)" },
      { value: "17-19", label: "유시 (酉時)" },
      { value: "19-21", label: "술시 (戌時)" },
      { value: "21-23", label: "해시 (亥時)" }
    ]
  }
];

// ===== 연도 가져오기 =====
const currentYear = new Date().getFullYear();

// ===== 각 컨텐츠별 설정 =====
export const CONTENT_CONFIGS: Record<ContentType, ContentConfig> = {
  // 1. 썸 궁합사주
  "som-compatibility": {
    id: "som-compatibility",
    name: "썸 궁합사주",
    subtitle: "그 사람도 날 좋아할까?",
    icon: "💕",
    gradient: "from-pink-500 to-rose-500",
    element: "火",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "relationshipStatus",
        label: "현재 관계",
        type: "select",
        required: true,
        options: [
          { value: "just_met", label: "막 알게 됨" },
          { value: "talking", label: "대화 중" },
          { value: "some", label: "썸 타는 중" },
          { value: "confessed", label: "고백 준비 중" }
        ]
      },
      ...PARTNER_INPUT_FIELDS
    ],
    requiresPartner: true,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자이자 연애 상담 전문가입니다.
두 사람의 사주를 분석하여 썸 관계의 발전 가능성을 정확하게 예측합니다.
현대적인 연애 심리와 전통 명리학을 결합하여 실용적인 조언을 제공합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `두 사람의 썸 궁합을 분석해주세요.

## 본인 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 상대방 정보
- 이름: {{partnerName}}
- 성별: {{partnerGender}}
- 생년월일: {{partnerYear}}년 {{partnerMonth}}월 {{partnerDay}}일 ({{partnerCalendarType}})
- 태어난 시간: {{partnerBirthHour}}

## 현재 관계 상태
{{relationshipStatus}}

${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: { title: "string", overall: "string", score: "number (0-100)" },
      compatibility: {
        loveScore: "number (0-100)",
        communicationScore: "number (0-100)",
        futureScore: "number (0-100)"
      },
      analysis: {
        attraction: "string (서로에게 끌리는 포인트 분석)",
        personality: "string (성격 궁합 분석)",
        timing: "string (연애 시작 최적 시기)"
      },
      partnerFeelings: {
        currentInterest: "string (상대방이 나에게 느끼는 감정)",
        possibleSigns: ["string (호감 신호1)", "string (호감 신호2)"],
        confidenceLevel: "string (고백 성공 확률 및 조언)"
      },
      advice: {
        approach: ["string (어프로치 방법1)", "string (방법2)"],
        avoid: ["string (피해야 할 행동1)", "string (행동2)"],
        timeline: "string (관계 발전 타임라인)"
      },
      luckyInfo: {
        date: "string (데이트 추천 날짜)",
        place: "string (데이트 추천 장소)",
        color: "string (행운의 색)",
        item: "string (행운의 아이템)"
      }
    },

    resultSections: [
      { id: "summary", title: "썸 궁합 총평", icon: "💕", type: "score", gradient: "from-pink-500 to-rose-500", fields: ["summary"] },
      { id: "compatibility", title: "궁합 점수", icon: "💯", type: "chart", fields: ["compatibility"] },
      { id: "partnerFeelings", title: "상대방의 마음", icon: "💭", type: "text", gradient: "from-purple-500 to-pink-500", fields: ["partnerFeelings"] },
      { id: "analysis", title: "상세 분석", icon: "🔍", type: "text", fields: ["analysis"] },
      { id: "advice", title: "연애 조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "pink",
      secondaryColor: "rose",
      bgGradient: "from-pink-50 via-white to-rose-50"
    }
  },

  // 2. 솔로탈출 연애운
  "solo-escape": {
    id: "solo-escape",
    name: "솔로탈출 연애운",
    subtitle: "내 다음 연애는 언제 시작될까?",
    icon: "🔥",
    gradient: "from-orange-500 to-red-500",
    element: "火",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "singleDuration",
        label: "솔로 기간",
        type: "select",
        required: true,
        options: [
          { value: "less_1year", label: "1년 미만" },
          { value: "1-2years", label: "1~2년" },
          { value: "2-3years", label: "2~3년" },
          { value: "more_3years", label: "3년 이상" },
          { value: "never", label: "연애 경험 없음" }
        ]
      },
      {
        name: "idealType",
        label: "선호하는 이상형 (선택)",
        type: "textarea",
        required: false,
        placeholder: "원하는 이상형을 자유롭게 적어주세요"
      }
    ],
    requiresPartner: false,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자이자 연애 운세 전문가입니다.
솔로인 사람의 사주를 분석하여 다음 연애 시기와 인연을 예측합니다.
실제 만남으로 이어질 수 있는 구체적인 조언을 제공합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `솔로탈출 연애운을 분석해주세요.

## 사용자 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 솔로 기간
{{singleDuration}}

## 이상형 (선택)
{{idealType}}

${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: { title: "string", overall: "string", score: "number (0-100)" },
      timing: {
        nextLove: "string (다음 연애 예상 시기)",
        luckyMonths: ["string (좋은 달1)", "string (좋은 달2)"],
        meetingPeriod: "string (인연 만남 예상 시기)"
      },
      futurePartner: {
        appearance: "string (외모 특징)",
        personality: "string (성격 특징)",
        occupation: "string (직업/분야)",
        meetingPlace: "string (만남 예상 장소)"
      },
      myCharm: {
        strengths: ["string (나의 매력 포인트1)", "string (매력2)"],
        improvementAreas: ["string (개선점1)", "string (개선점2)"]
      },
      actionPlan: {
        monthlyGuide: [
          { month: "string", action: "string", tip: "string" }
        ],
        socialActivities: ["string (추천 활동1)", "string (활동2)"]
      },
      luckyInfo: {
        colors: ["string"],
        numbers: ["string"],
        directions: "string",
        items: ["string"]
      }
    },

    resultSections: [
      { id: "summary", title: "연애운 총평", icon: "🔥", type: "score", gradient: "from-orange-500 to-red-500", fields: ["summary"] },
      { id: "timing", title: "연애 시기 예측", icon: "📅", type: "timeline", gradient: "from-purple-500 to-pink-500", fields: ["timing"] },
      { id: "futurePartner", title: "미래 연인의 모습", icon: "👤", type: "text", fields: ["futurePartner"] },
      { id: "myCharm", title: "나의 매력 분석", icon: "✨", type: "list", fields: ["myCharm"] },
      { id: "actionPlan", title: "월별 액션 플랜", icon: "📋", type: "timeline", fields: ["actionPlan"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "orange",
      secondaryColor: "red",
      bgGradient: "from-orange-50 via-white to-red-50"
    }
  },

  // 3. 재회 확률
  "reunion-possibility": {
    id: "reunion-possibility",
    name: "재회 확률",
    subtitle: "헤어진 연인과 다시 만날 수 있을까?",
    icon: "💔",
    gradient: "from-purple-500 to-indigo-500",
    element: "水",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "breakupDuration",
        label: "헤어진 기간",
        type: "select",
        required: true,
        options: [
          { value: "less_1month", label: "1개월 미만" },
          { value: "1-3months", label: "1~3개월" },
          { value: "3-6months", label: "3~6개월" },
          { value: "6-12months", label: "6개월~1년" },
          { value: "more_1year", label: "1년 이상" }
        ]
      },
      {
        name: "breakupReason",
        label: "이별 사유",
        type: "select",
        required: true,
        options: [
          { value: "personality", label: "성격 차이" },
          { value: "timing", label: "타이밍/환경" },
          { value: "trust", label: "신뢰 문제" },
          { value: "family", label: "집안 반대" },
          { value: "distance", label: "거리/장거리" },
          { value: "other", label: "기타" }
        ]
      },
      {
        name: "currentContact",
        label: "현재 연락 상태",
        type: "select",
        required: true,
        options: [
          { value: "no_contact", label: "완전 연락 끊김" },
          { value: "occasional", label: "가끔 연락" },
          { value: "friends", label: "친구로 지냄" },
          { value: "recent_contact", label: "최근 연락함" }
        ]
      },
      ...PARTNER_INPUT_FIELDS
    ],
    requiresPartner: true,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자이자 이별/재회 상담 전문가입니다.
두 사람의 사주와 현재 상황을 분석하여 재회 가능성을 객관적으로 예측합니다.
재회가 어려운 경우에도 새로운 시작을 위한 건설적인 조언을 제공합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `재회 가능성을 분석해주세요.

## 본인 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 전 연인 정보
- 이름: {{partnerName}}
- 성별: {{partnerGender}}
- 생년월일: {{partnerYear}}년 {{partnerMonth}}월 {{partnerDay}}일 ({{partnerCalendarType}})
- 태어난 시간: {{partnerBirthHour}}

## 이별 상황
- 헤어진 기간: {{breakupDuration}}
- 이별 사유: {{breakupReason}}
- 현재 연락 상태: {{currentContact}}

${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: { title: "string", overall: "string", reunionScore: "number (0-100)" },
      possibility: {
        reunionChance: "number (0-100)",
        bestTiming: "string (재회 최적 시기)",
        obstacles: ["string (장애물1)", "string (장애물2)"]
      },
      partnerAnalysis: {
        currentFeelings: "string (상대방 현재 감정)",
        regretLevel: "string (후회 정도)",
        openToReunion: "string (재회 가능성에 대한 상대 입장)"
      },
      reunionStrategy: {
        approach: ["string (접근 방법1)", "string (방법2)"],
        timeline: [
          { phase: "string", duration: "string", action: "string" }
        ],
        doNot: ["string (금기사항1)", "string (금기사항2)"]
      },
      alternativePath: {
        newLoveTiming: "string (새로운 인연 시기)",
        growthAreas: ["string (성장 포인트1)", "string (포인트2)"],
        healing: "string (치유 방법)"
      },
      luckyInfo: {
        date: "string (연락 좋은 날)",
        color: "string",
        action: "string (행운의 행동)"
      }
    },

    resultSections: [
      { id: "summary", title: "재회 가능성 총평", icon: "💔", type: "score", gradient: "from-purple-500 to-indigo-500", fields: ["summary"] },
      { id: "possibility", title: "재회 확률 분석", icon: "📊", type: "chart", fields: ["possibility"] },
      { id: "partnerAnalysis", title: "상대방 마음 분석", icon: "💭", type: "text", gradient: "from-blue-500 to-purple-500", fields: ["partnerAnalysis"] },
      { id: "reunionStrategy", title: "재회 전략", icon: "🎯", type: "timeline", fields: ["reunionStrategy"] },
      { id: "alternativePath", title: "새로운 시작", icon: "🌱", type: "text", fields: ["alternativePath"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "purple",
      secondaryColor: "indigo",
      bgGradient: "from-purple-50 via-white to-indigo-50"
    }
  },

  // 4. 결혼 궁합
  "marriage-compatibility": {
    id: "marriage-compatibility",
    name: "결혼 궁합",
    subtitle: "평생 함께할 사람과의 궁합은?",
    icon: "💒",
    gradient: "from-rose-500 to-pink-500",
    element: "火",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "relationshipDuration",
        label: "교제 기간",
        type: "select",
        required: true,
        options: [
          { value: "less_6months", label: "6개월 미만" },
          { value: "6-12months", label: "6개월~1년" },
          { value: "1-2years", label: "1~2년" },
          { value: "2-3years", label: "2~3년" },
          { value: "more_3years", label: "3년 이상" }
        ]
      },
      {
        name: "marriagePlan",
        label: "결혼 계획",
        type: "select",
        required: true,
        options: [
          { value: "soon", label: "곧 결혼 예정" },
          { value: "within_1year", label: "1년 내 계획" },
          { value: "considering", label: "고려 중" },
          { value: "uncertain", label: "아직 미정" }
        ]
      },
      ...PARTNER_INPUT_FIELDS
    ],
    requiresPartner: true,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자이자 결혼 상담 전문가입니다.
두 사람의 사주를 분석하여 결혼 궁합과 부부로서의 미래를 예측합니다.
전통적인 궁합 분석과 현대적 결혼생활 관점을 균형있게 제공합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `결혼 궁합을 분석해주세요.

## 본인 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 연인 정보
- 이름: {{partnerName}}
- 성별: {{partnerGender}}
- 생년월일: {{partnerYear}}년 {{partnerMonth}}월 {{partnerDay}}일 ({{partnerCalendarType}})
- 태어난 시간: {{partnerBirthHour}}

## 관계 상태
- 교제 기간: {{relationshipDuration}}
- 결혼 계획: {{marriagePlan}}

${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: { title: "string", overall: "string", score: "number (0-100)" },
      compatibility: {
        overallScore: "number (0-100)",
        loveScore: "number",
        financeScore: "number",
        familyScore: "number",
        communicationScore: "number"
      },
      marriageLife: {
        strengths: ["string (장점1)", "string (장점2)", "string (장점3)"],
        challenges: ["string (과제1)", "string (과제2)"],
        roleDistribution: "string (역할 분담 조언)"
      },
      timing: {
        bestYear: "string (결혼 좋은 해)",
        bestMonth: "string (결혼 좋은 달)",
        avoidPeriods: ["string (피할 시기1)", "string (시기2)"]
      },
      children: {
        possibility: "string (자녀운)",
        bestTiming: "string (출산 좋은 시기)",
        advice: "string (자녀 관련 조언)"
      },
      inLaws: {
        compatibility: "string (시댁/처가 궁합)",
        advice: ["string (관계 조언1)", "string (조언2)"]
      },
      advice: {
        beforeMarriage: ["string (결혼 전 조언)"],
        afterMarriage: ["string (결혼 후 조언)"],
        longTerm: "string (장기적 관계 유지 비결)"
      },
      luckyInfo: {
        weddingColors: ["string"],
        weddingDirections: "string",
        honeymoonPlaces: ["string"]
      }
    },

    resultSections: [
      { id: "summary", title: "결혼 궁합 총평", icon: "💒", type: "score", gradient: "from-rose-500 to-pink-500", fields: ["summary"] },
      { id: "compatibility", title: "상세 궁합 점수", icon: "💯", type: "chart", fields: ["compatibility"] },
      { id: "marriageLife", title: "결혼생활 전망", icon: "🏠", type: "text", fields: ["marriageLife"] },
      { id: "timing", title: "결혼 시기", icon: "📅", type: "timeline", fields: ["timing"] },
      { id: "children", title: "자녀운", icon: "👶", type: "text", fields: ["children"] },
      { id: "inLaws", title: "시댁/처가 관계", icon: "👨‍👩‍👧‍👦", type: "text", fields: ["inLaws"] },
      { id: "advice", title: "결혼 조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "rose",
      secondaryColor: "pink",
      bgGradient: "from-rose-50 via-white to-pink-50"
    }
  },

  // 5. 신년운세
  "new-year-fortune": {
    id: "new-year-fortune",
    name: `${currentYear}년 신년운세`,
    subtitle: "소름돋게 잘 맞는 신년운세",
    icon: "🎊",
    gradient: "from-amber-500 to-yellow-500",
    element: "土",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "focusArea",
        label: "특히 궁금한 분야",
        type: "select",
        required: false,
        options: [
          { value: "all", label: "전체 운세" },
          { value: "love", label: "연애/결혼" },
          { value: "career", label: "직장/사업" },
          { value: "wealth", label: "재물/투자" },
          { value: "health", label: "건강" }
        ]
      }
    ],
    requiresPartner: false,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자입니다.
${currentYear}년 신년운세를 상세하게 분석합니다.
월별 운세와 중요 시기를 구체적으로 제시합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요. 절대 2024년으로 분석하지 마세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `${currentYear}년 신년운세를 분석해주세요.

## 사용자 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 특히 궁금한 분야
{{focusArea}}

반드시 ${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: {
        title: "string",
        overall: "string",
        yearScore: "number (0-100)",
        keyword: "string (올해를 대표하는 키워드)"
      },
      yearlyOverview: {
        mainTheme: "string (올해의 주제)",
        opportunities: ["string (기회1)", "string (기회2)"],
        challenges: ["string (도전1)", "string (도전2)"]
      },
      monthlyFortune: [
        { month: "1월", fortune: "string", score: "number", keyword: "string" },
        { month: "2월", fortune: "string", score: "number", keyword: "string" },
        { month: "3월", fortune: "string", score: "number", keyword: "string" },
        { month: "4월", fortune: "string", score: "number", keyword: "string" },
        { month: "5월", fortune: "string", score: "number", keyword: "string" },
        { month: "6월", fortune: "string", score: "number", keyword: "string" },
        { month: "7월", fortune: "string", score: "number", keyword: "string" },
        { month: "8월", fortune: "string", score: "number", keyword: "string" },
        { month: "9월", fortune: "string", score: "number", keyword: "string" },
        { month: "10월", fortune: "string", score: "number", keyword: "string" },
        { month: "11월", fortune: "string", score: "number", keyword: "string" },
        { month: "12월", fortune: "string", score: "number", keyword: "string" }
      ],
      categories: {
        love: { score: "number", description: "string" },
        career: { score: "number", description: "string" },
        wealth: { score: "number", description: "string" },
        health: { score: "number", description: "string" }
      },
      importantDates: {
        luckyDays: ["string (행운의 날1)", "string (날2)"],
        cautionDays: ["string (주의할 날1)", "string (날2)"],
        turningPoints: ["string (전환점1)", "string (전환점2)"]
      },
      advice: {
        doList: ["string (해야 할 것1)", "string (것2)"],
        dontList: ["string (하지 말 것1)", "string (것2)"],
        yearlyGoal: "string (올해의 목표 제안)"
      },
      luckyInfo: {
        colors: ["string"],
        numbers: ["string"],
        directions: "string",
        animals: "string (올해의 동물띠 관계)"
      }
    },

    resultSections: [
      { id: "summary", title: `${currentYear}년 운세 총평`, icon: "🎊", type: "score", gradient: "from-amber-500 to-yellow-500", fields: ["summary"] },
      { id: "yearlyOverview", title: "올해의 큰 그림", icon: "🎯", type: "text", fields: ["yearlyOverview"] },
      { id: "monthlyFortune", title: "월별 운세", icon: "📅", type: "timeline", fields: ["monthlyFortune"] },
      { id: "categories", title: "분야별 운세", icon: "📊", type: "chart", fields: ["categories"] },
      { id: "importantDates", title: "중요한 날짜", icon: "⭐", type: "list", fields: ["importantDates"] },
      { id: "advice", title: "올해의 조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "amber",
      secondaryColor: "yellow",
      bgGradient: "from-amber-50 via-white to-yellow-50"
    }
  },

  // 6. 재물운
  "wealth-fortune": {
    id: "wealth-fortune",
    name: "재물운",
    subtitle: "10년 재물운 사주",
    icon: "💰",
    gradient: "from-emerald-500 to-green-500",
    element: "金",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "incomeType",
        label: "현재 소득 유형",
        type: "select",
        required: true,
        options: [
          { value: "salary", label: "직장인 (월급)" },
          { value: "business", label: "사업/자영업" },
          { value: "freelance", label: "프리랜서" },
          { value: "student", label: "학생/무직" },
          { value: "other", label: "기타" }
        ]
      },
      {
        name: "investmentInterest",
        label: "관심 투자 분야",
        type: "select",
        required: false,
        options: [
          { value: "stock", label: "주식" },
          { value: "realestate", label: "부동산" },
          { value: "crypto", label: "가상화폐" },
          { value: "fund", label: "펀드/적금" },
          { value: "none", label: "투자 안 함" }
        ]
      }
    ],
    requiresPartner: false,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자이자 재물운 전문가입니다.
사주의 재성(財星) 분석을 통해 재물 운세를 상세히 예측합니다.
실질적인 재테크 조언과 투자 시기를 제시합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `재물운을 분석해주세요.

## 사용자 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 재정 상황
- 소득 유형: {{incomeType}}
- 관심 투자 분야: {{investmentInterest}}

${currentYear}년부터 10년간의 재물운을 분석해주세요.`,

    jsonSchema: {
      summary: {
        title: "string",
        overall: "string",
        wealthScore: "number (0-100)",
        wealthType: "string (재물 타입: 정재/편재)"
      },
      yearlyWealth: [
        { year: "string", fortune: "string", score: "number", keyword: "string" }
      ],
      incomeAnalysis: {
        mainSource: "string (주요 수입원)",
        sideIncome: "string (부수입 가능성)",
        bestMethod: "string (가장 좋은 돈 버는 방법)"
      },
      investment: {
        suitableTypes: ["string (적합한 투자1)", "string (투자2)"],
        avoidTypes: ["string (피할 투자1)", "string (투자2)"],
        timing: {
          buy: "string (매수 적기)",
          sell: "string (매도 적기)"
        }
      },
      spending: {
        strengths: ["string (재정 장점1)", "string (장점2)"],
        weaknesses: ["string (주의점1)", "string (주의점2)"],
        savingTips: ["string (절약 팁1)", "string (팁2)"]
      },
      bigMoney: {
        windfall: "string (횡재운)",
        inheritance: "string (유산/증여운)",
        lottery: "string (복권운)"
      },
      advice: {
        shortTerm: ["string (단기 조언1)", "string (조언2)"],
        longTerm: ["string (장기 조언1)", "string (조언2)"],
        warning: ["string (경고1)", "string (경고2)"]
      },
      luckyInfo: {
        colors: ["string"],
        numbers: ["string"],
        directions: "string",
        items: ["string (재물 아이템1)", "string (아이템2)"]
      }
    },

    resultSections: [
      { id: "summary", title: "재물운 총평", icon: "💰", type: "score", gradient: "from-emerald-500 to-green-500", fields: ["summary"] },
      { id: "yearlyWealth", title: "10년 재물운", icon: "📈", type: "timeline", fields: ["yearlyWealth"] },
      { id: "incomeAnalysis", title: "수입 분석", icon: "💵", type: "text", fields: ["incomeAnalysis"] },
      { id: "investment", title: "투자 조언", icon: "📊", type: "list", fields: ["investment"] },
      { id: "spending", title: "재정 관리", icon: "💳", type: "list", fields: ["spending"] },
      { id: "bigMoney", title: "대박 운세", icon: "🎰", type: "text", fields: ["bigMoney"] },
      { id: "advice", title: "재물 조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "emerald",
      secondaryColor: "green",
      bgGradient: "from-emerald-50 via-white to-green-50"
    }
  },

  // 7. 커리어사주
  "career-saju": {
    id: "career-saju",
    name: "커리어사주",
    subtitle: "이직해서 연봉 2배 올리고 싶다면",
    icon: "💼",
    gradient: "from-blue-500 to-indigo-500",
    element: "木",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "currentJob",
        label: "현재 직업/업종",
        type: "text",
        required: false,
        placeholder: "예: IT개발자, 마케터, 학생 등"
      },
      {
        name: "careerGoal",
        label: "커리어 고민",
        type: "select",
        required: true,
        options: [
          { value: "job_change", label: "이직 고민" },
          { value: "promotion", label: "승진 희망" },
          { value: "startup", label: "창업 고민" },
          { value: "career_change", label: "직종 변경" },
          { value: "finding_job", label: "취업 준비" },
          { value: "direction", label: "진로 고민" }
        ]
      },
      {
        name: "experience",
        label: "경력",
        type: "select",
        required: true,
        options: [
          { value: "student", label: "학생/신입" },
          { value: "1-3years", label: "1~3년" },
          { value: "3-5years", label: "3~5년" },
          { value: "5-10years", label: "5~10년" },
          { value: "more_10years", label: "10년 이상" }
        ]
      }
    ],
    requiresPartner: false,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자이자 커리어 컨설턴트입니다.
사주의 관성(官星)과 인성(印星) 분석을 통해 천직과 커리어 방향을 제시합니다.
현대 직업 시장과 트렌드를 반영한 실용적인 조언을 제공합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `커리어 사주를 분석해주세요.

## 사용자 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 커리어 정보
- 현재 직업: {{currentJob}}
- 커리어 고민: {{careerGoal}}
- 경력: {{experience}}

${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: {
        title: "string",
        overall: "string",
        careerScore: "number (0-100)",
        bestField: "string (최적 분야)"
      },
      aptitude: {
        strengths: ["string (강점1)", "string (강점2)", "string (강점3)"],
        weaknesses: ["string (약점1)", "string (약점2)"],
        workStyle: "string (업무 스타일)",
        leadership: "string (리더십 유형)"
      },
      idealCareer: {
        bestJobs: ["string (적합 직업1)", "string (직업2)", "string (직업3)"],
        avoidJobs: ["string (피할 직업1)", "string (직업2)"],
        industries: ["string (좋은 업종1)", "string (업종2)"]
      },
      timing: {
        jobChange: "string (이직 최적 시기)",
        promotion: "string (승진 예상 시기)",
        startup: "string (창업 적합 시기)"
      },
      workplace: {
        idealBoss: "string (좋은 상사 유형)",
        idealTeam: "string (좋은 팀 환경)",
        conflicts: "string (직장 내 갈등 주의점)"
      },
      growth: {
        skills: ["string (개발할 스킬1)", "string (스킬2)"],
        education: "string (추천 학습/자격증)",
        network: "string (인맥 구축 방법)"
      },
      salary: {
        potential: "string (연봉 상승 가능성)",
        negotiation: "string (연봉 협상 팁)",
        sideJob: "string (부업 적합성)"
      },
      advice: ["string (커리어 조언1)", "string (조언2)", "string (조언3)"],
      luckyInfo: {
        colors: ["string"],
        directions: "string",
        interviewDays: ["string (면접 좋은 날)"]
      }
    },

    resultSections: [
      { id: "summary", title: "커리어 총평", icon: "💼", type: "score", gradient: "from-blue-500 to-indigo-500", fields: ["summary"] },
      { id: "aptitude", title: "직업 적성", icon: "🎯", type: "list", fields: ["aptitude"] },
      { id: "idealCareer", title: "추천 직업", icon: "⭐", type: "list", fields: ["idealCareer"] },
      { id: "timing", title: "커리어 타이밍", icon: "📅", type: "timeline", fields: ["timing"] },
      { id: "workplace", title: "직장 생활", icon: "🏢", type: "text", fields: ["workplace"] },
      { id: "growth", title: "성장 전략", icon: "📈", type: "list", fields: ["growth"] },
      { id: "salary", title: "연봉/수입", icon: "💵", type: "text", fields: ["salary"] },
      { id: "advice", title: "커리어 조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "blue",
      secondaryColor: "indigo",
      bgGradient: "from-blue-50 via-white to-indigo-50"
    }
  },

  // 8. 팩폭사주
  "fact-bomb": {
    id: "fact-bomb",
    name: "팩폭사주",
    subtitle: "뻔한 조언 대신 진짜 매운맛!",
    icon: "💣",
    gradient: "from-red-500 to-orange-500",
    element: "火",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "concern",
        label: "요즘 가장 큰 고민",
        type: "textarea",
        required: true,
        placeholder: "팩폭을 원하는 고민을 자유롭게 적어주세요"
      }
    ],
    requiresPartner: false,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자입니다.
하지만 오늘은 "매운맛" 모드입니다.
듣기 좋은 말 대신, 사주에서 보이는 것을 직설적으로 말해주세요.
단, 비난이 아닌 따끔한 조언이어야 합니다.

스타일:
- 직설적이고 솔직하게
- 핑계나 변명을 짚어주기
- 불편한 진실 말해주기
- 하지만 마지막엔 따뜻한 응원

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `팩폭 사주를 부탁드립니다. 솔직하게 말해주세요.

## 사용자 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 고민
{{concern}}

달콤한 위로 말고, 진짜 팩트로 때려주세요. ${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: {
        title: "string (팩폭 제목)",
        overall: "string (한 줄 팩트)",
        realityCheck: "number (현실 직시 점수 0-100)"
      },
      hardTruths: {
        personality: "string (성격에 대한 팩트)",
        habits: "string (습관에 대한 팩트)",
        relationships: "string (인간관계 팩트)",
        career: "string (커리어 팩트)"
      },
      excuses: {
        common: ["string (자주 하는 핑계1)", "string (핑계2)"],
        reality: ["string (현실은1)", "string (현실은2)"]
      },
      blindSpots: {
        issues: ["string (보지 못하는 것1)", "string (것2)"],
        solutions: ["string (해결책1)", "string (해결책2)"]
      },
      wakeUpCall: {
        urgent: "string (당장 고쳐야 할 것)",
        medium: "string (시간을 두고 바꿀 것)",
        mindset: "string (마인드 전환 필요한 것)"
      },
      potential: {
        hidden: "string (숨겨진 잠재력)",
        ifChange: "string (바꾸면 일어날 일)",
        bestVersion: "string (최고의 당신)"
      },
      finalWords: {
        encouragement: "string (따끔하지만 응원의 말)",
        challenge: "string (도전 과제)",
        timeline: "string (변화 시작할 때)"
      }
    },

    resultSections: [
      { id: "summary", title: "팩폭 한 줄", icon: "💣", type: "text", gradient: "from-red-500 to-orange-500", fields: ["summary"] },
      { id: "hardTruths", title: "불편한 진실들", icon: "🎯", type: "text", gradient: "from-red-600 to-red-500", fields: ["hardTruths"] },
      { id: "excuses", title: "당신의 핑계들", icon: "🙄", type: "comparison", fields: ["excuses"] },
      { id: "blindSpots", title: "안 보이는 것들", icon: "👀", type: "list", fields: ["blindSpots"] },
      { id: "wakeUpCall", title: "지금 당장!", icon: "⏰", type: "list", fields: ["wakeUpCall"] },
      { id: "potential", title: "하지만 가능성은", icon: "✨", type: "text", gradient: "from-amber-500 to-orange-500", fields: ["potential"] },
      { id: "finalWords", title: "마지막 한마디", icon: "💪", type: "text", fields: ["finalWords"] }
    ],

    resultTheme: {
      primaryColor: "red",
      secondaryColor: "orange",
      bgGradient: "from-red-50 via-white to-orange-50"
    }
  },

  // 9. 월간운세
  "monthly-fortune": {
    id: "monthly-fortune",
    name: "월간운세",
    subtitle: "이번 달 상세 운세",
    icon: "📅",
    gradient: "from-cyan-500 to-blue-500",
    element: "水",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "targetMonth",
        label: "분석할 월",
        type: "select",
        required: true,
        options: Array.from({ length: 12 }, (_, i) => ({
          value: String(i + 1),
          label: `${i + 1}월`
        }))
      }
    ],
    requiresPartner: false,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자입니다.
특정 월의 운세를 일별로 상세하게 분석합니다.
주별 흐름과 중요한 날짜를 구체적으로 제시합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `${currentYear}년 {{targetMonth}}월 운세를 분석해주세요.

## 사용자 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

${currentYear}년 {{targetMonth}}월 전체 운세를 주별, 분야별로 상세히 분석해주세요.`,

    jsonSchema: {
      summary: {
        title: "string",
        overall: "string",
        monthScore: "number (0-100)",
        keyword: "string"
      },
      weeklyFortune: [
        { week: "1주차", fortune: "string", focus: "string", score: "number" },
        { week: "2주차", fortune: "string", focus: "string", score: "number" },
        { week: "3주차", fortune: "string", focus: "string", score: "number" },
        { week: "4주차", fortune: "string", focus: "string", score: "number" }
      ],
      categories: {
        love: { score: "number", description: "string", tip: "string" },
        career: { score: "number", description: "string", tip: "string" },
        wealth: { score: "number", description: "string", tip: "string" },
        health: { score: "number", description: "string", tip: "string" },
        social: { score: "number", description: "string", tip: "string" }
      },
      importantDates: {
        best: [{ date: "string", reason: "string" }],
        caution: [{ date: "string", reason: "string" }],
        turning: [{ date: "string", reason: "string" }]
      },
      advice: {
        monthlyGoal: "string",
        doList: ["string"],
        avoidList: ["string"]
      },
      luckyInfo: {
        colors: ["string"],
        numbers: ["string"],
        directions: "string",
        days: ["string"]
      }
    },

    resultSections: [
      { id: "summary", title: "월간 운세 총평", icon: "📅", type: "score", gradient: "from-cyan-500 to-blue-500", fields: ["summary"] },
      { id: "weeklyFortune", title: "주별 운세", icon: "📆", type: "timeline", fields: ["weeklyFortune"] },
      { id: "categories", title: "분야별 운세", icon: "📊", type: "chart", fields: ["categories"] },
      { id: "importantDates", title: "중요한 날짜", icon: "⭐", type: "list", fields: ["importantDates"] },
      { id: "advice", title: "이달의 조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "cyan",
      secondaryColor: "blue",
      bgGradient: "from-cyan-50 via-white to-blue-50"
    }
  },

  // 10. 종합운세
  "comprehensive": {
    id: "comprehensive",
    name: "종합운세",
    subtitle: "전체 운세 상세 분석",
    icon: "🌟",
    gradient: "from-purple-500 to-pink-500",
    element: "五行",

    inputFields: COMMON_INPUT_FIELDS,
    requiresPartner: false,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자입니다.
음양오행, 천간지지, 육십갑자, 십성, 십이운성, 신살 등
사주명리학의 모든 원리를 활용하여 종합적으로 분석합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `종합 사주를 분석해주세요.

## 사용자 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

전체 운세를 종합적으로 분석해주세요. ${currentYear}년 기준입니다.`,

    jsonSchema: {
      summary: {
        title: "string",
        overall: "string",
        overallScore: "number (0-100)",
        lifeKeyword: "string"
      },
      personality: {
        traits: ["string"],
        strengths: ["string"],
        weaknesses: ["string"],
        elementBalance: "string (오행 균형 분석)"
      },
      categories: {
        love: { score: "number", summary: "string", details: "string" },
        career: { score: "number", summary: "string", details: "string" },
        wealth: { score: "number", summary: "string", details: "string" },
        health: { score: "number", summary: "string", details: "string" },
        relationships: { score: "number", summary: "string", details: "string" }
      },
      lifePhases: {
        youth: "string (청년기)",
        middle: "string (중년기)",
        senior: "string (노년기)"
      },
      yearlyForecast: {
        thisYear: "string",
        nextYear: "string",
        fiveYears: "string"
      },
      advice: {
        lifeDirection: "string",
        doList: ["string"],
        avoidList: ["string"],
        growthAreas: ["string"]
      },
      luckyInfo: {
        colors: ["string"],
        numbers: ["string"],
        directions: "string",
        elements: "string (보완 오행)",
        items: ["string"]
      }
    },

    resultSections: [
      { id: "summary", title: "종합 운세 총평", icon: "🌟", type: "score", gradient: "from-purple-500 to-pink-500", fields: ["summary"] },
      { id: "personality", title: "타고난 기질", icon: "✨", type: "list", fields: ["personality"] },
      { id: "categories", title: "분야별 운세", icon: "📊", type: "chart", fields: ["categories"] },
      { id: "lifePhases", title: "인생의 흐름", icon: "🌊", type: "timeline", fields: ["lifePhases"] },
      { id: "yearlyForecast", title: "미래 전망", icon: "🔮", type: "text", fields: ["yearlyForecast"] },
      { id: "advice", title: "인생 조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "purple",
      secondaryColor: "pink",
      bgGradient: "from-purple-50 via-white to-pink-50"
    }
  },

  // 11. 환승연애
  "transfer-love": {
    id: "transfer-love",
    name: "환승연애",
    subtitle: "재회 vs 환승? 이제 지쳤다면",
    icon: "🔄",
    gradient: "from-violet-500 to-purple-500",
    element: "水",

    inputFields: [
      ...COMMON_INPUT_FIELDS,
      {
        name: "situation",
        label: "현재 상황",
        type: "select",
        required: true,
        options: [
          { value: "ex_miss", label: "전 애인이 그립다" },
          { value: "new_interest", label: "새로운 사람이 생겼다" },
          { value: "confused", label: "둘 다 마음이 있다" },
          { value: "move_on", label: "완전히 새 출발하고 싶다" }
        ]
      },
      ...PARTNER_INPUT_FIELDS
    ],
    requiresPartner: true,

    systemPrompt: `당신은 30년 경력의 전문 사주명리학자이자 연애 상담 전문가입니다.
이별 후 재회와 새로운 시작 사이에서 고민하는 사람을 위해
객관적이고 현실적인 분석을 제공합니다.

오늘 날짜: ${currentYear}년
반드시 ${currentYear}년을 기준으로 분석해주세요.

다음 JSON 형식으로만 응답해주세요:`,

    userPromptTemplate: `환승연애 분석을 해주세요.

## 본인 정보
- 이름: {{name}}
- 성별: {{gender}}
- 생년월일: {{year}}년 {{month}}월 {{day}}일 ({{calendarType}})
- 태어난 시간: {{birthHour}}

## 전 연인/새로운 사람 정보
- 이름: {{partnerName}}
- 성별: {{partnerGender}}
- 생년월일: {{partnerYear}}년 {{partnerMonth}}월 {{partnerDay}}일 ({{partnerCalendarType}})
- 태어난 시간: {{partnerBirthHour}}

## 현재 상황
{{situation}}

${currentYear}년 기준으로 분석해주세요.`,

    jsonSchema: {
      summary: {
        title: "string",
        overall: "string",
        recommendation: "string (재회 vs 환승 추천)"
      },
      comparison: {
        reunionScore: "number (재회 점수 0-100)",
        newLoveScore: "number (새 시작 점수 0-100)",
        recommendation: "string"
      },
      reunionAnalysis: {
        possibility: "string",
        pros: ["string"],
        cons: ["string"],
        timing: "string"
      },
      newStartAnalysis: {
        readiness: "string",
        idealPartner: "string",
        timing: "string",
        where: "string"
      },
      currentState: {
        emotional: "string (감정 상태)",
        healing: "string (치유 정도)",
        readyFor: "string (준비된 것)"
      },
      advice: {
        ifReunion: ["string"],
        ifNewStart: ["string"],
        selfCare: ["string"]
      },
      timeline: {
        shortTerm: "string (1-3개월)",
        midTerm: "string (6개월-1년)",
        longTerm: "string (1-3년)"
      },
      luckyInfo: {
        colors: ["string"],
        dates: ["string"],
        actions: ["string"]
      }
    },

    resultSections: [
      { id: "summary", title: "환승연애 분석", icon: "🔄", type: "text", gradient: "from-violet-500 to-purple-500", fields: ["summary"] },
      { id: "comparison", title: "재회 vs 새 시작", icon: "⚖️", type: "comparison", fields: ["comparison"] },
      { id: "reunionAnalysis", title: "재회 분석", icon: "💔", type: "list", fields: ["reunionAnalysis"] },
      { id: "newStartAnalysis", title: "새 시작 분석", icon: "💕", type: "list", fields: ["newStartAnalysis"] },
      { id: "currentState", title: "현재 상태", icon: "💭", type: "text", fields: ["currentState"] },
      { id: "advice", title: "조언", icon: "💡", type: "list", fields: ["advice"] },
      { id: "timeline", title: "타임라인", icon: "📅", type: "timeline", fields: ["timeline"] },
      { id: "luckyInfo", title: "행운의 정보", icon: "🍀", type: "grid", fields: ["luckyInfo"] }
    ],

    resultTheme: {
      primaryColor: "violet",
      secondaryColor: "purple",
      bgGradient: "from-violet-50 via-white to-purple-50"
    }
  }
};

// ===== 유틸리티 함수 =====

/**
 * 상품 ID로 컨텐츠 타입 매핑
 */
export function getContentTypeByProductId(productId: number): ContentType {
  const mapping: Record<number, ContentType> = {
    1: "som-compatibility",
    2: "solo-escape",
    3: "reunion-possibility",
    4: "comprehensive",
    5: "marriage-compatibility",
    6: "new-year-fortune",
    7: "wealth-fortune",
    8: "career-saju",
    9: "fact-bomb",
    10: "monthly-fortune",
    11: "transfer-love",
    12: "comprehensive"
  };
  return mapping[productId] || "comprehensive";
}

/**
 * 컨텐츠 설정 가져오기
 */
export function getContentConfig(contentType: ContentType): ContentConfig {
  return CONTENT_CONFIGS[contentType];
}

/**
 * 프롬프트 템플릿에 데이터 채우기
 */
export function fillPromptTemplate(template: string, data: Record<string, any>): string {
  let filled = template;
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    filled = filled.replace(regex, data[key] || '');
  });
  return filled;
}
