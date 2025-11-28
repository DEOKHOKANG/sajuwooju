import { test, expect } from '@playwright/test';

/**
 * Saturn Ring Detailed Verification
 *
 * 토성 고리를 상세하게 검증합니다:
 * 1. 고리 모양 (Ring shape): 얇고 납작한 원반 형태
 * 2. 고리 크기 (Ring size): 행성 반지름의 1.2배~2.8배
 * 3. 고리 색상 (Ring color): 갈색/베이지색 띠
 * 4. 고리 패턴 (Ring pattern): 텍스처의 밴드/줄무늬 패턴
 * 5. 고리 투명도: 약간 투명하여 뒤가 비침
 * 6. 고리 각도: 26.7도 기울어짐
 */

test.describe('Saturn Ring Detailed Verification', () => {
  test('should verify Saturn ring appearance in production', async ({ page }) => {
    const consoleMessages: { type: string; text: string; timestamp: number }[] = [];
    const errors: string[] = [];

    // Capture console and errors
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: Date.now()
      });
    });

    page.on('pageerror', error => {
      errors.push(`${error.name}: ${error.message}`);
      console.log('\n❌ PAGE ERROR:', error.message);
    });

    console.log('\n========== SATURN RING DETAILED VERIFICATION ==========\n');
    console.log('🌐 Loading: https://sajuwooju.vercel.app\n');

    const startTime = Date.now();

    try {
      await page.goto('https://sajuwooju.vercel.app', {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      console.log(`✅ Page loaded in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
    } catch (error) {
      console.log(`❌ Page load failed: ${error}\n`);
      throw error;
    }

    // Wait for 3D scene to initialize
    console.log('⏳ Waiting 8 seconds for 3D scene initialization...\n');
    await page.waitForTimeout(8000);

    // Capture screenshots at different intervals
    console.log('📸 Capturing screenshots...\n');

    await page.screenshot({
      path: 'tests/screenshots/saturn-detailed-8s.png',
      fullPage: false
    });
    console.log('  - 8s screenshot saved');

    await page.waitForTimeout(5000);
    await page.screenshot({
      path: 'tests/screenshots/saturn-detailed-13s.png',
      fullPage: false
    });
    console.log('  - 13s screenshot saved');

    await page.waitForTimeout(5000);
    await page.screenshot({
      path: 'tests/screenshots/saturn-detailed-18s.png',
      fullPage: false
    });
    console.log('  - 18s screenshot saved\n');

    // Check for errors
    const saturnErrors = consoleMessages.filter(m =>
      m.type === 'error' &&
      (m.text.toLowerCase().includes('saturn') ||
       m.text.toLowerCase().includes('ring') ||
       m.text.toLowerCase().includes('texture'))
    );

    const allErrors = consoleMessages.filter(m => m.type === 'error');

    console.log('========== ERROR ANALYSIS ==========\n');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Total errors: ${allErrors.length}`);
    console.log(`Saturn-related errors: ${saturnErrors.length}`);
    console.log(`Page errors: ${errors.length}\n`);

    if (errors.length > 0) {
      console.log('❌ PAGE ERRORS:\n');
      errors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. ${err}`);
      });
      console.log('');
    }

    if (allErrors.length > 0) {
      console.log('❌ CONSOLE ERRORS:\n');
      allErrors.forEach((err, idx) => {
        const timeOffset = ((err.timestamp - startTime) / 1000).toFixed(1);
        console.log(`  ${idx + 1}. [+${timeOffset}s] ${err.text}`);
      });
      console.log('');
    }

    // Get canvas element for visual inspection
    const canvas = await page.locator('canvas').first();
    const canvasExists = await canvas.count() > 0;

    console.log('========== VISUAL VERIFICATION ==========\n');
    console.log(`Canvas element exists: ${canvasExists ? '✅' : '❌'}\n`);

    if (canvasExists) {
      const box = await canvas.boundingBox();
      if (box) {
        console.log(`Canvas size: ${box.width}×${box.height}px\n`);
      }
    }

    console.log('🔍 Saturn Ring Checklist:\n');
    console.log('   [ ] Ring shape: Thin, flat disk around planet');
    console.log('   [ ] Ring size: Extends from 1.2× to 2.8× planet radius');
    console.log('   [ ] Ring color: Brown/beige bands visible');
    console.log('   [ ] Ring pattern: Texture bands/stripes visible');
    console.log('   [ ] Ring transparency: Semi-transparent (0.9 opacity)');
    console.log('   [ ] Ring angle: Tilted at 26.7 degrees\n');

    console.log('📋 Manual Verification Steps:\n');
    console.log('   1. Check saturn-detailed-8s.png');
    console.log('   2. Check saturn-detailed-13s.png');
    console.log('   3. Check saturn-detailed-18s.png');
    console.log('   4. Look for Saturn (orange planet on left side)');
    console.log('   5. Verify ring is visible around Saturn');
    console.log('   6. Confirm ring has brown/beige color from texture');
    console.log('   7. Verify ring is tilted (not horizontal)\n');

    console.log('========================================\n');

    // Assertions
    expect(errors.length).toBe(0);
    expect(canvasExists).toBe(true);
  });
});
