import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const ORIGINAL_URL = 'https://sajuwooju.me';

/**
 * E2E Test Suite for Detail Pages
 * Tests all detail pages and compares with original site for improvements
 */

test.describe('Detail Pages E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Product Detail Pages', () => {
    test('should navigate to product detail page from card', async ({ page }) => {
      // Click first product card
      const firstProduct = page.locator('a[href^="/products/"]').first();
      const productTitle = await firstProduct.locator('.font-bold').textContent();

      await firstProduct.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on product detail page
      expect(page.url()).toContain('/products/');

      // Check page structure
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('h1')).toContainText(productTitle || '');
      await expect(page.locator('img[alt]')).toBeVisible(); // Product image
      await expect(page.locator('text=할인중')).toBeVisible(); // Discount badge
      await expect(page.locator('text=상담 신청하기')).toBeVisible(); // CTA button
    });

    test('should display product information correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/products/1`);

      // Check all required elements
      await expect(page.locator('text=상품 설명')).toBeVisible();
      await expect(page.locator('text=고객 후기')).toBeVisible();
      await expect(page.locator('text=원')).toBeVisible(); // Price

      // Check star ratings
      const stars = page.locator('svg.lucide-star');
      expect(await stars.count()).toBeGreaterThan(0);

      // Check reviews
      const reviews = page.locator('div:has-text("김**"), div:has-text("이**"), div:has-text("박**")');
      expect(await reviews.count()).toBeGreaterThan(0);
    });

    test('should have working back button', async ({ page }) => {
      await page.goto(`${BASE_URL}/products/1`);

      const backButton = page.locator('button[aria-label="뒤로 가기"]');
      await backButton.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toBe(`${BASE_URL}/`);
    });
  });

  test.describe('Category Detail Pages', () => {
    test('should navigate to category page from homepage', async ({ page }) => {
      // Click first category
      const firstCategory = page.locator('a[href^="/category/"]').first();
      const categoryLabel = await firstCategory.locator('span').textContent();

      await firstCategory.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on category page
      expect(page.url()).toContain('/category/');
      await expect(page.locator('h1')).toContainText(categoryLabel || '');
    });

    test('should display category products', async ({ page }) => {
      await page.goto(`${BASE_URL}/category/1`);

      // Check category header
      await expect(page.locator('h2')).toBeVisible();
      await expect(page.locator('text=추천 상품')).toBeVisible();

      // Check products list
      const productCards = page.locator('a[href^="/products/"]');
      expect(await productCards.count()).toBeGreaterThan(0);
    });

    test('should test all 10 categories', async ({ page }) => {
      for (let i = 1; i <= 10; i++) {
        await page.goto(`${BASE_URL}/category/${i}`);

        // Verify page loads
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=추천 상품')).toBeVisible();

        console.log(`✓ Category ${i} tested`);
      }
    });
  });

  test.describe('Menu & Settings Pages', () => {
    test('should navigate to menu page', async ({ page }) => {
      const menuButton = page.locator('a[href="/menu"]');
      await menuButton.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toBe(`${BASE_URL}/menu`);
      await expect(page.locator('text=메뉴')).toBeVisible();
      await expect(page.locator('text=내 리포트')).toBeVisible();
      await expect(page.locator('text=쿠폰함')).toBeVisible();
      await expect(page.locator('text=계정설정')).toBeVisible();
      await expect(page.locator('text=고객센터')).toBeVisible();
    });

    test('should navigate to reports page', async ({ page }) => {
      await page.goto(`${BASE_URL}/menu`);
      await page.click('a[href="/reports"]');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toBe(`${BASE_URL}/reports`);
      await expect(page.locator('text=내 리포트')).toBeVisible();
    });

    test('should navigate to coupons page', async ({ page }) => {
      await page.goto(`${BASE_URL}/menu`);
      await page.click('a[href="/coupons"]');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toBe(`${BASE_URL}/coupons`);
      await expect(page.locator('text=내 쿠폰')).toBeVisible();
      await expect(page.locator('text=사용가능')).toBeVisible();
      await expect(page.locator('text=만료됨')).toBeVisible();
    });

    test('should navigate to settings page', async ({ page }) => {
      await page.goto(`${BASE_URL}/menu`);
      await page.click('a[href="/settings"]');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toBe(`${BASE_URL}/settings`);
      await expect(page.locator('text=계정설정')).toBeVisible();
      await expect(page.locator('text=알림 설정')).toBeVisible();
    });

    test('should navigate to support page', async ({ page }) => {
      await page.goto(`${BASE_URL}/menu`);
      await page.click('a[href="/support"]');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toBe(`${BASE_URL}/support`);
      await expect(page.locator('text=고객센터')).toBeVisible();
      await expect(page.locator('text=자주 묻는 질문')).toBeVisible();
    });
  });

  test.describe('Visual Comparison & Improvements', () => {
    test('compare product detail page layout', async ({ page }) => {
      // Our clone
      await page.goto(`${BASE_URL}/products/1`);
      const cloneScreenshot = await page.screenshot({ fullPage: true });

      // Get layout measurements
      const headerHeight = await page.locator('header').boundingBox();
      const imageHeight = await page.locator('section').first().boundingBox();
      const ctaButton = await page.locator('text=상담 신청하기').boundingBox();

      console.log('Product Detail Page Measurements:');
      console.log('- Header height:', headerHeight?.height);
      console.log('- Image section height:', imageHeight?.height);
      console.log('- CTA button position:', ctaButton?.y);

      // Verify fixed elements
      expect(headerHeight?.y).toBe(0); // Header should be at top
      expect(ctaButton?.y).toBeGreaterThan(800); // CTA should be near bottom
    });

    test('compare category page layout', async ({ page }) => {
      await page.goto(`${BASE_URL}/category/1`);

      // Check responsive design
      const categoryIcon = await page.locator('img[alt="이벤트"]').first().boundingBox();
      const productCards = await page.locator('a[href^="/products/"]').count();

      console.log('Category Page Measurements:');
      console.log('- Category icon size:', categoryIcon?.width, 'x', categoryIcon?.height);
      console.log('- Product cards count:', productCards);

      expect(productCards).toBeGreaterThan(0);
    });

    test('test responsive behavior on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });

      await page.goto(`${BASE_URL}/products/1`);

      // Check mobile-specific elements
      const backButton = page.locator('button[aria-label="뒤로 가기"]');
      await expect(backButton).toBeVisible();

      const productImage = page.locator('section img').first();
      await expect(productImage).toBeVisible();

      console.log('Mobile viewport test passed');
    });
  });

  test.describe('Interactive Elements', () => {
    test('should test coupon tabs interaction', async ({ page }) => {
      await page.goto(`${BASE_URL}/coupons`);

      // Click "만료됨" tab
      await page.click('text=만료됨');
      await page.waitForTimeout(500);

      // Should show expired coupons or empty state
      const expiredContent = page.locator('text=만료된 쿠폰이 없습니다, text=유효기간');
      await expect(expiredContent.first()).toBeVisible();
    });

    test('should test settings toggles', async ({ page }) => {
      await page.goto(`${BASE_URL}/settings`);

      // Find toggle buttons
      const toggles = page.locator('button:has-text("")').filter({ has: page.locator('div[style*="border-radius"]') });
      const toggleCount = await toggles.count();

      expect(toggleCount).toBeGreaterThan(0);
      console.log('Settings toggles found:', toggleCount);
    });

    test('should test support FAQ accordion', async ({ page }) => {
      await page.goto(`${BASE_URL}/support`);

      // Click first FAQ
      const firstFAQ = page.locator('button:has-text("사주 상담은 어떻게 진행되나요?")');
      await firstFAQ.click();
      await page.waitForTimeout(500);

      // Answer should be visible
      await expect(page.locator('text=생년월일과 시간 정보를 입력')).toBeVisible();
    });
  });

  test.describe('Navigation Flow Tests', () => {
    test('complete user flow: home → category → product → back', async ({ page }) => {
      // 1. Start at home
      await page.goto(BASE_URL);
      await expect(page.locator('text=사주우주')).toBeVisible();

      // 2. Click category
      await page.click('a[href="/category/2"]');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/category/2');

      // 3. Click product from category
      await page.click('a[href^="/products/"]');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/products/');

      // 4. Go back
      await page.click('button[aria-label="뒤로 가기"]');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/category/');
    });

    test('complete user flow: home → menu → settings → back', async ({ page }) => {
      // 1. Start at home
      await page.goto(BASE_URL);

      // 2. Open menu
      await page.click('a[href="/menu"]');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toBe(`${BASE_URL}/menu`);

      // 3. Go to settings
      await page.click('a[href="/settings"]');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toBe(`${BASE_URL}/settings`);

      // 4. Go back
      await page.click('button[aria-label="뒤로 가기"]');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toBe(`${BASE_URL}/menu`);
    });
  });
});
