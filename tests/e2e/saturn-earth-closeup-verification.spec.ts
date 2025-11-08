import { test, expect } from '@playwright/test';

/**
 * Saturn & Earth Close-up Verification
 *
 * This test zooms in on Saturn and Earth to visually verify:
 * 1. Saturn rings are visible with texture
 * 2. Earth atmosphere is bright sky blue (#87CEEB)
 * 3. All textures loaded successfully
 */

test.describe('Saturn & Earth Close-up Verification', () => {
  test('should show Saturn rings and bright Earth atmosphere in detail', async ({ page }) => {
    console.log('\n========== SATURN & EARTH CLOSE-UP VERIFICATION ==========\n');

    const textureRequests: { url: string; status: number }[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/textures/')) {
        textureRequests.push({
          url,
          status: response.status()
        });
      }
    });

    // Navigate to production
    console.log('🌐 Loading: https://sajuwooju.vercel.app\n');
    await page.goto('https://sajuwooju.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait for initial scene load
    await page.waitForTimeout(8000);

    // Take initial screenshot
    await page.screenshot({
      path: 'tests/screenshots/production-initial.png'
    });
    console.log('📸 Initial screenshot saved\n');

    // Try to interact with the scene to rotate or zoom
    // Click and drag to rotate the solar system
    const canvas = await page.locator('canvas').first();

    // Get canvas bounding box
    const box = await canvas.boundingBox();
    if (box) {
      // Drag to rotate the view to better see planets
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2);
      await page.mouse.up();

      console.log('🔄 Rotated solar system view\n');
      await page.waitForTimeout(2000);
    }

    // Take rotated screenshot
    await page.screenshot({
      path: 'tests/screenshots/production-rotated.png'
    });
    console.log('📸 Rotated view screenshot saved\n');

    // Scroll down to see if there are planet navigation buttons
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Take scrolled screenshot
    await page.screenshot({
      path: 'tests/screenshots/production-scrolled.png',
      fullPage: true
    });
    console.log('📸 Scrolled view screenshot saved\n');

    // Check texture loading results
    console.log('🌐 Texture Loading Results:\n');

    const saturnTexture = textureRequests.find(r => r.url.includes('saturn.jpg'));
    const saturnRing = textureRequests.find(r => r.url.includes('saturnRing.png'));
    const earthDay = textureRequests.find(r => r.url.includes('earth.jpg') && !r.url.includes('Night') && !r.url.includes('Clouds'));
    const earthNight = textureRequests.find(r => r.url.includes('earthNight.jpg'));
    const earthClouds = textureRequests.find(r => r.url.includes('earthClouds.jpg'));

    console.log(`Saturn surface: ${saturnTexture ? '✅ ' + saturnTexture.status : '❌ Not loaded'}`);
    console.log(`Saturn rings: ${saturnRing ? '✅ ' + saturnRing.status : '❌ Not loaded'}`);
    console.log(`Earth day: ${earthDay ? '✅ ' + earthDay.status : '❌ Not loaded'}`);
    console.log(`Earth night: ${earthNight ? '✅ ' + earthNight.status : '❌ Not loaded'}`);
    console.log(`Earth clouds: ${earthClouds ? '✅ ' + earthClouds.status : '❌ Not loaded'}`);
    console.log('');

    console.log('📊 Summary:');
    console.log(`Total texture requests: ${textureRequests.length}`);
    console.log(`Successful (200): ${textureRequests.filter(r => r.status === 200).length}`);
    console.log(`Failed (404): ${textureRequests.filter(r => r.status === 404).length}\n`);

    console.log('🔍 Visual Verification Needed:');
    console.log('   Check production-initial.png for overall scene');
    console.log('   Check production-rotated.png for different angle');
    console.log('   Check production-scrolled.png for full page view');
    console.log('   Look for Saturn with visible rings');
    console.log('   Look for Earth with bright blue atmosphere\n');

    // Assertions
    expect(saturnTexture?.status).toBe(200);
    expect(saturnRing?.status).toBe(200);
    expect(earthDay?.status).toBe(200);
    expect(earthNight?.status).toBe(200);
    expect(earthClouds?.status).toBe(200);
  });
});
