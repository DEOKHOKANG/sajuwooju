const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../analysis/ultra-precise/original-detailed.json'), 'utf8')
);

console.log('Total images:', data.images.length);
console.log('\nAll images with dimensions:\n');

data.images.forEach((img, i) => {
  console.log(`${i + 1}. ${img.width}x${img.height} - ${img.alt || 'no alt'}`);
  console.log(`   ${img.src.substring(0, 100)}`);
  console.log('');
});
