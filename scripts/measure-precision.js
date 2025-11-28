const fs = require('fs');
const path = require('path');

// 분석 데이터 로드
const analysisPath = path.join(__dirname, '../analysis/comprehensive-analysis.json');
const data = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

console.log('📐 PRECISION MEASUREMENT REPORT\n');
console.log('='.repeat(60));

// 1. 헤더 측정
console.log('\n🎯 HEADER MEASUREMENTS');
console.log('-'.repeat(60));

const findElementByText = (tree, text) => {
  if (tree.text && tree.text.includes(text)) return tree;
  for (const child of tree.children || []) {
    const found = findElementByText(child, text);
    if (found) return found;
  }
  return null;
};

// "사주우주" 로고 찾기
const logo = findElementByText(data.domTree, '사주우주');
if (logo) {
  console.log('Logo:');
  console.log(`  Text: "${logo.text}"`);
  console.log(`  Position: x=${logo.boundingBox.x}px, y=${logo.boundingBox.y}px`);
  console.log(`  Size: ${logo.boundingBox.width}px × ${logo.boundingBox.height}px`);
  console.log(`  Font: ${logo.styles.fontFamily}`);
  console.log(`  Font Size: ${logo.styles.fontSize}`);
  console.log(`  Font Weight: ${logo.styles.fontWeight}`);
  console.log(`  Color: ${logo.styles.color}`);
}

// 2. 제목 정밀 측정
console.log('\n📝 HEADING MEASUREMENTS');
console.log('-'.repeat(60));
data.headings.forEach((h, i) => {
  console.log(`\n${h.level} #${i + 1}: "${h.text}"`);
  console.log(`  Font Family: ${h.styles.fontFamily}`);
  console.log(`  Font Size: ${h.styles.fontSize}`);
  console.log(`  Font Weight: ${h.styles.fontWeight}`);
  console.log(`  Color: ${h.styles.color}`);
});

// 3. 버튼 정밀 측정
console.log('\n🔘 BUTTON MEASUREMENTS');
console.log('-'.repeat(60));
data.interactiveElements.buttons.forEach((btn, i) => {
  console.log(`\nButton #${i + 1}:`);
  console.log(`  Text: "${btn.text || '(empty)'}"`);
  console.log(`  Background: ${btn.styles.backgroundColor}`);
  console.log(`  Color: ${btn.styles.color}`);
  console.log(`  Padding: ${btn.styles.padding}`);
  console.log(`  Border: ${btn.styles.border}`);
  console.log(`  Border Radius: ${btn.styles.borderRadius}`);
  console.log(`  Font Size: ${btn.styles.fontSize}`);
  console.log(`  Font Weight: ${btn.styles.fontWeight}`);
  console.log(`  Cursor: ${btn.styles.cursor}`);
});

// 4. Input 정밀 측정
console.log('\n📝 INPUT FIELD MEASUREMENTS');
console.log('-'.repeat(60));
data.interactiveElements.inputs.forEach((input, i) => {
  console.log(`\nInput #${i + 1}:`);
  console.log(`  Type: ${input.type}`);
  console.log(`  Placeholder: "${input.placeholder || 'N/A'}"`);
  console.log(`  Background: ${input.styles.backgroundColor}`);
  console.log(`  Color: ${input.styles.color}`);
  console.log(`  Border: ${input.styles.border}`);
  console.log(`  Border Radius: ${input.styles.borderRadius}`);
  console.log(`  Padding: ${input.styles.padding}`);
  console.log(`  Font Size: ${input.styles.fontSize}`);
  console.log(`  Height: ${input.styles.height}`);
});

// 5. 이미지 크기 분석
console.log('\n🖼️  IMAGE SIZE ANALYSIS');
console.log('-'.repeat(60));

const imageSizes = new Map();
data.images.forEach(img => {
  const key = `${img.width}x${img.height}`;
  imageSizes.set(key, (imageSizes.get(key) || 0) + 1);
});

console.log('\nImage Size Distribution:');
Array.from(imageSizes.entries())
  .sort((a, b) => b[1] - a[1])
  .forEach(([size, count]) => {
    console.log(`  ${size}: ${count}개`);
  });

// 6. 색상 팔레트 정밀 분석
console.log('\n🎨 COLOR PALETTE (RGB VALUES)');
console.log('-'.repeat(60));

const rgbToHex = (rgb) => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb;
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

const uniqueColors = [...new Set(data.colors.filter(c => c.startsWith('rgb(') && !c.includes('rgba')))];
console.log('\nSolid Colors:');
uniqueColors.slice(0, 20).forEach(color => {
  console.log(`  ${color.padEnd(25)} = ${rgbToHex(color)}`);
});

// 7. 간격 패턴 분석
console.log('\n📏 SPACING PATTERNS');
console.log('-'.repeat(60));

const extractSpacing = (tree, spacings = new Set()) => {
  if (tree.styles) {
    if (tree.styles.padding && tree.styles.padding !== '0px') {
      spacings.add(tree.styles.padding);
    }
    if (tree.styles.margin && tree.styles.margin !== '0px') {
      spacings.add(tree.styles.margin);
    }
    if (tree.styles.gap && tree.styles.gap !== 'normal') {
      spacings.add(tree.styles.gap);
    }
  }
  (tree.children || []).forEach(child => extractSpacing(child, spacings));
  return spacings;
};

const spacings = Array.from(extractSpacing(data.domTree))
  .filter(s => !s.includes('auto'))
  .slice(0, 15);

console.log('\nCommon Spacing Values:');
spacings.forEach(s => console.log(`  ${s}`));

// 8. Border Radius 패턴
console.log('\n⭕ BORDER RADIUS PATTERNS');
console.log('-'.repeat(60));

const extractBorderRadius = (tree, radiuses = new Set()) => {
  if (tree.styles && tree.styles.borderRadius && tree.styles.borderRadius !== '0px') {
    radiuses.add(tree.styles.borderRadius);
  }
  (tree.children || []).forEach(child => extractBorderRadius(child, radiuses));
  return radiuses;
};

const radiuses = Array.from(extractBorderRadius(data.domTree)).slice(0, 10);
console.log('\nCommon Border Radius Values:');
radiuses.forEach(r => console.log(`  ${r}`));

// 9. 레이아웃 구조
console.log('\n📐 LAYOUT STRUCTURE');
console.log('-'.repeat(60));
console.log(`Body Width: ${data.domTree.boundingBox.width}px`);
console.log(`Body Height: ${data.domTree.boundingBox.height}px`);
console.log(`Display: ${data.domTree.styles.display}`);
console.log(`Flex Direction: ${data.domTree.styles.flexDirection}`);
console.log(`Justify Content: ${data.domTree.styles.justifyContent}`);
console.log(`Align Items: ${data.domTree.styles.alignItems}`);

console.log('\n' + '='.repeat(60));
console.log('✅ Precision measurement complete!');
console.log('\n📌 Use these exact values for pixel-perfect replication.');
