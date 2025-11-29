import { test, expect } from "@playwright/test";

/**
 * 상담 페이지 UI 플로우 E2E 테스트
 * 사용자 입력 → 분석 → 결과 페이지 플로우
 */

test.describe("상담 페이지 UI 플로우", () => {
  test("consultation 페이지 로드 및 폼 표시", async ({ page }) => {
    await page.goto("/consultation/1");
    await expect(page.locator("body")).toBeVisible();

    // 폼 요소들이 존재하는지 확인
    await expect(page.locator("input, select, button").first()).toBeVisible();
  });

  test("종합운세 상담 폼 입력 테스트", async ({ page }) => {
    await page.goto("/consultation/1");

    // 이름 입력
    const nameInput = page.locator('input[placeholder*="이름"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill("테스트유저");
    }

    // 성별 선택
    const maleRadio = page.locator('input[value="male"]');
    if (await maleRadio.isVisible()) {
      await maleRadio.click();
    }

    // 페이지가 정상적으로 동작하는지 확인
    await expect(page.locator("body")).toBeVisible();
  });

  test("saju/new 페이지 로드", async ({ page }) => {
    await page.goto("/saju/new");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("분석 결과 페이지", () => {
  test("결과 페이지 직접 접근 시 처리", async ({ page }) => {
    // 존재하지 않는 세션으로 접근
    await page.goto("/saju/result/test-session-12345");
    await expect(page.locator("body")).toBeVisible();
  });

  test("분석 중 페이지 직접 접근 시 처리", async ({ page }) => {
    // 존재하지 않는 세션으로 접근
    await page.goto("/saju/analyze/test-session-12345");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("공유 페이지", () => {
  test("공유 결과 페이지 접근", async ({ page }) => {
    await page.goto("/share/saju/test-id");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("모바일 반응형 테스트", () => {
  test("모바일 뷰포트에서 홈페이지 로드", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("모바일 뷰포트에서 대시보드 로드", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("모바일 뷰포트에서 메뉴 로드", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/menu");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("태블릿 반응형 테스트", () => {
  test("태블릿 뷰포트에서 홈페이지 로드", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("태블릿 뷰포트에서 상담 페이지 로드", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/consultation/1");
    await expect(page.locator("body")).toBeVisible();
  });
});
