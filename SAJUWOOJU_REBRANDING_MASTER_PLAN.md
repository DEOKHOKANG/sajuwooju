# 사주우주 (SajuWooju) 리브랜딩 마스터 플랜

> **사주우주 → 사주우주 완전 리브랜딩 프로젝트**
>
> 우주의 신비와 음양오행의 조화를 담은 프리미엄 사주 플랫폼

---

## 📋 프로젝트 개요

### 비전
**"우주의 법칙으로 읽는 나의 운명"**

사주우주는 단순한 사주 서비스를 넘어, 우주의 신비와 음양오행의 깊이를 3D 인터랙티브 경험으로 전달하는 프리미엄 플랫폼입니다.

### 핵심 차별화 요소
1. **실사 수준 3D 태양계**: Three.js 기반 인터랙티브 행성계
2. **음양오행 매핑**: 수금지화목토천해명 → 五行 (수화목금토) 시각화
3. **우주 테마 디자인**: 깊은 우주색, 별빛 애니메이션, 행성 궤도
4. **AI 로딩 애니메이션**: 행성 공전 + 프로그레스바 통합
5. **프리미엄 UX**: 신비로움과 신뢰도를 동시에 전달

---

## 🎨 Phase R1: 디자인 시스템 재정의 (5-7일, Critical)

### R1.1 브랜드 아이덴티티 (2일)

#### 1.1.1 브랜드 네이밍 & 슬로건
- [ ] **브랜드명**: 사주우주 (SajuWooju)
- [ ] **영문**: SajuWooju / Saju Universe
- [ ] **슬로건**: "우주의 법칙으로 읽는 나의 운명"
- [ ] **서브 슬로건**: "별자리를 넘어, 행성의 조화로"
- [ ] **도메인**: sajuwooju.com (또는 sajuuniverse.com)

#### 1.1.2 브랜드 스토리
```
사주우주는 태양계의 9개 행성(수금지화목토천해명)을
음양오행(木火土金水)과 매핑하여,
당신의 사주를 우주의 법칙으로 해석합니다.

태양을 중심으로 돌아가는 행성처럼,
당신의 운명도 천체의 조화 속에서 움직입니다.
```

#### 1.1.3 브랜드 개성
- **신비로운 (Mysterious)**: 우주의 깊이, 별빛의 반짝임
- **프리미엄 (Premium)**: 고급스러운 색감, 정교한 3D
- **신뢰할 수 있는 (Trustworthy)**: 과학적 시각화, 정확한 계산
- [ ] 파일: `docs/BRAND_IDENTITY.md` (신규)

---

### R1.2 컬러 시스템 (1일)

#### 우주 테마 팔레트

**Primary Colors (주요 색상)**
```css
/* 깊은 우주 배경 */
--space-black: #0A0E27;        /* 메인 배경 */
--space-dark: #1A1F3A;         /* 섹션 배경 */
--space-navy: #2D3561;         /* 카드 배경 */

/* 별빛 & 강조색 */
--star-gold: #FFD700;          /* 주요 CTA, 강조 */
--cosmic-purple: #7B68EE;      /* 보조 강조, 링크 */
--nebula-pink: #FF6EC7;        /* 포인트 색상 */

/* 행성 색상 (Five Elements Mapping) */
--mercury-silver: #C0C0C0;     /* 수성 - 水 (물) */
--venus-gold: #FFD700;         /* 금성 - 金 (쇠) */
--earth-blue: #4169E1;         /* 지구 - 土 (흙) */
--mars-red: #DC143C;           /* 화성 - 火 (불) */
--jupiter-orange: #FF8C00;     /* 목성 - 木 (나무) */
--saturn-beige: #F4A460;       /* 토성 - 土 (흙) */
--uranus-cyan: #00CED1;        /* 천왕성 - 水 */
--neptune-blue: #4169E1;       /* 해왕성 - 水 */
--pluto-gray: #696969;         /* 명왕성 - 土 */
```

**Semantic Colors (의미 색상)**
```css
/* 텍스트 */
--text-primary: #FFFFFF;       /* 주요 텍스트 */
--text-secondary: #B8C5D6;     /* 보조 텍스트 */
--text-muted: #6B7A8F;         /* 약한 텍스트 */

/* 상태 */
--success: #00D9A5;            /* 성공 */
--warning: #FFB800;            /* 경고 */
--error: #FF5555;              /* 에러 */
--info: #5E81AC;               /* 정보 */
```

**Gradient Presets**
```css
/* 우주 그라디언트 */
--gradient-cosmos: linear-gradient(135deg, #0A0E27 0%, #2D3561 50%, #1A1F3A 100%);

/* 성운 그라디언트 */
--gradient-nebula: linear-gradient(135deg, #7B68EE 0%, #FF6EC7 100%);

/* 별빛 그라디언트 */
--gradient-starlight: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);

/* 오로라 그라디언트 */
--gradient-aurora: linear-gradient(135deg, #00CED1 0%, #7B68EE 50%, #FF6EC7 100%);
```

- [ ] 파일: `lib/design-tokens-woozoo.ts` (신규)
- [ ] 파일: `app/globals-woozoo.css` (신규)

---

### R1.3 타이포그래피 (1일)

#### 폰트 선정

**Display Font (타이틀용)**
- [ ] **한글**: Pretendard Variable (유지, 우주적 느낌)
- [ ] **영문**: Space Grotesk (우주 테마 적합)
- [ ] **대체**: Outfit (모던하고 기하학적)

**Body Font (본문용)**
- [ ] **한글**: Pretendard Variable
- [ ] **영문**: Inter Variable

**Accent Font (강조용)**
- [ ] **한글**: 한글 서예체 (음양오행 표시용)
- [ ] **옵션**: Noto Serif KR (고전미)

#### 폰트 스케일
```css
/* 우주 테마 타이포그래피 */
--font-display-xl: 64px;    /* 히어로 타이틀 */
--font-display-lg: 48px;    /* 섹션 타이틀 */
--font-display-md: 36px;    /* 서브 타이틀 */
--font-heading-lg: 32px;    /* 큰 제목 */
--font-heading-md: 24px;    /* 중간 제목 */
--font-heading-sm: 20px;    /* 작은 제목 */
--font-body-lg: 18px;       /* 큰 본문 */
--font-body-md: 16px;       /* 일반 본문 */
--font-body-sm: 14px;       /* 작은 본문 */
--font-caption: 12px;       /* 캡션 */
```

#### Font Weights
```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-black: 900;   /* Display용 */
```

- [ ] 파일: `public/fonts/space-grotesk/` (신규)
- [ ] 파일: `app/globals-woozoo.css` (폰트 정의)

---

### R1.4 스페이싱 & 레이아웃 (0.5일)

#### Spacing Scale (8px 기반)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

#### Border Radius (우주적 곡선)
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;   /* 행성 모양 */
```

#### Shadows (우주 깊이감)
```css
--shadow-glow: 0 0 20px rgba(255, 215, 0, 0.3);
--shadow-planet: 0 8px 32px rgba(0, 0, 0, 0.5);
--shadow-nebula: 0 0 40px rgba(123, 104, 238, 0.4);
--shadow-card: 0 4px 16px rgba(0, 0, 0, 0.3);
```

- [ ] 파일: `tailwind.config-woozoo.ts` (신규)

---

### R1.5 애니메이션 시스템 (1.5일)

#### 우주 테마 애니메이션

**1. 별 반짝임 (Twinkle)**
```css
@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.star-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}
```

**2. 행성 공전 (Orbit)**
```css
@keyframes orbit {
  from {
    transform: rotate(0deg) translateX(200px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(200px) rotate(-360deg);
  }
}

.planet-orbit {
  animation: orbit 20s linear infinite;
}
```

**3. 성운 펄스 (Nebula Pulse)**
```css
@keyframes nebula-pulse {
  0%, 100% {
    filter: brightness(1) blur(0px);
  }
  50% {
    filter: brightness(1.2) blur(4px);
  }
}

.nebula-effect {
  animation: nebula-pulse 4s ease-in-out infinite;
}
```

**4. 별똥별 (Shooting Star)**
```css
@keyframes shooting-star {
  0% {
    transform: translateX(-100px) translateY(-100px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(1000px) translateY(1000px);
    opacity: 0;
  }
}

.shooting-star {
  animation: shooting-star 3s ease-out infinite;
}
```

**5. 우주 먼지 (Cosmic Dust)**
```css
@keyframes float-dust {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

.cosmic-dust {
  animation: float-dust 6s ease-in-out infinite;
}
```

- [ ] 파일: `app/globals-woozoo.css` (애니메이션 정의)
- [ ] 파일: `components/animations/` (신규 디렉토리)

---

## 🌌 Phase R2: 3D 우주 엔진 구현 (7-10일, Critical)

### R2.1 Three.js 환경 설정 (1일)

#### 패키지 설치
```bash
npm install three @react-three/fiber @react-three/drei
npm install @react-three/postprocessing
npm install @types/three
```

#### 기본 구조
- [ ] Three.js Canvas 컴포넌트
- [ ] Camera 설정 (원근감)
- [ ] Lighting 시스템 (태양광, 앰비언트)
- [ ] Post-processing (블룸 효과)
- [ ] 파일: `components/3d/SpaceCanvas.tsx` (신규)
- [ ] 파일: `components/3d/Lights.tsx` (신규)

---

### R2.2 태양계 시스템 구현 (4일)

#### 2.2.1 태양 (Sun) - 중심
```typescript
// 태양 컴포넌트
interface SunProps {
  radius: number;
  emissiveIntensity: number;
}

// Features:
// - 발광 효과 (emissive material)
// - 코로나 효과 (shader)
// - 플레어 효과 (lens flare)
// - 자전 애니메이션
```
- [ ] 파일: `components/3d/planets/Sun.tsx` (신규)

#### 2.2.2 행성 시스템 (Planets)
```typescript
// 9개 행성 컴포넌트
interface PlanetProps {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  texture: string;
  element: '木' | '火' | '土' | '金' | '水';
  color: string;
}

// 행성별 설정
const PLANETS = {
  mercury: {
    name: '수성',
    element: '水',
    orbitRadius: 50,
    orbitSpeed: 4.74,
    texture: '/textures/mercury.jpg',
    color: '#C0C0C0'
  },
  venus: {
    name: '금성',
    element: '金',
    orbitRadius: 70,
    orbitSpeed: 3.50,
    texture: '/textures/venus.jpg',
    color: '#FFD700'
  },
  earth: {
    name: '지구',
    element: '土',
    orbitRadius: 90,
    orbitSpeed: 2.98,
    texture: '/textures/earth.jpg',
    color: '#4169E1'
  },
  mars: {
    name: '화성',
    element: '火',
    orbitRadius: 110,
    orbitSpeed: 2.41,
    texture: '/textures/mars.jpg',
    color: '#DC143C'
  },
  jupiter: {
    name: '목성',
    element: '木',
    orbitRadius: 150,
    orbitSpeed: 1.31,
    texture: '/textures/jupiter.jpg',
    color: '#FF8C00'
  },
  saturn: {
    name: '토성',
    element: '土',
    orbitRadius: 180,
    orbitSpeed: 0.97,
    texture: '/textures/saturn.jpg',
    color: '#F4A460'
  },
  uranus: {
    name: '천왕성',
    element: '水',
    orbitRadius: 210,
    orbitSpeed: 0.68,
    texture: '/textures/uranus.jpg',
    color: '#00CED1'
  },
  neptune: {
    name: '해왕성',
    element: '水',
    orbitRadius: 240,
    orbitSpeed: 0.54,
    texture: '/textures/neptune.jpg',
    color: '#4169E1'
  },
  pluto: {
    name: '명왕성',
    element: '土',
    orbitRadius: 270,
    orbitSpeed: 0.47,
    texture: '/textures/pluto.jpg',
    color: '#696969'
  }
};
```
- [ ] 파일: `components/3d/planets/Planet.tsx` (신규)
- [ ] 파일: `components/3d/planets/PlanetSystem.tsx` (신규)
- [ ] 파일: `lib/planet-data.ts` (신규)

#### 2.2.3 궤도 (Orbits)
```typescript
// 궤도 링 시각화
interface OrbitRingProps {
  radius: number;
  color: string;
  opacity: number;
}

// Features:
// - 타원 궤도 (ellipse)
// - 점선 스타일
// - 발광 효과
```
- [ ] 파일: `components/3d/OrbitRing.tsx` (신규)

#### 2.2.4 음양오행 라벨
```typescript
// 행성에 매핑된 오행 표시
interface ElementLabelProps {
  element: '木' | '火' | '土' | '金' | '水';
  position: [number, number, number];
  planetName: string;
}

// Features:
// - 한자 표시 (木火土金水)
// - Billboard (항상 카메라 방향)
// - 호버 효과
```
- [ ] 파일: `components/3d/ElementLabel.tsx` (신규)

---

### R2.3 인터랙션 시스템 (2일)

#### 3D 인터랙션
- [ ] **클릭 감지**: 행성 클릭 시 상세 정보 표시
- [ ] **호버 효과**: 행성 위에 마우스 올리면 발광
- [ ] **카메라 컨트롤**: OrbitControls (회전, 줌)
- [ ] **자동 회전**: 유휴 시 자동으로 태양계 회전
- [ ] **줌 레벨**: 전체 뷰 ↔ 행성 클로즈업
- [ ] 파일: `components/3d/InteractionControls.tsx` (신규)

#### UI 오버레이
```typescript
// 3D 위에 표시되는 UI
interface PlanetInfoOverlay {
  planet: Planet;
  element: string;
  meaning: string;
  sajuInterpretation: string;
}

// Modal 스타일 정보 패널
```
- [ ] 파일: `components/3d/PlanetInfoOverlay.tsx` (신규)

---

### R2.4 배경 효과 (1일)

#### 별 배경 (Starfield)
```typescript
// 10,000개 별 파티클 시스템
interface StarfieldProps {
  count: number;
  radius: number;
  depth: number;
}

// Features:
// - Points geometry
// - 랜덤 위치
// - 반짝임 효과
// - 깊이감 (z축)
```
- [ ] 파일: `components/3d/Starfield.tsx` (신규)

#### 성운 효과 (Nebula)
```typescript
// 배경 성운 구름
interface NebulaProps {
  colors: string[];
  density: number;
  animated: boolean;
}

// Features:
// - Shader material
// - 그라디언트 블렌딩
// - 천천히 움직임
```
- [ ] 파일: `components/3d/Nebula.tsx` (신규)

---

### R2.5 성능 최적화 (1일)

#### 최적화 기법
- [ ] **LOD (Level of Detail)**: 거리에 따라 행성 디테일 조정
- [ ] **Frustum Culling**: 화면 밖 객체 렌더링 제외
- [ ] **Texture Compression**: 텍스처 최적화 (WebP, basis)
- [ ] **Instancing**: 별 파티클 인스턴싱
- [ ] **Lazy Loading**: 텍스처 지연 로딩
- [ ] 파일: `components/3d/OptimizedPlanet.tsx` (신규)

#### 성능 목표
- [ ] 60 FPS 유지 (데스크톱)
- [ ] 30 FPS 이상 (모바일)
- [ ] 초기 로딩 < 3초
- [ ] 메모리 사용량 < 200MB

---

## 🎬 Phase R3: 로딩 애니메이션 시스템 (3-4일, High Priority)

### R3.1 행성계 로딩 애니메이션 (2일)

#### 3.1.1 3D 로딩 씬
```typescript
// AI 사주 해석 중 표시되는 3D 애니메이션
interface SajuLoadingSceneProps {
  progress: number;      // 0-100
  userBirthDate: Date;   // 사용자 생년월일
  estimatedTime: number; // 예상 소요 시간 (초)
}

// Features:
// - 태양 중심 행성계 자동 공전
// - 사용자 생년월일에 맞는 행성 강조
// - 진행률에 따라 속도 변화
// - 완료 시 행성 정렬 애니메이션
```
- [ ] 파일: `components/loading/SajuLoadingScene.tsx` (신규)

#### 3.1.2 프로그레스 바 통합
```typescript
// 하단 프로그레스 바 + 텍스트
interface CosmicProgressBarProps {
  progress: number;
  message: string;
  subMessage?: string;
}

// 디자인:
// ┌─────────────────────────────────┐
// │ "운명의 별을 찾고 있습니다..."    │
// │ [████████░░░░░░░░░░░░] 40%      │
// │ "목성의 기운을 분석 중..."        │
// └─────────────────────────────────┘

// 애니메이션:
// - 바 채워지는 애니메이션
// - 별빛 반짝이며 이동
// - 그라디언트 효과
```
- [ ] 파일: `components/loading/CosmicProgressBar.tsx` (신규)

#### 3.1.3 로딩 메시지 시스템
```typescript
// 진행 단계별 메시지
const LOADING_MESSAGES = [
  { progress: 0, message: "우주의 문을 열고 있습니다...", planet: null },
  { progress: 10, message: "당신의 생년월일을 행성과 매핑 중...", planet: "태양" },
  { progress: 25, message: "목성의 기운을 분석하고 있습니다...", planet: "목성" },
  { progress: 40, message: "화성의 에너지를 측정 중...", planet: "화성" },
  { progress: 55, message: "토성의 지혜를 해석하고 있습니다...", planet: "토성" },
  { progress: 70, message: "수성의 흐름을 읽고 있습니다...", planet: "수성" },
  { progress: 85, message: "금성의 조화를 확인 중...", planet: "금성" },
  { progress: 95, message: "우주의 답을 정리하고 있습니다...", planet: "태양" },
  { progress: 100, message: "완료! 당신의 우주가 펼쳐집니다.", planet: null }
];
```
- [ ] 파일: `lib/loading-messages.ts` (신규)

---

### R3.2 GIF/Lottie 애니메이션 (1일)

#### GIF 애니메이션 제작
- [ ] After Effects로 행성 공전 애니메이션 제작
- [ ] 30 FPS, 5초 루프
- [ ] 투명 배경 (alpha channel)
- [ ] 최적화 (< 500KB)
- [ ] 파일: `public/animations/planet-orbit.gif` (신규)

#### Lottie 애니메이션 (대안)
```bash
npm install lottie-react
```
- [ ] Lottie JSON 파일 생성
- [ ] 벡터 기반 (크기 작음, 품질 좋음)
- [ ] 인터랙티브 제어 가능
- [ ] 파일: `public/animations/planet-orbit.json` (신규)
- [ ] 파일: `components/loading/LottieLoader.tsx` (신규)

---

### R3.3 스켈레톤 UI 개선 (0.5일)

#### 우주 테마 스켈레톤
```css
/* 기존 스켈레톤에서 우주 테마로 */
.skeleton-woozoo {
  background: linear-gradient(
    90deg,
    var(--space-dark) 25%,
    var(--space-navy) 50%,
    var(--space-dark) 75%
  );
  background-size: 200% 100%;
  animation: shimmer-cosmic 2s ease-in-out infinite;
}

@keyframes shimmer-cosmic {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```
- [ ] 파일: `components/ui/skeleton-woozoo.tsx` (신규)

---

## 🔤 Phase R4: 텍스트 리브랜딩 (2-3일, Critical)

### R4.1 브랜드명 전수 교체 (1일)

#### 자동 교체 스크립트
```typescript
// 모든 파일에서 브랜드명 교체
const REPLACEMENTS = {
  // 한글
  '사주우주': '사주우주',
  '사주우주': '사주우주',
  '타이트': '우주',

  // 영문
  'sajuwooju': 'sajuwooju',
  'SajuWooju': 'SajuWooju',
  'SAJUWOOJU': 'SAJUWOOJU',
  'Tight': 'Woozoo',

  // URL/도메인
  'sajuwooju.me': 'sajuwooju.com',
};

// 제외할 파일/폴더
const EXCLUDE = [
  'node_modules/',
  '.git/',
  '.next/',
  'SAJUWOOJU_REBRANDING_MASTER_PLAN.md'
];
```
- [ ] 파일: `scripts/rebrand-text-replace.ts` (신규)
- [ ] 실행: `npx tsx scripts/rebrand-text-replace.ts`

#### 수동 검토 필요 파일
- [ ] package.json (name, description)
- [ ] README.md
- [ ] 모든 .md 문서
- [ ] 메타 태그 (SEO)
- [ ] OG 이미지 텍스트

---

### R4.2 UI 텍스트 재작성 (1일)

#### 주요 카피 재작성
```typescript
// 기존 → 신규
const TEXT_UPDATES = {
  // 히어로 섹션
  hero: {
    before: "AI 기반 사주 궁합 서비스",
    after: "우주의 법칙으로 읽는 나의 운명"
  },

  // CTA
  cta: {
    before: "상담 시작",
    after: "우주로 떠나기"
  },

  // 카테고리
  categories: {
    before: "카테고리",
    after: "우주 탐험"
  },

  // 제품
  products: {
    before: "월간 랭킹 BEST",
    after: "별자리 인기 상담"
  }
};
```

#### 우주 테마 용어집
```
기존 → 신규
-----------------
상담 → 우주 탐험 / 행성 여행
결과 → 우주 지도 / 운명 별자리
분석 → 행성 해석 / 천체 분석
궁합 → 별자리 조화 / 행성 궁합
운세 → 천체 운행 / 우주 흐름
사주풀이 → 행성 해석 / 우주 리딩
```
- [ ] 파일: `docs/COPY_GUIDELINES.md` (신규)

---

### R4.3 메타데이터 업데이트 (0.5일)

#### SEO 메타데이터
```typescript
// app/layout.tsx
export const metadata = {
  title: '사주우주 - 우주의 법칙으로 읽는 나의 운명',
  description: '태양계 9개 행성과 음양오행을 결합한 프리미엄 사주 플랫폼. 3D 인터랙티브 경험으로 만나는 당신의 운명.',
  keywords: '사주, 사주우주, 우주, 행성, 음양오행, 운세, AI사주, 3D사주',
  openGraph: {
    title: '사주우주 - 우주의 법칙으로 읽는 나의 운명',
    description: '태양계 행성과 음양오행의 조화로 해석하는 당신의 사주',
    images: ['/og-image-woozoo.jpg'],
  }
};
```
- [ ] 모든 페이지 메타데이터 업데이트
- [ ] OG 이미지 새로 제작 (우주 테마)

---

## 🎨 Phase R5: UI 컴포넌트 리디자인 (4-5일, High Priority)

### R5.1 히어로 섹션 (2일)

#### 3D 배경 히어로
```typescript
// 풀스크린 3D 우주 배경
<section className="hero-space">
  {/* 3D Canvas - 배경 */}
  <SpaceCanvas className="absolute inset-0 z-0" />

  {/* 컨텐츠 오버레이 */}
  <div className="relative z-10">
    <h1 className="cosmic-title">
      우주의 법칙으로 읽는
      <br />
      <span className="gradient-text">나의 운명</span>
    </h1>

    <p className="cosmic-subtitle">
      태양계 9개 행성과 음양오행이 만나
      <br />
      당신의 사주를 해석합니다
    </p>

    <button className="cta-cosmic">
      <PlanetIcon />
      우주로 떠나기
    </button>
  </div>

  {/* 스크롤 인디케이터 */}
  <ScrollIndicator />
</section>
```
- [ ] 파일: `components/hero/CosmicHero.tsx` (신규)
- [ ] 파일: `components/hero/ScrollIndicator.tsx` (신규)

---

### R5.2 제품 카드 리디자인 (1일)

#### 우주 테마 카드
```typescript
// 행성 카드 스타일
<div className="product-card-woozoo">
  {/* 배경 효과 */}
  <div className="card-nebula-bg" />

  {/* 행성 아이콘 */}
  <div className="planet-icon">
    <PlanetOrb element={product.element} />
  </div>

  {/* 제목 */}
  <h3 className="card-title-cosmic">
    {product.title}
  </h3>

  {/* 음양오행 태그 */}
  <ElementBadge element={product.element} />

  {/* 별점 + 조회수 */}
  <div className="card-stats">
    <StarRating value={product.rating} />
    <ViewCount count={product.views} />
  </div>

  {/* 호버 효과: 행성 공전 */}
  <OrbitingStars />
</div>
```

#### CSS 스타일
```css
.product-card-woozoo {
  background: var(--gradient-cosmos);
  border: 1px solid rgba(123, 104, 238, 0.2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-nebula);
  transition: all 0.3s ease;
}

.product-card-woozoo:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-glow);
  border-color: var(--star-gold);
}
```
- [ ] 파일: `components/products/ProductCardWoozoo.tsx` (신규)

---

### R5.3 카테고리 아이콘 (1일)

#### 행성 아이콘으로 교체
```typescript
// 각 카테고리를 행성으로 매핑
const CATEGORY_PLANETS = {
  1: { name: '이벤트', planet: '태양', icon: <SunIcon /> },
  2: { name: '궁합', planet: '금성', icon: <VenusIcon /> },
  3: { name: '솔로/연애', planet: '화성', icon: <MarsIcon /> },
  4: { name: '이별/재회', planet: '명왕성', icon: <PlutoIcon /> },
  5: { name: '직장/취업', planet: '토성', icon: <SaturnIcon /> },
  6: { name: '재물/사업', planet: '목성', icon: <JupiterIcon /> },
  7: { name: '건강', planet: '수성', icon: <MercuryIcon /> },
  8: { name: '월별운세', planet: '해왕성', icon: <NeptuneIcon /> },
  9: { name: '종합운', planet: '천왕성', icon: <UranusIcon /> },
  10: { name: '타로', planet: '지구', icon: <EarthIcon /> },
  11: { name: '작명', planet: '달', icon: <MoonIcon /> }
};
```

#### 3D 아이콘 컴포넌트
```typescript
// Mini 3D 행성 아이콘
interface PlanetIconProps {
  planet: string;
  size: number;
  animated?: boolean;
}

// Features:
// - 작은 3D 행성 렌더링
// - 자전 애니메이션
// - 호버 시 확대
```
- [ ] 파일: `components/icons/PlanetIcons.tsx` (신규)

---

### R5.4 버튼 & CTA (0.5일)

#### 우주 테마 버튼
```css
/* Primary Button - 별빛 효과 */
.btn-cosmic-primary {
  background: var(--gradient-starlight);
  color: var(--space-black);
  font-weight: var(--font-weight-bold);
  padding: 16px 32px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-glow);
  transition: all 0.3s ease;
}

.btn-cosmic-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

/* Secondary Button - 성운 효과 */
.btn-cosmic-secondary {
  background: transparent;
  border: 2px solid var(--cosmic-purple);
  color: var(--cosmic-purple);
  backdrop-filter: blur(10px);
}

.btn-cosmic-secondary:hover {
  background: var(--gradient-nebula);
  color: white;
  border-color: transparent;
}
```
- [ ] 파일: `components/ui/button-woozoo.tsx` (신규)

---

### R5.5 푸터 리디자인 (0.5일)

#### 우주 테마 푸터
```typescript
<footer className="footer-cosmos">
  {/* 별 배경 */}
  <Starfield density="low" />

  {/* 컨텐츠 */}
  <div className="footer-content">
    <div className="footer-logo">
      <CosmicLogo />
      <p className="tagline">우주의 법칙으로 읽는 나의 운명</p>
    </div>

    <nav className="footer-nav">
      {/* 링크들 */}
    </nav>

    <div className="footer-social">
      {/* SNS 아이콘 */}
    </div>
  </div>

  {/* Copyright */}
  <div className="footer-bottom">
    <p>© 2025 SajuWooju. All rights reserved.</p>
    <p className="cosmic-quote">
      "별들이 말하는 당신의 이야기"
    </p>
  </div>
</footer>
```
- [ ] 파일: `components/layout/footer-woozoo.tsx` (신규)

---

## 🎯 Phase R6: 페이지별 리브랜딩 (3-4일, High Priority)

### R6.1 홈페이지 (1일)
- [ ] 히어로 섹션 → 3D 우주 배경
- [ ] 카테고리 → 행성 아이콘
- [ ] 제품 카드 → 우주 테마
- [ ] 리뷰 섹션 → 별자리 리뷰
- [ ] 파일: `app/page-woozoo.tsx` (신규)

### R6.2 제품 상세 페이지 (1일)
- [ ] 제품 이미지 → 행성 배경
- [ ] 설명 섹션 → 음양오행 해석
- [ ] CTA 버튼 → 우주 테마
- [ ] 파일: `app/products/[id]/page-woozoo.tsx` (신규)

### R6.3 카테고리 페이지 (0.5일)
- [ ] 카테고리 헤더 → 행성 배경
- [ ] 제품 그리드 → 우주 테마
- [ ] 파일: `app/category/[id]/page-woozoo.tsx` (신규)

### R6.4 사주 입력 페이지 (0.5일)
- [ ] 폼 스타일 → 우주 테마
- [ ] 달력 → 별자리 달력
- [ ] 파일: `app/consult/page-woozoo.tsx` (신규)

### R6.5 결과 페이지 (1일)
- [ ] 사주판 → 3D 행성계 시각화
- [ ] 운세 섹션 → 행성별 해석
- [ ] 공유 버튼 → 우주 테마
- [ ] 파일: `app/result/[sessionId]/page-woozoo.tsx` (신규)

---

## 📦 Phase R7: 에셋 제작 (3-4일, High Priority)

### R7.1 3D 텍스처 (2일)

#### 행성 텍스처 수집/제작
- [ ] 태양 텍스처 (4K)
- [ ] 수성 ~ 명왕성 텍스처 (각 2K)
- [ ] 법선 맵 (Normal maps)
- [ ] 발광 맵 (Emissive maps)
- [ ] 소스: NASA, Solar System Scope, 또는 직접 제작
- [ ] 디렉토리: `public/textures/planets/`

#### 배경 텍스처
- [ ] 성운 이미지 (3장)
- [ ] HDR 환경 맵
- [ ] 디렉토리: `public/textures/backgrounds/`

---

### R7.2 아이콘 & 일러스트 (1일)

#### 행성 아이콘 세트
- [ ] SVG 형식
- [ ] 9개 행성 + 태양 + 달
- [ ] 여러 스타일 (outline, filled, 3d-like)
- [ ] 디렉토리: `public/icons/planets/`

#### 음양오행 아이콘
- [ ] 木火土金水 한자 아이콘
- [ ] 서예 스타일 + 모던 스타일
- [ ] 디렉토리: `public/icons/elements/`

---

### R7.3 로고 & 브랜딩 (1일)

#### 사주우주 로고
```
디자인 방향:
- 태양계를 형상화
- "사주우주" 타이포그래피
- 별과 행성 조합
- SVG 포맷 (반응형)
```

**파일 목록:**
- [ ] `logo-full.svg` (전체 로고)
- [ ] `logo-icon.svg` (아이콘만)
- [ ] `logo-text.svg` (텍스트만)
- [ ] `logo-full-white.svg` (어두운 배경용)
- [ ] `favicon.ico` (16x16, 32x32, 48x48)
- [ ] `apple-touch-icon.png` (180x180)
- [ ] 디렉토리: `public/brand/`

#### OG 이미지
- [ ] `og-image-woozoo.jpg` (1200x630)
- [ ] 디자인: 우주 배경 + 로고 + 슬로건
- [ ] 디렉토리: `public/`

---

## 🔧 Phase R8: 기술 구현 (5-7일, Critical)

### R8.1 디자인 토큰 마이그레이션 (1일)

#### Tailwind 설정
```typescript
// tailwind.config-woozoo.ts
const config = {
  theme: {
    extend: {
      colors: {
        space: {
          black: '#0A0E27',
          dark: '#1A1F3A',
          navy: '#2D3561',
        },
        star: {
          gold: '#FFD700',
        },
        cosmic: {
          purple: '#7B68EE',
        },
        nebula: {
          pink: '#FF6EC7',
        },
        planet: {
          mercury: '#C0C0C0',
          venus: '#FFD700',
          earth: '#4169E1',
          mars: '#DC143C',
          jupiter: '#FF8C00',
          saturn: '#F4A460',
          uranus: '#00CED1',
          neptune: '#4169E1',
          pluto: '#696969',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'Pretendard Variable', 'sans-serif'],
        body: ['Pretendard Variable', 'Inter Variable', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'nebula-pulse': 'nebula-pulse 4s ease-in-out infinite',
        'shooting-star': 'shooting-star 3s ease-out infinite',
      }
    }
  }
};
```
- [ ] 파일: `tailwind.config-woozoo.ts` (신규)
- [ ] 기존 `tailwind.config.ts` 백업

---

### R8.2 컴포넌트 마이그레이션 (2일)

#### 단계별 마이그레이션
1. **Step 1**: 새 컴포넌트 생성 (`-woozoo` suffix)
2. **Step 2**: 테스트 페이지에서 검증
3. **Step 3**: 기존 컴포넌트 교체
4. **Step 4**: 기존 파일 삭제 또는 `-old` suffix

#### 우선순위
- [ ] Layout 컴포넌트 (header, footer)
- [ ] UI 컴포넌트 (button, card, modal)
- [ ] 3D 컴포넌트 (새로 생성)
- [ ] 페이지 컴포넌트

---

### R8.3 라우팅 구조 변경 (1일)

#### 옵션 A: 서브 도메인
```
기존: sajuwooju.me
신규: www.sajuwooju.com
개발: dev.sajuwooju.com
```

#### 옵션 B: 같은 도메인 리디렉션
```
sajuwooju.me → sajuwooju.com (301 redirect)
```

#### 옵션 C: Feature Flag
```typescript
// 환경 변수로 테마 전환
const THEME = process.env.NEXT_PUBLIC_THEME; // 'tight' | 'woozoo'

// 컴포넌트에서 분기
{THEME === 'woozoo' ? <CosmicHero /> : <HeroSlider />}
```
- [ ] 파일: `lib/theme-config.ts` (신규)

---

### R8.4 데이터 마이그레이션 (1일)

#### 제품 데이터 업데이트
```typescript
// lib/products-data-woozoo.ts
export const PRODUCTS_WOOZOO = [
  {
    id: 1,
    title: '별자리 궁합 - 우주의 인연',
    subtitle: '행성의 조화로 보는 두 사람의 운명',
    element: '金', // 음양오행 추가
    planet: 'venus', // 연관 행성
    constellation: '금성', // 한글 행성명
    // ...기존 필드
  },
  // ...
];
```
- [ ] 모든 제품에 행성/오행 매핑
- [ ] 카테고리에 행성 아이콘 매핑

---

### R8.5 테스트 & QA (1-2일)

#### 테스트 항목
- [ ] **3D 렌더링**: 모든 브라우저에서 동작
- [ ] **성능**: 60fps 유지, 메모리 누수 없음
- [ ] **반응형**: Mobile, Tablet, Desktop
- [ ] **접근성**: 키보드 네비게이션, 스크린 리더
- [ ] **로딩 시간**: 초기 로딩 < 3초
- [ ] **크로스 브라우저**: Chrome, Safari, Firefox, Edge

#### 성능 벤치마크
```
목표:
- Lighthouse Performance: > 85
- Lighthouse SEO: 100
- Lighthouse Accessibility: > 95
- FPS (Desktop): 60
- FPS (Mobile): 30+
- Initial Load: < 3s
- 3D Scene Load: < 2s
```

---

## 📊 Phase R9: 최종 검증 & 배포 (2-3일, Critical)

### R9.1 프로덕션 빌드 (0.5일)
- [ ] `npm run build` 성공
- [ ] TypeScript 에러 0개
- [ ] ESLint 경고 0개
- [ ] Bundle 크기 확인 (< 500KB initial)
- [ ] 3D 에셋 최적화 (텍스처 압축)

### R9.2 SEO 최적화 (0.5일)
- [ ] 메타 태그 업데이트
- [ ] Sitemap 재생성
- [ ] Robots.txt 업데이트
- [ ] Structured Data (행성/음양오행 정보)

### R9.3 배포 준비 (1일)
- [ ] Vercel 프로젝트 설정
- [ ] 환경 변수 설정
- [ ] Custom Domain 연결
- [ ] CDN 설정 (3D 에셋용)

### R9.4 소프트 론칭 (1일)
- [ ] 베타 테스터 초대
- [ ] 피드백 수집
- [ ] 버그 수정
- [ ] 최종 조정

---

## 📈 성공 지표 (KPI)

### 기술 지표
- ✅ 3D 렌더링 성공률: 100%
- ✅ 평균 FPS: 60 (Desktop), 30+ (Mobile)
- ✅ Lighthouse Performance: > 85
- ✅ 초기 로딩 시간: < 3초
- ✅ 리브랜딩 완성도: 100%

### 사용자 경험
- ✅ 3D 인터랙션 참여율: > 70%
- ✅ 로딩 애니메이션 완주율: > 90%
- ✅ 페이지 이탈률: < 30%
- ✅ 평균 체류 시간: > 3분

---

## 🗓️ 타임라인 (총 30-40일)

### Week 1-2: 디자인 & 기획
- Day 1-3: R1 디자인 시스템
- Day 4-5: R2 준비 (Three.js 학습)
- Day 6-7: R4 텍스트 리브랜딩

### Week 3-4: 3D 엔진 구현
- Day 8-14: R2 3D 우주 엔진
- Day 15-17: R3 로딩 애니메이션

### Week 5-6: UI 구현
- Day 18-22: R5 UI 컴포넌트
- Day 23-26: R6 페이지 리브랜딩

### Week 7: 에셋 & 통합
- Day 27-29: R7 에셋 제작
- Day 30-33: R8 기술 구현

### Week 8: 테스트 & 배포
- Day 34-36: R8.5 테스트
- Day 37-40: R9 배포

---

## 💰 예산 예상 (선택사항)

### 필수 비용
- **3D 텍스처**: $50-100 (NASA 무료 or 유료 팩)
- **폰트 라이선스**: $0 (오픈소스 사용)
- **도메인**: $10-20/년
- **Hosting**: $0 (Vercel Free) or $20/월 (Pro)

### 선택 비용
- **디자이너**: $500-1000 (로고, OG 이미지)
- **3D 아티스트**: $300-500 (행성 모델 최적화)
- **After Effects**: $20/월 (GIF 애니메이션)

**총 예상**: $580-1650 (초기) + $20-40/월 (운영)

---

## 🎯 우선순위 정리

### P0 (Critical - 즉시 시작)
1. R1: 디자인 시스템 정의
2. R4: 텍스트 리브랜딩
3. R2: 3D 우주 엔진 기본 구현

### P1 (High - 2주 내)
4. R3: 로딩 애니메이션
5. R5: UI 컴포넌트 리디자인
6. R7: 에셋 제작

### P2 (Medium - 1개월 내)
7. R6: 페이지별 리브랜딩
8. R8: 기술 구현 & 테스트

### P3 (Low - 필요 시)
9. R9: 배포 & 론칭

---

## 🚀 즉시 시작 가능한 작업

### 오늘 할 일 (Day 1)
1. ✅ 마스터 플랜 문서 작성 (현재)
2. [ ] 디자인 토큰 정의 (`lib/design-tokens-woozoo.ts`)
3. [ ] 컬러 시스템 CSS 작성 (`app/globals-woozoo.css`)
4. [ ] Three.js 패키지 설치
5. [ ] 텍스트 교체 스크립트 작성

### 내일 할 일 (Day 2)
1. [ ] 브랜드 아이덴티티 문서 작성
2. [ ] 행성 텍스처 수집 시작
3. [ ] 기본 3D Scene 구현
4. [ ] 로고 스케치 시작

---

생성일: 2025-11-08
상태: **Planning Complete - Ready to Execute** 🚀
다음 단계: R1.2 컬러 시스템 구현 시작
