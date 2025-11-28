const { chromium } = require('playwright');

async function comprehensiveAnalysis() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://sajuwooju.me', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const analysis = await page.evaluate(() => {
      // Get all visible text organized by sections
      function getTextContent(element, depth = 0) {
        let text = '';
        for (let node of element.childNodes) {
          if (node.nodeType === 3) { // Text node
            const content = node.textContent.trim();
            if (content) text += content + '\n';
          } else if (node.nodeType === 1) { // Element node
            text += getTextContent(node, depth + 1);
          }
        }
        return text;
      }
      
      // Collect all visible text
      const bodyText = document.body.innerText;
      
      // Get main page div (Bubble.io structure)
      const mainPage = document.querySelector('.main-page');
      
      // Analyze immediate children of main page
      let sections = [];
      if (mainPage) {
        let currentSection = null;
        for (let i = 0; i < mainPage.children.length; i++) {
          const child = mainPage.children[i];
          const classes = child.className;
          const innerText = child.innerText || '';
          
          sections.push({
            index: i,
            element: child.tagName,
            className: classes,
            textPreview: innerText.substring(0, 300),
            children: child.children.length,
            hasImages: child.querySelectorAll('img').length > 0
          });
        }
      }
      
      // Find specific content areas
      const categoryLinks = Array.from(document.querySelectorAll('a, [role="link"], button')).map(el => el.innerText).filter(t => t && t.length < 50);
      
      // Count product cards / service items
      const productCards = document.querySelectorAll('[class*="card"], [class*="item"], [class*="product"]');
      
      // Get all visible headings and text structure
      const allText = document.body.innerText.split('\n').filter(l => l.trim());
      
      // Count CTAs
      const ctas = document.querySelectorAll('button, a[class*="btn"], a[class*="cta"], [class*="button"]');
      
      // Get images
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src.substring(0, 100),
        alt: img.alt,
      }));
      
      return {
        pageTitle: document.title,
        totalVisibleLines: allText.length,
        allText: allText.slice(0, 200), // First 200 lines
        sections: sections,
        totalImages: document.querySelectorAll('img').length,
        uniqueImages: new Set(images.map(i => i.src)).size,
        totalCTAs: ctas.length,
        categoryLinksFound: categoryLinks.slice(0, 20),
        productCards: productCards.length,
        fullBodyText: bodyText
      };
    });
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('d:/saju/sajuwooju-v2/page-structure.json', JSON.stringify(analysis, null, 2));
    console.log('Analysis saved to page-structure.json');
    console.log('Total lines of text:', analysis.totalVisibleLines);
    console.log('First 50 lines:');
    console.log(analysis.allText.slice(0, 50).join('\n'));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

comprehensiveAnalysis();
