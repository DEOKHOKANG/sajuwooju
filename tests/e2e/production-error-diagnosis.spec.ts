import { test, expect } from '@playwright/test';

/**
 * Production Error Diagnosis
 *
 * 배포 사이트에서 발생하는 오류를 진단합니다:
 * 1. 페이지 로드 후 몇 초 후 발생하는 오류 캡처
 * 2. 토성 고리가 렌더링되지 않는 원인 분석
 * 3. 모든 console 메시지 상세 로깅
 */

test.describe('Production Error Diagnosis', () => {
  test('should diagnose Saturn ring rendering issue and errors', async ({ page }) => {
    const consoleMessages: {
      type: string;
      text: string;
      timestamp: number;
      location?: string;
    }[] = [];

    const errors: { message: string; stack?: string; timestamp: number }[] = [];
    const warnings: { message: string; timestamp: number }[] = [];

    // Capture ALL console messages with timestamp
    page.on('console', msg => {
      const timestamp = Date.now();
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp,
        location: msg.location()?.url
      });

      if (msg.type() === 'error') {
        errors.push({
          message: msg.text(),
          timestamp
        });
      } else if (msg.type() === 'warning') {
        warnings.push({
          message: msg.text(),
          timestamp
        });
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
      console.log('\n❌ PAGE ERROR:', error.message);
      if (error.stack) {
        console.log('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
      }
    });

    console.log('\n========== PRODUCTION ERROR DIAGNOSIS ==========\n');
    console.log('🌐 URL: https://sajuwooju.vercel.app');
    console.log('⏰ Start time:', new Date().toISOString());
    console.log('');

    const startTime = Date.now();

    // Navigate
    await page.goto('https://sajuwooju.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('✅ Page loaded at', (Date.now() - startTime) / 1000, 'seconds\n');

    // Wait and capture screenshots at different intervals
    console.log('📸 Capturing screenshots at intervals...\n');

    // 2 seconds
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/error-diagnosis-2s.png' });
    console.log('  - 2s screenshot saved');

    // 5 seconds
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'tests/screenshots/error-diagnosis-5s.png' });
    console.log('  - 5s screenshot saved');

    // 10 seconds (when error typically appears)
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'tests/screenshots/error-diagnosis-10s.png' });
    console.log('  - 10s screenshot saved');

    // 15 seconds
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'tests/screenshots/error-diagnosis-15s.png' });
    console.log('  - 15s screenshot saved\n');

    // Analyze console messages
    console.log('========== CONSOLE ANALYSIS ==========\n');

    console.log('📊 Summary:');
    console.log(`  Total messages: ${consoleMessages.length}`);
    console.log(`  Errors: ${errors.length}`);
    console.log(`  Warnings: ${warnings.length}\n`);

    if (errors.length > 0) {
      console.log('❌ ERRORS FOUND:\n');
      errors.forEach((err, idx) => {
        const timeOffset = ((err.timestamp - startTime) / 1000).toFixed(1);
        console.log(`  ${idx + 1}. [+${timeOffset}s] ${err.message}`);
        if (err.stack) {
          console.log(`     Stack: ${err.stack.split('\n')[0]}`);
        }
      });
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS FOUND:\n');
      warnings.forEach((warn, idx) => {
        const timeOffset = ((warn.timestamp - startTime) / 1000).toFixed(1);
        console.log(`  ${idx + 1}. [+${timeOffset}s] ${warn.message}`);
      });
      console.log('');
    }

    // Check for specific Saturn-related messages
    const saturnMessages = consoleMessages.filter(m =>
      m.text.toLowerCase().includes('saturn')
    );

    if (saturnMessages.length > 0) {
      console.log('🪐 SATURN-RELATED MESSAGES:\n');
      saturnMessages.forEach(msg => {
        const timeOffset = ((msg.timestamp - startTime) / 1000).toFixed(1);
        console.log(`  [+${timeOffset}s] [${msg.type}] ${msg.text}`);
      });
      console.log('');
    }

    // Check for React/Suspense errors
    const reactErrors = consoleMessages.filter(m =>
      m.text.toLowerCase().includes('react') ||
      m.text.toLowerCase().includes('suspense') ||
      m.text.toLowerCase().includes('boundary')
    );

    if (reactErrors.length > 0) {
      console.log('⚛️  REACT-RELATED MESSAGES:\n');
      reactErrors.forEach(msg => {
        const timeOffset = ((msg.timestamp - startTime) / 1000).toFixed(1);
        console.log(`  [+${timeOffset}s] [${msg.type}] ${msg.text}`);
      });
      console.log('');
    }

    // Timeline of all messages
    console.log('⏱️  MESSAGE TIMELINE:\n');
    consoleMessages.slice(0, 30).forEach(msg => {
      const timeOffset = ((msg.timestamp - startTime) / 1000).toFixed(1);
      console.log(`  [+${timeOffset}s] [${msg.type.padEnd(7)}] ${msg.text.substring(0, 100)}`);
    });

    if (consoleMessages.length > 30) {
      console.log(`  ... and ${consoleMessages.length - 30} more messages`);
    }

    console.log('\n========================================\n');
  });
});
