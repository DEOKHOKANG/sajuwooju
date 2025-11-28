import { test, expect } from '@playwright/test';

/**
 * Detailed Production Analysis
 * 프로덕션 배포 상세 분석 - 콘솔 에러 및 네트워크 요청 추적
 */

test.describe('Detailed Production Analysis', () => {
  const PRODUCTION_URL = 'https://sajuwooju.vercel.app';

  test('should analyze console errors and network requests', async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];
    const networkErrors: { url: string; status: number }[] = [];
    const textureRequests: { url: string; status: number; ok: boolean }[] = [];

    // Capture all console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Capture network responses
    page.on('response', response => {
      const url = response.url();
      const status = response.status();

      // Track texture file requests
      if (url.includes('/textures/') || url.includes('.jpg') || url.includes('.png')) {
        textureRequests.push({
          url,
          status,
          ok: response.ok()
        });
      }

      // Track failed requests
      if (!response.ok()) {
        networkErrors.push({ url, status });
      }
    });

    // Visit production page
    await page.goto(PRODUCTION_URL);

    // Wait for 3D scene to load
    await page.waitForTimeout(8000);

    // Capture screenshot
    await page.screenshot({
      path: 'tests/screenshots/detailed-production-analysis.png',
      fullPage: true
    });

    // Print analysis results
    console.log('\n========== CONSOLE MESSAGES ==========');
    consoleMessages.forEach((msg, i) => {
      console.log(`[${i + 1}] [${msg.type}] ${msg.text}`);
    });

    console.log('\n========== TEXTURE REQUESTS ==========');
    if (textureRequests.length === 0) {
      console.log('⚠️  NO TEXTURE REQUESTS DETECTED!');
    } else {
      textureRequests.forEach((req, i) => {
        const icon = req.ok ? '✅' : '❌';
        console.log(`${icon} [${i + 1}] ${req.status} - ${req.url}`);
      });
    }

    console.log('\n========== NETWORK ERRORS ==========');
    if (networkErrors.length === 0) {
      console.log('✅ No network errors');
    } else {
      networkErrors.forEach((err, i) => {
        console.log(`❌ [${i + 1}] ${err.status} - ${err.url}`);
      });
    }

    console.log('\n========== SUMMARY ==========');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Console errors: ${consoleMessages.filter(m => m.type === 'error').length}`);
    console.log(`Console warnings: ${consoleMessages.filter(m => m.type === 'warning').length}`);
    console.log(`Texture requests: ${textureRequests.length}`);
    console.log(`Failed texture requests: ${textureRequests.filter(r => !r.ok).length}`);
    console.log(`Total network errors: ${networkErrors.length}`);
  });

  test('should check if texture files are accessible', async ({ page, request }) => {
    const texturePaths = [
      '/textures/saturn.jpg',
      '/textures/saturnRing.png',
      '/textures/earth_daymap.jpg',
      '/textures/earth_nightmap.jpg',
      '/textures/earth_clouds.jpg',
    ];

    console.log('\n========== DIRECT TEXTURE ACCESS TEST ==========');

    for (const path of texturePaths) {
      const url = `${PRODUCTION_URL}${path}`;
      try {
        const response = await request.get(url);
        const status = response.status();
        const icon = response.ok() ? '✅' : '❌';
        console.log(`${icon} ${status} - ${url}`);
      } catch (error) {
        console.log(`❌ ERROR - ${url} - ${error}`);
      }
    }
  });
});
