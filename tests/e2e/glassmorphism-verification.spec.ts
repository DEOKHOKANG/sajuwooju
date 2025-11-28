import { test, expect } from '@playwright/test';

test.describe('Glassmorphism Design Verification (3rd E2E)', () => {
  const VERCEL_URL = 'https://sajuwooju-izppw4gha-kevinglecs-projects.vercel.app';

  test.use({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  });

  test('should display glassmorphism on mobile header', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');

    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Check for glassmorphism classes
    const headerClass = await header.getAttribute('class');
    expect(headerClass).toContain('backdrop-blur');
    expect(headerClass).toContain('bg-white/80');
  });

  test('should display glassmorphism on bottom navigation', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');

    const bottomNav = page.locator('nav').filter({ hasText: '홈' });
    await expect(bottomNav).toBeVisible();

    const navClass = await bottomNav.getAttribute('class');
    expect(navClass).toContain('backdrop-blur');
    expect(navClass).toContain('bg-white/80');
  });

  test('should display glassmorphism on features cards', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');

    // Scroll to features section
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    // Find features section cards
    const featuresCards = page.locator('div').filter({ hasText: /AI 기반 사주|실시간 상담|정확도/ });
    const firstCard = featuresCards.first();

    if (await firstCard.isVisible()) {
      const cardClass = await firstCard.getAttribute('class');
      console.log('Features card classes:', cardClass);
      expect(cardClass).toContain('backdrop-blur');
    }
  });

  test('should display glassmorphism on testimonials cards', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');

    // Scroll to testimonials section
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);

    // Find testimonial cards
    const testimonialCards = page.locator('div').filter({ hasText: /만족도/ });
    const count = await testimonialCards.count();
    console.log('Found testimonial cards:', count);

    if (count > 0) {
      const cardClass = await testimonialCards.first().getAttribute('class');
      console.log('Testimonial card classes:', cardClass);
      expect(cardClass).toContain('backdrop-blur');
    }
  });

  test('should display glassmorphism on event banner', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');

    // Scroll to event section
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);

    // Find event banner
    const eventBanner = page.locator('div').filter({ hasText: /친구 초대/ });
    if (await eventBanner.first().isVisible()) {
      const bannerClass = await eventBanner.first().getAttribute('class');
      console.log('Event banner classes:', bannerClass);
      expect(bannerClass).toContain('backdrop-blur');
    }
  });

  test('should display glassmorphism on floating chat button', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');

    const chatButton = page.locator('button[aria-label="채팅 상담"]');
    await expect(chatButton).toBeVisible();

    const buttonClass = await chatButton.getAttribute('class');
    console.log('Chat button classes:', buttonClass);
    expect(buttonClass).toContain('backdrop-blur');
  });

  test('should navigate successfully from landing to main', async ({ page }) => {
    await page.goto(VERCEL_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const startButton = page.locator('button:has-text("사주우주 시작하기")');
    if (await startButton.isVisible()) {
      await startButton.click();
    }

    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    expect(currentUrl).toContain('/main');
  });
});
