import { test, expect } from '@playwright/test';

test.describe('Landing Page Solar System Navigation Bug', () => {
  test('should navigate from landing page to /main when clicking solar system', async ({ page }) => {
    // Go to landing page
    await page.goto('https://sajuwooju.vercel.app/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Wait for the solar system to be visible
    await page.waitForTimeout(2000);
    
    // Take screenshot before click
    await page.screenshot({ path: 'tests/screenshots/before-click.png', fullPage: true });
    
    // Click the solar system / button
    const startButton = page.locator('button:has-text("사주우주 시작하기")');
    if (await startButton.isVisible()) {
      console.log('Clicking start button');
      await startButton.click();
    } else {
      console.log('Start button not visible, clicking canvas area');
      // Click in the center of the page where solar system should be
      await page.click('body', { position: { x: 200, y: 400 } });
    }
    
    // Wait for animation (3 seconds + 0.8 seconds buffer)
    await page.waitForTimeout(4000);
    
    // Take screenshot after click
    await page.screenshot({ path: 'tests/screenshots/after-click.png', fullPage: true });
    
    // Check if we navigated to /main
    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);
    
    // Check for error messages or loading text
    const loadingText = await page.locator('text=우주를 불러오는 중').isVisible().catch(() => false);
    console.log('Loading text visible:', loadingText);
    
    // Verify we reached /main page
    expect(currentUrl).toContain('/main');
    
    // Verify we see the main page content (mobile header/nav)
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav:has-text("홈")')).toBeVisible();
  });
  
  test('should check for JavaScript errors on landing page', async ({ page }) => {
    const errors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('https://sajuwooju.vercel.app/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    console.log('JavaScript errors found:', errors);
    
    // Report errors if any
    if (errors.length > 0) {
      console.error('Errors detected:', errors);
    }
  });
});
