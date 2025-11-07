const fs = require('fs');
const path = require('path');

/**
 * 빠른 이미지 매핑 - 원본 사이트 이미지 URL 직접 사용
 * 다운로드 없이 즉시 적용 가능
 */

const originalData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../analysis/ultra-precise/original-detailed.json'), 'utf8')
);

console.log('🖼️  Quick Image Mapper');
console.log('='.repeat(80));
console.log('Mapping images by size and position\n');

// 이미지를 크기별로 분류
const imagesBySize = {
  hero: [],      // 큰 카드형 이미지 (200-350px)
  category: [],  // 중간 아이콘 (40-100px)
  thumbnail: [], // 작은 썸네일 (80-150px)
  profile: [],   // 프로필 이미지 (원형, 40-80px)
  other: []
};

originalData.images.forEach(img => {
  const width = img.width || img.naturalWidth || 0;
  const height = img.height || img.naturalHeight || 0;

  if (width >= 200 && width <= 350 && height >= 200) {
    imagesBySize.hero.push(img);
  } else if (width >= 40 && width <= 100 && height >= 40 && height <= 100) {
    imagesBySize.category.push(img);
  } else if (width >= 80 && width <= 150 && height >= 80 && height <= 150) {
    imagesBySize.thumbnail.push(img);
  } else if (width >= 40 && width <= 80 && height >= 40 && height <= 80) {
    imagesBySize.profile.push(img);
  } else {
    imagesBySize.other.push(img);
  }
});

console.log('📊 Image Classification:\n');
console.log(`Hero Cards (200-350px): ${imagesBySize.hero.length}`);
imagesBySize.hero.slice(0, 3).forEach((img, i) => {
  console.log(`  ${i + 1}. ${img.width}x${img.height} - ${img.src.substring(0, 80)}`);
});

console.log(`\nCategory Icons (40-100px): ${imagesBySize.category.length}`);
imagesBySize.category.slice(0, 10).forEach((img, i) => {
  console.log(`  ${i + 1}. ${img.width}x${img.height} - ${img.src.substring(0, 80)}`);
});

console.log(`\nThumbnails (80-150px): ${imagesBySize.thumbnail.length}`);
imagesBySize.thumbnail.slice(0, 5).forEach((img, i) => {
  console.log(`  ${i + 1}. ${img.width}x${img.height} - ${img.src.substring(0, 80)}`);
});

console.log(`\nProfile Images (40-80px): ${imagesBySize.profile.length}`);
console.log(`Other: ${imagesBySize.other.length}\n`);

// 실제 사용할 이미지 URL 추출
const mappedImages = {
  hero: imagesBySize.hero.slice(0, 2).map(img => ({
    src: img.src,
    alt: img.alt || 'Hero image',
    width: img.width,
    height: img.height
  })),
  categories: imagesBySize.category.slice(0, 10).map((img, i) => ({
    src: img.src,
    alt: img.alt || `Category ${i + 1}`,
    width: img.width,
    height: img.height
  })),
  eventProfile: imagesBySize.profile[0] || null,
  rankingThumbnail: imagesBySize.thumbnail[0] || null
};

// 컴포넌트 업데이트용 데이터 생성
const componentData = {
  hero: mappedImages.hero,
  categories: [
    { id: 1, label: '이벤트', icon: '🎫', image: mappedImages.categories[0]?.src },
    { id: 2, label: '궁합', icon: '💖', image: mappedImages.categories[1]?.src },
    { id: 3, label: '솔로/연애운', icon: '🤡', image: mappedImages.categories[2]?.src },
    { id: 4, label: '이별/재회', icon: '💝', image: mappedImages.categories[3]?.src },
    { id: 5, label: '달콤운', icon: '💗', image: mappedImages.categories[4]?.src },
    { id: 6, label: '업신/사대운', icon: '🔔', image: mappedImages.categories[5]?.src },
    { id: 7, label: '신년운세', icon: '🍀', image: mappedImages.categories[6]?.src },
    { id: 8, label: '월별운세', icon: '📅', image: mappedImages.categories[7]?.src },
    { id: 9, label: '취업/직장운', icon: '💼', image: mappedImages.categories[8]?.src },
    { id: 10, label: '관성/타운', icon: '🎨', image: mappedImages.categories[9]?.src }
  ]
};

// TypeScript 타입으로 저장
const outputCode = `// Auto-generated image mapping from original site
export const IMAGE_MAP = ${JSON.stringify(componentData, null, 2)} as const;

export type HeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CategoryData = {
  id: number;
  label: string;
  icon: string;
  image?: string;
};
`;

fs.writeFileSync(
  path.join(__dirname, '../lib/image-map.ts'),
  outputCode
);

console.log('='.repeat(80));
console.log('✅ Generated: lib/image-map.ts\n');

console.log('📝 Next Steps:');
console.log('  1. Import IMAGE_MAP in components');
console.log('  2. Replace placeholder images with real URLs');
console.log('  3. Verify all images load correctly\n');

// 요약 저장
fs.writeFileSync(
  path.join(__dirname, '../analysis/ultra-precise/image-mapping.json'),
  JSON.stringify({
    timestamp: new Date().toISOString(),
    classification: {
      hero: imagesBySize.hero.length,
      category: imagesBySize.category.length,
      thumbnail: imagesBySize.thumbnail.length,
      profile: imagesBySize.profile.length,
      other: imagesBySize.other.length
    },
    mapped: componentData,
    coverage: {
      hero: `${mappedImages.hero.length}/2`,
      categories: `${mappedImages.categories.length}/10`
    }
  }, null, 2)
);

console.log('📁 Saved mapping data to: analysis/ultra-precise/image-mapping.json\n');
