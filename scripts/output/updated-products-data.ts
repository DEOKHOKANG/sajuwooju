import type { Product } from '@/components/product-card';

export interface ProductWithCategory extends Product {
  categoryIds: number[]; // Multiple categories per product
}

export const FEATURED_PRODUCTS: ProductWithCategory[] = [
  {
    "id": 1,
    "title": "내 속마음 얼마나 알까?",
    "subtitle": "솔로탈출 사주 😊",
    "rating": 4.9,
    "views": "5만+",
    "discount": 54,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png",
    "categoryIds": [
      1,
      3
    ]
  },
  {
    "id": 2,
    "title": "이별 후 재회 가능성",
    "subtitle": "재회 사주 💔",
    "rating": 4.8,
    "views": "3만+",
    "discount": 45,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      4
    ]
  },
  {
    "id": 3,
    "title": "우리 궁합 어때?",
    "subtitle": "궁합 사주 💕",
    "rating": 4.9,
    "views": "6만+",
    "discount": 60,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      2
    ]
  },
  {
    "id": 4,
    "title": "2025 신년운세",
    "subtitle": "신년 사주 🍀",
    "rating": 4.7,
    "views": "4만+",
    "discount": 40,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      7
    ]
  },
  {
    "id": 5,
    "title": "하반기 종합운",
    "subtitle": "하반기 사주 🌟",
    "rating": 4.8,
    "views": "3만+",
    "discount": 50,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png",
    "categoryIds": [
      1,
      8
    ]
  },
  {
    "id": 6,
    "title": "취업운 보기",
    "subtitle": "커리어 사주 💼",
    "rating": 4.6,
    "views": "2만+",
    "discount": 35,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      9,
      6
    ]
  },
  {
    "id": 7,
    "title": "월별 운세 확인",
    "subtitle": "월간 사주 📅",
    "rating": 4.7,
    "views": "2만+",
    "discount": 29,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1755096595963x896724663128204200/%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE.png",
    "categoryIds": [
      8
    ]
  },
  {
    "id": 8,
    "title": "연애운 상승법",
    "subtitle": "달콤운 사주 💗",
    "rating": 4.8,
    "views": "4만+",
    "discount": 48,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png",
    "categoryIds": [
      5,
      3
    ]
  },
  {
    "id": 9,
    "title": "썸 타는 사람과의 궁합",
    "subtitle": "썸사주 궁합 😍",
    "rating": 4.9,
    "views": "5만+",
    "discount": 55,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      2,
      3
    ]
  },
  {
    "id": 10,
    "title": "이별 극복하기",
    "subtitle": "재회 사주 🌈",
    "rating": 4.7,
    "views": "3만+",
    "discount": 42,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      4
    ]
  },
  {
    "id": 11,
    "title": "사업운 점검",
    "subtitle": "사업 사주 💰",
    "rating": 4.6,
    "views": "1만+",
    "discount": 38,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      6,
      9
    ]
  },
  {
    "id": 12,
    "title": "인생 전환점 찾기",
    "subtitle": "종합 사주 ✨",
    "rating": 4.8,
    "views": "4만+",
    "discount": 52,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png",
    "categoryIds": [
      10,
      7
    ]
  },
  {
    "id": 13,
    "title": "내 숨겨진 연애운은?",
    "subtitle": "솔로탈출 사주 🌸",
    "rating": 4.9,
    "views": "5만+",
    "discount": 54,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png",
    "categoryIds": [
      1,
      3
    ]
  },
  {
    "id": 14,
    "title": "재회 vs 환승? 이제 지쳤다면",
    "subtitle": "[재회 환승사주]",
    "rating": 4.9,
    "views": "1만+",
    "discount": 60,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      4
    ]
  },
  {
    "id": 15,
    "title": "화 기운 3년을 읽어주는",
    "subtitle": "[프리미엄 하반기 종합사주✨]",
    "rating": 4.9,
    "views": "1만+",
    "discount": 46,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png",
    "categoryIds": [
      1,
      8
    ]
  },
  {
    "id": 16,
    "title": "그 사람과 나는 얼마나 잘 맞을까?",
    "subtitle": "[커플 궁합사주 🥵]",
    "rating": 4.7,
    "views": "2만+",
    "discount": 46,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      2
    ]
  },
  {
    "id": 17,
    "title": "그 사람과 재회할 수 있을까..?",
    "subtitle": "[이별 재회 사주]",
    "rating": 4.9,
    "views": "6만+",
    "discount": 41,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467391031x376946978522862700/%EC%9E%AC%ED%9A%8C%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      4
    ]
  },
  {
    "id": 18,
    "title": "이직해서 연봉 2배 올리고 싶다면",
    "subtitle": "봐야할 [커리어사주]",
    "rating": 4.6,
    "views": "1만+",
    "discount": 46,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=130,f=auto,dpr=1,fit=contain/f1754467415536x796541878799546000/%EC%BB%A4%EB%A6%AC%EC%96%B4%EC%82%AC%EC%A3%BC_%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      9
    ]
  },
  {
    "id": 19,
    "title": "명쾌한 10년 풀이까지 해주는",
    "subtitle": "[2025년 타이트 종합사주]",
    "rating": 4.7,
    "views": "1만+",
    "discount": 29,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png",
    "categoryIds": [
      1,
      7,
      8
    ]
  },
  {
    "id": 20,
    "title": "뻔한 조언 대신 진짜 매운맛 사주!",
    "subtitle": "[팩폭 사주]",
    "rating": 4.6,
    "views": "1만+",
    "discount": 29,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png",
    "categoryIds": [
      1,
      10
    ]
  },
  {
    "id": 21,
    "title": "소름돋게 잘 맞는 2026 신년운세",
    "subtitle": "[신년운세 총운]",
    "rating": 4.7,
    "views": "1만+",
    "discount": 60,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1755096595963x896724663128204200/%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A1%E1%84%8C%E1%85%AE.png",
    "categoryIds": [
      1,
      7
    ]
  },
  {
    "id": 22,
    "title": "소름돋는 2026년 재물운세 💵",
    "subtitle": "[10년 재물운 사주]",
    "rating": 4.7,
    "views": "1만+",
    "discount": 50,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1754467329857x835823088653500300/%ED%95%98%EB%B0%98%EA%B8%B0%EC%A2%85%ED%95%A9.png",
    "categoryIds": [
      1,
      7,
      14
    ]
  },
  {
    "id": 23,
    "title": "그 사람도 나를 좋아할까?",
    "subtitle": "[썸 궁합사주]",
    "rating": 4.7,
    "views": "1만+",
    "discount": 46,
    "image": "https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png",
    "categoryIds": [
      1,
      2,
      3
    ]
  }
];
