const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function extractImages() {
  console.log('🖼️  Image Extraction Tool');
  console.log('=' .repeat(80));
  console.log('Extracting all images from sajuwooju.me\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });

  const page = await context.newPage();

  console.log('📊 Loading sajuwooju.me...\n');
  await page.goto('https://sajuwooju.me', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForTimeout(3000);

  // 모든 이미지 URL 추출
  const images = await page.evaluate(() => {
    const imageData = [];

    // <img> 태그
    document.querySelectorAll('img').forEach((img, index) => {
      if (img.src && !img.src.startsWith('data:')) {
        imageData.push({
          type: 'img',
          src: img.src,
          alt: img.alt || '',
          width: img.naturalWidth,
          height: img.naturalHeight,
          index,
          className: img.className,
          id: img.id
        });
      }
    });

    // Background images
    document.querySelectorAll('*').forEach((el) => {
      const styles = window.getComputedStyle(el);
      if (styles.backgroundImage && styles.backgroundImage !== 'none') {
        const match = styles.backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
        if (match && match[1] && !match[1].startsWith('data:')) {
          imageData.push({
            type: 'background',
            src: match[1],
            element: el.tagName.toLowerCase(),
            className: el.className,
            id: el.id
          });
        }
      }
    });

    return imageData;
  });

  console.log(`✅ Found ${images.length} images\n`);

  // 이미지 저장 디렉토리 생성
  const imageDir = path.join(__dirname, '../public/images/original');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // 이미지 메타데이터 저장
  const metadata = [];

  console.log('📥 Downloading images...\n');

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    try {
      const url = new URL(img.src);
      const ext = path.extname(url.pathname) || '.jpg';
      const filename = `${img.type}_${i}${ext}`;
      const filepath = path.join(imageDir, filename);

      console.log(`[${i + 1}/${images.length}] ${filename}`);
      console.log(`  URL: ${img.src.substring(0, 80)}...`);

      await downloadImage(img.src, filepath);

      metadata.push({
        ...img,
        localPath: `/images/original/${filename}`,
        downloaded: true
      });

      console.log(`  ✅ Saved\n`);
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
      metadata.push({
        ...img,
        downloaded: false,
        error: error.message
      });
    }
  }

  // 메타데이터 저장
  fs.writeFileSync(
    path.join(__dirname, '../analysis/ultra-precise/images-metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80) + '\n');

  const downloaded = metadata.filter(m => m.downloaded).length;
  const failed = metadata.filter(m => !m.downloaded).length;

  console.log(`Total images: ${images.length}`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}\n`);

  console.log(`📁 Images saved to: public/images/original/`);
  console.log(`📁 Metadata saved to: analysis/ultra-precise/images-metadata.json\n`);

  await browser.close();

  return metadata;
}

extractImages().catch(console.error);
