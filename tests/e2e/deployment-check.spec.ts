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
    await page.goto('https://sajuwooju-pyljco9gu-kevinglecs-projects.vercel.app/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait for initial render
    await page.waitForTimeout(3000);

    // Take initial screenshot
    await page.screenshot({
      path: 'tests/screenshots/deployment-initial.png',
      fullPage: true
    });
    console.log('Initial screenshot taken');

    // Check for error page text
    const errorText = await page.locator('text=오류').count();
    const notFoundText = await page.locator('text=NOT_FOUND').count();
    console.log('Error text count:', errorText);
    console.log('NOT_FOUND text count:', notFoundText);

    // Try to find hero text
    const sajuText = await page.locator('text=사주우주').count();
    console.log('사주우주 text count:', sajuText);

    // Wait longer to see if error appears
    await page.waitForTimeout(7000);

    // Take screenshot after waiting
    await page.screenshot({
      path: 'tests/screenshots/deployment-after-10s.png',
      fullPage: true
    });
    console.log('After 10s screenshot taken');

    // Log all errors
    console.log('Console errors:', consoleErrors);
    console.log('Page errors:', pageErrors.map(e => e.message));

    // Check if error page appeared
    const hasError = await page.locator('text=오류 발생').count() > 0;
    const has404 = await page.locator('text=404').count() > 0;
    console.log('Has error page:', hasError);
    console.log('Has 404 page:', has404);

    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log('Page title:', title);
    console.log('Page URL:', url);
  });
});
