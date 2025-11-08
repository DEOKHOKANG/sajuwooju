/**
 * NASA/Solar System Scope Texture Downloader
 *
 * 행성 텍스처를 Solar System Scope에서 자동 다운로드합니다.
 *
 * 사용법:
 * node scripts/download-textures.js
 *
 * 출력:
 * public/textures/*.jpg (2K resolution)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Solar System Scope 무료 텍스처 URL (2K resolution)
const TEXTURE_SOURCES = {
  sun: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
  mercury: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
  venus: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
  earth: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
  earthNight: 'https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg',
  earthClouds: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
  mars: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
  jupiter: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
  saturn: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
  saturnRing: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png',
  uranus: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
  neptune: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
};

/**
 * 단일 텍스처 다운로드
 * @param {string} url - 다운로드 URL
 * @param {string} filename - 저장할 파일명
 * @returns {Promise<void>}
 */
async function downloadTexture(url, filename) {
  const outputPath = path.join(__dirname, '../public/textures', filename);

  // Create directory if not exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }

  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`⏭️  Skipped (already exists): ${filename} (${fileSizeMB} MB)`);
    return;
  }

  return new Promise((resolve, reject) => {
    console.log(`⬇️  Downloading: ${filename}...`);

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        console.log(`   Redirecting to: ${redirectUrl}`);
        https.get(redirectUrl, (redirectResponse) => {
          if (redirectResponse.statusCode === 200) {
            downloadFile(redirectResponse, outputPath, filename, resolve, reject);
          } else {
            reject(`Failed to download ${filename}: ${redirectResponse.statusCode}`);
          }
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        downloadFile(response, outputPath, filename, resolve, reject);
      } else {
        reject(`Failed to download ${filename}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(`Network error for ${filename}: ${err.message}`);
    });
  });
}

/**
 * 파일 스트림 다운로드 헬퍼
 */
function downloadFile(response, outputPath, filename, resolve, reject) {
  const file = fs.createWriteStream(outputPath);
  let downloadedBytes = 0;
  const totalBytes = parseInt(response.headers['content-length'] || '0', 10);

  response.on('data', (chunk) => {
    downloadedBytes += chunk.length;
    if (totalBytes > 0) {
      const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
      process.stdout.write(`   Progress: ${percent}%\r`);
    }
  });

  response.pipe(file);

  file.on('finish', () => {
    file.close();
    const fileSizeMB = (downloadedBytes / (1024 * 1024)).toFixed(2);
    console.log(`✅ Downloaded: ${filename} (${fileSizeMB} MB)          `);
    resolve();
  });

  file.on('error', (err) => {
    fs.unlink(outputPath, () => {}); // Delete partial file
    reject(`File write error for ${filename}: ${err.message}`);
  });
}

/**
 * 모든 텍스처 다운로드
 */
async function downloadAllTextures() {
  console.log('\n🌌 NASA/Solar System Scope Texture Downloader');
  console.log('='.repeat(50));
  console.log(`📦 Downloading ${Object.keys(TEXTURE_SOURCES).length} textures...\n`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const [name, url] of Object.entries(TEXTURE_SOURCES)) {
    try {
      const ext = url.endsWith('.png') ? 'png' : 'jpg';
      const wasSkipped = fs.existsSync(path.join(__dirname, '../public/textures', `${name}.${ext}`));

      await downloadTexture(url, `${name}.${ext}`);

      if (wasSkipped) {
        skipCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error downloading ${name}:`, error);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Download Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount} (already exists)`);
  console.log(`   ❌ Failed: ${failCount}`);

  if (failCount === 0) {
    console.log('\n🎉 All textures are ready!');
    console.log(`📁 Location: public/textures/\n`);
  } else {
    console.log('\n⚠️  Some textures failed to download. Please check errors above.\n');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  downloadAllTextures().catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { downloadAllTextures };
