const { chromium } = require('playwright');

async function analyzeHomepage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://sajuwooju.me', { waitUntil: 'networkidle' });
    
    // Get full page content and structure
    const structure = await page.evaluate(() => {
      const sections = [];
      const mainContent = document.body;
      
      // Helper function to get element info
      function getElementInfo(el) {
        return {
          tag: el.tagName.toLowerCase(),
          classes: el.className,
          id: el.id,
          textContent: el.innerText ? el.innerText.substring(0, 200) : '',
          children: el.children.length
        };
      }
      
      // Analyze main sections
      const mainElements = mainContent.children;
      let sectionIndex = 0;
      
      for (let el of mainElements) {
        if (el.tagName === 'SECTION' || el.tagName === 'DIV' || el.tagName === 'HEADER' || el.tagName === 'FOOTER') {
          const section = {
            index: sectionIndex,
            element: getElementInfo(el),
            content: []
          };
          
          // Analyze children
          for (let child of el.children) {
            section.content.push(getElementInfo(child));
          }
          
          sections.push(section);
          sectionIndex++;
        }
      }
      
      // Count images
      const images = document.querySelectorAll('img');
      const imageInfo = Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt,
        className: img.className
      }));
      
      // Count buttons and CTAs
      const buttons = document.querySelectorAll('button, a[role="button"], .btn, [class*="cta"]');
      const buttonInfo = Array.from(buttons).map(btn => ({
        text: btn.innerText,
        className: btn.className,
        href: btn.href || 'N/A'
      }));
      
      return {
        title: document.title,
        sections,
        totalImages: images.length,
        imageDetails: imageInfo,
        buttons: buttonInfo,
        bodyStructure: getElementInfo(mainContent)
      };
    });
    
    console.log(JSON.stringify(structure, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

analyzeHomepage();
