import { test, expect } from '@playwright/test';

test.describe('Mobile UI Verification', () => {
  test.use({ 
    viewport: { width: 375, height: 812 }, // iPhone X
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  test('should display mobile header on main page', async ({ page }) => {
    await page.goto('https://sajuwooju.vercel.app/main');
    await page.waitForLoadState('networkidle');
    
    // Mobile header should be visible
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-header-before.png', fullPage: false });
  });

  test('should display mobile bottom navigation on main page', async ({ page }) => {
    await page.goto('https://sajuwooju.vercel.app/main');
    await page.waitForLoadState('networkidle');
    
    // Mobile bottom nav should be visible
    const bottomNav = page.locator('nav').filter({ hasText: '홈' });
    await expect(bottomNav).toBeVisible();
    
    // All 4 nav items should be present
    await expect(page.getByText('홈')).toBeVisible();
    await expect(page.getByText('메뉴')).toBeVisible();
    await expect(page.getByText('마이')).toBeVisible();
    await expect(page.getByText('설정')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-bottom-nav-before.png', fullPage: false });
  });

  test('should not show mobile nav on landing page', async ({ page }) => {
    await page.goto('https://sajuwooju.vercel.app/');
    await page.waitForTimeout(2000);
    
    // Mobile nav should NOT be visible on landing page
    const bottomNav = page.locator('nav').filter({ hasText: '홈' });
    await expect(bottomNav).not.toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/landing-page.png', fullPage: false });
  });

  test('should have glassmorphism styles on cards', async ({ page }) => {
    await page.goto('https://sajuwooju.vercel.app/main');
    await page.waitForLoadState('networkidle');
    
    // Find product cards
    const cards = page.locator('article, div[class*="card"]').first();
    
    // Get computed styles
    const bgColor = await cards.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    console.log('Card background color:', bgColor);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/cards-before.png', fullPage: true });
  });

  test('navigation between pages should work', async ({ page }) => {
    await page.goto('https://sajuwooju.vercel.app/main');
    await page.waitForLoadState('networkidle');
    
    // Click on menu nav item
    await page.getByText('메뉴').click();
    await page.waitForTimeout(1000);
    
    // Should navigate to menu page
    await expect(page).toHaveURL(/\/menu/);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/menu-page.png', fullPage: false });
  });
});
