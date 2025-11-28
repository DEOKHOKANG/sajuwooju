const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Precise Spacing Measurement\n');
  console.log('='.repeat(80));

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });

  // 복제본 측정
  const page = await context.newPage();
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);

  const cloneMeasurements = await page.evaluate(() => {
    const measurements = {};

    // Main container
    const main = document.querySelector('main');
    if (main) {
      const mainStyles = window.getComputedStyle(main);
      measurements.main = {
        maxWidth: mainStyles.maxWidth,
        paddingLeft: mainStyles.paddingLeft,
        paddingRight: mainStyles.paddingRight,
        paddingBottom: mainStyles.paddingBottom
      };
    }

    // Sections
    const sections = document.querySelectorAll('section');
    measurements.sections = Array.from(sections).map((section, i) => {
      const styles = window.getComputedStyle(section);
      return {
        index: i,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        marginTop: styles.marginTop,
        marginBottom: styles.marginBottom
      };
    });

    // Hero slider
    const heroSlider = document.querySelector('section:first-of-type > div');
    if (heroSlider) {
      const styles = window.getComputedStyle(heroSlider);
      measurements.heroSlider = {
        gap: styles.gap
      };
    }

    // Category grid
    const categoryGrid = document.querySelector('section:nth-of-type(2) .grid');
    if (categoryGrid) {
      const styles = window.getComputedStyle(categoryGrid);
      measurements.categoryGrid = {
        gap: styles.gap,
        gridTemplateColumns: styles.gridTemplateColumns
      };
    }

    // Headings
    const h2Elements = document.querySelectorAll('h2');
    measurements.headings = Array.from(h2Elements).map((h2, i) => {
      const styles = window.getComputedStyle(h2);
      return {
        index: i,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        marginBottom: styles.marginBottom
      };
    });

    // Event banner
    const eventBanner = document.querySelector('section:nth-of-type(3) > div:nth-of-type(2)');
    if (eventBanner) {
      const styles = window.getComputedStyle(eventBanner);
      measurements.eventBanner = {
        padding: styles.padding,
        borderRadius: styles.borderRadius
      };
    }

    // Ranking card
    const rankingCard = document.querySelector('section:nth-of-type(4) > div:nth-of-type(2)');
    if (rankingCard) {
      const styles = window.getComputedStyle(rankingCard);
      measurements.rankingCard = {
        padding: styles.padding,
        borderRadius: styles.borderRadius
      };
    }

    return measurements;
  });

  await browser.close();

  console.log('📏 Clone Measurements:\n');
  console.log(JSON.stringify(cloneMeasurements, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log('✅ Spacing measurement complete\n');

  // ROADMAP에서 기대값 비교
  console.log('📊 Expected vs Actual:\n');

  console.log('Main Container:');
  console.log(`  Max-width: ${cloneMeasurements.main.maxWidth} (expected: 600px)`);
  console.log(`  Padding-left: ${cloneMeasurements.main.paddingLeft} (expected: 16px)`);
  console.log(`  Padding-right: ${cloneMeasurements.main.paddingRight} (expected: 16px)`);

  console.log('\nSections:');
  cloneMeasurements.sections.forEach((section, i) => {
    console.log(`  Section ${i}:`);
    console.log(`    Padding-top: ${section.paddingTop} (expected: 32px for most)`);
    console.log(`    Padding-bottom: ${section.paddingBottom}`);
  });

  console.log('\nHero Slider:');
  console.log(`  Gap: ${cloneMeasurements.heroSlider?.gap || 'N/A'} (expected: 16px)`);

  console.log('\nCategory Grid:');
  console.log(`  Gap: ${cloneMeasurements.categoryGrid?.gap || 'N/A'} (expected: 16px)`);

  console.log('\nHeadings (h2):');
  cloneMeasurements.headings.forEach((h, i) => {
    console.log(`  H2 ${i}:`);
    console.log(`    Font-size: ${h.fontSize} (expected: 20px)`);
    console.log(`    Font-weight: ${h.fontWeight} (expected: 600)`);
    console.log(`    Margin-bottom: ${h.marginBottom} (expected: 16px)`);
  });

  console.log('\nBorder Radius:');
  console.log(`  Event Banner: ${cloneMeasurements.eventBanner?.borderRadius || 'N/A'} (expected: 20px)`);
  console.log(`  Ranking Card: ${cloneMeasurements.rankingCard?.borderRadius || 'N/A'} (expected: 20px)`);

  console.log('\n' + '='.repeat(80));
  console.log('💡 Recommended Adjustments:\n');

  // 간단한 차이 분석
  if (cloneMeasurements.main.paddingLeft !== '16px') {
    console.log('⚠️  Main padding-left should be 16px (currently: ' + cloneMeasurements.main.paddingLeft + ')');
  }

  let allSectionsCorrect = cloneMeasurements.sections.every((s, i) => {
    if (i === 2) return s.paddingTop === '16px'; // Event section is py-4
    return s.paddingTop === '32px';
  });

  if (!allSectionsCorrect) {
    console.log('⚠️  Some section paddings need adjustment');
  }

  if (!cloneMeasurements.headings.every(h => h.marginBottom === '24px')) {
    console.log('⚠️  H2 margin-bottom should be 24px (mb-6)');
  }

  console.log('\n✅ Continue to next phase: Line-height adjustments');
})();
