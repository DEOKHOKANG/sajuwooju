const { chromium } = require('playwright');

/**
 * Verify Category Product Filtering
 * Checks if each category shows the correct filtered products
 */

const CLONE_URL = 'http://localhost:3001';

// Expected products per category (based on categoryIds in products-data.ts)
const EXPECTED_PRODUCTS = {
  1: [1, 2, 3, 4, 5], // 이벤트
  2: [3, 9], // 궁합
  3: [1, 8, 9], // 솔로/연애운
  4: [2, 10], // 이별/재회
  5: [8], // 달콤운
  6: [6, 11], // 업신/사대운
  7: [4, 12], // 신년운세
  8: [5, 7], // 월별운세
  9: [6, 11], // 취업/직장운
  10: [12] // 관성/타운
};

async function verifyFiltering() {
  console.log('🔍 Verifying Category Product Filtering...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });

  const results = {
    passed: [],
    failed: []
  };

  try {
    const page = await context.newPage();

    for (let categoryId = 1; categoryId <= 10; categoryId++) {
      await page.goto(`${CLONE_URL}/category/${categoryId}`);
      await page.waitForLoadState('networkidle');

      // Get category name
      const categoryName = await page.locator('h1, h2').first().textContent();

      // Get all product links
      const productLinks = await page.locator('a[href^="/products/"]').all();
      const productIds = [];

      for (const link of productLinks) {
        const href = await link.getAttribute('href');
        const id = parseInt(href.split('/').pop());
        if (!productIds.includes(id)) {
          productIds.push(id);
        }
      }

      const expected = EXPECTED_PRODUCTS[categoryId];
      const isCorrect = JSON.stringify(productIds.sort()) === JSON.stringify(expected.sort());

      console.log(`Category ${categoryId}: ${categoryName}`);
      console.log(`  Expected: [${expected.join(', ')}]`);
      console.log(`  Actual:   [${productIds.join(', ')}]`);
      console.log(`  Status:   ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
      console.log('');

      if (isCorrect) {
        results.passed.push(categoryId);
      } else {
        results.failed.push({
          categoryId,
          categoryName,
          expected,
          actual: productIds
        });
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Passed: ${results.passed.length}/10`);
    console.log(`✗ Failed: ${results.failed.length}/10`);

    if (results.failed.length > 0) {
      console.log('\nFailed Categories:');
      results.failed.forEach(fail => {
        console.log(`  - Category ${fail.categoryId} (${fail.categoryName})`);
        console.log(`    Expected: [${fail.expected.join(', ')}]`);
        console.log(`    Got:      [${fail.actual.join(', ')}]`);
      });
    } else {
      console.log('\n✅ All categories are correctly filtered!');
    }
    console.log('='.repeat(60));

    await page.close();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

verifyFiltering().then(() => {
  console.log('\n✅ Verification complete!\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Verification failed:', error);
  process.exit(1);
});
