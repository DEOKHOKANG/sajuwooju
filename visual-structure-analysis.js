const { chromium } = require('playwright');

async function visualStructureAnalysis() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://sajuwooju.me', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const analysis = await page.evaluate(() => {
      // Get dimensions and layout info
      const viewport = window.innerWidth + 'x' + window.innerHeight;
      
      // Find all major content blocks
      const blocks = [];
      const main = document.querySelector('.main-page');
      
      if (main) {
        const children = main.children;
        let blockIndex = 0;
        
        for (let child of children) {
          // Get computed styles for positioning
          const style = window.getComputedStyle(child);
          const rect = child.getBoundingClientRect();
          
          // Count images in this block
          const images = child.querySelectorAll('img');
          const imageList = Array.from(images).map(img => ({
            alt: img.alt || 'no-alt',
            width: img.naturalWidth,
            height: img.naturalHeight
          }));
          
          // Count text nodes
          const textNodes = [];
          function extractText(el) {
            for (let node of el.childNodes) {
              if (node.nodeType === 3) {
                const text = node.textContent.trim();
                if (text) textNodes.push(text);
              } else if (node.nodeType === 1) {
                extractText(node);
              }
            }
          }
          extractText(child);
          
          // Get the text content
          const text = child.innerText || '';
          const textLines = text.split('\n').filter(l => l.trim());
          
          // Detect what type of content this is
          let contentType = 'unknown';
          if (text.includes('카테고리')) contentType = 'navigation';
          if (text.includes('랭킹') || text.includes('사주')) contentType = 'content-section';
          if (text.includes('리뷰')) contentType = 'reviews';
          if (text.includes('Copyright') || text.includes('고객센터')) contentType = 'footer';
          if (imageList.length > 0 && text.length < 500) contentType = 'hero-slider';
          if (text.includes('연애') || text.includes('궁합')) contentType = 'service-cards';
          if (child.className.includes('Video')) contentType = 'video';
          if (child.className.includes('HTML')) contentType = 'custom-html';
          
          blocks.push({
            index: blockIndex,
            contentType,
            className: child.className.substring(0, 100),
            textLength: text.length,
            textLines: textLines.slice(0, 10),
            imageCount: imageList.length,
            imageDetails: imageList.slice(0, 5),
            position: {
              top: Math.round(rect.top),
              left: Math.round(rect.left),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            },
            display: style.display,
            flexDirection: style.flexDirection,
            children: child.children.length
          });
          
          blockIndex++;
        }
      }
      
      // Collect hero slider information
      const heroImages = Array.from(document.querySelectorAll('[class*="hero"], [class*="slider"], [class*="banner"]')).flatMap(el => 
        Array.from(el.querySelectorAll('img'))
      );
      
      // Category grid analysis
      const categoryItems = Array.from(document.querySelectorAll('[class*="category"], [class*="nav"]')).flatMap(el =>
        Array.from(el.querySelectorAll('a, button')).map(item => item.innerText)
      ).filter(t => t && t.length < 30);
      
      // Services/Products analysis
      const serviceCards = Array.from(document.querySelectorAll('[class*="card"], [class*="product"], [class*="service"]'));
      const services = serviceCards.map(card => ({
        title: card.querySelector('h2, h3, .title')?.innerText || '',
        description: card.querySelector('p, .description')?.innerText || '',
        rating: card.querySelector('[class*="rating"], .rating')?.innerText || '',
        price: card.querySelector('[class*="price"], .price')?.innerText || '',
        discount: card.querySelector('[class*="discount"], .discount')?.innerText || ''
      }));
      
      return {
        viewport,
        totalBlocks: blocks.length,
        blocks,
        heroImageCount: heroImages.length,
        heroImages: Array.from(heroImages).slice(0, 10).map(img => img.alt || 'no-alt'),
        categories: [...new Set(categoryItems)],
        serviceCardsFound: services.length,
        pageScrollHeight: document.documentElement.scrollHeight,
        pageHeight: document.documentElement.clientHeight
      };
    });
    
    const fs = require('fs');
    fs.writeFileSync('d:/saju/sajuwooju-v2/visual-structure.json', JSON.stringify(analysis, null, 2));
    console.log('Visual structure analysis saved');
    console.log('Total blocks:', analysis.totalBlocks);
    console.log('Viewport:', analysis.viewport);
    console.log('Page scroll height:', analysis.pageScrollHeight);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

visualStructureAnalysis();
