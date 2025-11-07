const { chromium } = require('playwright');
const fs = require('fs');

async function analyzeHomepage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Loading homepage: https://sajuwooju.me');

  await page.goto('https://sajuwooju.me', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for page to fully load
  await page.waitForTimeout(8000);

  console.log('Scrolling to load all products...');
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
  }

  // Take a screenshot to see what we're working with
  await page.screenshot({ path: 'd:/saju/sajuwooju-v2/analysis/homepage.png', fullPage: true });
  console.log('Screenshot saved');

  // Extract all product information
  const products = await page.evaluate(() => {
    const results = [];

    // Find all images that look like product thumbnails
    const images = Array.from(document.querySelectorAll('img')).filter(img => {
      const src = img.src || '';
      // Filter for product images from bubble.io CDN
      return src.includes('cdn.bubble.io') &&
             !src.includes('w=48') && // Not small avatars
             !src.includes('logo') &&
             img.width > 50 &&
             img.height > 50;
    });

    console.log(`Found ${images.length} potential product images`);

    images.forEach((img, index) => {
      try {
        // Get the parent container
        let container = img.parentElement;
        let depth = 0;

        // Go up to find the main product card container
        while (container && depth < 5) {
          const style = window.getComputedStyle(container);
          const isClickable = style.cursor === 'pointer' || container.onclick || container.closest('a');

          if (isClickable) {
            break;
          }
          container = container.parentElement;
          depth++;
        }

        if (!container) container = img.parentElement;

        // Extract all text from the container
        const allText = container.textContent.trim();
        const textElements = Array.from(container.querySelectorAll('*'))
          .map(el => el.textContent.trim())
          .filter(text => text.length > 0 && text.length < 200);

        // Find title - usually the longest meaningful text
        const title = textElements.find(text =>
          text.length > 10 &&
          text.length < 100 &&
          !text.includes('만+') &&
          !text.includes('⭐') &&
          !text.match(/^\d\.\d$/) &&
          !text.includes('%')
        ) || '';

        // Find subtitle - text in brackets
        const subtitle = textElements.find(text =>
          text.startsWith('[') && text.endsWith(']')
        ) || '';

        // Find rating
        const ratingText = textElements.find(text => /^\d\.\d$/.test(text));
        const rating = ratingText ? parseFloat(ratingText) : 0;

        // Find views
        const views = textElements.find(text =>
          text.includes('만+') || text.includes('천+')
        ) || '';

        // Find discount
        const discountText = textElements.find(text =>
          text.includes('%') && text.match(/\d+%/)
        );
        const discount = discountText ? parseInt(discountText.match(/(\d+)%/)[1]) : 0;

        // Get link
        const link = container.closest('a')?.href || '';

        // Get image URL
        const imageUrl = img.src || '';

        if (title || subtitle) {
          results.push({
            index,
            title,
            subtitle,
            rating,
            views,
            discount,
            imageUrl,
            link,
            allText: textElements.join(' | '),
            containerHtml: container.outerHTML.substring(0, 500)
          });
        }
      } catch (err) {
        console.error(`Error processing image ${index}:`, err.message);
      }
    });

    return results;
  });

  console.log(`\nFound ${products.length} products on homepage\n`);

  products.forEach((product, i) => {
    console.log(`${i + 1}. ${product.title}`);
    console.log(`   Subtitle: ${product.subtitle}`);
    console.log(`   Rating: ${product.rating}, Views: ${product.views}, Discount: ${product.discount}%`);
    console.log(`   Image: ${product.imageUrl.substring(0, 100)}...`);
    console.log(`   Link: ${product.link}`);
    console.log('');
  });

  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    products
  };

  fs.writeFileSync(
    'd:/saju/sajuwooju-v2/analysis/homepage-products.json',
    JSON.stringify(results, null, 2)
  );

  console.log('Results saved to analysis/homepage-products.json');

  // Now try to click on category filters and see what products appear
  console.log('\n\nAnalyzing category filters...');

  const categoryLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a').forEach(link => {
      const text = link.textContent.trim();
      const href = link.href;
      if (href && href.includes('category=')) {
        links.push({ text, href });
      }
    });
    return links;
  });

  console.log(`Found ${categoryLinks.length} category links:`);
  categoryLinks.forEach(link => {
    console.log(`  - ${link.text}: ${link.href}`);
  });

  await browser.close();
  return results;
}

analyzeHomepage().catch(console.error);
