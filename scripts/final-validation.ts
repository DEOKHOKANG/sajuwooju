import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface ProductComparison {
  original: {
    title: string;
    subtitle: string;
    rating?: string;
    views?: string;
    discount?: string;
  };
  clone: {
    title: string;
    subtitle: string;
    rating?: string;
    views?: string;
    discount?: string;
  };
  match: boolean;
  similarity: number;
}

async function validateClone() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  console.log('🔍 Starting Final Validation...\n');

  const originalUrl = 'https://sajutight.me';
  const cloneUrl = 'http://localhost:3004';

  const results = {
    timestamp: new Date().toISOString(),
    originalUrl,
    cloneUrl,
    summary: {
      totalOriginalProducts: 0,
      totalCloneProducts: 0,
      matchedProducts: 0,
      missingProducts: 0,
      completionPercentage: 0
    },
    comparisons: [] as ProductComparison[],
    categories: {
      original: [] as string[],
      clone: [] as string[],
      missing: [] as string[]
    }
  };

  try {
    // Step 1: Crawl Original Site
    console.log('📍 Step 1: Analyzing Original Site...');
    const originalPage = await context.newPage();
    await originalPage.goto(originalUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await originalPage.waitForTimeout(3000);

    const originalData = await originalPage.evaluate(() => {
      const data = {
        products: [] as any[],
        categories: [] as string[]
      };

      // Extract categories
      const categoryElements = document.querySelectorAll('[class*="bubble-element Group baaTt"]');
      categoryElements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 0 && text.length < 20) {
          data.categories.push(text);
        }
      });

      // Extract products from visible text
      const allText = document.body.innerText;
      const lines = allText.split('\n').map(l => l.trim()).filter(l => l);

      let i = 0;
      while (i < lines.length) {
        const line = lines[i];

        // Check if this looks like a product title
        if (line.length > 5 &&
            !line.includes('⭐️') &&
            !line.includes('👀') &&
            !line.includes('%') &&
            !line.includes('카테고리') &&
            !line.includes('타이트') &&
            !line.includes('이벤트') &&
            (line.includes('?') || line.includes('사주') || line.includes('[') || line.includes('운세'))) {

          const product: any = { title: line };

          // Look ahead for subtitle, rating, views, discount
          for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
            const nextLine = lines[j];

            if (nextLine.includes('[') && !product.subtitle) {
              product.subtitle = nextLine;
            }
            if (nextLine.includes('⭐️')) {
              product.rating = nextLine.replace('⭐️', '').trim();
            }
            if (nextLine.includes('👀')) {
              product.views = nextLine.replace('👀 조회수', '').trim();
            }
            if (nextLine.includes('%') && nextLine.includes('할인')) {
              product.discount = nextLine.replace('% 할인중', '').trim();
            }
          }

          if (!product.subtitle) {
            product.subtitle = lines[i + 1] || '';
          }

          data.products.push(product);
        }

        i++;
      }

      return data;
    });

    results.summary.totalOriginalProducts = originalData.products.length;
    results.categories.original = originalData.categories;

    console.log(`✅ Found ${originalData.products.length} products on original site`);
    console.log(`✅ Found ${originalData.categories.length} categories on original site`);

    // Step 2: Crawl Clone Site
    console.log('\n📍 Step 2: Analyzing Clone Site...');
    const clonePage = await context.newPage();
    await clonePage.goto(cloneUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await clonePage.waitForTimeout(3000);

    const cloneData = await clonePage.evaluate(() => {
      const data = {
        products: [] as any[],
        categories: [] as string[]
      };

      // Extract categories
      const categoryElements = document.querySelectorAll('[class*="flex flex-col items-center"]');
      categoryElements.forEach(el => {
        const text = el.querySelector('span')?.textContent?.trim();
        if (text && text.length > 0 && text.length < 20) {
          data.categories.push(text);
        }
      });

      // Extract products
      const productCards = document.querySelectorAll('[class*="bg-muted-100"]');
      productCards.forEach(card => {
        const titleEl = card.querySelector('[class*="text-primary font-semibold"]');
        const subtitleEl = card.querySelector('[class*="text-slate-500"]');
        const ratingEl = card.querySelector('[class*="text-xs"]:has(span:contains("⭐️"))');
        const viewsEl = Array.from(card.querySelectorAll('[class*="text-xs"]')).find(
          el => el.textContent?.includes('조회수')
        );
        const discountEl = card.querySelector('[class*="bg-accent"]');

        if (titleEl) {
          data.products.push({
            title: titleEl.textContent?.trim() || '',
            subtitle: subtitleEl?.textContent?.trim() || '',
            rating: ratingEl?.textContent?.trim() || '',
            views: viewsEl?.textContent?.trim() || '',
            discount: discountEl?.textContent?.trim() || ''
          });
        }
      });

      return data;
    });

    results.summary.totalCloneProducts = cloneData.products.length;
    results.categories.clone = cloneData.categories;

    console.log(`✅ Found ${cloneData.products.length} products on clone site`);
    console.log(`✅ Found ${cloneData.categories.length} categories on clone site`);

    // Step 3: Compare Products
    console.log('\n📍 Step 3: Comparing Products...');

    for (const originalProduct of originalData.products) {
      let bestMatch: any = null;
      let bestSimilarity = 0;

      for (const cloneProduct of cloneData.products) {
        // Calculate similarity
        const titleMatch = calculateSimilarity(originalProduct.title, cloneProduct.title);
        const subtitleMatch = calculateSimilarity(originalProduct.subtitle, cloneProduct.subtitle);
        const similarity = (titleMatch + subtitleMatch) / 2;

        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatch = cloneProduct;
        }
      }

      const isMatch = bestSimilarity > 0.6;

      results.comparisons.push({
        original: originalProduct,
        clone: bestMatch || { title: 'NOT FOUND', subtitle: '', rating: '', views: '', discount: '' },
        match: isMatch,
        similarity: bestSimilarity
      });

      if (isMatch) {
        results.summary.matchedProducts++;
      } else {
        results.summary.missingProducts++;
      }
    }

    // Step 4: Compare Categories
    console.log('\n📍 Step 4: Comparing Categories...');

    for (const originalCategory of results.categories.original) {
      if (!results.categories.clone.includes(originalCategory)) {
        results.categories.missing.push(originalCategory);
      }
    }

    // Calculate completion percentage
    results.summary.completionPercentage = Math.round(
      (results.summary.matchedProducts / results.summary.totalOriginalProducts) * 100
    );

    // Take screenshots
    await originalPage.screenshot({
      path: 'scripts/output/final-original.png',
      fullPage: true
    });
    await clonePage.screenshot({
      path: 'scripts/output/final-clone.png',
      fullPage: true
    });

    console.log('📸 Screenshots saved');

    // Save results
    const outputDir = path.join(process.cwd(), 'scripts', 'output');
    const outputFile = path.join(outputDir, 'final-validation-report.json');
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

    // Print Report
    console.log('\n' + '='.repeat(80));
    console.log('FINAL VALIDATION REPORT');
    console.log('='.repeat(80));

    console.log('\n📊 SUMMARY:');
    console.log(`   Original Products: ${results.summary.totalOriginalProducts}`);
    console.log(`   Clone Products: ${results.summary.totalCloneProducts}`);
    console.log(`   Matched Products: ${results.summary.matchedProducts}`);
    console.log(`   Missing Products: ${results.summary.missingProducts}`);
    console.log(`   Completion: ${results.summary.completionPercentage}%`);

    console.log('\n📦 PRODUCT COMPARISON:');
    results.comparisons.forEach((comp, idx) => {
      const status = comp.match ? '✅' : '❌';
      console.log(`\n${idx + 1}. ${status} [${Math.round(comp.similarity * 100)}%]`);
      console.log(`   Original: "${comp.original.title}"`);
      console.log(`   Clone:    "${comp.clone.title}"`);
    });

    console.log('\n📂 CATEGORIES:');
    console.log(`   Original: ${results.categories.original.join(', ')}`);
    console.log(`   Clone: ${results.categories.clone.join(', ')}`);
    if (results.categories.missing.length > 0) {
      console.log(`   Missing: ${results.categories.missing.join(', ')}`);
    }

    console.log(`\n✅ Report saved to: ${outputFile}`);

    // Final verdict
    console.log('\n' + '='.repeat(80));
    if (results.summary.completionPercentage >= 95) {
      console.log('🎉 SUCCESS! Clone is 95%+ complete!');
    } else if (results.summary.completionPercentage >= 80) {
      console.log('⚠️ GOOD PROGRESS! Clone is 80%+ complete, but needs more work.');
    } else {
      console.log('❌ INCOMPLETE! Clone is less than 80% complete.');
    }
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error during validation:', error);
  } finally {
    await browser.close();
  }
}

function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;

  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Calculate Levenshtein distance
  const matrix: number[][] = [];

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);

  return 1 - (distance / maxLength);
}

// Run validation
validateClone().catch(console.error);
