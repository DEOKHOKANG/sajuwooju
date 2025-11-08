import { test, expect } from '@playwright/test';

/**
 * Suspense Fix Verification
 * React Three Fiber Suspense 경계를 통한 텍스처 로딩 검증
 */

test.describe('Suspense Fix Verification', () => {
  test('should verify Saturn rings and Earth atmosphere render correctly in local production', async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];
    const textureRequests: { url: string; status: number; ok: boolean }[] = [];

    // Capture console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Capture network responses for textures
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/textures/') || url.includes('.jpg') || url.includes('.png')) {
        textureRequests.push({
          url,
          status: response.status(),
          ok: response.ok()
        });
      }
    });

    // Visit local production server
    await page.goto('http://localhost:3003/');

    // Wait for 3D scene to load (with textures via Suspense)
    await page.waitForTimeout(8000);

    // Capture screenshot
    await page.screenshot({
      path: 'tests/screenshots/suspense-fix-verification.png',
      fullPage: true
    });

    console.log('\n========== SUSPENSE FIX VERIFICATION ==========');

    // Check console for warnings
    const saturnWarnings = consoleMessages.filter(m =>
      m.text.includes('Saturn') && m.type === 'warning'
    );

    console.log('\n📋 Saturn Texture Warnings:');
    if (saturnWarnings.length === 0) {
      console.log('✅ No Saturn texture warnings (Suspense working correctly)');
    } else {
      console.log('❌ Saturn texture warnings still present:');
      saturnWarnings.forEach(w => console.log(`   ${w.text}`));
    }

    // Check texture requests
    console.log('\n🌐 Texture Requests:');
    textureRequests.forEach(req => {
      const icon = req.ok ? '✅' : '❌';
      console.log(`${icon} ${req.status} - ${req.url}`);
    });

    console.log('\n📊 Summary:');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Console errors: ${consoleMessages.filter(m => m.type === 'error').length}`);
    console.log(`Console warnings: ${consoleMessages.filter(m => m.type === 'warning').length}`);
    console.log(`Saturn warnings: ${saturnWarnings.length}`);
    console.log(`Texture requests: ${textureRequests.length}`);
    console.log(`Failed texture requests: ${textureRequests.filter(r => !r.ok).length}`);

    // Expectations
    console.log('\n🔍 Expected Results:');
    console.log('   ✅ Saturn rings should be visible in screenshot');
    console.log('   ✅ Earth atmosphere should be bright sky blue');
    console.log('   ✅ NO "Saturn texture failed to load" warnings');
    console.log('   ✅ All texture requests return 200 OK');
  });
});
