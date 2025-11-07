const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Analyze post-login pages structure of sajutight.me
 * This script explores the site structure to identify:
 * - Product detail page structure
 * - User profile pages
 * - Booking/purchase flows
 * - Any login-gated features
 */

async function analyzePostLoginPages() {
  console.log('🔍 Starting post-login pages analysis...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 12 Pro size
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  const page = await context.newPage();
  const results = {
    timestamp: new Date().toISOString(),
    homepage: {},
    productPages: [],
    categoryPages: [],
    loginFlow: {},
    userPages: [],
    observations: []
  };

  try {
    // Step 1: Analyze homepage for clickable elements
    console.log('📱 Step 1: Loading homepage...');
    await page.goto('https://sajutight.me', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Find all product cards/links
    console.log('🔗 Step 2: Finding product links...');
    const productLinks = await page.evaluate(() => {
      const links = [];
      const cards = document.querySelectorAll('a[href*="/product"], a[href*="/saju"], div[onclick*="product"]');

      cards.forEach((card, index) => {
        const href = card.getAttribute('href') || card.getAttribute('onclick');
        const title = card.textContent?.trim().slice(0, 50) || `Product ${index + 1}`;

        if (href) {
          links.push({
            title,
            href: href.includes('http') ? href : `https://sajutight.me${href}`,
            selector: card.tagName + (card.id ? `#${card.id}` : '') + (card.className ? `.${card.className.split(' ')[0]}` : '')
          });
        }
      });

      return links.slice(0, 5); // Get first 5 products
    });

    console.log(`   Found ${productLinks.length} product links`);
    results.homepage.productLinks = productLinks;

    // Step 3: Try to find login button
    console.log('\n🔑 Step 3: Looking for login/auth elements...');
    const authElements = await page.evaluate(() => {
      const auth = {
        loginButtons: [],
        profileLinks: [],
        kakaoButtons: []
      };

      // Find login buttons
      document.querySelectorAll('a, button').forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        const href = el.getAttribute('href') || '';

        if (text.includes('로그인') || text.includes('login') || href.includes('login')) {
          auth.loginButtons.push({
            text: el.textContent?.trim(),
            href,
            tag: el.tagName
          });
        }

        if (text.includes('카카오') || text.includes('kakao')) {
          auth.kakaoButtons.push({
            text: el.textContent?.trim(),
            href,
            tag: el.tagName
          });
        }

        if (text.includes('프로필') || text.includes('내 정보') || text.includes('마이페이지')) {
          auth.profileLinks.push({
            text: el.textContent?.trim(),
            href,
            tag: el.tagName
          });
        }
      });

      return auth;
    });

    results.loginFlow = authElements;
    console.log('   Login buttons:', authElements.loginButtons.length);
    console.log('   Kakao buttons:', authElements.kakaoButtons.length);
    console.log('   Profile links:', authElements.profileLinks.length);

    // Step 4: Visit first product page (if exists)
    if (productLinks.length > 0) {
      console.log('\n📄 Step 4: Analyzing product detail page...');

      try {
        const firstProduct = productLinks[0];
        console.log(`   Visiting: ${firstProduct.title}`);

        // Try clicking the element
        await page.click(firstProduct.selector).catch(() => {
          console.log('   Click failed, trying navigation...');
        });

        await page.waitForTimeout(3000);

        // Analyze product page structure
        const productPageStructure = await page.evaluate(() => {
          return {
            url: window.location.href,
            title: document.title,
            hasBookingButton: !!document.querySelector('[class*="book"], [class*="purchase"], [class*="buy"], button:has-text("예약"), button:has-text("구매")'),
            hasPriceDisplay: !!document.querySelector('[class*="price"], .amount, [class*="cost"]'),
            hasReviews: !!document.querySelector('[class*="review"], [class*="rating"]'),
            hasDescription: !!document.querySelector('[class*="description"], [class*="detail"]'),
            requiresLogin: document.body.textContent?.includes('로그인이 필요') || document.body.textContent?.includes('로그인 후'),
            elements: {
              buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(Boolean).slice(0, 10),
              headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent?.trim()).filter(Boolean).slice(0, 5)
            }
          };
        });

        results.productPages.push(productPageStructure);
        console.log('   Product page analyzed');
        console.log('   - Requires login:', productPageStructure.requiresLogin);
        console.log('   - Has booking:', productPageStructure.hasBookingButton);
        console.log('   - Has reviews:', productPageStructure.hasReviews);
      } catch (error) {
        console.log('   ⚠️ Could not analyze product page:', error.message);
      }
    }

    // Step 5: Check category pages
    console.log('\n📂 Step 5: Checking category structure...');
    await page.goto('https://sajutight.me', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const categories = await page.evaluate(() => {
      const cats = [];
      const categoryElements = document.querySelectorAll('[class*="category"], [class*="카테고리"]');

      categoryElements.forEach(cat => {
        const links = cat.querySelectorAll('a');
        links.forEach(link => {
          cats.push({
            text: link.textContent?.trim(),
            href: link.getAttribute('href')
          });
        });
      });

      return cats.slice(0, 10);
    });

    results.categoryPages = categories;
    console.log(`   Found ${categories.length} category links`);

    // Step 6: Observations and recommendations
    console.log('\n💡 Step 6: Generating observations...');

    results.observations = [
      {
        area: 'Authentication',
        finding: authElements.kakaoButtons.length > 0 ? 'Kakao login detected' : 'No obvious Kakao login button',
        recommendation: authElements.kakaoButtons.length > 0
          ? 'Implement Kakao OAuth 2.0 authentication'
          : 'Need to investigate login flow manually'
      },
      {
        area: 'Product Pages',
        finding: `Found ${productLinks.length} product links on homepage`,
        recommendation: 'Create dynamic product detail pages with [id] route'
      },
      {
        area: 'User Flow',
        finding: results.productPages[0]?.requiresLogin
          ? 'Login required for product details'
          : 'Product details may be public',
        recommendation: 'Implement authentication check and redirect logic'
      }
    ];

    // Save results
    const outputDir = path.join(__dirname, '..', 'analysis', 'post-login');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'structure-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    // Generate markdown report
    const reportPath = path.join(outputDir, 'PHASE_6_ANALYSIS.md');
    const report = generateMarkdownReport(results);
    fs.writeFileSync(reportPath, report);

    console.log('\n✅ Analysis complete!');
    console.log(`📁 Results saved to:`);
    console.log(`   - ${outputPath}`);
    console.log(`   - ${reportPath}`);

  } catch (error) {
    console.error('❌ Error during analysis:', error);
    results.error = error.message;
  } finally {
    await browser.close();
  }

  return results;
}

function generateMarkdownReport(results) {
  return `# Phase 6: Post-Login Features Analysis

**Analysis Date**: ${new Date(results.timestamp).toLocaleString('ko-KR')}

---

## 🔍 Homepage Product Links

Found **${results.homepage.productLinks?.length || 0}** product links:

${results.homepage.productLinks?.map((link, i) => `${i + 1}. **${link.title}**
   - URL: ${link.href}
   - Selector: \`${link.selector}\`
`).join('\n') || 'No products found'}

---

## 🔑 Authentication Elements

### Login Buttons
${results.loginFlow.loginButtons?.map(btn => `- ${btn.tag}: "${btn.text}" → ${btn.href || 'No href'}`).join('\n') || 'None found'}

### Kakao Login
${results.loginFlow.kakaoButtons?.map(btn => `- ${btn.tag}: "${btn.text}"`).join('\n') || 'None found'}

### Profile Links
${results.loginFlow.profileLinks?.map(link => `- ${link.tag}: "${link.text}" → ${link.href || 'No href'}`).join('\n') || 'None found'}

---

## 📄 Product Page Structure

${results.productPages.length > 0 ? results.productPages.map((page, i) => `
### Product ${i + 1}

- **URL**: ${page.url}
- **Title**: ${page.title}
- **Requires Login**: ${page.requiresLogin ? '✅ Yes' : '❌ No'}
- **Has Booking Button**: ${page.hasBookingButton ? '✅ Yes' : '❌ No'}
- **Has Price**: ${page.hasPriceDisplay ? '✅ Yes' : '❌ No'}
- **Has Reviews**: ${page.hasReviews ? '✅ Yes' : '❌ No'}

**Buttons Found**:
${page.elements.buttons.map(b => `- ${b}`).join('\n')}

**Headings**:
${page.elements.headings.map(h => `- ${h}`).join('\n')}
`).join('\n---\n') : 'No product pages analyzed'}

---

## 📂 Category Pages

${results.categoryPages.map((cat, i) => `${i + 1}. **${cat.text}** → ${cat.href || 'No link'}`).join('\n') || 'No categories found'}

---

## 💡 Observations & Recommendations

${results.observations.map((obs, i) => `
### ${i + 1}. ${obs.area}

**Finding**: ${obs.finding}

**Recommendation**: ${obs.recommendation}
`).join('\n')}

---

## 🎯 Phase 6 Implementation Plan

Based on this analysis, the following tasks should be implemented:

### 6.1 Authentication System
- [ ] Set up Kakao OAuth 2.0
- [ ] Create login/logout flow
- [ ] Implement session management
- [ ] Add protected route middleware

### 6.2 Product Detail Pages
- [ ] Create \`app/products/[id]/page.tsx\`
- [ ] Implement product detail layout
- [ ] Add booking/purchase buttons
- [ ] Fetch product data (static or API)

### 6.3 User Profile
- [ ] Create \`app/profile/page.tsx\`
- [ ] User information display
- [ ] Purchase history
- [ ] Settings page

### 6.4 Booking Flow
- [ ] Booking form component
- [ ] Payment integration (if needed)
- [ ] Confirmation page

---

**Generated**: ${new Date().toISOString()}
`;
}

// Run the analysis
analyzePostLoginPages().then(() => {
  console.log('\n🎉 Analysis script completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Analysis script failed:', error);
  process.exit(1);
});
