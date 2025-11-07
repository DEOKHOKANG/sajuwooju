const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Recursive Improvement Script
 * Compares clone with original and suggests improvements
 */

const CLONE_URL = 'http://localhost:3001';
const ORIGINAL_URL = 'https://sajutight.me';

const improvements = [];

async function analyzeAndCompare() {
  console.log('🔄 Starting Recursive Improvement Analysis...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });

  try {
    // Test 1: Product Detail Pages
    await testProductDetailPages(context);

    // Test 2: Category Pages
    await testCategoryPages(context);

    // Test 3: Menu Pages
    await testMenuPages(context);

    // Test 4: Interactive Elements
    await testInteractiveElements(context);

    // Generate improvement report
    generateReport();

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

async function testProductDetailPages(context) {
  console.log('📄 Testing Product Detail Pages...\n');

  const clonePage = await context.newPage();
  const originalPage = await context.newPage();

  // Test Product 1
  await clonePage.goto(`${CLONE_URL}/products/1`);
  await originalPage.goto(ORIGINAL_URL);

  // Find and click first product on original
  try {
    const firstProduct = originalPage.locator('a, div').filter({ hasText: '신년' }).first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await originalPage.waitForTimeout(2000);
    }
  } catch (e) {
    console.log('⚠️  Could not navigate to original product page');
  }

  // Compare layouts
  const cloneLayout = await analyzeLayout(clonePage);
  const originalLayout = await analyzeLayout(originalPage);

  console.log('Clone Layout:', cloneLayout);
  console.log('Original Layout:', originalLayout);

  // Check for improvements
  if (cloneLayout.headerHeight !== originalLayout.headerHeight) {
    improvements.push({
      page: 'Product Detail',
      issue: 'Header height mismatch',
      clone: cloneLayout.headerHeight,
      original: originalLayout.headerHeight,
      priority: 'medium'
    });
  }

  console.log('✓ Product detail pages analyzed\n');

  await clonePage.close();
  await originalPage.close();
}

async function testCategoryPages(context) {
  console.log('📂 Testing Category Pages...\n');

  const page = await context.newPage();

  // Test all 10 categories
  for (let i = 1; i <= 10; i++) {
    await page.goto(`${CLONE_URL}/category/${i}`);

    // Check page structure
    const hasHeader = await page.locator('h1').isVisible();
    const hasProducts = await page.locator('a[href^="/products/"]').count() > 0;
    const hasBackButton = await page.locator('button[aria-label="뒤로 가기"]').isVisible();

    if (!hasHeader || !hasProducts || !hasBackButton) {
      improvements.push({
        page: `Category ${i}`,
        issue: 'Missing elements',
        details: { hasHeader, hasProducts, hasBackButton },
        priority: 'high'
      });
    }

    console.log(`✓ Category ${i} tested`);
  }

  console.log('\n');
  await page.close();
}

async function testMenuPages(context) {
  console.log('⚙️  Testing Menu Pages...\n');

  const page = await context.newPage();

  const pagesToTest = [
    '/menu',
    '/reports',
    '/coupons',
    '/settings',
    '/support',
    '/terms',
    '/privacy'
  ];

  for (const pagePath of pagesToTest) {
    await page.goto(`${CLONE_URL}${pagePath}`);

    const hasHeader = await page.locator('header').isVisible();
    const hasBackButton = await page.locator('button[aria-label="뒤로 가기"]').isVisible();
    const hasContent = await page.locator('main, section, div').count() > 5;

    if (!hasHeader || !hasBackButton || !hasContent) {
      improvements.push({
        page: pagePath,
        issue: 'Page structure incomplete',
        details: { hasHeader, hasBackButton, hasContent },
        priority: 'medium'
      });
    }

    console.log(`✓ ${pagePath} tested`);
  }

  console.log('\n');
  await page.close();
}

async function testInteractiveElements(context) {
  console.log('🎯 Testing Interactive Elements...\n');

  const page = await context.newPage();

  // Test coupon tabs
  await page.goto(`${CLONE_URL}/coupons`);
  await page.click('text=만료됨');
  await page.waitForTimeout(500);

  const tabWorks = await page.locator('text=만료된 쿠폰이 없습니다, text=유효기간').first().isVisible();

  if (!tabWorks) {
    improvements.push({
      page: 'Coupons',
      issue: 'Tab interaction not working properly',
      priority: 'medium'
    });
  }

  console.log('✓ Coupon tabs tested');

  // Test settings toggles
  await page.goto(`${CLONE_URL}/settings`);
  const toggles = await page.locator('button').filter({ has: page.locator('div[style*="border-radius: 12px"]') }).count();

  if (toggles === 0) {
    improvements.push({
      page: 'Settings',
      issue: 'Toggle buttons not found',
      priority: 'low'
    });
  }

  console.log('✓ Settings toggles tested');

  // Test support FAQ
  await page.goto(`${CLONE_URL}/support`);
  await page.click('button:has-text("사주 상담은 어떻게 진행되나요?")');
  await page.waitForTimeout(500);

  const faqWorks = await page.locator('text=생년월일과 시간 정보를 입력').isVisible();

  if (!faqWorks) {
    improvements.push({
      page: 'Support',
      issue: 'FAQ accordion not working',
      priority: 'medium'
    });
  }

  console.log('✓ Support FAQ tested\n');

  await page.close();
}

async function analyzeLayout(page) {
  try {
    const header = await page.locator('header').boundingBox();
    const mainContent = await page.locator('main, section').first().boundingBox();

    return {
      headerHeight: header?.height || 0,
      contentTop: mainContent?.y || 0,
      url: page.url()
    };
  } catch (e) {
    return { error: e.message };
  }
}

function generateReport() {
  console.log('\n📊 Improvement Report\n');
  console.log('='.repeat(60));

  if (improvements.length === 0) {
    console.log('\n✅ No issues found! All pages are working correctly.\n');
    return;
  }

  // Group by priority
  const high = improvements.filter(i => i.priority === 'high');
  const medium = improvements.filter(i => i.priority === 'medium');
  const low = improvements.filter(i => i.priority === 'low');

  console.log(`\n🔴 High Priority (${high.length})`);
  high.forEach((imp, i) => {
    console.log(`\n${i + 1}. ${imp.page}`);
    console.log(`   Issue: ${imp.issue}`);
    if (imp.details) console.log(`   Details:`, imp.details);
  });

  console.log(`\n🟡 Medium Priority (${medium.length})`);
  medium.forEach((imp, i) => {
    console.log(`\n${i + 1}. ${imp.page}`);
    console.log(`   Issue: ${imp.issue}`);
    if (imp.clone && imp.original) {
      console.log(`   Clone: ${imp.clone}, Original: ${imp.original}`);
    }
  });

  console.log(`\n🟢 Low Priority (${low.length})`);
  low.forEach((imp, i) => {
    console.log(`\n${i + 1}. ${imp.page}`);
    console.log(`   Issue: ${imp.issue}`);
  });

  // Save to file
  const outputDir = path.join(__dirname, '..', 'analysis');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reportPath = path.join(outputDir, 'improvement-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalIssues: improvements.length,
    improvements
  }, null, 2));

  console.log(`\n📁 Report saved to: ${reportPath}\n`);
  console.log('='.repeat(60));
}

// Run the analysis
analyzeAndCompare().then(() => {
  console.log('\n✅ Recursive improvement analysis complete!\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Analysis failed:', error);
  process.exit(1);
});
