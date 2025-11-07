const { chromium } = require('playwright');
const fs = require('fs');

async function deepAnalyze() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500  // Slow down to see what's happening
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Loading homepage: https://sajuwooju.me\n');

  await page.goto('https://sajuwooju.me', {
    waitUntil: 'networkidle',
    timeout: 90000
  });

  // Wait for initial load
  console.log('Waiting for page to fully load...');
  await page.waitForTimeout(10000);

  // Take screenshot
  await page.screenshot({
    path: 'd:/saju/sajuwooju-v2/analysis/initial-load.png',
    fullPage: true
  });
  console.log('Initial screenshot saved\n');

  // Get page HTML to analyze structure
  const html = await page.content();
  fs.writeFileSync('d:/saju/sajuwooju-v2/analysis/page-html.html', html);
  console.log('HTML saved\n');

  // Scroll and wait for content to load
  console.log('Scrolling to load dynamic content...');
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(2000);
    console.log(`  Scroll ${i + 1}/15`);
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);

  // Take another screenshot after scrolling
  await page.screenshot({
    path: 'd:/saju/sajuwooju-v2/analysis/after-scroll.png',
    fullPage: true
  });
  console.log('After-scroll screenshot saved\n');

  // Analyze all elements on the page
  console.log('Analyzing page structure...\n');

  const analysis = await page.evaluate(() => {
    const result = {
      allImages: [],
      allLinks: [],
      allDivs: [],
      textContent: [],
      productLikeElements: []
    };

    // Get all images
    document.querySelectorAll('img').forEach((img, i) => {
      result.allImages.push({
        index: i,
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        className: img.className,
        parent: img.parentElement?.tagName
      });
    });

    // Get all links
    document.querySelectorAll('a').forEach((link, i) => {
      result.allLinks.push({
        index: i,
        href: link.href,
        text: link.textContent.trim().substring(0, 100),
        className: link.className
      });
    });

    // Find clickable divs with images (likely products)
    document.querySelectorAll('div').forEach((div, i) => {
      const style = window.getComputedStyle(div);
      const hasImage = div.querySelector('img');
      const hasText = div.textContent.trim().length > 10;
      const isClickable = style.cursor === 'pointer' || div.onclick;

      if ((hasImage || isClickable) && hasText) {
        const imgs = Array.from(div.querySelectorAll('img'));
        const texts = Array.from(div.querySelectorAll('*'))
          .map(el => {
            const text = el.textContent.trim();
            if (text && text.length > 0 && text.length < 200 && !el.querySelector('*')) {
              return text;
            }
            return null;
          })
          .filter(Boolean);

        result.productLikeElements.push({
          index: i,
          className: div.className,
          id: div.id,
          isClickable,
          images: imgs.map(img => img.src),
          texts: texts.slice(0, 10),
          html: div.outerHTML.substring(0, 300)
        });
      }
    });

    // Get all text nodes that might be product titles
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text.length > 10 && text.length < 200) {
        result.textContent.push({
          text,
          parent: node.parentElement?.tagName,
          className: node.parentElement?.className
        });
      }
    }

    return result;
  });

  console.log(`Found ${analysis.allImages.length} images`);
  console.log(`Found ${analysis.allLinks.length} links`);
  console.log(`Found ${analysis.productLikeElements.length} product-like elements\n`);

  // Print product images
  console.log('Product Images (CDN images):');
  const productImages = analysis.allImages.filter(img =>
    img.src.includes('cdn.bubble.io') &&
    !img.src.includes('w=48') &&
    img.width > 80
  );

  productImages.forEach((img, i) => {
    console.log(`${i + 1}. ${img.src}`);
    console.log(`   Size: ${img.width}x${img.height}`);
    console.log(`   Alt: ${img.alt}`);
    console.log('');
  });

  // Print category links
  console.log('\nCategory Links:');
  const categoryLinks = analysis.allLinks.filter(link =>
    link.href.includes('category=')
  );

  categoryLinks.forEach((link, i) => {
    console.log(`${i + 1}. ${link.text}`);
    console.log(`   URL: ${link.href}`);
    console.log('');
  });

  // Print product-like elements
  console.log('\nProduct-like Elements (top 20):');
  analysis.productLikeElements.slice(0, 20).forEach((el, i) => {
    console.log(`${i + 1}. Clickable: ${el.isClickable}`);
    console.log(`   Images: ${el.images.length}`);
    console.log(`   Texts: ${el.texts.join(' | ')}`);
    console.log(`   HTML: ${el.html}`);
    console.log('');
  });

  // Save full analysis
  fs.writeFileSync(
    'd:/saju/sajuwooju-v2/analysis/deep-analysis.json',
    JSON.stringify(analysis, null, 2)
  );
  console.log('Full analysis saved to deep-analysis.json');

  // Try clicking on first category to see what happens
  if (categoryLinks.length > 0) {
    console.log(`\n\nTrying to navigate to first category: ${categoryLinks[0].text}`);
    await page.goto(categoryLinks[0].href, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(10000);

    // Scroll in category page
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 600));
      await page.waitForTimeout(2000);
    }

    await page.screenshot({
      path: 'd:/saju/sajuwooju-v2/analysis/category-page.png',
      fullPage: true
    });
    console.log('Category page screenshot saved');
  }

  await browser.close();
}

deepAnalyze().catch(console.error);
