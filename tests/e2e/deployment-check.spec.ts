import { test, expect } from '@playwright/test';

test.describe('Deployment Site Check', () => {
  test('should load without errors and capture screenshots', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error);
    });

    // Go to deployment site
    console.log('Navigating to deployment site...');
    await page.goto('https://sajuwooju-aiag97fnb-kevinggangs-projects.vercel.app/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for initial render
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: 'tests/screenshots/deployment-initial.png',
      fullPage: true
    });
    console.log('Initial screenshot taken');

    // Check for error page
    const errorText = await page.locator('text=오류').count();
    console.log('Error text count:', errorText);

    // Check for empty box issue
    const heroSection = page.locator('div').filter({ hasText: '사주우주' }).first();
    await heroSection.screenshot({
      path: 'tests/screenshots/deployment-hero-section.png'
    });
    console.log('Hero section screenshot taken');

    // Wait a bit more to see if error appears
    await page.waitForTimeout(5000);

    // Take screenshot after waiting
    await page.screenshot({
      path: 'tests/screenshots/deployment-after-5s.png',
      fullPage: true
    });
    console.log('After 5s screenshot taken');

    // Log all errors
    console.log('Console errors:', consoleErrors);
    console.log('Page errors:', pageErrors.map(e => e.message));

    // Check if error page appeared
    const hasError = await page.locator('text=오류 발생').count() > 0;
    console.log('Has error page:', hasError);

    if (hasError) {
      await page.screenshot({
        path: 'tests/screenshots/deployment-error-page.png',
        fullPage: true
      });
      console.log('Error page screenshot taken');
    }
  });
});
