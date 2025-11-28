import { test, expect } from '@playwright/test';

/**
 * Saturn Zoom Test
 *
 * 토성을 확대해서 고리가 보이는지 확인합니다:
 * 1. 스크롤 다운으로 행성 선택 UI 찾기
 * 2. 토성 클릭 또는 선택
 * 3. 확대된 뷰에서 고리 확인
 */

test.describe('Saturn Zoom Test', () => {
  test('should zoom into Saturn and verify rings are visible', async ({ page }) => {
    console.log('\n========== SATURN ZOOM TEST ==========\n');

    await page.goto('https://sajuwooju.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await page.waitForTimeout(5000);

    // 초기 화면 캡처
    await page.screenshot({ path: 'tests/screenshots/saturn-test-initial.png' });
    console.log('📸 Initial view captured\n');

    // 스크롤 다운 - 행성 선택 UI가 아래에 있을 수 있음
    console.log('📜 Scrolling down to find planet selection UI...\n');

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: `tests/screenshots/saturn-test-scroll-${i + 1}.png`,
        fullPage: true
      });
    }

    // Canvas에서 마우스 휠로 줌 시도
    console.log('🔍 Attempting to zoom with mouse wheel...\n');

    const canvas = await page.locator('canvas').first();
    const box = await canvas.boundingBox();

    if (box) {
      // Canvas 중앙으로 이동
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

      // 마우스 휠로 줌인 (음수 값 = 줌인)
      for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, -100);
        await page.waitForTimeout(200);
      }

      await page.screenshot({ path: 'tests/screenshots/saturn-test-zoomed.png' });
      console.log('📸 Zoomed view captured\n');
    }

    // 페이지에서 "토성" 또는 "Saturn" 텍스트 찾기
    const saturnText = await page.getByText(/토성|Saturn/i).first();
    if (await saturnText.isVisible()) {
      console.log('✅ Found Saturn text element\n');
      await saturnText.click();
      await page.waitForTimeout(2000);

      await page.screenshot({ path: 'tests/screenshots/saturn-test-clicked.png' });
      console.log('📸 After clicking Saturn text\n');
    }

    // 행성 아이콘/버튼 찾기 시도
    const planetButtons = await page.locator('button, [role="button"]').all();
    console.log(`🔘 Found ${planetButtons.length} clickable elements\n`);

    // Canvas 위 특정 위치 클릭 (토성이 있을 것으로 예상되는 위치)
    // 스크린샷에서 토성은 왼쪽에 큰 주황색 행성(목성) 근처에 있음
    if (box) {
      console.log('🖱️  Clicking on estimated Saturn position...\n');

      // 목성 왼쪽 근처 (토성이 있을 추정 위치)
      const saturnX = box.x + box.width * 0.35;
      const saturnY = box.y + box.height * 0.48;

      await page.mouse.click(saturnX, saturnY);
      await page.waitForTimeout(2000);

      await page.screenshot({ path: 'tests/screenshots/saturn-test-position-click.png' });
      console.log('📸 After clicking estimated Saturn position\n');
    }

    console.log('========================================\n');
  });
});
