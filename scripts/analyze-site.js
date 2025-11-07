const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function analyzeSite() {
  console.log('🚀 Starting site analysis...');

  // Create analysis directory if it doesn't exist
  const analysisDir = path.join(__dirname, '../analysis');
  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('📡 Navigating to https://sajutight.me...');
  await page.goto('https://sajutight.me', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Wait for content to load
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('📸 Taking screenshot...');
  await page.screenshot({
    path: path.join(__dirname, '../analysis/screenshot-full.png'),
    fullPage: true
  });

  console.log('🔍 Extracting DOM structure...');
  const domStructure = await page.evaluate(() => {
    const getElementInfo = (element) => {
      const styles = window.getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        classes: Array.from(element.classList),
        text: element.innerText?.substring(0, 100) || null,
        styles: {
          display: styles.display,
          position: styles.position,
          width: styles.width,
          height: styles.height,
          padding: styles.padding,
          margin: styles.margin,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
        },
        attributes: Array.from(element.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {})
      };
    };

    const extractTree = (element, maxDepth = 5, currentDepth = 0) => {
      if (currentDepth > maxDepth) return null;

      const info = getElementInfo(element);
      info.children = Array.from(element.children)
        .filter(child => child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE')
        .map(child => extractTree(child, maxDepth, currentDepth + 1))
        .filter(Boolean);

      return info;
    };

    return extractTree(document.body);
  });

  console.log('🎨 Extracting all CSS...');
  const allStyles = await page.evaluate(() => {
    const styles = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText) {
            styles.push(rule.cssText);
          }
        }
      } catch (e) {
        // Cross-origin stylesheet
      }
    }
    return styles;
  });

  console.log('🔘 Extracting all buttons and interactive elements...');
  const interactiveElements = await page.evaluate(() => {
    const elements = [];

    // Buttons
    document.querySelectorAll('button, [role="button"], a.button, .btn').forEach(el => {
      const styles = window.getComputedStyle(el);
      elements.push({
        type: 'button',
        text: el.innerText?.trim() || el.textContent?.trim(),
        classes: Array.from(el.classList),
        styles: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          padding: styles.padding,
          borderRadius: styles.borderRadius,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          border: styles.border,
          cursor: styles.cursor,
        },
        href: el.href || null
      });
    });

    // Forms
    document.querySelectorAll('form').forEach(form => {
      const inputs = Array.from(form.querySelectorAll('input, select, textarea')).map(input => ({
        type: input.type || input.tagName.toLowerCase(),
        name: input.name,
        placeholder: input.placeholder,
        required: input.required,
        classes: Array.from(input.classList)
      }));

      elements.push({
        type: 'form',
        action: form.action,
        method: form.method,
        inputs: inputs
      });
    });

    // Links
    const links = Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText?.trim(),
      href: a.href,
      classes: Array.from(a.classList)
    }));

    return { elements, links };
  });

  console.log('📝 Extracting all text content...');
  const textContent = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
      level: h.tagName,
      text: h.innerText?.trim(),
      styles: {
        fontSize: window.getComputedStyle(h).fontSize,
        fontWeight: window.getComputedStyle(h).fontWeight,
        color: window.getComputedStyle(h).color
      }
    }));

    const paragraphs = Array.from(document.querySelectorAll('p')).map(p => ({
      text: p.innerText?.trim()?.substring(0, 200)
    }));

    return { headings, paragraphs };
  });

  console.log('🎭 Extracting animations and transitions...');
  const animations = await page.evaluate(() => {
    const animatedElements = [];

    document.querySelectorAll('*').forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.animation !== 'none' || styles.transition !== 'none') {
        animatedElements.push({
          tag: el.tagName.toLowerCase(),
          classes: Array.from(el.classList),
          animation: styles.animation,
          transition: styles.transition
        });
      }
    });

    return animatedElements;
  });

  console.log('🖼️ Extracting all images...');
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
      classes: Array.from(img.classList)
    }));
  });

  console.log('📱 Testing mobile viewport...');
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({
    path: path.join(__dirname, '../analysis/screenshot-mobile.png'),
    fullPage: true
  });

  console.log('💾 Saving analysis results...');
  const analysis = {
    timestamp: new Date().toISOString(),
    url: 'https://sajutight.me',
    domStructure,
    styles: allStyles.slice(0, 100), // First 100 rules
    interactiveElements,
    textContent,
    animations,
    images,
    metadata: {
      title: await page.title(),
      description: await page.$eval('meta[name="description"]', el => el.content).catch(() => null),
    }
  };

  fs.writeFileSync(
    path.join(analysisDir, 'site-analysis.json'),
    JSON.stringify(analysis, null, 2)
  );

  console.log('✅ Analysis complete!');
  console.log('📁 Files saved to: analysis/');
  console.log('   - screenshot-full.png');
  console.log('   - screenshot-mobile.png');
  console.log('   - site-analysis.json');

  await browser.close();
}

analyzeSite().catch(console.error);
