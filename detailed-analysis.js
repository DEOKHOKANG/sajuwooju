const { chromium } = require('playwright');

async function detailedAnalysis() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://sajuwooju.me', { waitUntil: 'networkidle' });
    
    const analysis = await page.evaluate(() => {
      // Get full HTML structure
      const fullHTML = document.documentElement.outerHTML;
      
      // Count all major elements
      const allSections = document.querySelectorAll('section, [role="region"]');
      const allDivs = document.querySelectorAll('div');
      const allImages = document.querySelectorAll('img');
      const allButtons = document.querySelectorAll('button, a[role="button"], [class*="button"]');
      const allText = document.body.innerText;
      
      // Get the actual visible content structure
      const mainPageDiv = document.querySelector('.main-page');
      const mainContent = mainPageDiv ? mainPageDiv.innerText : '';
      
      // Get specific sections
      const navbar = document.querySelector('nav, [class*="nav"]');
      const heroSection = document.querySelector('[class*="hero"], [class*="banner"], [class*="slider"]');
      const footer = document.querySelector('footer, [class*="footer"]');
      
      // Count specific elements
      const countBySelector = (selector) => document.querySelectorAll(selector).length;
      
      return {
        pageTitle: document.title,
        htmlLength: fullHTML.length,
        totalDivs: allDivs.length,
        totalSections: allSections.length,
        totalImages: allImages.length,
        totalButtons: allButtons.length,
        totalHeadings: countBySelector('h1, h2, h3, h4, h5, h6'),
        mainContentLength: mainContent.length,
        mainContentPreview: mainContent.substring(0, 2000),
        imageCount: allImages.length,
        hasNavbar: !!navbar,
        hasHeroSection: !!heroSection,
        hasFooter: !!footer,
        bodyChildrenCount: document.body.children.length,
        visibleText: document.body.innerText.split('\n').filter(l => l.trim()).length
      };
    });
    
    console.log(JSON.stringify(analysis, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

detailedAnalysis();
