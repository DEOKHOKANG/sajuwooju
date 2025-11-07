const { chromium } = require('playwright');
const fs = require('fs');

async function extractAllProducts() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Loading homepage...\n');
  await page.goto('https://sajutight.me', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(10000);

  // Scroll to load all content
  console.log('Scrolling to load all products...');
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);

  // Extract product links
  const productLinks = await page.evaluate(() => {
    const links = [];
    const seen = new Set();

    // Find all links with product images
    document.querySelectorAll('a').forEach(link => {
      const href = link.href;
      const img = link.querySelector('img');

      if (img && href && href.includes('sajutight.me') && !seen.has(href)) {
        const alt = img.alt || '';
        const src = img.src || '';

        // Filter for product images
        if (src.includes('cdn.bubble.io') &&
            !src.includes('logo') &&
            !src.includes('w=48') &&
            img.width > 80) {

          seen.add(href);
          links.push({
            href,
            imageUrl: src,
            imageName: alt,
            width: img.width,
            height: img.height
          });
        }
      }
    });

    return links;
  });

  console.log(`Found ${productLinks.length} unique product links\n`);

  // Visit each product page and extract details
  const products = [];

  for (let i = 0; i < productLinks.length; i++) {
    const link = productLinks[i];
    console.log(`\n[${i + 1}/${productLinks.length}] Visiting: ${link.href}`);
    console.log(`Image: ${link.imageName}`);

    try {
      await page.goto(link.href, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(5000);

      // Scroll to load all content
      for (let j = 0; j < 5; j++) {
        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(1000);
      }

      // Extract product details
      const productData = await page.evaluate((linkData) => {
        const data = {
          url: window.location.href,
          imageUrl: linkData.imageUrl,
          imageName: linkData.imageName
        };

        // Extract title - look for large heading text
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, div, span')).filter(el => {
          const text = el.textContent.trim();
          const style = window.getComputedStyle(el);
          const fontSize = parseInt(style.fontSize);
          return text.length > 5 &&
                 text.length < 100 &&
                 fontSize >= 18 &&
                 !el.querySelector('*') &&
                 !text.includes('만+') &&
                 !text.match(/^\d\.\d$/);
        });

        if (headings.length > 0) {
          data.title = headings[0].textContent.trim();
        }

        // Extract subtitle - text in brackets
        const allText = Array.from(document.querySelectorAll('*')).map(el => {
          const text = el.textContent.trim();
          if (text.startsWith('[') && text.endsWith(']') && text.length < 100 && !el.querySelector('*')) {
            return text;
          }
          return null;
        }).filter(Boolean);

        if (allText.length > 0) {
          data.subtitle = allText[0];
        }

        // Extract rating
        const ratingEl = Array.from(document.querySelectorAll('*')).find(el => {
          const text = el.textContent.trim();
          return /^\d\.\d$/.test(text) && !el.querySelector('*');
        });
        if (ratingEl) {
          data.rating = parseFloat(ratingEl.textContent.trim());
        }

        // Extract views
        const viewsEl = Array.from(document.querySelectorAll('*')).find(el => {
          const text = el.textContent.trim();
          return (text.includes('만+') || text.includes('천+')) && !el.querySelector('*');
        });
        if (viewsEl) {
          data.views = viewsEl.textContent.trim();
        }

        // Extract discount
        const discountEl = Array.from(document.querySelectorAll('*')).find(el => {
          const text = el.textContent.trim();
          return /^\d+%$/.test(text) && !el.querySelector('*');
        });
        if (discountEl) {
          data.discount = parseInt(discountEl.textContent.match(/(\d+)%/)[1]);
        }

        // Extract price
        const priceEls = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent.trim();
          return text.includes('원') && text.includes(',') && !el.querySelector('*');
        });
        if (priceEls.length > 0) {
          data.prices = priceEls.map(el => el.textContent.trim());
        }

        // Get all text content for analysis
        data.allTexts = Array.from(document.querySelectorAll('div, span, p, h1, h2, h3'))
          .map(el => el.textContent.trim())
          .filter(text => text.length > 5 && text.length < 200)
          .slice(0, 50);

        return data;
      }, link);

      products.push(productData);

      console.log(`Title: ${productData.title || 'Not found'}`);
      console.log(`Subtitle: ${productData.subtitle || 'Not found'}`);
      console.log(`Rating: ${productData.rating || 'Not found'}`);
      console.log(`Views: ${productData.views || 'Not found'}`);
      console.log(`Discount: ${productData.discount || 'Not found'}%`);

      await page.waitForTimeout(2000);

    } catch (error) {
      console.error(`Error visiting ${link.href}:`, error.message);
    }
  }

  console.log(`\n\n========================================`);
  console.log(`EXTRACTION COMPLETE`);
  console.log(`========================================\n`);
  console.log(`Total products extracted: ${products.length}\n`);

  // Print summary
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title || p.imageName}`);
    console.log(`   Subtitle: ${p.subtitle || 'N/A'}`);
    console.log(`   Rating: ${p.rating || 'N/A'}, Views: ${p.views || 'N/A'}, Discount: ${p.discount || 0}%`);
    console.log(`   Image: ${p.imageUrl.substring(0, 100)}...`);
    console.log(`   URL: ${p.url}`);
    console.log('');
  });

  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    products
  };

  fs.writeFileSync(
    'd:/saju/sajutight-v2/analysis/extracted-products.json',
    JSON.stringify(results, null, 2)
  );
  console.log('Results saved to analysis/extracted-products.json');

  // Generate TypeScript products data
  generateProductsData(products);

  await browser.close();
  return results;
}

function generateProductsData(products) {
  const lines = [];

  lines.push('// Generated Product Data from Original Site');
  lines.push('// Timestamp: ' + new Date().toISOString());
  lines.push('');
  lines.push('export const EXTRACTED_PRODUCTS = [');

  products.forEach((product, i) => {
    const title = product.title || product.imageName || 'Unknown';
    const subtitle = product.subtitle || '';
    const rating = product.rating || 4.5;
    const views = product.views || '1만+';
    const discount = product.discount || 0;
    const image = product.imageUrl;

    lines.push('  {');
    lines.push(`    id: ${i + 1},`);
    lines.push(`    title: '${title.replace(/'/g, "\\'")}',`);
    lines.push(`    subtitle: '${subtitle.replace(/'/g, "\\'")}',`);
    lines.push(`    rating: ${rating},`);
    lines.push(`    views: '${views}',`);
    lines.push(`    discount: ${discount},`);
    lines.push(`    image: '${image}',`);
    lines.push(`    url: '${product.url}',`);
    lines.push(`    categoryIds: [] // TODO: Map categories`);
    lines.push(`  }${i < products.length - 1 ? ',' : ''}`);
  });

  lines.push('];');

  fs.writeFileSync(
    'd:/saju/sajutight-v2/analysis/extracted-products-data.ts',
    lines.join('\n')
  );
  console.log('TypeScript data saved to analysis/extracted-products-data.ts');
}

extractAllProducts().catch(console.error);
