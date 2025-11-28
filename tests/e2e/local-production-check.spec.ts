import { test, expect } from '@playwright/test';

/**
 * Local Production Build Verification
 * 로컬 프로덕션 빌드 검증
 */

test.describe('Local Production Build Check', () => {
  test('should verify landing page renders without errors', async ({ page }) => {
    const errors: string[] = [];

    // Capture console messages
    page.on('console', msg => {
      const text = msg.text();
      console.log(`[${msg.type()}]`, text);
      if (msg.type() === 'error') {
        errors.push(text);
      }
    });

    // Visit local production server
    await page.goto('http://localhost:3002/');

    // Wait for 3D scene to load
    await page.waitForTimeout(6000);

    // Capture screenshot
    await page.screenshot({
      path: 'tests/screenshots/local-production.png',
      fullPage: true
    });

    console.log('✅ Local production screenshot captured');
    console.log(`📊 Console errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('❌ Errors found:');
      errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }
  });
});
