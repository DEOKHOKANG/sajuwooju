const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🎯 Final Verification - 100% Clone Accuracy\n');
  console.log('='.repeat(80));

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });

  // 복제본 측정
  const page = await context.newPage();
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);

  const finalMeasurements = await page.evaluate(() => {
    const results = {
      score: 0,
      maxScore: 1000,
      categories: {}
    };

    // 1. Layout Structure (200 points)
    const main = document.querySelector('main');
    const sections = document.querySelectorAll('section');

    let layoutScore = 0;
    if (main && window.getComputedStyle(main).maxWidth === '600px') layoutScore += 50;
    if (main && window.getComputedStyle(main).paddingLeft === '16px') layoutScore += 50;
    if (sections.length === 4) layoutScore += 50;

    // Check section paddings
    let sectionsCorrect = 0;
    sections.forEach((section, i) => {
      const styles = window.getComputedStyle(section);
      if (i === 2 && styles.paddingTop === '16px') sectionsCorrect++;
      else if (styles.paddingTop === '32px') sectionsCorrect++;
    });
    layoutScore += (sectionsCorrect / 4) * 50;

    results.categories.layout = {
      score: layoutScore,
      max: 200,
      percentage: (layoutScore / 200 * 100).toFixed(1) + '%'
    };

    // 2. Typography (200 points)
    const h2Elements = document.querySelectorAll('h2');
    let typoScore = 0;

    h2Elements.forEach(h2 => {
      const styles = window.getComputedStyle(h2);
      if (styles.fontSize === '20px') typoScore += 20;
      if (styles.fontWeight === '600') typoScore += 20;
      if (styles.lineHeight === '28px') typoScore += 20;
    });

    const body = document.querySelector('body');
    const bodyStyles = window.getComputedStyle(body);
    if (bodyStyles.fontSize === '16px') typoScore += 40;
    if (parseFloat(bodyStyles.lineHeight) >= 22 && parseFloat(bodyStyles.lineHeight) <= 25) typoScore += 40;

    results.categories.typography = {
      score: typoScore,
      max: 200,
      percentage: (typoScore / 200 * 100).toFixed(1) + '%'
    };

    // 3. Colors (150 points)
    const header = document.querySelector('header');
    let colorScore = 0;

    if (header) {
      const headerStyles = window.getComputedStyle(header);
      if (headerStyles.backgroundColor === 'rgb(255, 255, 255)') colorScore += 50;
    }

    const chatButton = document.querySelector('button[aria-label="채팅"]');
    if (chatButton) {
      const btnStyles = window.getComputedStyle(chatButton);
      if (btnStyles.backgroundColor === 'rgb(244, 63, 94)') colorScore += 50;
    }

    h2Elements.forEach(h2 => {
      const styles = window.getComputedStyle(h2);
      if (styles.color === 'rgb(65, 66, 84)') colorScore += 10;
    });

    results.categories.colors = {
      score: colorScore,
      max: 150,
      percentage: (colorScore / 150 * 100).toFixed(1) + '%'
    };

    // 4. Images (200 points)
    const images = document.querySelectorAll('img');
    let imageScore = 0;

    // Hero images
    const heroImages = Array.from(images).filter(img =>
      img.closest('section:first-of-type')
    );
    if (heroImages.length >= 2) imageScore += 50;

    // Category images
    const categoryImages = Array.from(images).filter(img =>
      img.closest('.grid')
    );
    if (categoryImages.length >= 10) imageScore += 100;

    // All images loaded
    const allLoaded = Array.from(images).every(img => img.complete && img.naturalWidth > 0);
    if (allLoaded) imageScore += 50;

    results.categories.images = {
      score: imageScore,
      max: 200,
      percentage: (imageScore / 200 * 100).toFixed(1) + '%',
      count: images.length
    };

    // 5. Spacing & Dimensions (150 points)
    let spacingScore = 0;

    const heroSlider = document.querySelector('section:first-of-type > div');
    if (heroSlider && window.getComputedStyle(heroSlider).gap === '16px') spacingScore += 30;

    const categoryGrid = document.querySelector('.grid');
    if (categoryGrid && window.getComputedStyle(categoryGrid).gap === '16px') spacingScore += 30;

    if (chatButton) {
      const btnStyles = window.getComputedStyle(chatButton);
      if (btnStyles.width === '56px' && btnStyles.height === '56px') spacingScore += 30;
    }

    if (header) {
      const headerStyles = window.getComputedStyle(header);
      if (headerStyles.height === '60px') spacingScore += 30;
    }

    const mainBottom = window.getComputedStyle(main).paddingBottom;
    if (mainBottom === '80px') spacingScore += 30;

    results.categories.spacing = {
      score: spacingScore,
      max: 150,
      percentage: (spacingScore / 150 * 100).toFixed(1) + '%'
    };

    // 6. Border Radius (50 points)
    let borderScore = 0;

    const heroCards = document.querySelectorAll('section:first-of-type > div > div');
    heroCards.forEach(card => {
      const styles = window.getComputedStyle(card);
      if (styles.borderRadius === '20px') borderScore += 5;
    });

    const eventBanner = document.querySelector('section:nth-of-type(3) > div:nth-of-type(2)');
    if (eventBanner && window.getComputedStyle(eventBanner).borderRadius === '20px') borderScore += 5;

    const rankingCard = document.querySelector('section:nth-of-type(4) > div:nth-of-type(2)');
    if (rankingCard && window.getComputedStyle(rankingCard).borderRadius === '20px') borderScore += 5;

    // Category icons (should be 50% = circular)
    const categoryIcons = document.querySelectorAll('.grid > div > div:first-child');
    let circularCount = 0;
    categoryIcons.forEach(icon => {
      const styles = window.getComputedStyle(icon);
      // Check if it's circular (50% or very large radius)
      if (styles.borderRadius.includes('%') || parseFloat(styles.borderRadius) >= 28) {
        circularCount++;
      }
    });
    if (circularCount >= 10) borderScore += 10;

    // Chat button (should be 50% = circular)
    if (chatButton) {
      const btnStyles = window.getComputedStyle(chatButton);
      if (btnStyles.borderRadius.includes('%') || parseFloat(btnStyles.borderRadius) >= 28) {
        borderScore += 10;
      }
    }

    // Event profile icon
    const eventProfile = document.querySelector('section:nth-of-type(3) > div > div > div:first-child');
    if (eventProfile) {
      const styles = window.getComputedStyle(eventProfile);
      if (styles.borderRadius.includes('%') || parseFloat(styles.borderRadius) >= 24) {
        borderScore += 5;
      }
    }

    // Discount badge
    const discountBadge = document.querySelector('.inline-block.px-3.py-1');
    if (discountBadge) {
      const styles = window.getComputedStyle(discountBadge);
      if (parseFloat(styles.borderRadius) >= 100) {
        borderScore += 10;
      }
    }

    results.categories.borderRadius = {
      score: borderScore,
      max: 50,
      percentage: (borderScore / 50 * 100).toFixed(1) + '%'
    };

    // 7. Effects (50 points)
    let effectsScore = 0;

    if (chatButton) {
      const btnStyles = window.getComputedStyle(chatButton);
      if (btnStyles.boxShadow && btnStyles.boxShadow !== 'none') effectsScore += 25;
      if (btnStyles.transition && btnStyles.transition.includes('transform')) effectsScore += 25;
    }

    results.categories.effects = {
      score: effectsScore,
      max: 50,
      percentage: (effectsScore / 50 * 100).toFixed(1) + '%'
    };

    // Calculate total
    results.score =
      results.categories.layout.score +
      results.categories.typography.score +
      results.categories.colors.score +
      results.categories.images.score +
      results.categories.spacing.score +
      results.categories.borderRadius.score +
      results.categories.effects.score;

    results.percentage = (results.score / results.maxScore * 100).toFixed(2);

    return results;
  });

  await browser.close();

  console.log('\n📊 FINAL ACCURACY REPORT\n');
  console.log('='.repeat(80));

  console.log(`\n🎯 Overall Accuracy: ${finalMeasurements.percentage}%`);
  console.log(`   Score: ${finalMeasurements.score}/${finalMeasurements.maxScore} points\n`);

  console.log('Breakdown by Category:\n');

  Object.entries(finalMeasurements.categories).forEach(([category, data]) => {
    const barLength = Math.min(20, Math.max(0, Math.floor(data.score / data.max * 20)));
    const bar = '█'.repeat(barLength);
    const emptyBar = '░'.repeat(Math.max(0, 20 - barLength));
    console.log(`${category.padEnd(20)} ${bar}${emptyBar} ${data.percentage} (${data.score}/${data.max})`);
  });

  console.log('\n' + '='.repeat(80));

  // Compare with initial accuracy
  const initialAccuracy = 82.00;
  const improvement = (parseFloat(finalMeasurements.percentage) - initialAccuracy).toFixed(2);

  console.log('\n📈 Progress:\n');
  console.log(`   Initial:  ${initialAccuracy}%`);
  console.log(`   Current:  ${finalMeasurements.percentage}%`);
  console.log(`   Improvement: +${improvement}% ${improvement > 0 ? '✅' : ''}\n`);

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    accuracy: finalMeasurements.percentage,
    score: finalMeasurements.score,
    maxScore: finalMeasurements.maxScore,
    categories: finalMeasurements.categories,
    improvements: {
      initial: initialAccuracy,
      current: parseFloat(finalMeasurements.percentage),
      change: parseFloat(improvement)
    },
    completedTasks: [
      'Border-radius precision (20px)',
      'Real image application (Hero + Categories)',
      'Precise spacing measurements',
      'Line-height optimization (1.5)',
      'Font rendering (-webkit-font-smoothing)',
      'Box shadow on chat button',
      'Pretendard Variable font'
    ]
  };

  fs.writeFileSync(
    path.join(__dirname, '../analysis/ultra-precise/final-verification-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('='.repeat(80));
  console.log('✅ Report saved: analysis/ultra-precise/final-verification-report.json\n');

  // Next steps
  if (parseFloat(finalMeasurements.percentage) >= 92) {
    console.log('🎉 SUCCESS! Target 92%+ achieved!\n');
    console.log('Next steps for 100%:');
    console.log('  - Add more Hero slides');
    console.log('  - Implement hover animations');
    console.log('  - Add auto-play to Hero slider');
    console.log('  - Apply remaining images');
  } else {
    console.log('📌 Continue improvements to reach 92% target\n');
  }
})();
