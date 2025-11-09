import { test, expect } from '@playwright/test';

test.describe('Long Running Deployment Check', () => {
  test('should stay stable for 30 seconds without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${new Date().toISOString()}] ${msg.text()}`);
      }
    });

    // Listen for page errors
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error);
      console.log(`[PAGE ERROR at ${new Date().toISOString()}]`, error.message);
    });

    // Listen for navigations
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        console.log(`[NAVIGATION at ${new Date().toISOString()}] URL: ${frame.url()}`);
      }
    });

    // Go to deployment site
    console.log('[0s] Navigating to deployment site...');
    await page.goto('https://sajuwooju-pyljco9gu-kevinglecs-projects.vercel.app/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Take screenshots every 5 seconds for 30 seconds
    for (let i = 0; i <= 30; i += 5) {
      await page.waitForTimeout(5000);

      const timestamp = i + 5;
      console.log(`[${timestamp}s] Taking screenshot...`);

      await page.screenshot({
        path: `tests/screenshots/deployment-${timestamp}s.png`,
        fullPage: true
      });

      // Check for error page
      const hasError = await page.locator('text=오류 발생').count() > 0;
      const has404 = await page.locator('text=404').count() > 0;
      const sajuText = await page.locator('text=사주우주').count();
      const title = await page.title();
      const url = page.url();

      console.log(`[${timestamp}s] Has error page: ${hasError}`);
      console.log(`[${timestamp}s] Has 404 page: ${has404}`);
      console.log(`[${timestamp}s] 사주우주 text count: ${sajuText}`);
      console.log(`[${timestamp}s] Page title: ${title}`);
      console.log(`[${timestamp}s] Page URL: ${url}`);

      // If error appears, log and fail
      if (hasError || has404) {
        console.log('ERROR DETECTED!');
        console.log('Console errors:', consoleErrors);
        console.log('Page errors:', pageErrors.map(e => e.message));
        throw new Error(`Error page appeared at ${timestamp}s`);
      }
    }

    // Final report
    console.log('\n=== FINAL REPORT ===');
    console.log('Total console errors:', consoleErrors.length);
    console.log('Console errors:', consoleErrors);
    console.log('Total page errors:', pageErrors.length);
    console.log('Page errors:', pageErrors.map(e => e.message));
  });
});
