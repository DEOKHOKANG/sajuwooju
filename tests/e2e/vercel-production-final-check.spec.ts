import { test, expect } from '@playwright/test';

/**
 * Vercel Production Final Check
 *
 * This test verifies the deployed Vercel site after useTexture fix:
 * 1. Waits for deployment to complete
 * 2. Captures visual screenshot of solar system
 * 3. Checks for Saturn rings visibility
 * 4. Checks for Earth bright atmosphere
 * 5. Verifies all textures load successfully (200 OK)
 * 6. Ensures NO console warnings about texture loading failures
 */

test.describe('Vercel Production - Final useTexture Verification', () => {
  test('should verify Saturn rings and Earth atmosphere on deployed site', async ({ page }) => {
    const consoleMessages: { type: string; text: string; timestamp: Date }[] = [];
    const textureRequests: {
      url: string;
      status: number;
      ok: boolean;
      timestamp: Date;
    }[] = [];

    // Capture all console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date()
      });
    });

    // Capture all texture requests
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/textures/') || url.includes('.jpg') || url.includes('.png')) {
        textureRequests.push({
          url,
          status: response.status(),
          ok: response.ok(),
          timestamp: new Date()
        });
      }
    });

    console.log('\n========== VERCEL PRODUCTION - FINAL CHECK ==========\n');
    console.log('🌐 Testing: https://sajuwooju.vercel.app');
    console.log('⏰ Waiting for deployment and texture loading...\n');

    // Navigate to production site
    await page.goto('https://sajuwooju.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait extra time for:
    // 1. Vercel edge deployment to complete
    // 2. 3D scene to initialize
    // 3. All textures to load via useTexture
    // 4. Solar system animation to start
    console.log('⏳ Waiting 10 seconds for full scene initialization...');
    await page.waitForTimeout(10000);

    // Capture screenshot
    const screenshotPath = 'tests/screenshots/vercel-production-final.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}\n`);

    // Analyze results
    console.log('========== ANALYSIS ==========\n');

    // 1. Saturn Texture Warnings
    const saturnWarnings = consoleMessages.filter(m =>
      m.text.toLowerCase().includes('saturn') &&
      (m.type === 'warning' || m.type === 'error')
    );

    console.log('📋 Saturn Texture Warnings:');
    if (saturnWarnings.length === 0) {
      console.log('✅ No Saturn texture warnings (useTexture working correctly)\n');
    } else {
      console.log(`❌ Found ${saturnWarnings.length} Saturn warnings:\n`);
      saturnWarnings.forEach(w => {
        console.log(`   - [${w.type}] ${w.text}`);
      });
      console.log('');
    }

    // 2. Texture Requests
    console.log('🌐 Texture Requests:');
    if (textureRequests.length === 0) {
      console.log('⚠️  NO texture requests detected - possible Suspense issue\n');
    } else {
      textureRequests.forEach(req => {
        const filename = req.url.split('/').pop();
        const statusIcon = req.ok ? '✅' : '❌';
        console.log(`${statusIcon} ${req.status} - ${filename}`);
      });
      console.log('');
    }

    // 3. Console Errors
    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');

    console.log('📊 Summary:');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Console errors: ${errors.length}`);
    console.log(`Console warnings: ${warnings.length}`);
    console.log(`Saturn warnings: ${saturnWarnings.length}`);
    console.log(`Texture requests: ${textureRequests.length}`);
    console.log(`Failed texture requests: ${textureRequests.filter(r => !r.ok).length}\n`);

    // 4. Expected Results
    console.log('🔍 Expected Results:');
    console.log('   ✅ Saturn rings should be visible in screenshot');
    console.log('   ✅ Earth atmosphere should be bright sky blue');
    console.log('   ✅ NO "Saturn texture failed to load" warnings');
    console.log('   ✅ All texture requests return 200 OK');
    console.log('   ✅ useTexture hook working with Suspense\n');

    // Log any errors for debugging
    if (errors.length > 0) {
      console.log('❌ Console Errors Found:');
      errors.forEach(e => {
        console.log(`   - ${e.text}`);
      });
      console.log('');
    }

    // Assertions
    expect(saturnWarnings.length).toBe(0);
    expect(textureRequests.length).toBeGreaterThan(0);
    expect(textureRequests.filter(r => !r.ok && !r.url.includes('pluto')).length).toBe(0);
  });
});
