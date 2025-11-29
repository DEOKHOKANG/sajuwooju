import { test, expect } from "@playwright/test";

/**
 * 사주우주 E2E 전수 테스트
 * 모든 콘텐츠 타입에 대한 전체 플로우 테스트
 */

// 테스트 데이터
const TEST_USER = {
  name: "테스트유저",
  year: "1990",
  month: "5",
  day: "15",
  birthHour: "14:00",
  gender: "male",
  calendarType: "solar",
};

const TEST_PARTNER = {
  name: "테스트상대",
  year: "1992",
  month: "8",
  day: "22",
  birthHour: "10:00",
  gender: "female",
  calendarType: "solar",
};

// 콘텐츠 타입별 테스트 데이터
const CONTENT_TYPES = [
  { id: "comprehensive", name: "종합운세", requiresPartner: false, productId: "1" },
  { id: "wealth-fortune", name: "재물운", requiresPartner: false, productId: "2" },
  { id: "career-saju", name: "커리어사주", requiresPartner: false, productId: "3" },
  { id: "new-year-fortune", name: "신년운세", requiresPartner: false, productId: "4" },
  { id: "monthly-fortune", name: "월간운세", requiresPartner: false, productId: "5" },
  { id: "solo-escape", name: "솔로탈출", requiresPartner: false, productId: "6" },
  { id: "fact-bomb", name: "팩폭사주", requiresPartner: false, productId: "7" },
  { id: "som-compatibility", name: "썸궁합", requiresPartner: true, productId: "8" },
  { id: "marriage-compatibility", name: "결혼궁합", requiresPartner: true, productId: "9" },
  { id: "reunion-possibility", name: "재회확률", requiresPartner: true, productId: "10" },
  { id: "transfer-love", name: "환승연애", requiresPartner: false, productId: "11" },
];

test.describe("홈페이지 및 기본 네비게이션", () => {
  test("홈페이지가 정상적으로 로드됨", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/사주우주/);
  });

  test("메인 페이지 접근 가능", async ({ page }) => {
    await page.goto("/main");
    await expect(page.locator("body")).toBeVisible();
  });

  test("대시보드 페이지 접근 가능", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("상품 목록 페이지", () => {
  test("상품 목록 페이지 로드", async ({ page }) => {
    await page.goto("/products/1");
    await expect(page.locator("body")).toBeVisible();
  });

  test("카테고리 페이지 로드", async ({ page }) => {
    await page.goto("/category/love");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("사주 분석 API 테스트", () => {
  // 단일 사용자 콘텐츠 타입 테스트
  for (const content of CONTENT_TYPES.filter((c) => !c.requiresPartner)) {
    test(`API 테스트: ${content.name} (${content.id})`, async ({ request }) => {
      const response = await request.post("/api/saju/analyze", {
        data: {
          name: TEST_USER.name,
          gender: TEST_USER.gender,
          year: parseInt(TEST_USER.year),
          month: parseInt(TEST_USER.month),
          day: parseInt(TEST_USER.day),
          birthHour: TEST_USER.birthHour,
          calendarType: TEST_USER.calendarType,
          contentType: content.id,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.contentType).toBe(content.id);
      expect(data.structured).toBe(true);
    });
  }

  // 파트너 필요 콘텐츠 타입 테스트
  for (const content of CONTENT_TYPES.filter((c) => c.requiresPartner)) {
    test(`API 테스트: ${content.name} (${content.id}) - 궁합`, async ({ request }) => {
      const response = await request.post("/api/saju/analyze", {
        data: {
          name: TEST_USER.name,
          gender: TEST_USER.gender,
          year: parseInt(TEST_USER.year),
          month: parseInt(TEST_USER.month),
          day: parseInt(TEST_USER.day),
          birthHour: TEST_USER.birthHour,
          calendarType: TEST_USER.calendarType,
          contentType: content.id,
          partnerName: TEST_PARTNER.name,
          partnerGender: TEST_PARTNER.gender,
          partnerYear: parseInt(TEST_PARTNER.year),
          partnerMonth: parseInt(TEST_PARTNER.month),
          partnerDay: parseInt(TEST_PARTNER.day),
          partnerBirthHour: TEST_PARTNER.birthHour,
          partnerCalendarType: TEST_PARTNER.calendarType,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.contentType).toBe(content.id);
      expect(data.structured).toBe(true);
    });
  }
});

test.describe("API 에러 핸들링", () => {
  test("필수 필드 누락 시 400 에러", async ({ request }) => {
    const response = await request.post("/api/saju/analyze", {
      data: {
        name: TEST_USER.name,
        // gender, year, month, day 누락
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test("잘못된 contentType도 처리 가능", async ({ request }) => {
    const response = await request.post("/api/saju/analyze", {
      data: {
        name: TEST_USER.name,
        gender: TEST_USER.gender,
        year: parseInt(TEST_USER.year),
        month: parseInt(TEST_USER.month),
        day: parseInt(TEST_USER.day),
        contentType: "invalid-content-type",
      },
    });

    // 잘못된 contentType은 comprehensive로 폴백
    expect(response.ok()).toBeTruthy();
  });
});

test.describe("정적 페이지 테스트", () => {
  test("이용약관 페이지", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("body")).toBeVisible();
  });

  test("개인정보처리방침 페이지", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("body")).toBeVisible();
  });

  test("지원 페이지", async ({ page }) => {
    await page.goto("/support");
    await expect(page.locator("body")).toBeVisible();
  });

  test("설정 페이지", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("body")).toBeVisible();
  });

  test("메뉴 페이지", async ({ page }) => {
    await page.goto("/menu");
    await expect(page.locator("body")).toBeVisible();
  });

  test("리포트 페이지", async ({ page }) => {
    await page.goto("/reports");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("관리자 페이지 테스트", () => {
  test("관리자 로그인 페이지", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("body")).toBeVisible();
  });

  test("관리자 대시보드 (인증 필요)", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("로그인/인증 페이지", () => {
  test("로그인 페이지 로드", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("SEO 및 메타데이터", () => {
  test("robots.txt 접근 가능", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.ok()).toBeTruthy();
  });

  test("sitemap.xml 접근 가능", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.ok()).toBeTruthy();
  });
});

test.describe("404 페이지", () => {
  test("존재하지 않는 페이지 접근 시 404 처리", async ({ page }) => {
    await page.goto("/non-existent-page-12345");
    await expect(page.locator("body")).toBeVisible();
  });
});
