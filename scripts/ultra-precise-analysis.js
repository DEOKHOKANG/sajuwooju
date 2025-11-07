const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function ultraPreciseAnalysis() {
  console.log('🔬 Ultra-Precise Analysis Tool');
  console.log('=' .repeat(80));
  console.log('Target: 100% Clone Accuracy\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });

  const page = await context.newPage();

  // 원본 사이트 분석
  console.log('📊 Analyzing original site (sajuwooju.me)...\n');
  await page.goto('https://sajuwooju.me', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForTimeout(3000);

  const originalData = await page.evaluate(() => {
    const data = {
      elements: [],
      images: [],
      fonts: new Set(),
      animations: [],
      boxModels: []
    };

    // 모든 요소의 상세 분석
    const allElements = document.querySelectorAll('*');

    allElements.forEach((el, index) => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // 화면에 보이는 요소만 분석
      if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight + 100) {
        const elementData = {
          index,
          tag: el.tagName.toLowerCase(),
          className: el.className,
          id: el.id,
          text: el.textContent?.trim().substring(0, 50),

          // Box Model
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },

          // Spacing
          margin: {
            top: parseFloat(styles.marginTop),
            right: parseFloat(styles.marginRight),
            bottom: parseFloat(styles.marginBottom),
            left: parseFloat(styles.marginLeft)
          },
          padding: {
            top: parseFloat(styles.paddingTop),
            right: parseFloat(styles.paddingRight),
            bottom: parseFloat(styles.paddingBottom),
            left: parseFloat(styles.paddingLeft)
          },

          // Typography
          font: {
            family: styles.fontFamily,
            size: styles.fontSize,
            weight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            textAlign: styles.textAlign
          },

          // Colors
          colors: {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor
          },

          // Border & Radius
          border: {
            width: styles.borderWidth,
            style: styles.borderStyle,
            radius: styles.borderRadius
          },

          // Display & Position
          display: styles.display,
          position: styles.position,
          zIndex: styles.zIndex,

          // Flexbox/Grid
          flexbox: {
            display: styles.display,
            flexDirection: styles.flexDirection,
            justifyContent: styles.justifyContent,
            alignItems: styles.alignItems,
            gap: styles.gap
          },

          // Effects
          effects: {
            boxShadow: styles.boxShadow,
            opacity: styles.opacity,
            transform: styles.transform,
            transition: styles.transition,
            animation: styles.animation
          }
        };

        data.elements.push(elementData);

        // 폰트 수집
        if (styles.fontFamily) {
          data.fonts.add(styles.fontFamily);
        }
      }
    });

    // 이미지 추출
    document.querySelectorAll('img').forEach(img => {
      data.images.push({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
    });

    // Background images 추출
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.backgroundImage && styles.backgroundImage !== 'none') {
        const match = styles.backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
        if (match) {
          data.images.push({
            src: match[1],
            type: 'background',
            element: el.tagName + (el.className ? '.' + el.className : '')
          });
        }
      }
    });

    return {
      elements: data.elements,
      images: data.images,
      fonts: Array.from(data.fonts)
    };
  });

  console.log(`✅ Analyzed ${originalData.elements.length} visible elements`);
  console.log(`✅ Found ${originalData.images.length} images`);
  console.log(`✅ Detected ${originalData.fonts.length} font families\n`);

  // 결과 저장
  const outputDir = path.join(__dirname, '../analysis/ultra-precise');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'original-detailed.json'),
    JSON.stringify(originalData, null, 2)
  );

  console.log('📁 Saved: analysis/ultra-precise/original-detailed.json\n');

  // 복제본 분석
  console.log('📊 Analyzing clone (localhost:3001)...\n');

  await page.goto('http://localhost:3001', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(3000);

  const cloneData = await page.evaluate(() => {
    const data = {
      elements: [],
      images: [],
      fonts: new Set()
    };

    const allElements = document.querySelectorAll('*');

    allElements.forEach((el, index) => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight + 100) {
        const elementData = {
          index,
          tag: el.tagName.toLowerCase(),
          className: el.className,
          id: el.id,
          text: el.textContent?.trim().substring(0, 50),

          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },

          margin: {
            top: parseFloat(styles.marginTop),
            right: parseFloat(styles.marginRight),
            bottom: parseFloat(styles.marginBottom),
            left: parseFloat(styles.marginLeft)
          },
          padding: {
            top: parseFloat(styles.paddingTop),
            right: parseFloat(styles.paddingRight),
            bottom: parseFloat(styles.paddingBottom),
            left: parseFloat(styles.paddingLeft)
          },

          font: {
            family: styles.fontFamily,
            size: styles.fontSize,
            weight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            textAlign: styles.textAlign
          },

          colors: {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor
          },

          border: {
            width: styles.borderWidth,
            style: styles.borderStyle,
            radius: styles.borderRadius
          },

          display: styles.display,
          position: styles.position,
          zIndex: styles.zIndex,

          flexbox: {
            display: styles.display,
            flexDirection: styles.flexDirection,
            justifyContent: styles.justifyContent,
            alignItems: styles.alignItems,
            gap: styles.gap
          },

          effects: {
            boxShadow: styles.boxShadow,
            opacity: styles.opacity,
            transform: styles.transform,
            transition: styles.transition,
            animation: styles.animation
          }
        };

        data.elements.push(elementData);

        if (styles.fontFamily) {
          data.fonts.add(styles.fontFamily);
        }
      }
    });

    document.querySelectorAll('img').forEach(img => {
      data.images.push({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height
      });
    });

    return {
      elements: data.elements,
      images: data.images,
      fonts: Array.from(data.fonts)
    };
  });

  console.log(`✅ Analyzed ${cloneData.elements.length} visible elements`);
  console.log(`✅ Found ${cloneData.images.length} images`);
  console.log(`✅ Detected ${cloneData.fonts.length} font families\n`);

  fs.writeFileSync(
    path.join(outputDir, 'clone-detailed.json'),
    JSON.stringify(cloneData, null, 2)
  );

  console.log('📁 Saved: analysis/ultra-precise/clone-detailed.json\n');

  // Gap 분석
  console.log('🔍 GAP ANALYSIS');
  console.log('=' .repeat(80));

  const gaps = {
    fonts: [],
    colors: [],
    spacing: [],
    sizing: [],
    effects: [],
    critical: []
  };

  // 폰트 비교
  console.log('\n📝 FONT ANALYSIS:\n');
  originalData.fonts.forEach(font => {
    const inClone = cloneData.fonts.some(f => f.includes(font.split(',')[0]));
    if (!inClone) {
      gaps.fonts.push({
        type: 'missing',
        font: font,
        priority: 'HIGH'
      });
      console.log(`❌ Missing font: ${font}`);
    } else {
      console.log(`✅ Font present: ${font.split(',')[0]}`);
    }
  });

  // 주요 섹션별 상세 비교
  console.log('\n📐 SECTION-BY-SECTION COMPARISON:\n');

  const sections = [
    { name: 'Header', selector: 'header' },
    { name: 'Hero Section', selector: '.hero, section:first-of-type' },
    { name: 'Category Grid', selector: '.grid-cols-5' },
    { name: 'Event Banner', selector: 'section:has(h2)' },
    { name: 'Chat Button', selector: '[aria-label="채팅"]' }
  ];

  for (const section of sections) {
    console.log(`\n--- ${section.name} ---`);

    const origSection = originalData.elements.find(el => {
      if (section.selector === 'header') return el.tag === 'header';
      if (typeof el.className === 'string') {
        return el.className.includes(section.selector.replace('.', ''));
      }
      return false;
    });

    const cloneSection = cloneData.elements.find(el => {
      if (section.selector === 'header') return el.tag === 'header';
      if (typeof el.className === 'string') {
        return el.className.includes(section.selector.replace('.', ''));
      }
      return false;
    });

    if (origSection && cloneSection) {
      // 크기 비교
      const widthDiff = Math.abs(origSection.position.width - cloneSection.position.width);
      const heightDiff = Math.abs(origSection.position.height - cloneSection.position.height);

      console.log(`  Width:  ${origSection.position.width.toFixed(1)}px → ${cloneSection.position.width.toFixed(1)}px (Δ ${widthDiff.toFixed(1)}px) ${widthDiff < 2 ? '✅' : '❌'}`);
      console.log(`  Height: ${origSection.position.height.toFixed(1)}px → ${cloneSection.position.height.toFixed(1)}px (Δ ${heightDiff.toFixed(1)}px) ${heightDiff < 2 ? '✅' : '❌'}`);

      // 여백 비교
      const paddingDiff = Math.abs(origSection.padding.top - cloneSection.padding.top);
      console.log(`  Padding: ${origSection.padding.top}px → ${cloneSection.padding.top}px (Δ ${paddingDiff.toFixed(1)}px) ${paddingDiff < 2 ? '✅' : '❌'}`);

      // 색상 비교
      const bgMatch = origSection.colors.backgroundColor === cloneSection.colors.backgroundColor;
      console.log(`  BG Color: ${origSection.colors.backgroundColor} → ${cloneSection.colors.backgroundColor} ${bgMatch ? '✅' : '❌'}`);

      if (widthDiff >= 2 || heightDiff >= 2) {
        gaps.sizing.push({
          section: section.name,
          original: origSection.position,
          clone: cloneSection.position,
          priority: 'HIGH'
        });
      }

      if (paddingDiff >= 2) {
        gaps.spacing.push({
          section: section.name,
          property: 'padding',
          original: origSection.padding,
          clone: cloneSection.padding,
          priority: 'MEDIUM'
        });
      }

      if (!bgMatch) {
        gaps.colors.push({
          section: section.name,
          property: 'backgroundColor',
          original: origSection.colors.backgroundColor,
          clone: cloneSection.colors.backgroundColor,
          priority: 'HIGH'
        });
      }
    }
  }

  // 이미지 분석
  console.log('\n\n🖼️  IMAGE ANALYSIS:\n');
  console.log(`Original: ${originalData.images.length} images`);
  console.log(`Clone: ${cloneData.images.length} images`);

  const imageDiff = originalData.images.length - cloneData.images.length;
  if (imageDiff > 0) {
    gaps.critical.push({
      type: 'missing-images',
      count: imageDiff,
      priority: 'CRITICAL'
    });
    console.log(`❌ Missing ${imageDiff} images`);
  } else {
    console.log(`✅ Image count matches`);
  }

  // Gap 요약
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 GAP SUMMARY');
  console.log('='.repeat(80) + '\n');

  const totalGaps =
    gaps.fonts.length +
    gaps.colors.length +
    gaps.spacing.length +
    gaps.sizing.length +
    gaps.effects.length +
    gaps.critical.length;

  console.log(`Total Gaps Found: ${totalGaps}\n`);

  console.log(`🔴 CRITICAL (${gaps.critical.length}):`);
  gaps.critical.forEach(gap => console.log(`   - ${gap.type}: ${JSON.stringify(gap).substring(0, 80)}`));

  console.log(`\n🟡 HIGH Priority (${gaps.fonts.length + gaps.colors.length + gaps.sizing.length}):`);
  [...gaps.fonts, ...gaps.colors, ...gaps.sizing].forEach(gap =>
    console.log(`   - ${gap.section || gap.type}: ${JSON.stringify(gap).substring(0, 80)}`)
  );

  console.log(`\n🟢 MEDIUM Priority (${gaps.spacing.length + gaps.effects.length}):`);
  [...gaps.spacing, ...gaps.effects].forEach(gap =>
    console.log(`   - ${gap.section}: ${gap.property}`)
  );

  // Gap 저장
  fs.writeFileSync(
    path.join(outputDir, 'gaps.json'),
    JSON.stringify(gaps, null, 2)
  );

  console.log('\n📁 Saved: analysis/ultra-precise/gaps.json');

  // 정확도 계산
  const maxScore = 1000; // 총 1000점 만점
  const deductions = {
    critical: gaps.critical.length * 100,
    high: (gaps.fonts.length + gaps.colors.length + gaps.sizing.length) * 20,
    medium: (gaps.spacing.length + gaps.effects.length) * 5
  };

  const totalDeduction = deductions.critical + deductions.high + deductions.medium;
  const accuracy = Math.max(0, ((maxScore - totalDeduction) / maxScore) * 100);

  console.log('\n\n' + '='.repeat(80));
  console.log('🎯 ACCURACY SCORE');
  console.log('='.repeat(80));
  console.log(`\nCurrent Accuracy: ${accuracy.toFixed(2)}%`);
  console.log(`Target: 100.00%`);
  console.log(`Gap: ${(100 - accuracy).toFixed(2)}%\n`);

  console.log('Deductions:');
  console.log(`  - Critical issues: -${deductions.critical} points`);
  console.log(`  - High priority: -${deductions.high} points`);
  console.log(`  - Medium priority: -${deductions.medium} points`);
  console.log(`  Total deduction: -${totalDeduction} points\n`);

  await browser.close();

  return {
    accuracy,
    gaps,
    totalGaps
  };
}

ultraPreciseAnalysis().catch(console.error);
