import { test, expect } from '@playwright/test';

test.describe('Planet Detail Check', () => {
  test('should capture solar system for planet inspection', async ({ page }) => {
    // Visit landing page
    await page.goto('http://localhost:3001/');

    // Wait for 3D scene to load
    await page.waitForTimeout(5000);

    // Capture full screenshot
    await page.screenshot({
      path: 'tests/screenshots/planet-inspection.png',
      fullPage: true
    });

    console.log('✅ Screenshot captured: planet-inspection.png');
  });
});
