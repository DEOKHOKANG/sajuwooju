import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface ProductData {
  url: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  discount?: string;
  rating?: string;
  views?: string;
  image?: string;
  category?: string;
  allText?: string;
}

async function deepCrawlBubbleSite() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  const originalSite = 'https://sajutight.me';

  const allProducts: ProductData[] = [];
  const visitedUrls = new Set<string>();

  try {
    console.log('🚀 Starting deep crawl of Bubble.io site:', originalSite);
    console.log('⏳ Waiting for page to fully load...');

    await page.goto(originalSite, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for Bubble.io to fully render
    await page.waitForTimeout(5000);

    // Take initial screenshot
    await page.screenshot({ path: 'scripts/output/homepage-initial.png', fullPage: true });
    console.log('📸 Screenshot saved: homepage-initial.png');

    // Scroll to load lazy content
    console.log('📜 Scrolling to load all content...');
    await autoScroll(page);
    await page.waitForTimeout(2000);

    // Take screenshot after scroll
    await page.screenshot({ path: 'scripts/output/homepage-scrolled.png', fullPage: true });

    // Extract all visible text
    console.log('\n📝 Extracting all visible content...');
    const pageContent = await page.evaluate(() => {
      const content: any = {
        allText: document.body.innerText,
        htmlStructure: '',
        allElements: [] as any[]
      };

      // Get all clickable elements
      const clickableSelectors = [
        'a',
        'button',
        '[onclick]',
        '[role="button"]',
        '[class*="clickable"]',
        '[class*="card"]',
        '[class*="item"]',
        'div[style*="cursor: pointer"]',
        'div[style*="cursor:pointer"]'
      ];

      clickableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const rect = el.getBoundingClientRect();
          const text = el.textContent?.trim() || '';
          const href = (el as HTMLAnchorElement).href || el.getAttribute('data-href') || '';
          const onclick = el.getAttribute('onclick') || '';
          const classes = el.className || '';

          if (text.length > 0 && text.length < 200) {
            content.allElements.push({
              tag: el.tagName,
              text: text.substring(0, 100),
              href,
              onclick,
              classes,
              visible: rect.width > 0 && rect.height > 0,
              position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            });
          }
        });
      });

      // Get all images
      content.images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height
      }));

      // Get main content area
      const mainSelectors = ['main', '[role="main"]', '#main', '.main', '[class*="content"]'];
      for (const selector of mainSelectors) {
        const main = document.querySelector(selector);
        if (main) {
          content.mainContent = main.innerHTML;
          break;
        }
      }

      return content;
    });

    console.log(`✅ Extracted ${pageContent.allElements.length} elements`);
    console.log(`✅ Found ${pageContent.images.length} images`);

    // Save raw content for analysis
    const outputDir = path.join(process.cwd(), 'scripts', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, 'page-content.json'),
      JSON.stringify(pageContent, null, 2)
    );

    console.log('\n🔍 Analyzing visible elements...');

    // Look for product-like elements
    const productElements = pageContent.allElements.filter((el: any) =>
      el.visible &&
      (el.text.includes('사주') ||
       el.text.includes('운세') ||
       el.text.includes('궁합') ||
       el.text.includes('상담') ||
       el.text.includes('%') ||
       el.text.includes('만원') ||
       el.classes.includes('card') ||
       el.classes.includes('item') ||
       el.classes.includes('product'))
    );

    console.log(`📦 Found ${productElements.length} potential product elements`);

    // Print visible text content
    console.log('\n📄 ALL VISIBLE TEXT ON PAGE:');
    console.log('='.repeat(80));
    console.log(pageContent.allText.substring(0, 3000));
    console.log('='.repeat(80));

    // Try to find and click on product cards
    console.log('\n🖱️ Looking for clickable product cards...');

    const clickableTexts = [
      '솔로탈출',
      '궁합',
      '재회',
      '신년운세',
      '하반기',
      '취업',
      '연애',
      '이별'
    ];

    for (const searchText of clickableTexts) {
      try {
        console.log(`\n🔎 Searching for: "${searchText}"`);

        // Find elements containing this text
        const elements = await page.locator(`text=${searchText}`).all();
        console.log(`  Found ${elements.length} elements with "${searchText}"`);

        for (let i = 0; i < Math.min(elements.length, 3); i++) {
          try {
            const element = elements[i];

            // Get the clickable parent (might be a link or div)
            const clickableParent = await element.evaluateHandle(el => {
              let current: Element | null = el;
              while (current) {
                if (
                  current.tagName === 'A' ||
                  current.getAttribute('onclick') ||
                  current.getAttribute('role') === 'button' ||
                  window.getComputedStyle(current).cursor === 'pointer'
                ) {
                  return current;
                }
                current = current.parentElement;
              }
              return el;
            });

            // Try to get href or click event
            const elementInfo = await page.evaluate((el) => {
              const href = (el as HTMLAnchorElement).href || el.getAttribute('data-href') || '';
              const onclick = el.getAttribute('onclick') || '';
              const text = el.textContent?.trim() || '';

              return { href, onclick, text };
            }, clickableParent);

            console.log(`  Element ${i+1}:`, elementInfo.text.substring(0, 50));

            if (elementInfo.href && elementInfo.href.startsWith('http')) {
              console.log(`  📎 Found URL: ${elementInfo.href}`);

              // Visit this URL if not visited
              if (!visitedUrls.has(elementInfo.href)) {
                visitedUrls.add(elementInfo.href);

                const productPage = await context.newPage();

                try {
                  console.log(`  🌐 Visiting: ${elementInfo.href}`);
                  await productPage.goto(elementInfo.href, { waitUntil: 'networkidle', timeout: 30000 });
                  await productPage.waitForTimeout(3000);

                  // Extract product data
                  const productData = await extractProductData(productPage, elementInfo.href);

                  if (productData.title) {
                    console.log(`  ✅ Extracted: ${productData.title}`);
                    allProducts.push(productData);

                    // Save screenshot of product page
                    await productPage.screenshot({
                      path: `scripts/output/product-${allProducts.length}.png`,
                      fullPage: true
                    });
                  }
                } catch (err) {
                  console.log(`  ❌ Error visiting URL: ${(err as Error).message}`);
                } finally {
                  await productPage.close();
                }
              }
            } else if (elementInfo.onclick) {
              console.log(`  🔘 Has onclick: ${elementInfo.onclick.substring(0, 50)}`);
            }

          } catch (err) {
            console.log(`  ⚠️ Error processing element: ${(err as Error).message}`);
          }
        }
      } catch (err) {
        console.log(`  ⚠️ Error searching for "${searchText}": ${(err as Error).message}`);
      }
    }

    // Save final results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = path.join(outputDir, `deep-crawl-results-${timestamp}.json`);

    const results = {
      originalSite,
      totalProducts: allProducts.length,
      visitedUrls: Array.from(visitedUrls),
      products: allProducts,
      rawContent: {
        totalElements: pageContent.allElements.length,
        totalImages: pageContent.images.length,
        visibleText: pageContent.allText.substring(0, 5000)
      }
    };

    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

    console.log('\n' + '='.repeat(80));
    console.log('✅ DEEP CRAWL COMPLETE');
    console.log('='.repeat(80));
    console.log(`📊 Total products found: ${allProducts.length}`);
    console.log(`🔗 URLs visited: ${visitedUrls.size}`);
    console.log(`📁 Results saved to: ${resultsFile}`);

    console.log('\n📦 DISCOVERED PRODUCTS:');
    allProducts.forEach((product, idx) => {
      console.log(`\n${idx + 1}. ${product.title}`);
      console.log(`   Subtitle: ${product.subtitle || 'N/A'}`);
      console.log(`   URL: ${product.url}`);
      console.log(`   Image: ${product.image ? 'Yes' : 'No'}`);
      console.log(`   Rating: ${product.rating || 'N/A'}`);
      console.log(`   Views: ${product.views || 'N/A'}`);
    });

  } catch (error) {
    console.error('❌ Error during crawl:', error);
  } finally {
    await browser.close();
  }
}

async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function extractProductData(page: any, url: string): Promise<ProductData> {
  const data = await page.evaluate((pageUrl: string) => {
    const product: ProductData = {
      url: pageUrl,
      title: '',
      allText: document.body.innerText
    };

    // Extract title - look for main heading
    const titleSelectors = [
      'h1',
      '[class*="title"]',
      '[class*="heading"]',
      '[class*="product-name"]',
      'div[class*="name"]'
    ];

    for (const selector of titleSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of Array.from(elements)) {
        const text = el.textContent?.trim() || '';
        if (text.length > 3 && text.length < 100 && !text.includes('타이트사주')) {
          product.title = text;
          break;
        }
      }
      if (product.title) break;
    }

    // If no title found, use first significant text
    if (!product.title) {
      const lines = document.body.innerText.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 5 && trimmed.length < 100 && !trimmed.includes('타이트')) {
          product.title = trimmed;
          break;
        }
      }
    }

    // Extract subtitle
    const subtitleSelectors = [
      '[class*="subtitle"]',
      '[class*="sub"]',
      'h2',
      'h3'
    ];

    for (const selector of subtitleSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = el.textContent?.trim() || '';
        if (text && text !== product.title && text.length < 100) {
          product.subtitle = text;
          break;
        }
      }
    }

    // Extract description
    const paragraphs = document.querySelectorAll('p, div[class*="description"], div[class*="content"]');
    for (const p of Array.from(paragraphs)) {
      const text = p.textContent?.trim() || '';
      if (text.length > 20 && text.length < 500) {
        product.description = text;
        break;
      }
    }

    // Extract images
    const images = document.querySelectorAll('img');
    for (const img of Array.from(images)) {
      const src = (img as HTMLImageElement).src;
      if (src && !src.includes('logo') && !src.includes('icon') && src.includes('http')) {
        product.image = src;
        break;
      }
    }

    // Look for rating/views in text
    const text = document.body.innerText;
    const ratingMatch = text.match(/(\d+\.?\d*)\s*점/);
    if (ratingMatch) {
      product.rating = ratingMatch[1];
    }

    const viewsMatch = text.match(/(\d+[만천]?\+?)\s*조회/);
    if (viewsMatch) {
      product.views = viewsMatch[1];
    }

    // Look for discount
    const discountMatch = text.match(/(\d+)%/);
    if (discountMatch) {
      product.discount = discountMatch[1];
    }

    return product;
  }, url);

  return data;
}

// Run the deep crawler
deepCrawlBubbleSite().catch(console.error);
