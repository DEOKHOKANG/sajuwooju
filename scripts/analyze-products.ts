import * as fs from 'fs';
import * as path from 'path';

interface OriginalProduct {
  title: string;
  subtitle: string;
  rating?: string;
  views?: string;
  discount?: string;
  category?: string;
}

interface CurrentProduct {
  id: number;
  title: string;
  subtitle: string;
  rating: number;
  views: string;
  discount: number;
  image: string;
  categoryIds: number[];
}

const CATEGORIES = {
  1: '이벤트!',
  2: '궁합',
  3: '솔로/연애운',
  4: '이별/재회',
  5: '달콤운',
  6: '업신/사대운',
  7: '신년운세',
  8: '월별운세',
  9: '취업/직장운',
  10: '관성/타운',
  11: '결혼운',
  12: '임신/자녀운',
  13: '관상/타로',
  14: '재물운'
};

// Current products from lib/products-data.ts
const CURRENT_PRODUCTS: CurrentProduct[] = [
  { id: 1, title: '내 속마음 얼마나 알까?', subtitle: '솔로탈출 사주 😊', rating: 4.9, views: '5만+', discount: 54, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png', categoryIds: [1, 3] },
  { id: 2, title: '이별 후 재회 가능성', subtitle: '재회 사주 💔', rating: 4.8, views: '3만+', discount: 45, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png', categoryIds: [1, 4] },
  { id: 3, title: '우리 궁합 어때?', subtitle: '궁합 사주 💕', rating: 4.9, views: '6만+', discount: 60, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png', categoryIds: [1, 2] },
  { id: 4, title: '2025 신년운세', subtitle: '신년 사주 🍀', rating: 4.7, views: '4만+', discount: 40, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png', categoryIds: [1, 7] },
  { id: 5, title: '하반기 종합운', subtitle: '하반기 사주 🌟', rating: 4.8, views: '3만+', discount: 50, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png', categoryIds: [1, 8] },
  { id: 6, title: '취업운 보기', subtitle: '커리어 사주 💼', rating: 4.6, views: '2만+', discount: 35, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png', categoryIds: [9, 6] },
  { id: 7, title: '월별 운세 확인', subtitle: '월간 사주 📅', rating: 4.7, views: '2만+', discount: 29, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1755096595963x896724663128204200/%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE.png', categoryIds: [8] },
  { id: 8, title: '연애운 상승법', subtitle: '달콤운 사주 💗', rating: 4.8, views: '4만+', discount: 48, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png', categoryIds: [5, 3] },
  { id: 9, title: '썸 타는 사람과의 궁합', subtitle: '썸사주 궁합 😍', rating: 4.9, views: '5만+', discount: 55, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png', categoryIds: [2, 3] },
  { id: 10, title: '이별 극복하기', subtitle: '재회 사주 🌈', rating: 4.7, views: '3만+', discount: 42, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png', categoryIds: [4] },
  { id: 11, title: '사업운 점검', subtitle: '사업 사주 💰', rating: 4.6, views: '1만+', discount: 38, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png', categoryIds: [6, 9] },
  { id: 12, title: '인생 전환점 찾기', subtitle: '종합 사주 ✨', rating: 4.8, views: '4만+', discount: 52, image: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png', categoryIds: [10, 7] }
];

// Parse the visible text from original site
function parseOriginalProducts(): OriginalProduct[] {
  const text = `내 숨겨진 연애운은?
솔로탈출 사주 🌸
⭐️ 4.9
👀 조회수 5만+
54% 할인중

재회 vs 환승? 이제 지쳤다면
[재회 환승사주]
60% 할인중

화 기운 3년을 읽어주는
[프리미엄 하반기 종합사주✨]
⭐️ 4.9
👀 조회수 1만+
46% 할인중

그 사람과 나는 얼마나 잘 맞을까?
[커플 궁합사주 🥵]
⭐️ 4.7
👀 조회수 2만+
46% 할인중

그 사람과 재회할 수 있을까..?
[이별 재회 사주]
⭐️ 4.9
👀 조회수 6만+
41% 할인중

이직해서 연봉 2배 올리고 싶다면
봐야할 [커리어사주]
⭐️ 4.6
👀 조회수 1만+
46% 할인중

명쾌한 10년 풀이까지 해주는
[2025년 타이트 종합사주]
⭐️ 4.7
👀 조회수 1만+
29% 할인중

뻔한 조언 대신 진짜 매운맛 사주!
[팩폭 사주]
⭐️ 4.6
👀 조회수 1만+
29% 할인중

소름돋게 잘 맞는 2026 신년운세
[신년운세 총운]
54% 할인중

소름돋는 2026년 재물운세 💵
[10년 재물운 사주]
60% 할인중

2025년 8월 월간운세
50% 할인중

그 사람도 나를 좋아할까?
[썸 궁합사주]
46% 할인중`;

  const products: OriginalProduct[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Check if this is a product title (not a rating/views/discount line)
    if (!line.includes('⭐️') && !line.includes('👀') && !line.includes('%') && line.length > 5) {
      const product: OriginalProduct = {
        title: line,
        subtitle: ''
      };

      // Next line might be subtitle (with brackets or emoji)
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (nextLine.includes('[') || nextLine.includes('🌸') || nextLine.includes('🥵') || nextLine.includes('💵') || nextLine.includes('✨')) {
          product.subtitle = nextLine;
          i++;
        }
      }

      // Look ahead for rating, views, discount
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const checkLine = lines[j];

        if (checkLine.includes('⭐️')) {
          product.rating = checkLine.replace('⭐️', '').trim();
        }
        if (checkLine.includes('👀')) {
          product.views = checkLine.replace('👀 조회수', '').trim();
        }
        if (checkLine.includes('%') && checkLine.includes('할인')) {
          product.discount = checkLine.replace('% 할인중', '').trim();
        }
      }

      products.push(product);
    }

    i++;
  }

  return products;
}

function categorizeProduct(title: string, subtitle: string): number[] {
  const text = (title + ' ' + subtitle).toLowerCase();
  const categories: number[] = [];

  // Mapping logic
  if (text.includes('솔로') || text.includes('연애')) categories.push(3); // 솔로/연애운
  if (text.includes('궁합')) categories.push(2); // 궁합
  if (text.includes('재회') || text.includes('이별') || text.includes('환승')) categories.push(4); // 이별/재회
  if (text.includes('신년') || text.includes('2026') || text.includes('2025')) categories.push(7); // 신년운세
  if (text.includes('하반기') || text.includes('종합')) categories.push(8); // 월별운세 (or could be general)
  if (text.includes('커리어') || text.includes('이직') || text.includes('취업')) categories.push(9); // 취업/직장운
  if (text.includes('월간') || text.includes('8월')) categories.push(8); // 월별운세
  if (text.includes('재물')) categories.push(14); // 재물운
  if (text.includes('팩폭')) categories.push(10); // 관성/타운 (or general)
  if (text.includes('썸')) {
    categories.push(2); // 궁합
    categories.push(3); // 솔로/연애운
  }

  // Add to events if it has high discount
  if (categories.length > 0) {
    categories.unshift(1); // 이벤트!
  }

  // Ensure at least one category
  if (categories.length === 0) {
    categories.push(1); // Default to 이벤트
  }

  return Array.from(new Set(categories)); // Remove duplicates
}

function analyzeProducts() {
  console.log('🔍 ANALYZING ORIGINAL SITE vs CLONE SITE');
  console.log('='.repeat(80));

  const originalProducts = parseOriginalProducts();
  console.log(`\n✅ Found ${originalProducts.length} products on original site`);
  console.log(`✅ Found ${CURRENT_PRODUCTS.length} products in clone site`);

  console.log('\n📦 ORIGINAL SITE PRODUCTS:');
  console.log('='.repeat(80));

  originalProducts.forEach((product, idx) => {
    console.log(`\n${idx + 1}. Title: ${product.title}`);
    console.log(`   Subtitle: ${product.subtitle || 'N/A'}`);
    console.log(`   Rating: ${product.rating || 'N/A'}`);
    console.log(`   Views: ${product.views || 'N/A'}`);
    console.log(`   Discount: ${product.discount || 'N/A'}`);

    // Suggest categories
    const suggestedCategories = categorizeProduct(product.title, product.subtitle);
    console.log(`   Suggested Categories: ${suggestedCategories.map(c => `${c} (${CATEGORIES[c as keyof typeof CATEGORIES]})`).join(', ')}`);
  });

  console.log('\n\n🔄 COMPARISON & MISSING PRODUCTS:');
  console.log('='.repeat(80));

  // Compare products
  const missingProducts: OriginalProduct[] = [];

  originalProducts.forEach(originalProduct => {
    const found = CURRENT_PRODUCTS.some(currentProduct => {
      const titleMatch = currentProduct.title.includes(originalProduct.title) ||
                        originalProduct.title.includes(currentProduct.title) ||
                        currentProduct.subtitle.includes(originalProduct.subtitle) ||
                        originalProduct.subtitle.includes(currentProduct.subtitle);
      return titleMatch;
    });

    if (!found) {
      missingProducts.push(originalProduct);
    }
  });

  if (missingProducts.length === 0) {
    console.log('\n✅ ALL PRODUCTS FROM ORIGINAL SITE ARE PRESENT IN CLONE!');
  } else {
    console.log(`\n❌ MISSING ${missingProducts.length} PRODUCTS:`);

    missingProducts.forEach((product, idx) => {
      console.log(`\n${idx + 1}. ${product.title}`);
      console.log(`   Subtitle: ${product.subtitle}`);
      console.log(`   Rating: ${product.rating || 'N/A'}`);
      console.log(`   Views: ${product.views || 'N/A'}`);
      console.log(`   Discount: ${product.discount || 'N/A'}`);

      const suggestedCategories = categorizeProduct(product.title, product.subtitle);
      console.log(`   Suggested Categories: ${suggestedCategories.map(c => `${c} (${CATEGORIES[c as keyof typeof CATEGORIES]})`).join(', ')}`);
    });
  }

  // Generate new products data
  console.log('\n\n📝 GENERATING NEW PRODUCTS DATA:');
  console.log('='.repeat(80));

  const newProducts: any[] = [...CURRENT_PRODUCTS];
  let nextId = Math.max(...CURRENT_PRODUCTS.map(p => p.id)) + 1;

  missingProducts.forEach(product => {
    const rating = product.rating ? parseFloat(product.rating) : 4.7;
    const views = product.views || '1만+';
    const discount = product.discount ? parseInt(product.discount) : 40;
    const categoryIds = categorizeProduct(product.title, product.subtitle);

    // Find appropriate image
    let image = 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png';
    if (product.title.includes('궁합') || product.subtitle.includes('궁합')) {
      image = 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png';
    } else if (product.title.includes('재회') || product.subtitle.includes('재회') || product.title.includes('이별')) {
      image = 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png';
    } else if (product.title.includes('커리어') || product.title.includes('이직')) {
      image = 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png';
    } else if (product.title.includes('신년')) {
      image = 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1755096595963x896724663128204200/%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE.png';
    } else if (product.title.includes('솔로') || product.subtitle.includes('솔로')) {
      image = 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png';
    }

    const newProduct = {
      id: nextId++,
      title: product.title,
      subtitle: product.subtitle,
      rating,
      views,
      discount,
      image,
      categoryIds
    };

    newProducts.push(newProduct);
  });

  // Save to file
  const outputDir = path.join(process.cwd(), 'scripts', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'updated-products-data.ts');

  const tsContent = `import type { Product } from '@/components/product-card';

export interface ProductWithCategory extends Product {
  categoryIds: number[]; // Multiple categories per product
}

export const FEATURED_PRODUCTS: ProductWithCategory[] = ${JSON.stringify(newProducts, null, 2)};
`;

  fs.writeFileSync(outputFile, tsContent);

  console.log(`\n✅ Generated ${newProducts.length} total products`);
  console.log(`📁 Saved to: ${outputFile}`);

  console.log('\n\n📊 FINAL SUMMARY:');
  console.log('='.repeat(80));
  console.log(`Original site products: ${originalProducts.length}`);
  console.log(`Current clone products: ${CURRENT_PRODUCTS.length}`);
  console.log(`Missing products: ${missingProducts.length}`);
  console.log(`Total after update: ${newProducts.length}`);
  console.log('\n✅ Analysis complete!');
}

// Run analysis
analyzeProducts();
