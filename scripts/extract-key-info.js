const fs = require('fs');
const path = require('path');

const analysisPath = path.join(__dirname, '../analysis/comprehensive-analysis.json');
const data = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

console.log('🔍 Extracting Key Information...\n');

// Headings
console.log('===== HEADINGS =====');
data.headings.forEach(h => {
  console.log(`${h.level}: "${h.text}"`);
  console.log(`  Font: ${h.styles.fontFamily}`);
  console.log(`  Size: ${h.styles.fontSize}`);
  console.log(`  Weight: ${h.styles.fontWeight}`);
  console.log(`  Color: ${h.styles.color}\n`);
});

// Buttons
console.log('\n===== BUTTONS =====');
data.interactiveElements.buttons.forEach((btn, i) => {
  console.log(`Button ${i + 1}: "${btn.text}"`);
  console.log(`  BG Color: ${btn.styles.backgroundColor}`);
  console.log(`  Text Color: ${btn.styles.color}`);
  console.log(`  Padding: ${btn.styles.padding}`);
  console.log(`  Border Radius: ${btn.styles.borderRadius}`);
  console.log(`  Font: ${btn.styles.fontSize} / ${btn.styles.fontWeight}\n`);
});

// Key Colors
console.log('\n===== KEY COLORS =====');
const uniqueColors = [... new Set(data.colors)];
uniqueColors.slice(0, 15).forEach(c => console.log(`  - ${c}`));

//  Fonts
console.log('\n===== FONTS =====');
data.fonts.forEach(f => console.log(`  - ${f}`));

// Inputs
console.log('\n===== INPUT FIELDS =====');
data.interactiveElements.inputs.forEach((input, i) => {
  console.log(`Input ${i + 1}:`);
  console.log(`  Type: ${input.type}`);
  console.log(`  Placeholder: ${input.placeholder || 'N/A'}`);
  console.log(`  BG: ${input.styles.backgroundColor}`);
  console.log(`  Border: ${input.styles.border}`);
  console.log(`  Border Radius: ${input.styles.borderRadius}\n`);
});

// Links Sample
console.log('\n===== LINKS (Sample) =====');
data.interactiveElements.links.slice(0, 10).forEach((link, i) => {
  console.log(`${i + 1}. "${link.text}" -> ${link.href}`);
});

// Images Sample
console.log('\n===== IMAGES (Sample) =====');
data.images.slice(0, 10).forEach((img, i) => {
  console.log(`${i + 1}. ${img.src.substring(0, 80)}...`);
  console.log(`   Alt: ${img.alt || 'N/A'}`);
  console.log(`   Size: ${img.width}x${img.height}\n`);
});

console.log('\n✅ Key information extracted!');
