const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Phase 1: 원본 사이트 인터랙션 완전 분석
 * - Hover states
 * - Scroll behaviors
 * - Animations
 * - Transitions
 * - Touch interactions
 */

(async () => {
  console.log('🔍 Original Site Interaction Analysis\n');
  console.log('='.repeat(80));
  console.log('Analyzing all interactive states and animations\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  const page = await context.newPage();

  try {
    await page.goto('https://sajutight.me', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.waitForTimeout(5000);

    const interactionData = {
      timestamp: new Date().toISOString(),
      animations: [],
      transitions: [],
      hoverStates: [],
      scrollBehaviors: {},
      touchInteractions: []
    };

    console.log('📊 Step 1: Analyzing CSS Animations & Transitions\n');

    // 1. CSS Animations & Transitions 분석
    const animationData = await page.evaluate(() => {
      const results = {
        animations: [],
        transitions: []
      };

      const allElements = document.querySelectorAll('*');

      allElements.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        // Animations
        if (styles.animation && styles.animation !== 'none') {
          results.animations.push({
            index,
            element: el.tagName.toLowerCase(),
            className: el.className,
            animation: styles.animation,
            animationName: styles.animationName,
            animationDuration: styles.animationDuration,
            animationTimingFunction: styles.animationTimingFunction,
            animationDelay: styles.animationDelay,
            animationIterationCount: styles.animationIterationCount,
            position: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height
            }
          });
        }

        // Transitions
        if (styles.transition && styles.transition !== 'all 0s ease 0s') {
          results.transitions.push({
            index,
            element: el.tagName.toLowerCase(),
            className: el.className,
            transition: styles.transition,
            transitionProperty: styles.transitionProperty,
            transitionDuration: styles.transitionDuration,
            transitionTimingFunction: styles.transitionTimingFunction,
            transitionDelay: styles.transitionDelay,
            position: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height
            }
          });
        }
      });

      return results;
    });

    interactionData.animations = animationData.animations;
    interactionData.transitions = animationData.transitions;

    console.log(`Found ${animationData.animations.length} animations`);
    console.log(`Found ${animationData.transitions.length} transitions\n`);

    animationData.animations.slice(0, 5).forEach((anim, i) => {
      console.log(`  Animation ${i + 1}:`);
      console.log(`    Element: ${anim.element}.${anim.className}`);
      console.log(`    Name: ${anim.animationName}`);
      console.log(`    Duration: ${anim.animationDuration}`);
      console.log(`    Timing: ${anim.animationTimingFunction}\n`);
    });

    console.log('='.repeat(80));
    console.log('📊 Step 2: Analyzing Hover States\n');

    // 2. Hover States 분석
    const hoverTargets = [
      'a',
      'button',
      '.category-icon',
      '.hero-card',
      '.event-banner',
      '.ranking-card',
      'img'
    ];

    for (const selector of hoverTargets) {
      const elements = await page.$$(selector);

      for (let i = 0; i < Math.min(elements.length, 3); i++) {
        const element = elements[i];

        try {
          // Before hover
          const beforeStyles = await element.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              transform: styles.transform,
              opacity: styles.opacity,
              backgroundColor: styles.backgroundColor,
              boxShadow: styles.boxShadow,
              scale: styles.scale,
              filter: styles.filter
            };
          });

          // Hover
          await element.hover();
          await page.waitForTimeout(300);

          // After hover
          const afterStyles = await element.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              transform: styles.transform,
              opacity: styles.opacity,
              backgroundColor: styles.backgroundColor,
              boxShadow: styles.boxShadow,
              scale: styles.scale,
              filter: styles.filter
            };
          });

          // Check for changes
          const changes = {};
          Object.keys(beforeStyles).forEach(key => {
            if (beforeStyles[key] !== afterStyles[key]) {
              changes[key] = {
                before: beforeStyles[key],
                after: afterStyles[key]
              };
            }
          });

          if (Object.keys(changes).length > 0) {
            interactionData.hoverStates.push({
              selector,
              index: i,
              changes
            });

            console.log(`  Hover effect on ${selector} [${i}]:`);
            Object.entries(changes).forEach(([prop, vals]) => {
              console.log(`    ${prop}: ${vals.before} → ${vals.after}`);
            });
            console.log('');
          }

          // Reset hover
          await page.mouse.move(0, 0);
          await page.waitForTimeout(100);
        } catch (error) {
          // Element might not be interactable
        }
      }
    }

    console.log('='.repeat(80));
    console.log('📊 Step 3: Analyzing Scroll Behavior\n');

    // 3. Scroll Behavior 분석
    const scrollData = await page.evaluate(() => {
      return {
        scrollBehavior: window.getComputedStyle(document.documentElement).scrollBehavior,
        overflowY: window.getComputedStyle(document.body).overflowY,
        scrollPadding: window.getComputedStyle(document.documentElement).scrollPadding
      };
    });

    interactionData.scrollBehaviors = scrollData;
    console.log('  Scroll behavior:', scrollData.scrollBehavior);
    console.log('  Overflow-Y:', scrollData.overflowY);
    console.log('  Scroll padding:', scrollData.scrollPadding);

    // Hero slider scroll behavior
    const heroSlider = await page.$('section:first-of-type > div');
    if (heroSlider) {
      const heroScrollData = await heroSlider.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          overflowX: styles.overflowX,
          scrollSnapType: styles.scrollSnapType,
          scrollBehavior: styles.scrollBehavior,
          gap: styles.gap
        };
      });

      interactionData.scrollBehaviors.heroSlider = heroScrollData;
      console.log('\n  Hero Slider:');
      console.log('    Overflow-X:', heroScrollData.overflowX);
      console.log('    Scroll Snap:', heroScrollData.scrollSnapType);
      console.log('    Scroll Behavior:', heroScrollData.scrollBehavior);
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 Step 4: Checking for Auto-play/Intervals\n');

    // 4. JavaScript intervals/timeouts 감지 (rough check)
    await page.waitForTimeout(5000);

    const hasAutoplay = await page.evaluate(() => {
      // Hero slider 위치 변경 감지
      const slider = document.querySelector('section:first-of-type > div');
      if (!slider) return false;

      const initialScroll = slider.scrollLeft;
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(slider.scrollLeft !== initialScroll);
        }, 4000);
      });
    });

    interactionData.autoplay = {
      heroSlider: hasAutoplay,
      detected: hasAutoplay
    };

    console.log(`  Hero Slider Auto-play: ${hasAutoplay ? '✅ Detected' : '❌ Not detected'}`);

    console.log('\n' + '='.repeat(80));
    console.log('📊 Step 5: Touch Interaction Analysis\n');

    // 5. Touch/Swipe behaviors
    const touchData = await page.evaluate(() => {
      const slider = document.querySelector('section:first-of-type > div');
      if (!slider) return null;

      return {
        touchAction: window.getComputedStyle(slider).touchAction,
        userSelect: window.getComputedStyle(slider).userSelect,
        webkitOverflowScrolling: window.getComputedStyle(slider).webkitOverflowScrolling
      };
    });

    if (touchData) {
      interactionData.touchInteractions = touchData;
      console.log('  Touch Action:', touchData.touchAction);
      console.log('  User Select:', touchData.userSelect);
      console.log('  -webkit-overflow-scrolling:', touchData.webkitOverflowScrolling);
    }

    // Save results
    const outputPath = path.join(__dirname, '../analysis/ultra-precise/interaction-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(interactionData, null, 2));

    console.log('\n' + '='.repeat(80));
    console.log('✅ Analysis Complete\n');
    console.log(`📁 Saved to: ${outputPath}\n`);

    // Summary
    console.log('📋 Summary:\n');
    console.log(`  Animations: ${interactionData.animations.length}`);
    console.log(`  Transitions: ${interactionData.transitions.length}`);
    console.log(`  Hover Effects: ${interactionData.hoverStates.length}`);
    console.log(`  Auto-play: ${interactionData.autoplay.detected ? 'Yes' : 'No'}`);
    console.log('');

    // Key findings
    console.log('🔑 Key Findings:\n');

    if (interactionData.animations.length > 0) {
      console.log('  ✓ Site uses CSS animations');
      const uniqueAnimations = [...new Set(interactionData.animations.map(a => a.animationName))];
      console.log(`    Animation names: ${uniqueAnimations.join(', ')}`);
    }

    if (interactionData.transitions.length > 0) {
      console.log('  ✓ Site uses CSS transitions');
      const uniqueProps = [...new Set(interactionData.transitions.map(t => t.transitionProperty))];
      console.log(`    Transition properties: ${uniqueProps.slice(0, 5).join(', ')}`);
    }

    if (interactionData.hoverStates.length > 0) {
      console.log('  ✓ Interactive hover states detected');
      interactionData.hoverStates.slice(0, 3).forEach(hover => {
        const props = Object.keys(hover.changes).join(', ');
        console.log(`    ${hover.selector}: ${props}`);
      });
    }

    if (interactionData.autoplay.detected) {
      console.log('  ✓ Auto-play behavior detected on hero slider');
    }

    console.log('\n' + '='.repeat(80));
    console.log('💡 Next Steps:\n');
    console.log('  1. Implement detected animations in clone');
    console.log('  2. Add hover effects');
    console.log('  3. Implement auto-play if detected');
    console.log('  4. Match transition timings\n');

  } catch (error) {
    console.error('Error during analysis:', error);
  } finally {
    await browser.close();
  }
})();
