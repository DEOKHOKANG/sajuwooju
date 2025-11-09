/**
 * Lunar Calendar Conversion Utilities
 * Using lunar-javascript library for Korean lunar calendar
 */

import { Lunar, Solar } from 'lunar-javascript';

/**
 * Convert solar date to lunar date
 */
export function solarToLunar(date: Date): {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
} {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunar.isLeap(),
  };
}

/**
 * Convert lunar date to solar date
 */
export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): Date {
  const lunar = Lunar.fromYmd(year, month, day, isLeapMonth ? 1 : 0);
  const solar = lunar.getSolar();

  return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
}

/**
 * Format lunar date to Korean string
 * Example: "음력 2024년 10월 15일"
 */
export function formatLunarDate(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): string {
  const leapText = isLeapMonth ? '윤' : '';
  return `음력 ${year}년 ${leapText}${month}월 ${day}일`;
}

/**
 * Get lunar year zodiac (천간지지)
 */
export function getLunarYearZodiac(date: Date): {
  heavenlyStem: string; // 천간
  earthlyBranch: string; // 지지
  zodiacAnimal: string; // 띠
} {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  return {
    heavenlyStem: lunar.getYearInGanZhi().substring(0, 1), // 천간 (첫 글자)
    earthlyBranch: lunar.getYearInGanZhi().substring(1, 2), // 지지 (둘째 글자)
    zodiacAnimal: lunar.getYearShengXiao(), // 띠
  };
}

/**
 * Validate if lunar date is valid
 */
export function isValidLunarDate(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): boolean {
  try {
    const lunar = Lunar.fromYmd(year, month, day, isLeapMonth ? 1 : 0);
    const solar = lunar.getSolar();

    // Check if conversion is successful
    return (
      solar.getYear() >= 1900 &&
      solar.getYear() <= 2100 &&
      lunar.getMonth() === month &&
      lunar.getDay() === day
    );
  } catch {
    return false;
  }
}

/**
 * Check if a lunar year has leap month
 */
export function hasLeapMonth(year: number): boolean {
  try {
    // Check each month to see if it has a leap month
    for (let month = 1; month <= 12; month++) {
      try {
        const lunar = Lunar.fromYmd(year, month, 1, 1);
        const solar = lunar.getSolar();

        // If conversion succeeds, there's a leap month
        if (solar.getYear() === year || solar.getYear() === year + 1) {
          return true;
        }
      } catch {
        // Continue checking
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Get leap month number for a given year
 * Returns null if no leap month
 */
export function getLeapMonth(year: number): number | null {
  try {
    for (let month = 1; month <= 12; month++) {
      try {
        const lunar = Lunar.fromYmd(year, month, 1, 1);
        const solar = lunar.getSolar();

        if (solar.getYear() === year || solar.getYear() === year + 1) {
          return month;
        }
      } catch {
        // Continue
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get number of days in a lunar month
 */
export function getLunarMonthDays(
  year: number,
  month: number,
  isLeapMonth: boolean = false
): number {
  try {
    // Try day 30 first
    if (isValidLunarDate(year, month, 30, isLeapMonth)) {
      return 30;
    }
    // Otherwise it's 29
    return 29;
  } catch {
    return 29; // Default
  }
}
