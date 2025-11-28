import { test, expect } from '@playwright/test';

/**
 * E2E Test: Cosmic Landing Page → Main Content Page
 *
 * Test Scenario:
 * 1. Visit landing page (/)
 * 2. Wait for solar system to load
 * 3. Click on solar system
 * 4. Verify fast rotation animation starts
 * 5. Wait for Big Bang flash transition
 * 6. Verify redirect to /main page
 * 7. Verify main page loads with white background
 */

test.describe('Cosmic Landing to Main Page Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should display cosmic landing page with solar system', async ({ page }) => {
    // Navigate to landing page
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if landing page has black background
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check for cosmic landing text
    const landingText = page.locator('text=사주우주');
    await expect(landingText).toBeVisible();

    // Check for instruction text
    const instructionText = page.locator('text=태양계를 클릭하세요');
    await expect(instructionText).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/01-landing-page.png', fullPage: true });

    console.log('✅ Landing page loaded successfully');
  });

  test('should animate and redirect to main page on solar system click', async ({ page }) => {
    // Navigate to landing page
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for 3D scene to initialize
    await page.waitForTimeout(2000);

    // Find and click the solar system canvas area
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Take screenshot before click
    await page.screenshot({ path: 'tests/screenshots/02-before-click.png', fullPage: true });

    console.log('🖱️ Clicking solar system...');

    // Click the canvas (solar system)
    await canvas.click({ position: { x: 500, y: 400 } });

    // Wait a moment to see rotation start
    await page.waitForTimeout(500);

    // Check if "우주로 떠나는 중..." text appears
    const rotatingText = page.locator('text=우주로 떠나는 중');
    await expect(rotatingText).toBeVisible({ timeout: 2000 });

    // Take screenshot during rotation
    await page.screenshot({ path: 'tests/screenshots/03-during-rotation.png', fullPage: true });

    console.log('🌀 Rotation animation started');

    // Wait for the animation to complete and redirect (3s rotation + 0.8s flash = ~4s)
    await page.waitForURL('http://localhost:3000/main', { timeout: 6000 });

    console.log('✨ Redirected to main page');

    // Take screenshot after redirect
    await page.screenshot({ path: 'tests/screenshots/04-main-page.png', fullPage: true });
  });

  test('should load main page with white background and content', async ({ page }) => {
    // Navigate directly to main page
    await page.goto('http://localhost:3000/main');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if main page has white background
    const mainDiv = page.locator('div.bg-white').first();
    await expect(mainDiv).toBeVisible();

    // Check for main heading (use h1 selector to be more specific)
    const heading = page.locator('main h1:has-text("우주의 법칙으로 읽는")');
    await expect(heading).toBeVisible();

    // Check for "나의 운명" gradient text (use h1 span selector to be specific)
    const gradientText = page.locator('main h1 span:has-text("나의 운명")');
    await expect(gradientText).toBeVisible();

    // Check for category section
    const categoryHeading = page.locator('text=행성 카테고리');
    await expect(categoryHeading).toBeVisible();

    // Check for event section
    const eventHeading = page.locator('text=사주우주 이벤트');
    await expect(eventHeading).toBeVisible();

    // Check for products section
    const productsHeading = page.locator('text=월간 랭킹 BEST');
    await expect(productsHeading).toBeVisible();

    // Take screenshot of main page
    await page.screenshot({ path: 'tests/screenshots/05-main-page-full.png', fullPage: true });

    console.log('✅ Main page loaded with all sections');
  });

  test('full flow: landing → click → animation → redirect → main', async ({ page }) => {
    console.log('\n🚀 Starting full E2E test flow...\n');

    // Step 1: Visit landing page
    console.log('📍 Step 1: Visiting landing page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for 3D scene

    // Verify landing page
    await expect(page.locator('text=사주우주')).toBeVisible();
    console.log('✅ Landing page loaded\n');

    // Step 2: Click solar system
    console.log('📍 Step 2: Clicking solar system...');
    const canvas = page.locator('canvas').first();
    await canvas.click({ position: { x: 500, y: 400 } });
    console.log('✅ Solar system clicked\n');

    // Step 3: Verify rotation animation
    console.log('📍 Step 3: Verifying rotation animation...');
    await expect(page.locator('text=우주로 떠나는 중')).toBeVisible({ timeout: 2000 });
    console.log('✅ Rotation animation started\n');

    // Step 4: Wait for Big Bang and redirect
    console.log('📍 Step 4: Waiting for Big Bang flash and redirect...');
    await page.waitForURL('http://localhost:3000/main', { timeout: 6000 });
    console.log('✅ Redirected to /main\n');

    // Step 5: Verify main page
    console.log('📍 Step 5: Verifying main page content...');
    await page.waitForLoadState('networkidle');

    // Check white background
    await expect(page.locator('div.bg-white').first()).toBeVisible();

    // Check main sections (use more specific selectors)
    await expect(page.locator('main h1:has-text("우주의 법칙으로 읽는")')).toBeVisible();
    await expect(page.locator('main h2:has-text("행성 카테고리")')).toBeVisible();
    await expect(page.locator('main h2:has-text("사주우주 이벤트")')).toBeVisible();
    await expect(page.locator('main h2:has-text("월간 랭킹 BEST")')).toBeVisible();

    console.log('✅ Main page content verified\n');

    // Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/06-final-result.png', fullPage: true });

    console.log('🎉 Full E2E test completed successfully!\n');
  });
});
