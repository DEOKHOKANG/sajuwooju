const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🖼️  Image Selection Tool\n');
  console.log('='.repeat(80));
  console.log('This tool helps identify which images to use for specific sections\n');

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 }
  });

  console.log('📥 Loading original site...');
  await page.goto('https://sajutight.me', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(5000);

  // Extract all images with their context
  const imageData = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));

    return images.map((img, index) => {
      // Find parent section
      let section = img.closest('section');
      let sectionType = 'unknown';

      if (section) {
        const sectionIndex = Array.from(document.querySelectorAll('section')).indexOf(section);
        const heading = section.querySelector('h2');

        if (sectionIndex === 0) sectionType = 'hero';
        else if (heading?.textContent.includes('카테고리')) sectionType = 'categories';
        else if (heading?.textContent.includes('이벤트')) sectionType = 'event';
        else if (heading?.textContent.includes('랭킹')) sectionType = 'ranking';
      }

      // Get image dimensions
      const rect = img.getBoundingClientRect();

      // Get computed styles
      const styles = window.getComputedStyle(img);

      return {
        index,
        src: img.src,
        alt: img.alt || '',
        width: img.naturalWidth || rect.width,
        height: img.naturalHeight || rect.height,
        displayWidth: rect.width,
        displayHeight: rect.height,
        section: sectionType,
        borderRadius: styles.borderRadius,
        objectFit: styles.objectFit,
        position: {
          top: rect.top,
          left: rect.left
        }
      };
    });
  });

  console.log(`\n✅ Found ${imageData.length} images\n`);
  console.log('='.repeat(80));

  // Group by section
  const bySection = {
    hero: [],
    categories: [],
    event: [],
    ranking: [],
    unknown: []
  };

  imageData.forEach(img => {
    bySection[img.section].push(img);
  });

  // Display grouped results
  Object.entries(bySection).forEach(([section, images]) => {
    if (images.length > 0) {
      console.log(`\n📂 ${section.toUpperCase()} SECTION (${images.length} images)\n`);

      images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.width}x${img.height}px (display: ${Math.round(img.displayWidth)}x${Math.round(img.displayHeight)})`);
        console.log(`     Border: ${img.borderRadius}, Fit: ${img.objectFit}`);
        console.log(`     URL: ${img.src.substring(0, 80)}...`);
        console.log('');
      });
    }
  });

  // Recommendations for missing sections
  console.log('='.repeat(80));
  console.log('\n💡 RECOMMENDATIONS\n');

  if (bySection.event.length === 0) {
    console.log('⚠️  No images found in Event section');
    console.log('   Looking for images around 330x165 or profile-sized...\n');

    // Find candidates by size
    const eventCandidates = imageData.filter(img =>
      (img.width >= 300 && img.width <= 360 && img.height >= 150 && img.height <= 200) ||
      (img.width >= 40 && img.width <= 60 && img.height >= 40 && img.height <= 60)
    );

    eventCandidates.forEach((img, i) => {
      console.log(`   Candidate ${i + 1}: ${img.width}x${img.height} - ${img.section} section`);
      console.log(`   URL: ${img.src.substring(0, 60)}...`);
    });
  }

  if (bySection.ranking.length === 0) {
    console.log('\n⚠️  No images found in Ranking section');
    console.log('   Looking for small square images (48x48 to 80x80)...\n');

    const rankingCandidates = imageData.filter(img =>
      img.width >= 40 && img.width <= 100 &&
      img.height >= 40 && img.height <= 100 &&
      Math.abs(img.width - img.height) < 20 // roughly square
    );

    rankingCandidates.forEach((img, i) => {
      console.log(`   Candidate ${i + 1}: ${img.width}x${img.height} - ${img.section} section`);
      console.log(`   URL: ${img.src.substring(0, 60)}...`);
    });
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalImages: imageData.length,
    bySection: {
      hero: bySection.hero.length,
      categories: bySection.categories.length,
      event: bySection.event.length,
      ranking: bySection.ranking.length,
      unknown: bySection.unknown.length
    },
    images: imageData,
    recommendations: {
      eventSection: bySection.event.length === 0 ? 'MISSING' : 'OK',
      rankingSection: bySection.ranking.length === 0 ? 'MISSING' : 'OK'
    }
  };

  const outputPath = path.join(__dirname, '../analysis/ultra-precise/image-selection-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log('\n='.repeat(80));
  console.log(`✅ Detailed report saved: ${outputPath}\n`);

  await browser.close();
})();
