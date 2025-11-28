import { test, expect } from '@playwright/test';

/**
 * Compare Original Site Saturn
 *
 * 원본 사이트의 토성 렌더링과 비교합니다
 */

test.describe('Compare Original Site Saturn', () => {
  test('should capture original site Saturn rendering', async ({ page }) => {
    console.log('\n========== ORIGINAL SITE COMPARISON ==========\n');

    console.log('🌐 Loading original site: sajutight.me\n');

    await page.goto('https://sajutight.me', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait for 3D scene to load
    await page.waitForTimeout(8000);

    await page.screenshot({
      path: 'tests/screenshots/original-site-initial.png',
      fullPage: false
    });
    console.log('📸 Original site initial view captured\n');

    // Try to find Saturn or zoom controls
    await page.waitForTimeout(5000);

    await page.screenshot({
      path: 'tests/screenshots/original-site-after-wait.png',
      fullPage: false
    });
    console.log('📸 Original site after 13s captured\n');

    console.log('🔍 Comparing with our deployment:\n');
    console.log('  Original: tests/screenshots/original-site-initial.png');
    console.log('  Ours: tests/screenshots/error-diagnosis-10s.png\n');

    console.log('========================================\n');
  });
});
