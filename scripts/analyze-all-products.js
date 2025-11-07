const { chromium } = require('playwright');
const fs = require('fs');

const CATEGORIES = [
  { id: 1, name: '이벤트!', url: 'https://sajuwooju.me/?category=%EC%9D%B4%EB%B2%A4%ED%8A%B8!' },
  { id: 2, name: '궁합', url: 'https://sajuwooju.me/?category=%EA%B6%81%ED%95%A9' },
  { id: 3, name: '솔로/연애운', url: 'https://sajuwooju.me/?category=%EC%86%94%EB%A1%9C%2F%EC%97%B0%EC%95%A0%EC%9A%B4' },
  { id: 4, name: '이별/재회', url: 'https://sajuwooju.me/?category=%EC%9D%B4%EB%B3%84%2F%EC%9E%AC%ED%9A%8C' },
  { id: 5, name: '결혼운', url: 'https://sajuwooju.me/?category=%EA%B2%B0%ED%98%BC%EC%9A%B4' },
  { id: 6, name: '임신/자녀운', url: 'https://sajuwooju.me/?category=%EC%9E%84%EC%8B%A0%2F%EC%9E%90%EB%85%80%EC%9A%B4' },
  { id: 7, name: '신년운세', url: 'https://sajuwooju.me/?category=%EC%8B%A0%EB%85%84%EC%9A%B4%EC%84%B8' },
  { id: 8, name: '월별운세', url: 'https://sajuwooju.me/?category=%EC%9B%94%EB%B3%84%EC%9A%B4%EC%84%B8' },
  { id: 9, name: '취업/직업운', url: 'https://sajuwooju.me/?category=%EC%B7%A8%EC%97%85%2F%EC%A7%81%EC%97%85%EC%9A%B4' },
  { id: 10, name: '관상/타로', url: 'https://sajuwooju.me/?category=%EA%B4%80%EC%83%81%2F%ED%83%80%EB%A1%9C' },
  { id: 14, name: '재물운', url: 'https://sajuwooju.me/?category=%EC%9E%AC%EB%AC%BC%EC%9A%B4' }
];

async function analyzeAllProducts() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allProducts = [];
  const productsByCategory = {};

  console.log('Starting comprehensive product analysis...\n');

  for (const category of CATEGORIES) {
    console.log(`\n========================================`);
    console.log(`Analyzing Category: ${category.name} (ID: ${category.id})`);
    console.log(`URL: ${category.url}`);
    console.log(`========================================\n`);

    try {
      await page.goto(category.url, { waitUntil: 'networkidle', timeout: 60000 });

      // Wait for products to load
      await page.waitForTimeout(5000);

      // Scroll to load all products
      console.log('Scrolling to load all products...');
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(1000);
      }

      // Extract product cards
      const products = await page.evaluate(() => {
        const productCards = [];

        // Try different selectors for product cards
        const selectors = [
          '[class*="product"]',
          '[class*="card"]',
          'a[href*="product"]',
          'div[class*="item"]',
          '[data-type="product"]',
          'div[style*="cursor: pointer"]'
        ];

        let elements = [];
        for (const selector of selectors) {
          const found = document.querySelectorAll(selector);
          if (found.length > 0) {
            elements = Array.from(found);
            console.log(`Found ${found.length} elements with selector: ${selector}`);
            break;
          }
        }

        // If no specific selectors work, try to find clickable divs with images
        if (elements.length === 0) {
          elements = Array.from(document.querySelectorAll('div')).filter(el => {
            const hasImage = el.querySelector('img');
            const hasText = el.textContent.trim().length > 0;
            const style = window.getComputedStyle(el);
            const isClickable = style.cursor === 'pointer' || el.onclick;
            return hasImage && hasText && isClickable;
          });
          console.log(`Found ${elements.length} clickable divs with images`);
        }

        elements.forEach((card, index) => {
          try {
            // Extract title
            const titleEl = card.querySelector('[class*="title"], h1, h2, h3, strong, b') ||
                           Array.from(card.querySelectorAll('*')).find(el => {
                             const text = el.textContent.trim();
                             return text.length > 10 && text.length < 100 && !el.querySelector('*');
                           });
            const title = titleEl ? titleEl.textContent.trim() : '';

            // Extract subtitle
            const subtitleEl = card.querySelector('[class*="subtitle"], [class*="description"], p, span') ||
                              Array.from(card.querySelectorAll('*')).find(el => {
                                const text = el.textContent.trim();
                                return text.startsWith('[') && text.endsWith(']');
                              });
            const subtitle = subtitleEl ? subtitleEl.textContent.trim() : '';

            // Extract image
            const img = card.querySelector('img');
            const image = img ? (img.src || img.dataset.src || '') : '';

            // Extract rating
            const ratingEl = Array.from(card.querySelectorAll('*')).find(el => {
              const text = el.textContent.trim();
              return /^\d\.\d$/.test(text);
            });
            const rating = ratingEl ? parseFloat(ratingEl.textContent.trim()) : 0;

            // Extract views
            const viewsEl = Array.from(card.querySelectorAll('*')).find(el => {
              const text = el.textContent.trim();
              return text.includes('만+') || text.includes('천+');
            });
            const views = viewsEl ? viewsEl.textContent.trim() : '';

            // Extract discount
            const discountEl = Array.from(card.querySelectorAll('*')).find(el => {
              const text = el.textContent.trim();
              return text.includes('%') && /\d+%/.test(text);
            });
            const discount = discountEl ? parseInt(discountEl.textContent.match(/(\d+)%/)[1]) : 0;

            // Extract price
            const priceEl = Array.from(card.querySelectorAll('*')).find(el => {
              const text = el.textContent.trim();
              return text.includes('원') || text.includes(',');
            });
            const price = priceEl ? priceEl.textContent.trim() : '';

            // Extract link
            const linkEl = card.closest('a') || card.querySelector('a');
            const link = linkEl ? linkEl.href : '';

            if (title || subtitle || image) {
              productCards.push({
                title,
                subtitle,
                image,
                rating,
                views,
                discount,
                price,
                link,
                htmlSnippet: card.outerHTML.substring(0, 500)
              });
            }
          } catch (err) {
            console.error(`Error extracting product ${index}:`, err.message);
          }
        });

        return productCards;
      });

      console.log(`Found ${products.length} products in ${category.name}`);

      // Store products by category
      productsByCategory[category.name] = products;

      // Add category info to each product
      products.forEach(product => {
        const existing = allProducts.find(p =>
          p.title === product.title ||
          p.image === product.image ||
          p.link === product.link
        );

        if (existing) {
          // Add category to existing product
          if (!existing.categoryIds.includes(category.id)) {
            existing.categoryIds.push(category.id);
            existing.categories.push(category.name);
          }
        } else {
          // Add new product
          allProducts.push({
            ...product,
            categoryIds: [category.id],
            categories: [category.name]
          });
        }
      });

      // Print sample products
      console.log(`\nSample products from ${category.name}:`);
      products.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.title}`);
        console.log(`     ${p.subtitle}`);
        console.log(`     Rating: ${p.rating}, Views: ${p.views}, Discount: ${p.discount}%`);
        console.log(`     Image: ${p.image.substring(0, 80)}...`);
        console.log('');
      });

    } catch (error) {
      console.error(`Error analyzing category ${category.name}:`, error.message);
    }

    // Wait between categories
    await page.waitForTimeout(2000);
  }

  console.log('\n========================================');
  console.log('ANALYSIS COMPLETE');
  console.log('========================================\n');
  console.log(`Total unique products found: ${allProducts.length}`);
  console.log('\nProducts per category:');
  Object.entries(productsByCategory).forEach(([cat, products]) => {
    console.log(`  ${cat}: ${products.length} products`);
  });

  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    totalProducts: allProducts.length,
    productsByCategory,
    allProducts,
    summary: {
      categories: CATEGORIES.length,
      uniqueProducts: allProducts.length,
      averageProductsPerCategory: Math.round(
        Object.values(productsByCategory).reduce((sum, products) => sum + products.length, 0) / CATEGORIES.length
      )
    }
  };

  const outputPath = 'd:/saju/sajuwooju-v2/analysis/all-products-analysis.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputPath}`);

  // Generate report
  generateReport(results);

  await browser.close();
  return results;
}

function generateReport(results) {
  const report = [];

  report.push('# Complete Product Analysis Report');
  report.push('');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push('');
  report.push('## Summary');
  report.push('');
  report.push(`- Total Categories Analyzed: ${CATEGORIES.length}`);
  report.push(`- Total Unique Products: ${results.totalProducts}`);
  report.push(`- Average Products per Category: ${results.summary.averageProductsPerCategory}`);
  report.push('');
  report.push('## Products by Category');
  report.push('');

  Object.entries(results.productsByCategory).forEach(([category, products]) => {
    report.push(`### ${category} (${products.length} products)`);
    report.push('');
    products.forEach((product, i) => {
      report.push(`${i + 1}. **${product.title}**`);
      if (product.subtitle) report.push(`   - Subtitle: ${product.subtitle}`);
      if (product.rating) report.push(`   - Rating: ${product.rating} ⭐`);
      if (product.views) report.push(`   - Views: ${product.views}`);
      if (product.discount) report.push(`   - Discount: ${product.discount}%`);
      if (product.image) report.push(`   - Image: ${product.image.substring(0, 100)}...`);
      if (product.link) report.push(`   - Link: ${product.link}`);
      report.push('');
    });
    report.push('');
  });

  report.push('## All Unique Products');
  report.push('');
  results.allProducts.forEach((product, i) => {
    report.push(`${i + 1}. **${product.title}**`);
    report.push(`   - Subtitle: ${product.subtitle}`);
    report.push(`   - Categories: ${product.categories.join(', ')}`);
    report.push(`   - Category IDs: [${product.categoryIds.join(', ')}]`);
    report.push(`   - Rating: ${product.rating}, Views: ${product.views}, Discount: ${product.discount}%`);
    report.push(`   - Image: ${product.image}`);
    report.push('');
  });

  const reportPath = 'd:/saju/sajuwooju-v2/analysis/COMPLETE_PRODUCT_ANALYSIS.md';
  fs.writeFileSync(reportPath, report.join('\n'));
  console.log(`Report saved to: ${reportPath}`);
}

// Run analysis
analyzeAllProducts().catch(console.error);
