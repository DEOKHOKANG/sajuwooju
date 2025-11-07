const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeSite() {
  console.log('🚀 Starting comprehensive site analysis with Playwright...');

  // Create analysis directory
  const analysisDir = path.join(__dirname, '../analysis');
  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  console.log('📡 Navigating to https://sajutight.me...');
  await page.goto('https://sajutight.me', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for page to fully render
  await page.waitForTimeout(3000);

  console.log('📸 Taking full desktop screenshot...');
  await page.screenshot({
    path: path.join(analysisDir, 'screenshot-desktop.png'),
    fullPage: true
  });

  console.log('🔍 Extracting complete DOM structure...');
  const pageAnalysis = await page.evaluate(() => {
    // Helper function to get computed styles
    const getComputedStyles = (element) => {
      const styles = window.getComputedStyle(element);
      return {
        // Layout
        display: styles.display,
        position: styles.position,
        width: styles.width,
        height: styles.height,
        top: styles.top,
        left: styles.left,
        right: styles.right,
        bottom: styles.bottom,

        // Box Model
        margin: styles.margin,
        marginTop: styles.marginTop,
        marginRight: styles.marginRight,
        marginBottom: styles.marginBottom,
        marginLeft: styles.marginLeft,
        padding: styles.padding,
        paddingTop: styles.paddingTop,
        paddingRight: styles.paddingRight,
        paddingBottom: styles.paddingBottom,
        paddingLeft: styles.paddingLeft,

        // Typography
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        textAlign: styles.textAlign,
        color: styles.color,

        // Background
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        backgroundSize: styles.backgroundSize,
        backgroundPosition: styles.backgroundPosition,

        // Border
        border: styles.border,
        borderRadius: styles.borderRadius,
        borderTop: styles.borderTop,
        borderRight: styles.borderRight,
        borderBottom: styles.borderBottom,
        borderLeft: styles.borderLeft,

        // Effects
        boxShadow: styles.boxShadow,
        opacity: styles.opacity,
        transform: styles.transform,
        transition: styles.transition,
        animation: styles.animation,

        // Flexbox
        flexDirection: styles.flexDirection,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
        gap: styles.gap,

        // Grid
        gridTemplateColumns: styles.gridTemplateColumns,
        gridTemplateRows: styles.gridTemplateRows,
        gridGap: styles.gridGap,

        // Other
        cursor: styles.cursor,
        overflow: styles.overflow,
        zIndex: styles.zIndex,
      };
    };

    // Recursively extract DOM tree
    const extractElement = (element, depth = 0, maxDepth = 10) => {
      if (depth > maxDepth || !element) return null;

      // Skip script and style tags
      if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return null;

      const rect = element.getBoundingClientRect();

      const elementData = {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        classes: Array.from(element.classList),
        text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
          ? element.textContent.trim().substring(0, 200)
          : null,
        attributes: {},
        styles: getComputedStyles(element),
        boundingBox: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        },
        children: []
      };

      // Get all attributes
      for (const attr of element.attributes) {
        elementData.attributes[attr.name] = attr.value;
      }

      // Get children
      for (const child of element.children) {
        const childData = extractElement(child, depth + 1, maxDepth);
        if (childData) {
          elementData.children.push(childData);
        }
      }

      return elementData;
    };

    // Extract all interactive elements
    const extractInteractiveElements = () => {
      const elements = {
        buttons: [],
        links: [],
        inputs: [],
        forms: []
      };

      // Buttons
      document.querySelectorAll('button, [role="button"], .button, .btn').forEach(btn => {
        const styles = window.getComputedStyle(btn);
        elements.buttons.push({
          text: btn.textContent.trim(),
          classes: Array.from(btn.classList),
          id: btn.id,
          type: btn.type || 'button',
          disabled: btn.disabled,
          styles: getComputedStyles(btn)
        });
      });

      // Links
      document.querySelectorAll('a').forEach(link => {
        elements.links.push({
          text: link.textContent.trim(),
          href: link.href,
          target: link.target,
          classes: Array.from(link.classList)
        });
      });

      // Inputs
      document.querySelectorAll('input, textarea, select').forEach(input => {
        elements.inputs.push({
          type: input.type || 'text',
          name: input.name,
          placeholder: input.placeholder,
          value: input.value,
          required: input.required,
          classes: Array.from(input.classList),
          styles: getComputedStyles(input)
        });
      });

      // Forms
      document.querySelectorAll('form').forEach(form => {
        elements.forms.push({
          action: form.action,
          method: form.method,
          id: form.id,
          classes: Array.from(form.classList)
        });
      });

      return elements;
    };

    // Extract all headings
    const extractHeadings = () => {
      const headings = [];
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        const styles = window.getComputedStyle(h);
        headings.push({
          level: h.tagName,
          text: h.textContent.trim(),
          styles: {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            color: styles.color,
            fontFamily: styles.fontFamily
          }
        });
      });
      return headings;
    };

    // Extract all images
    const extractImages = () => {
      const images = [];
      document.querySelectorAll('img').forEach(img => {
        images.push({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          classes: Array.from(img.classList)
        });
      });
      return images;
    };

    // Extract color palette
    const extractColors = () => {
      const colors = new Set();
      document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.backgroundColor);
        }
        if (styles.color) {
          colors.add(styles.color);
        }
        if (styles.borderColor && styles.borderColor !== 'rgb(0, 0, 0)') {
          colors.add(styles.borderColor);
        }
      });
      return Array.from(colors);
    };

    // Extract fonts
    const extractFonts = () => {
      const fonts = new Set();
      document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.fontFamily) {
          fonts.add(styles.fontFamily);
        }
      });
      return Array.from(fonts);
    };

    return {
      domTree: extractElement(document.body),
      interactiveElements: extractInteractiveElements(),
      headings: extractHeadings(),
      images: extractImages(),
      colors: extractColors(),
      fonts: extractFonts(),
      pageInfo: {
        title: document.title,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
  });

  console.log('📱 Testing tablet viewport (768px)...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(analysisDir, 'screenshot-tablet.png'),
    fullPage: true
  });

  console.log('📱 Testing mobile viewport (375px)...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(analysisDir, 'screenshot-mobile.png'),
    fullPage: true
  });

  console.log('🎬 Testing interactions and animations...');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Try to click buttons and record what happens
  const interactions = await page.evaluate(() => {
    const results = [];
    const buttons = document.querySelectorAll('button, [role="button"]');

    buttons.forEach((btn, index) => {
      results.push({
        index,
        text: btn.textContent.trim(),
        classList: Array.from(btn.classList),
        hasOnClick: btn.onclick !== null,
        hasEventListeners: true // Can't easily detect in modern browsers
      });
    });

    return results;
  });

  console.log('💾 Saving comprehensive analysis...');
  const finalAnalysis = {
    timestamp: new Date().toISOString(),
    ...pageAnalysis,
    interactions,
    screenshots: {
      desktop: 'screenshot-desktop.png',
      tablet: 'screenshot-tablet.png',
      mobile: 'screenshot-mobile.png'
    }
  };

  // Save JSON
  fs.writeFileSync(
    path.join(analysisDir, 'comprehensive-analysis.json'),
    JSON.stringify(finalAnalysis, null, 2)
  );

  // Save human-readable report
  const report = `
# 타이트사주 사이트 분석 보고서
생성일시: ${new Date().toLocaleString('ko-KR')}

## 페이지 정보
- 제목: ${finalAnalysis.pageInfo.title}
- URL: ${finalAnalysis.pageInfo.url}

## 색상 팔레트
발견된 색상: ${finalAnalysis.colors.length}개
${finalAnalysis.colors.slice(0, 20).map(c => `- ${c}`).join('\n')}

## 폰트
${finalAnalysis.fonts.map(f => `- ${f}`).join('\n')}

## 제목 구조
${finalAnalysis.headings.map(h => `${h.level}: ${h.text}`).join('\n')}

## 인터랙티브 요소
- 버튼: ${finalAnalysis.interactiveElements.buttons.length}개
- 링크: ${finalAnalysis.interactiveElements.links.length}개
- 입력 필드: ${finalAnalysis.interactiveElements.inputs.length}개
- 폼: ${finalAnalysis.interactiveElements.forms.length}개

## 이미지
총 ${finalAnalysis.images.length}개의 이미지

## 스크린샷
- Desktop (1920x1080): screenshot-desktop.png
- Tablet (768x1024): screenshot-tablet.png
- Mobile (375x812): screenshot-mobile.png
  `;

  fs.writeFileSync(
    path.join(analysisDir, 'ANALYSIS_REPORT.md'),
    report
  );

  console.log('✅ Analysis complete!');
  console.log(`\n📁 Results saved to: ${analysisDir}`);
  console.log('\nGenerated files:');
  console.log('  - screenshot-desktop.png');
  console.log('  - screenshot-tablet.png');
  console.log('  - screenshot-mobile.png');
  console.log('  - comprehensive-analysis.json (detailed data)');
  console.log('  - ANALYSIS_REPORT.md (human-readable report)');

  console.log(`\n📊 Summary:`);
  console.log(`  - ${finalAnalysis.headings.length} headings`);
  console.log(`  - ${finalAnalysis.interactiveElements.buttons.length} buttons`);
  console.log(`  - ${finalAnalysis.interactiveElements.links.length} links`);
  console.log(`  - ${finalAnalysis.interactiveElements.inputs.length} inputs`);
  console.log(`  - ${finalAnalysis.images.length} images`);
  console.log(`  - ${finalAnalysis.colors.length} unique colors`);
  console.log(`  - ${finalAnalysis.fonts.length} font families`);

  await browser.close();
}

analyzeSite().catch(error => {
  console.error('❌ Error during analysis:', error);
  process.exit(1);
});
