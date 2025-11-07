const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function compareClone() {
  console.log('🔍 Clone Comparison Tool\n');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });

  const page = await context.newPage();

  // 우리의 복제본 스크린샷
  console.log('\n📸 Taking screenshot of our clone (localhost:3001)...');
  await page.goto('http://localhost:3001', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(2000);

  const cloneDir = path.join(__dirname, '../analysis/clone-result');
  if (!fs.existsSync(cloneDir)) {
    fs.mkdirSync(cloneDir, { recursive: true });
  }

  await page.screenshot({
    path: path.join(cloneDir, 'clone-mobile.png'),
    fullPage: true
  });

  console.log('✅ Screenshot saved: clone-mobile.png');

  // 요소 측정
  console.log('\n📏 Measuring our clone...');

  const measurements = await page.evaluate(() => {
    const measurements = {};

    // 헤더
    const header = document.querySelector('header');
    if (header) {
      measurements.header = {
        height: header.offsetHeight,
        bgColor: window.getComputedStyle(header).backgroundColor
      };
    }

    // 제목들
    const headings = Array.from(document.querySelectorAll('h2')).map(h => ({
      text: h.textContent.trim(),
      fontSize: window.getComputedStyle(h).fontSize,
      fontWeight: window.getComputedStyle(h).fontWeight,
      color: window.getComputedStyle(h).color
    }));
    measurements.headings = headings;

    // 카테고리 아이콘
    const categoryGrid = document.querySelector('.grid-cols-5');
    if (categoryGrid) {
      const items = categoryGrid.querySelectorAll('div');
      measurements.categories = {
        count: items.length,
        gridCols: window.getComputedStyle(categoryGrid).gridTemplateColumns
      };
    }

    // 채팅 버튼
    const chatBtn = document.querySelector('[aria-label="채팅"]');
    if (chatBtn) {
      const rect = chatBtn.getBoundingClientRect();
      measurements.chatButton = {
        width: rect.width,
        height: rect.height,
        bottom: window.innerHeight - rect.bottom,
        right: window.innerWidth - rect.right,
        bgColor: window.getComputedStyle(chatBtn).backgroundColor,
        borderRadius: window.getComputedStyle(chatBtn).borderRadius
      };
    }

    return measurements;
  });

  console.log('\n📊 Clone Measurements:');
  console.log(JSON.stringify(measurements, null, 2));

  // 비교 리포트 작성
  const originalMeasurements = {
    header: { height: 60, bgColor: 'rgb(255, 255, 255)' },
    headings: [
      { fontSize: '20px', fontWeight: '600', color: 'rgb(65, 66, 84)' }
    ],
    categories: { count: 10 },
    chatButton: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      bgColor: 'rgb(244, 63, 94)'
    }
  };

  console.log('\n🎯 COMPARISON REPORT');
  console.log('='.repeat(60));

  // 헤더 비교
  if (measurements.header) {
    const heightMatch = Math.abs(measurements.header.height - originalMeasurements.header.height) <= 2;
    console.log(`\n✓ Header Height: ${measurements.header.height}px ${heightMatch ? '✅' : '❌'} (Expected: 60px)`);
    console.log(`  BG Color: ${measurements.header.bgColor} ${measurements.header.bgColor === originalMeasurements.header.bgColor ? '✅' : '⚠️'}`);
  }

  // 제목 비교
  if (measurements.headings.length > 0) {
    const h = measurements.headings[0];
    console.log(`\n✓ Heading Style:`);
    console.log(`  Font Size: ${h.fontSize} ${h.fontSize === '20px' ? '✅' : '❌'}`);
    console.log(`  Font Weight: ${h.fontWeight} ${h.fontWeight === '600' ? '✅' : '⚠️'}`);
    console.log(`  Color: ${h.color} ${h.color === 'rgb(65, 66, 84)' ? '✅' : '❌'}`);
  }

  // 카테고리 비교
  if (measurements.categories) {
    console.log(`\n✓ Categories: ${measurements.categories.count} items ${measurements.categories.count === 10 ? '✅' : '❌'}`);
  }

  // 채팅 버튼 비교
  if (measurements.chatButton) {
    const btn = measurements.chatButton;
    console.log(`\n✓ Chat Button:`);
    console.log(`  Size: ${btn.width}x${btn.height} ${Math.abs(btn.width - 56) <= 2 ? '✅' : '❌'}`);
    console.log(`  Position: bottom-${btn.bottom}px, right-${btn.right}px`);
    console.log(`  Border Radius: ${btn.borderRadius} ${btn.borderRadius === '50%' || btn.borderRadius.includes('9999') ? '✅' : '❌'}`);
    console.log(`  BG Color: ${btn.bgColor} ${btn.bgColor === 'rgb(244, 63, 94)' ? '✅' : '❌'}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📁 Results saved to: analysis/clone-result/');
  console.log('\n💡 Compare with: analysis/screenshot-mobile.png');

  await browser.close();
}

compareClone().catch(console.error);
