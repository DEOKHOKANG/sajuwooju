/**
 * Text Rebranding Script
 * sajuwooju → sajuwooju 전체 교체
 *
 * Usage: node scripts/rebrand-text.js
 */

const fs = require('fs');
const path = require('path');

// 교체 매핑
const REPLACEMENTS = {
  // 브랜드 이름
  '사주우주': '사주우주',
  '사주우주': '사주우주',
  '사주우주': '사주우주',
  '사주우주': '사주우주',

  // 영문 (대소문자 구분)
  'sajuwooju': 'sajuwooju',
  'SajuWooju': 'SajuWooju',
  'SAJUWOOJU': 'SAJUWOOJU',
  'Sajuwooju': 'Sajuwooju',

  // 도메인
  'sajuwooju.me': 'sajuwooju.com',
  'sajuwooju-v2': 'sajuwooju-v2',

  // 슬로건 변경
  '우주의 법칙으로 읽는 나의 운명': '우주의 법칙으로 읽는 나의 운명',
  '우주의 법칙으로 읽는': '우주의 법칙으로 읽는',
};

// 제외할 디렉토리
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'out',
  'build',
  'dist',
];

// 처리할 파일 확장자
const INCLUDE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.css',
  '.html',
];

let filesProcessed = 0;
let replacementsCount = 0;

/**
 * 파일 내용 교체
 */
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileReplacements = 0;

    // 모든 교체 적용
    for (const [old, newText] of Object.entries(REPLACEMENTS)) {
      const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (content.match(regex) || []).length;

      if (matches > 0) {
        content = content.replace(regex, newText);
        fileReplacements += matches;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${filePath} (${fileReplacements} replacements)`);
      replacementsCount += fileReplacements;
    }

    filesProcessed++;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

/**
 * 디렉토리 재귀 탐색
 */
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 제외 디렉토리 체크
      if (!EXCLUDE_DIRS.includes(item) && !item.startsWith('.')) {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      // 확장자 체크
      const ext = path.extname(fullPath);
      if (INCLUDE_EXTENSIONS.includes(ext)) {
        replaceInFile(fullPath);
      }
    }
  }
}

/**
 * 메인 실행
 */
function main() {
  console.log('🚀 Starting text rebranding...\n');
  console.log('Replacements:');
  for (const [old, newText] of Object.entries(REPLACEMENTS)) {
    console.log(`  "${old}" → "${newText}"`);
  }
  console.log('\n');

  const rootDir = path.join(__dirname, '..');
  processDirectory(rootDir);

  console.log('\n✅ Rebranding complete!');
  console.log(`📊 Files processed: ${filesProcessed}`);
  console.log(`🔄 Total replacements: ${replacementsCount}`);
}

main();
