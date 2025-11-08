import { test, expect } from '@playwright/test';

/**
 * Saturn Rings Close-up Verification
 *
 * 토성으로 직접 이동하여 고리를 근접 촬영합니다.
 * This test navigates directly to Saturn and captures close-up screenshots.
 */

test.describe('Saturn Rings Close-up', () => {
  test('should capture Saturn rings in extreme close-up', async ({ page }) => {
    console.log('\n========== SATURN RINGS CLOSE-UP ==========\n');
    console.log('🌐 Loading: https://sajuwooju.vercel.app\n');

    const startTime = Date.now();

    await page.goto('https://sajuwooju.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log(`✅ Page loaded in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);

    // Wait for 3D scene to initialize
    console.log('⏳ Waiting 10 seconds for 3D scene...\n');
    await page.waitForTimeout(10000);

    const canvas = await page.locator('canvas').first();
    const canvasExists = await canvas.count() > 0;

    if (canvasExists) {
      const box = await canvas.boundingBox();
      if (box) {
        console.log(`Canvas found: ${box.width}×${box.height}px\n`);

        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        // Take initial screenshot
        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-initial.png',
          fullPage: false
        });
        console.log('📸 Initial view captured\n');

        // Saturn is at orbitRadius: 180, likely on the left side
        // Rotate view to bring Saturn to center
        console.log('🔄 Rotating camera to find Saturn...\n');

        // Drag from right to left to rotate and bring Saturn into view
        await page.mouse.move(centerX + 200, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 200, centerY, { steps: 30 });
        await page.mouse.up();
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-rotated-1.png',
          fullPage: false
        });
        console.log('📸 First rotation captured\n');

        // Rotate more to fully center Saturn
        await page.mouse.move(centerX + 150, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 150, centerY, { steps: 20 });
        await page.mouse.up();
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-rotated-2.png',
          fullPage: false
        });
        console.log('📸 Second rotation captured\n');

        // Now zoom in significantly to see Saturn rings
        console.log('🔍 Zooming in on Saturn...\n');

        for (let i = 0; i < 5; i++) {
          await page.mouse.wheel(0, -300);
          await page.waitForTimeout(300);
        }

        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-zoomed-5x.png',
          fullPage: false
        });
        console.log('📸 5× zoom captured\n');

        // Zoom even more
        for (let i = 0; i < 3; i++) {
          await page.mouse.wheel(0, -300);
          await page.waitForTimeout(300);
        }

        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-zoomed-8x.png',
          fullPage: false
        });
        console.log('📸 8× zoom captured\n');

        // Maximum zoom
        for (let i = 0; i < 3; i++) {
          await page.mouse.wheel(0, -300);
          await page.waitForTimeout(300);
        }

        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-zoomed-max.png',
          fullPage: false
        });
        console.log('📸 Maximum zoom captured\n');

        // Try panning left/right to find Saturn if needed
        console.log('🔄 Panning to locate Saturn...\n');

        // Pan left
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 100, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-pan-left.png',
          fullPage: false
        });
        console.log('📸 Pan left captured\n');

        // Pan right
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 200, centerY, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        await page.screenshot({
          path: 'tests/screenshots/saturn-closeup-pan-right.png',
          fullPage: false
        });
        console.log('📸 Pan right captured\n');

        console.log('\n========== ANALYSIS REQUIRED ==========\n');
        console.log('Please check screenshots in this order:\n');
        console.log('1. saturn-closeup-initial.png - Starting view');
        console.log('2. saturn-closeup-rotated-1.png - First rotation');
        console.log('3. saturn-closeup-rotated-2.png - Second rotation');
        console.log('4. saturn-closeup-zoomed-5x.png - 5× zoom');
        console.log('5. saturn-closeup-zoomed-8x.png - 8× zoom');
        console.log('6. saturn-closeup-zoomed-max.png - Maximum zoom');
        console.log('7. saturn-closeup-pan-left.png - Pan left');
        console.log('8. saturn-closeup-pan-right.png - Pan right\n');
        console.log('🔍 Saturn rings should be visible in zoomed views');
        console.log('   Look for: brown/beige bands extending from tan planet\n');
        console.log('========================================\n');
      }
    }

    expect(canvasExists).toBe(true);
  });
});
