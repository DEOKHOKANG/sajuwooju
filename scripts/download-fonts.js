const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_TO_DOWNLOAD = [
  {
    name: 'Pretendard Variable',
    url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css',
    woff2: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/woff2/PretendardVariable.subset.woff2',
    localName: 'PretendardVariable.woff2'
  },
  {
    name: 'OnGlyph Saehayan',
    // Note: This font might need to be sourced differently
    // Checking if it's available from the original site
    url: null,
    localName: 'OnGlyphSaehayan.woff2'
  }
];

async function downloadFont(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFont(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadFonts() {
  console.log('📝 Font Download Tool');
  console.log('='.repeat(80));
  console.log('Downloading required fonts\n');

  const fontDir = path.join(__dirname, '../public/fonts');
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
  }

  const results = [];

  for (const font of FONTS_TO_DOWNLOAD) {
    if (!font.woff2) {
      console.log(`⚠️  ${font.name}: No download URL available\n`);
      results.push({ name: font.name, status: 'skipped' });
      continue;
    }

    try {
      console.log(`📥 Downloading ${font.name}...`);
      console.log(`   URL: ${font.woff2}`);

      const filepath = path.join(fontDir, font.localName);
      await downloadFont(font.woff2, filepath);

      console.log(`   ✅ Saved to: public/fonts/${font.localName}\n`);
      results.push({ name: font.name, status: 'success', path: `/fonts/${font.localName}` });
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
      results.push({ name: font.name, status: 'failed', error: error.message });
    }
  }

  // CSS 생성
  console.log('📝 Generating font CSS...\n');

  const cssContent = `/* Pretendard Variable Font */
@font-face {
  font-family: 'Pretendard Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 45 920;
  src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
}

/* OnGlyph Saehayan Font */
/* Note: This font needs to be sourced from the original site or purchased */
@font-face {
  font-family: 'OnGlyph Saehayan Font';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url('/fonts/OnGlyphSaehayan.woff2') format('woff2');
}
`;

  fs.writeFileSync(path.join(fontDir, 'fonts.css'), cssContent);
  console.log('✅ Font CSS saved to: public/fonts/fonts.css\n');

  // 결과 요약
  console.log('='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80) + '\n');

  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${result.name}: ${result.status}`);
  });

  console.log('\n💡 Next steps:');
  console.log('   1. Update app/layout.tsx to use local fonts');
  console.log('   2. Import /fonts/fonts.css in globals.css');
  console.log('   3. Update Tailwind config font-family\n');

  return results;
}

downloadFonts().catch(console.error);
