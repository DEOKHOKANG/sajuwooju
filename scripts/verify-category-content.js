const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Category Content Verification Script
 * Analyzes original site categories and compares with clone
 */

const CLONE_URL = 'http://localhost:3001';
const ORIGINAL_URL = 'https://sajuwooju.me';

const results = {
  categories: [],
  products: [],
  issues: []
};

async function verifyCategories() {
  console.log('🔍 Starting Category Content Verification...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });

  try {
    // Step 1: Analyze original site categories
    console.log('📊 Step 1: Analyzing Original Site Categories\n');
    const originalCategories = await analyzeOriginalCategories(context);

    // Step 2: Analyze clone categories
    console.log('📊 Step 2: Analyzing Clone Categories\n');
    const cloneCategories = await analyzeCloneCategories(context);

    // Step 3: Compare and identify differences
    console.log('📊 Step 3: Comparing Categories\n');
    await compareCategories(originalCategories, cloneCategories);

    // Step 4: Verify product details
    console.log('📊 Step 4: Verifying Product Details\n');
    await verifyProductDetails(context);

    // Generate report
    generateVerificationReport();

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

async function analyzeOriginalCategories(context) {
  const page = await context.newPage();
  await page.goto(ORIGINAL_URL);
  await page.waitForTimeout(3000);

  console.log('Analyzing original site categories...\n');

  // Get all categories from homepage
  const categories = await page.evaluate(() => {
    const categoryElements = Array.from(document.querySelectorAll('a, div')).filter(el => {
      const text = el.textContent?.trim();
      return text && ['이벤트', '신년운세', '궁합', '토정비결', '사주팔자', '타로', '꿈해몽', '작명', '부적', '재물운'].includes(text);
    });

    return categoryElements.map(el => ({
      label: el.textContent?.trim(),
      isClickable: el.tagName === 'A' || el.onclick !== null,
      href: el.href || null
    }));
  });

  console.log(`Found ${categories.length} categories on original site:`);
  categories.forEach((cat, i) => {
    console.log(`  ${i + 1}. ${cat.label} ${cat.isClickable ? '✓' : '✗'}`);
  });
  console.log('');

  results.categories = categories;
  await page.close();
  return categories;
}

async function analyzeCloneCategories(context) {
  const page = await context.newPage();
  await page.goto(CLONE_URL);
  await page.waitForLoadState('networkidle');

  console.log('Analyzing clone categories...\n');

  // Get all category links
  const categories = await page.evaluate(() => {
    const categoryLinks = Array.from(document.querySelectorAll('a[href^="/category/"]'));
    return categoryLinks.map(link => {
      const label = link.querySelector('span')?.textContent?.trim();
      const id = link.getAttribute('href')?.split('/').pop();
      return { label, id, href: link.href };
    });
  });

  console.log(`Found ${categories.length} categories on clone:`);
  categories.forEach((cat, i) => {
    console.log(`  ${i + 1}. ${cat.label} (ID: ${cat.id})`);
  });
  console.log('');

  await page.close();
  return categories;
}

async function compareCategories(original, clone) {
  console.log('Comparing categories...\n');

  const originalLabels = original.map(c => c.label);
  const cloneLabels = clone.map(c => c.label);

  // Check for missing categories
  const missing = originalLabels.filter(label => !cloneLabels.includes(label));
  const extra = cloneLabels.filter(label => !originalLabels.includes(label));

  if (missing.length > 0) {
    console.log('⚠️  Missing categories in clone:');
    missing.forEach(label => console.log(`   - ${label}`));
    results.issues.push({
      type: 'missing_categories',
      categories: missing,
      priority: 'high'
    });
  } else {
    console.log('✓ All original categories present in clone');
  }

  if (extra.length > 0) {
    console.log('\n⚠️  Extra categories in clone:');
    extra.forEach(label => console.log(`   - ${label}`));
    results.issues.push({
      type: 'extra_categories',
      categories: extra,
      priority: 'low'
    });
  }

  console.log('');
}

async function verifyProductDetails(context) {
  const page = await context.newPage();

  console.log('Verifying product detail pages...\n');

  // Test first 5 products
  for (let i = 1; i <= 5; i++) {
    await page.goto(`${CLONE_URL}/products/${i}`);
    await page.waitForLoadState('networkidle');

    const productData = await page.evaluate(() => {
      const title = document.querySelector('h1, h2')?.textContent?.trim();
      const subtitle = document.querySelector('p')?.textContent?.trim();
      const hasImage = document.querySelector('img[alt]') !== null;
      const hasReviews = document.querySelector('text=고객 후기, text=리뷰') !== null;
      const hasDescription = document.querySelector('text=상품 설명') !== null;
      const hasCTA = document.querySelector('text=상담 신청하기, button') !== null;

      return {
        title,
        subtitle,
        hasImage,
        hasReviews,
        hasDescription,
        hasCTA
      };
    });

    console.log(`Product ${i}:`);
    console.log(`  Title: ${productData.title}`);
    console.log(`  Image: ${productData.hasImage ? '✓' : '✗'}`);
    console.log(`  Reviews: ${productData.hasReviews ? '✓' : '✗'}`);
    console.log(`  Description: ${productData.hasDescription ? '✓' : '✗'}`);
    console.log(`  CTA Button: ${productData.hasCTA ? '✓' : '✗'}`);

    results.products.push({
      id: i,
      ...productData,
      verified: productData.hasImage && productData.hasReviews && productData.hasDescription && productData.hasCTA
    });

    // Check if missing critical elements
    if (!productData.hasImage || !productData.hasCTA) {
      results.issues.push({
        type: 'incomplete_product',
        productId: i,
        missing: [
          !productData.hasImage && 'image',
          !productData.hasCTA && 'CTA button'
        ].filter(Boolean),
        priority: 'high'
      });
    }

    console.log('');
  }

  // Test category pages
  console.log('Verifying category pages...\n');

  for (let i = 1; i <= 10; i++) {
    await page.goto(`${CLONE_URL}/category/${i}`);
    await page.waitForLoadState('networkidle');

    const categoryData = await page.evaluate(() => {
      const title = document.querySelector('h1, h2')?.textContent?.trim();
      const productCount = document.querySelectorAll('a[href^="/products/"]').length;
      const hasDescription = document.querySelector('p')?.textContent?.includes('관련 전문 사주 상담');
      const hasBackButton = document.querySelector('button[aria-label="뒤로 가기"]') !== null;

      return {
        title,
        productCount,
        hasDescription,
        hasBackButton
      };
    });

    console.log(`Category ${i}: ${categoryData.title}`);
    console.log(`  Products: ${categoryData.productCount}`);
    console.log(`  Description: ${categoryData.hasDescription ? '✓' : '✗'}`);
    console.log(`  Back Button: ${categoryData.hasBackButton ? '✓' : '✗'}`);

    // Check if products are showing
    if (categoryData.productCount === 0) {
      results.issues.push({
        type: 'empty_category',
        categoryId: i,
        title: categoryData.title,
        priority: 'high'
      });
    }

    console.log('');
  }

  await page.close();
}

function generateVerificationReport() {
  console.log('\n' + '='.repeat(70));
  console.log('📊 CATEGORY & CONTENT VERIFICATION REPORT');
  console.log('='.repeat(70) + '\n');

  // Categories summary
  console.log('CATEGORIES:');
  console.log(`  Total on original: ${results.categories.length}`);
  console.log('');

  // Products summary
  console.log('PRODUCTS VERIFIED:');
  const verifiedProducts = results.products.filter(p => p.verified).length;
  console.log(`  Verified: ${verifiedProducts}/${results.products.length}`);
  console.log('');

  // Issues summary
  if (results.issues.length === 0) {
    console.log('✅ NO ISSUES FOUND - All categories and products verified!\n');
  } else {
    console.log(`⚠️  ISSUES FOUND: ${results.issues.length}\n`);

    const high = results.issues.filter(i => i.priority === 'high');
    const medium = results.issues.filter(i => i.priority === 'medium');
    const low = results.issues.filter(i => i.priority === 'low');

    if (high.length > 0) {
      console.log(`🔴 High Priority (${high.length}):`);
      high.forEach((issue, i) => {
        console.log(`\n${i + 1}. ${issue.type}`);
        if (issue.categories) console.log(`   Categories: ${issue.categories.join(', ')}`);
        if (issue.productId) console.log(`   Product ID: ${issue.productId}`);
        if (issue.missing) console.log(`   Missing: ${issue.missing.join(', ')}`);
        if (issue.title) console.log(`   Title: ${issue.title}`);
      });
      console.log('');
    }

    if (medium.length > 0) {
      console.log(`🟡 Medium Priority (${medium.length}):`);
      medium.forEach((issue, i) => {
        console.log(`\n${i + 1}. ${issue.type}`);
      });
      console.log('');
    }

    if (low.length > 0) {
      console.log(`🟢 Low Priority (${low.length}):`);
      low.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.type}`);
      });
      console.log('');
    }
  }

  // Save to file
  const outputDir = path.join(__dirname, '..', 'analysis');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reportPath = path.join(outputDir, 'category-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));

  console.log(`📁 Report saved to: ${reportPath}\n`);
  console.log('='.repeat(70));
}

// Run verification
verifyCategories().then(() => {
  console.log('\n✅ Category content verification complete!\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Verification failed:', error);
  process.exit(1);
});
