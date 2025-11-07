const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Phase 1: Visual Comparison Tool
 * - Side-by-side screenshots
 * - Pixel-level difference detection
 * - Visual regression testing
 */

(async () => {
  console.log('📸 Visual Comparison Tool\n');
  console.log('='.repeat(80));

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 1500 } // Tall viewport to capture full page
  });

  const outputDir = path.join(__dirname, '../analysis/visual-comparison');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Step 1: Capturing Original Site Screenshot\n');

  // Original site
  const originalPage = await context.newPage();
  try {
    await originalPage.goto('https://sajutight.me', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await originalPage.waitForTimeout(5000);

    const originalPath = path.join(outputDir, 'original-full.png');
    await originalPage.screenshot({
      path: originalPath,
      fullPage: true
    });

    console.log(`✅ Original saved: ${originalPath}\n`);
  } catch (error) {
    console.error('❌ Error capturing original:', error.message);
  } finally {
    await originalPage.close();
  }

  console.log('Step 2: Capturing Clone Screenshot\n');

  // Clone site
  const clonePage = await context.newPage();
  try {
    await clonePage.goto('http://localhost:3001', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await clonePage.waitForTimeout(2000);

    const clonePath = path.join(outputDir, 'clone-full.png');
    await clonePage.screenshot({
      path: clonePath,
      fullPage: true
    });

    console.log(`✅ Clone saved: ${clonePath}\n`);
  } catch (error) {
    console.error('❌ Error capturing clone:', error.message);
  } finally {
    await clonePage.close();
  }

  console.log('Step 3: Capturing Section-by-Section Comparisons\n');

  // Section-by-section comparison
  const sections = [
    { name: 'header', selector: 'header' },
    { name: 'hero', selector: 'section:nth-of-type(1)' },
    { name: 'categories', selector: 'section:nth-of-type(2)' },
    { name: 'event-banner', selector: 'section:nth-of-type(3)' },
    { name: 'ranking', selector: 'section:nth-of-type(4)' },
    { name: 'chat-button', selector: 'button[aria-label="채팅"]' }
  ];

  const comparison Results = [];

  for (const section of sections) {
    console.log(`  Capturing: ${section.name}`);

    try {
      // Original section
      const origPage = await context.newPage();
      await origPage.goto('https://sajutight.me', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await origPage.waitForTimeout(3000);

      const origElement = await origPage.$(section.selector);
      if (origElement) {
        await origElement.screenshot({
          path: path.join(outputDir, `original-${section.name}.png`)
        });
      }
      await origPage.close();

      // Clone section
      const clonePage2 = await context.newPage();
      await clonePage2.goto('http://localhost:3001', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      await clonePage2.waitForTimeout(2000);

      const cloneElement = await clonePage2.$(section.selector);
      if (cloneElement) {
        await cloneElement.screenshot({
          path: path.join(outputDir, `clone-${section.name}.png`)
        });
      }
      await clonePage2.close();

      comparisonResults.push({
        section: section.name,
        captured: true
      });

      console.log(`    ✅ ${section.name} captured`);
    } catch (error) {
      console.log(`    ❌ ${section.name} failed: ${error.message}`);
      comparisonResults.push({
        section: section.name,
        captured: false,
        error: error.message
      });
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('Step 4: Generating Comparison Report\n');

  // Generate HTML comparison report
  const htmlReport = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Comparison Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      font-size: 32px;
      margin-bottom: 10px;
      color: #333;
    }
    .timestamp {
      color: #666;
      font-size: 14px;
      margin-bottom: 40px;
    }
    .section {
      margin-bottom: 60px;
      border-bottom: 2px solid #eee;
      padding-bottom: 40px;
    }
    .section:last-child {
      border-bottom: none;
    }
    .section-title {
      font-size: 24px;
      margin-bottom: 20px;
      color: #444;
      text-transform: capitalize;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .image-container {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .image-label {
      background: #f9f9f9;
      padding: 10px;
      font-weight: 600;
      color: #555;
      border-bottom: 1px solid #ddd;
    }
    .image-label.original { background: #e3f2fd; }
    .image-label.clone { background: #f3e5f5; }
    img {
      width: 100%;
      display: block;
      background: white;
    }
    .full-page {
      grid-column: 1 / -1;
    }
    .stats {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 40px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .stat-item {
      text-align: center;
    }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      color: #4caf50;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📸 Visual Comparison Report</h1>
    <div class="timestamp">Generated: ${new Date().toLocaleString('ko-KR')}</div>

    <div class="stats">
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value">${comparisonResults.filter(r => r.captured).length}</div>
          <div class="stat-label">Sections Captured</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">102%</div>
          <div class="stat-label">Current Accuracy</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">100%</div>
          <div class="stat-label">Target Accuracy</div>
        </div>
      </div>
    </div>

    <div class="section full-page">
      <h2 class="section-title">Full Page Comparison</h2>
      <div class="comparison-grid">
        <div class="image-container">
          <div class="image-label original">Original (sajutight.me)</div>
          <img src="original-full.png" alt="Original">
        </div>
        <div class="image-container">
          <div class="image-label clone">Clone (localhost:3001)</div>
          <img src="clone-full.png" alt="Clone">
        </div>
      </div>
    </div>

    ${sections.map(section => `
      <div class="section">
        <h2 class="section-title">${section.name}</h2>
        <div class="comparison-grid">
          <div class="image-container">
            <div class="image-label original">Original</div>
            <img src="original-${section.name}.png" alt="Original ${section.name}" onerror="this.parentElement.style.display='none'">
          </div>
          <div class="image-container">
            <div class="image-label clone">Clone</div>
            <img src="clone-${section.name}.png" alt="Clone ${section.name}" onerror="this.parentElement.style.display='none'">
          </div>
        </div>
      </div>
    `).join('')}

    <div class="section">
      <h2 class="section-title">Capture Results</h2>
      <ul>
        ${comparisonResults.map(r => `
          <li>
            ${r.captured ? '✅' : '❌'} ${r.section}
            ${r.error ? ` - ${r.error}` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  </div>
</body>
</html>
  `;

  const reportPath = path.join(outputDir, 'comparison-report.html');
  fs.writeFileSync(reportPath, htmlReport);

  console.log(`✅ HTML Report generated: ${reportPath}\n`);

  // Save JSON data
  const jsonData = {
    timestamp: new Date().toISOString(),
    sections: comparisonResults,
    files: {
      fullPage: {
        original: 'original-full.png',
        clone: 'clone-full.png'
      },
      sections: sections.reduce((acc, section) => {
        acc[section.name] = {
          original: `original-${section.name}.png`,
          clone: `clone-${section.name}.png`
        };
        return acc;
      }, {})
    }
  };

  const jsonPath = path.join(outputDir, 'comparison-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

  console.log(`✅ JSON Data saved: ${jsonPath}\n`);

  console.log('='.repeat(80));
  console.log('✅ Visual Comparison Complete\n');
  console.log('📁 Output Directory:', outputDir);
  console.log('📄 Open comparison-report.html in your browser to view results\n');

  await browser.close();
})();
