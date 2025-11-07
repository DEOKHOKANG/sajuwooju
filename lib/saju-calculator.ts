import { SajuInput, SajuResult, SajuPillar, Fortune, HEAVENLY_STEMS, EARTHLY_BRANCHES, FORTUNE_CATEGORIES } from './types/saju';

export function calculateSaju(input: SajuInput): SajuResult {
  const sessionId = generateSessionId();
  const pillars = calculatePillars(input.birthDate, input.birthTime);
  const fortunes = generateFortunes();

  return {
    sessionId,
    input,
    pillars,
    fortunes,
    createdAt: new Date()
  };
}

function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `saju-${timestamp}-${random}`;
}

function calculatePillars(birthDate: Date, birthTime: number): {
  year: SajuPillar;
  month: SajuPillar;
  day: SajuPillar;
  time: SajuPillar;
} {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth();
  const day = birthDate.getDate();

  return {
    year: {
      heaven: HEAVENLY_STEMS[year % 10],
      earth: EARTHLY_BRANCHES[year % 12]
    },
    month: {
      heaven: HEAVENLY_STEMS[month % 10],
      earth: EARTHLY_BRANCHES[month % 12]
    },
    day: {
      heaven: HEAVENLY_STEMS[day % 10],
      earth: EARTHLY_BRANCHES[day % 12]
    },
    time: {
      heaven: HEAVENLY_STEMS[Math.floor(birthTime / 2) % 10],
      earth: EARTHLY_BRANCHES[Math.floor(birthTime / 2) % 12]
    }
  };
}

function generateFortunes(): Fortune[] {
  return FORTUNE_CATEGORIES.map((category, index) => {
    const fortuneId = `fortune-${index}`;
    return {
      id: fortuneId,
      category,
      score: Math.floor(Math.random() * 30) + 70,
      description: getMockDescription(category),
      advice: getMockAdvice(category)
    };
  });
}

function getMockDescription(category: string): string {
  const descriptions: Record<string, string> = {
    '종합운': '전반적으로 긍정적인 기운이 흐르고 있습니다.',
    '애정운': '새로운 인연을 만날 수 있는 좋은 시기입니다.',
    '재물운': '재물운이 상승하는 시기로 투자에 좋습니다.',
    '건강운': '건강에 주의가 필요한 시기입니다.',
    '직업운': '업무에서 좋은 성과를 거둘 수 있습니다.',
    '학업운': '학업 성취도가 높아지는 시기입니다.',
    '가족운': '가족과의 화목한 시간을 보낼 수 있습니다.',
    '인간관계': '새로운 사람들과의 만남이 많아집니다.',
    '여행운': '여행을 통해 좋은 경험을 할 수 있습니다.',
    '금전운': '금전적으로 안정적인 시기입니다.'
  };
  return descriptions[category] || '긍정적인 운세입니다.';
}

function getMockAdvice(category: string): string {
  const advices: Record<string, string> = {
    '종합운': '긍정적인 마음가짐을 유지하세요.',
    '애정운': '적극적으로 다가가 보세요.',
    '재물운': '계획적인 재테크가 필요합니다.',
    '건강운': '규칙적인 생활을 유지하세요.',
    '직업운': '새로운 도전을 두려워하지 마세요.',
    '학업운': '꾸준한 노력이 중요합니다.',
    '가족운': '가족과의 대화 시간을 늘려보세요.',
    '인간관계': '진심 어린 소통이 중요합니다.',
    '여행운': '새로운 경험을 즐겨보세요.',
    '금전운': '불필요한 지출을 줄이세요.'
  };
  return advices[category] || '현재 상태를 유지하세요.';
}
