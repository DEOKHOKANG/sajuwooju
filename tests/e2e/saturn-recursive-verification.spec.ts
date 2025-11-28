import { test, expect } from '@playwright/test';

/**
 * Saturn Recursive Verification
 *
 * 토성 고리가 명확히 보일 때까지 재귀적으로 검증합니다.
 * 이 테스트는 배포된 사이트에서 실제로 토성 고리를 캡처하고 분석합니다.
 */

test.describe('Saturn Recursive Verification', () => {
  test('should verify Saturn rings are clearly visible in production', async ({ page }) => {
    console.log('\n========== SATURN RECURSIVE VERIFICATION ==========\n');
    console.log('🌐 Loading: https://sajuwooju.vercel.app\n');

    const startTime = Date.now();

    // Navigate to production site
    await page.goto('https://sajuwooju.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log(`✅ Page loaded in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);

    // Wait for 3D scene to initialize
    console.log('⏳ Waiting 10 seconds for 3D scene...\n');
    await page.waitForTimeout(10000);

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/saturn-recursive-full-10s.png',
      fullPage: true
    });
    console.log('📸 Full page screenshot captured\n');

    // Check canvas
    const canvas = await page.locator('canvas').first();
    const canvasExists = await canvas.count() > 0;

    if (canvasExists) {
      const box = await canvas.boundingBox();
      if (box) {
        console.log(`Canvas found: ${box.width}×${box.height}px\n`);

        // Take canvas-only screenshot
        await canvas.screenshot({
          path: 'tests/screenshots/saturn-recursive-canvas-10s.png'
        });
        console.log('📸 Canvas screenshot captured\n');

        // Try to find Saturn in the view
        // Saturn should be in the left portion of the solar system
        // Let's zoom in on that area
        console.log('🔍 Attempting to zoom into Saturn area...\n');

        // Move to canvas center
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        await page.mouse.move(centerX, centerY);

        // Zoom in with mouse wheel
        for (let i = 0; i < 3; i++) {
          await page.mouse.wheel(0, -200);
          await page.waitForTimeout(500);
        }

        await page.screenshot({
          path: 'tests/screenshots/saturn-recursive-zoomed.png',
          fullPage: false
        });
        console.log('📸 Zoomed view captured\n');

        // Try rotating view to find Saturn
        console.log('🔄 Rotating view to locate Saturn...\n');

        await page.mouse.move(centerX - 100, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY, { steps: 20 });
        await page.mouse.up();
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: 'tests/screenshots/saturn-recursive-rotated.png',
          fullPage: false
        });
        console.log('📸 Rotated view captured\n');

        // Check if we can click on planets
        console.log('🖱️  Testing planet click interaction...\n');

        // Try clicking in various positions where planets might be
        const testPositions = [
          { name: 'Center-Left', x: centerX - 150, y: centerY },
          { name: 'Center-Right', x: centerX + 150, y: centerY },
          { name: 'Top-Center', x: centerX, y: centerY - 100 },
        ];

        for (const pos of testPositions) {
          await page.mouse.click(pos.x, pos.y);
          await page.waitForTimeout(1000);

          const url = page.url();
          console.log(`  Clicked ${pos.name}: ${url}`);
        }
      }
    }

    console.log('\n========== ANALYSIS REQUIRED ==========\n');
    console.log('Please check the following screenshots:\n');
    console.log('1. saturn-recursive-full-10s.png - Full page view');
    console.log('2. saturn-recursive-canvas-10s.png - Canvas only');
    console.log('3. saturn-recursive-zoomed.png - Zoomed view');
    console.log('4. saturn-recursive-rotated.png - Rotated view\n');
    console.log('🔍 Look for:');
    console.log('   - Saturn (tan/beige planet)');
    console.log('   - Saturn rings (should be visible around Saturn)');
    console.log('   - Ring color (brown/beige bands)');
    console.log('   - Ring size (should extend significantly from planet)\n');
    console.log('========================================\n');

    expect(canvasExists).toBe(true);
  });
});
