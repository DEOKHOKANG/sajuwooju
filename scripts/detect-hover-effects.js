const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Detecting Hover Effects on Original Site\n');
  console.log('='.repeat(80));

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 }
  });

  await page.goto('https://sajutight.me', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  // Detect elements with hover effects
  const hoverElements = await page.evaluate(() => {
    const elements = [];

    // Categories
    const categoryItems = document.querySelectorAll('.grid > div');
    categoryItems.forEach((item, i) => {
      const before = window.getComputedStyle(item);
      elements.push({
        type: 'category-item',
        index: i,
        selector: `.grid > div:nth-child(${i + 1})`,
        beforeHover: {
          transform: before.transform,
          opacity: before.opacity,
          backgroundColor: before.backgroundColor,
          transition: before.transition
        }
      });
    });

    // Links
    const links = document.querySelectorAll('a');
    links.forEach((link, i) => {
      if (link.href && !link.href.includes('#')) {
        const before = window.getComputedStyle(link);
        elements.push({
          type: 'link',
          index: i,
          href: link.href,
          beforeHover: {
            opacity: before.opacity,
            color: before.color,
            textDecoration: before.textDecoration,
            transition: before.transition
          }
        });
      }
    });

    // Buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, i) => {
      const before = window.getComputedStyle(button);
      elements.push({
        type: 'button',
        index: i,
        ariaLabel: button.getAttribute('aria-label'),
        beforeHover: {
          transform: before.transform,
          opacity: before.opacity,
          backgroundColor: before.backgroundColor,
          boxShadow: before.boxShadow,
          transition: before.transition
        }
      });
    });

    return elements;
  });

  console.log(`\n📋 Found ${hoverElements.length} potentially interactive elements\n`);

  // Now hover over each and detect changes
  const hoverEffects = [];

  for (const el of hoverElements.slice(0, 20)) { // Test first 20
    try {
      const selector = el.selector ||
        (el.type === 'link' ? `a[href="${el.href}"]` : null) ||
        (el.type === 'button' ? `button[aria-label="${el.ariaLabel}"]` : null);

      if (!selector) continue;

      const element = await page.$(selector);
      if (!element) continue;

      await element.hover();
      await page.waitForTimeout(500); // Wait for transition

      const afterHover = await page.evaluate((sel) => {
        const elem = document.querySelector(sel);
        if (!elem) return null;
        const styles = window.getComputedStyle(elem);
        return {
          transform: styles.transform,
          opacity: styles.opacity,
          backgroundColor: styles.backgroundColor,
          boxShadow: styles.boxShadow,
          color: styles.color,
          textDecoration: styles.textDecoration
        };
      }, selector);

      if (afterHover) {
        // Check for changes
        const changes = {};
        Object.keys(afterHover).forEach(key => {
          if (el.beforeHover[key] && el.beforeHover[key] !== afterHover[key]) {
            changes[key] = {
              before: el.beforeHover[key],
              after: afterHover[key]
            };
          }
        });

        if (Object.keys(changes).length > 0) {
          hoverEffects.push({
            type: el.type,
            selector: selector,
            changes: changes,
            transition: el.beforeHover.transition
          });

          console.log(`✓ ${el.type} has hover effect:`);
          console.log(`  Selector: ${selector}`);
          console.log(`  Changes:`, JSON.stringify(changes, null, 2));
          console.log('');
        }
      }

      // Move mouse away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);

    } catch (err) {
      // Skip elements that can't be hovered
    }
  }

  console.log('='.repeat(80));
  console.log(`\n✅ Detected ${hoverEffects.length} elements with hover effects\n`);

  if (hoverEffects.length > 0) {
    console.log('💡 Recommended CSS:\n');
    hoverEffects.forEach(effect => {
      console.log(`/* ${effect.type} */`);
      console.log(`${effect.selector} {`);
      console.log(`  transition: ${effect.transition};`);
      console.log(`}`);
      console.log(`${effect.selector}:hover {`);
      Object.keys(effect.changes).forEach(prop => {
        const kebab = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        console.log(`  ${kebab}: ${effect.changes[prop].after};`);
      });
      console.log(`}\n`);
    });
  }

  await browser.close();
})();
