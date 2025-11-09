import { test, expect } from '@playwright/test';

test.describe('Vercel Deployment Verification', () => {
  const VERCEL_URL = 'https://sajuwooju-izppw4gha-kevinglecs-projects.vercel.app';
  
  test.use({ 
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  });

  test('should navigate from landing page to /main successfully', async ({ page }) => {
    console.log('Testing:', VERCEL_URL);
    
    // Go to landing page
    await page.goto(VERCEL_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for page to be ready
    await page.waitForTimeout(2000);
    
    // Take screenshot before click
    await page.screenshot({ path: 'tests/screenshots/vercel-before-click.png', fullPage: true });
    
    // Click the start button
    const startButton = page.locator('button:has-text("사주우주 시작하기")');
    if (await startButton.isVisible()) {
      console.log('Clicking start button');
      await startButton.click();
    } else {
      console.log('Start button not visible, clicking canvas area');
      await page.click('body', { position: { x: 200, y: 400 } });
    }
    
    // Wait for navigation (4 seconds fallback timer + 1s buffer)
    await page.waitForTimeout(5000);
    
    // Take screenshot after navigation
    await page.screenshot({ path: 'tests/screenshots/vercel-after-navigation.png', fullPage: true });
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);
    
    // Verify we reached /main page
    expect(currentUrl).toContain('/main');
    
    // Verify mobile UI elements are present
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 5000 });
    
    const bottomNav = page.locator('nav:has-text("홈")');
    await expect(bottomNav).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Navigation successful! Mobile UI elements present.');
  });

  test('should display glassmorphism mobile header', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Check for glassmorphism classes
    const headerClass = await header.getAttribute('class');
    expect(headerClass).toContain('backdrop-blur');
    expect(headerClass).toContain('bg-white/80');
    
    console.log('✅ Glassmorphism header verified');
  });

  test('should display glassmorphism bottom navigation', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/main`);
    await page.waitForLoadState('networkidle');
    
    const bottomNav = page.locator('nav').filter({ hasText: '홈' });
    await expect(bottomNav).toBeVisible();
    
    // Check for glassmorphism classes
    const navClass = await bottomNav.getAttribute('class');
    expect(navClass).toContain('backdrop-blur');
    expect(navClass).toContain('bg-white/80');
    
    // Check navigation items
    await expect(page.getByText('홈')).toBeVisible();
    await expect(page.getByText('메뉴')).toBeVisible();
    await expect(page.getByText('마이')).toBeVisible();
    await expect(page.getByText('설정')).toBeVisible();
    
    console.log('✅ Glassmorphism bottom nav verified');
  });

  test('should not show mobile UI on landing page', async ({ page }) => {
    await page.goto(VERCEL_URL);
    await page.waitForLoadState('networkidle');
    
    // Header and bottom nav should NOT be visible on landing page
    const header = page.locator('header').first();
    const headerVisible = await header.isVisible().catch(() => false);
    expect(headerVisible).toBe(false);
    
    const bottomNav = page.locator('nav').filter({ hasText: '홈' });
    const navVisible = await bottomNav.isVisible().catch(() => false);
    expect(navVisible).toBe(false);
    
    console.log('✅ Mobile UI correctly hidden on landing page');
  });
});
