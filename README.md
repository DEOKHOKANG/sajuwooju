# 사주우주 (SajuWooju) 🌌

> **우주의 법칙으로 읽는 나의 운명**

AI 기반 사주 분석과 3D 우주 시각화가 만나는 차세대 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-Latest-purple)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

---

## 🌟 특징

### 🪐 3D 우주 시각화
- **9개 행성 시스템**: 수금지화목토천해명을 3D로 구현
- **음양오행 매핑**: 각 행성이 木火土金水 원소로 연결됨
- **인터랙티브**: 행성 클릭, 회전, 확대/축소 가능
- **실시간 애니메이션**: 공전과 자전 구현

### 🎨 우주 테마 디자인 시스템
- **Cosmic Colors**: 깊은 우주 배경부터 별빛 강조색까지
- **Space Grotesk**: 우주적 느낌의 디스플레이 폰트
- **10+ Animations**: 별 반짝임, 행성 공전, 성운 펄스 등
- **Glassmorphism**: 투명하고 미래지향적인 UI

### 🤖 AI 분석 로딩
- **3D 로딩 씬**: 5개 행성이 원형으로 회전
- **16단계 메시지**: AI 분석 과정을 실시간 표시
- **프로그레스 바**: Shimmer 효과의 그라디언트 바
- **자동 완료**: 분석 완료 후 콜백

---

## 🚀 빠른 시작

### 설치
```bash
git clone https://github.com/your-username/sajuwooju-v2.git
cd sajuwooju-v2
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 빌드
```bash
npm run build
npm run start
```

---

## 📁 프로젝트 구조

```
sajuwooju-v2/
├── app/                        # Next.js App Router
│   ├── space-test/            # 3D 태양계 테스트 페이지
│   ├── loading-test/          # 로딩 애니메이션 테스트
│   ├── globals-wooju.css      # 우주 테마 CSS
│   └── layout-wooju.tsx       # 우주 테마 레이아웃
│
├── components/
│   ├── 3d/                    # 3D 컴포넌트
│   │   ├── SpaceCanvas.tsx   # Three.js Canvas
│   │   ├── Sun.tsx           # 태양 컴포넌트
│   │   ├── Planet.tsx        # 행성 컴포넌트
│   │   ├── SolarSystem.tsx   # 태양계 시스템
│   │   └── LoadingScene.tsx  # 로딩 씬
│   │
│   ├── ui/                    # UI 컴포넌트
│   │   └── progress-bar.tsx  # 프로그레스 바
│   │
│   └── SajuLoader.tsx         # 통합 로딩 컴포넌트
│
├── lib/
│   ├── planets-data.ts        # 9개 행성 데이터 (음양오행)
│   └── loading-messages.ts    # AI 분석 메시지
│
└── scripts/
    └── rebrand-text.js        # 텍스트 리브랜딩 스크립트
```

---

## 🎨 디자인 시스템

### 컬러 팔레트

#### 우주 배경 (Deep Space)
```css
--space-black: #0A0E27      /* 깊은 우주 */
--space-dark: #1A1F3A       /* 어두운 우주 */
--space-navy: #2D3561       /* 우주 네이비 */
```

#### 별빛 & 강조색
```css
--star-gold: #FFD700        /* 별빛 골드 */
--cosmic-purple: #7B68EE    /* 우주 보라 */
--nebula-pink: #FF6EC7      /* 성운 핑크 */
--aurora-green: #00FFB3     /* 오로라 그린 */
```

#### 행성 색상 (음양오행)
```css
/* 水 (Water) */
--planet-mercury: #B8C5D6
--planet-uranus: #4FD0E7
--planet-neptune: #4169E1

/* 金 (Metal) */
--planet-venus: #FFD700

/* 土 (Earth) */
--planet-earth: #4169E1
--planet-saturn: #DAA520
--planet-pluto: #8B7355

/* 火 (Fire) */
--planet-mars: #DC143C

/* 木 (Wood) */
--planet-jupiter: #FF8C00
```

### 타이포그래피

#### 폰트 패밀리
- **Display**: Space Grotesk (제목, 로고)
- **Body**: Pretendard Variable (본문)
- **Decorative**: Ownglyph Saehayan (장식)

#### 폰트 크기 (8px 기반)
```
2xs: 10px  | xs: 12px  | sm: 14px  | base: 16px
lg: 18px   | xl: 20px  | 2xl: 24px | 3xl: 30px
4xl: 36px  | 5xl: 48px | 6xl: 60px | 7xl: 72px
8xl: 96px  | 9xl: 128px
```

### 애니메이션

```css
/* 별 반짝임 */
.animate-twinkle { animation: twinkle 2s infinite; }

/* 행성 공전 */
.animate-orbit { animation: orbit 20s linear infinite; }

/* 성운 펄스 */
.animate-nebula-pulse { animation: nebula-pulse 4s infinite; }

/* 글로우 펄스 */
.animate-glow-pulse { animation: glow-pulse 2s infinite; }
```

---

## 🪐 행성 데이터

### 9개 행성 (음양오행 매핑)

| 행성 | 원소 | 색상 | 공전반경 | 공전속도 |
|------|------|------|---------|---------|
| 수성 | 水 | #B8C5D6 | 50 AU | 4.74 km/s |
| 금성 | 金 | #FFD700 | 70 AU | 3.50 km/s |
| 지구 | 土 | #4169E1 | 90 AU | 2.98 km/s |
| 화성 | 火 | #DC143C | 110 AU | 2.41 km/s |
| 목성 | 木 | #FF8C00 | 150 AU | 1.31 km/s |
| 토성 | 土 | #DAA520 | 180 AU | 0.97 km/s |
| 천왕성 | 水 | #4FD0E7 | 210 AU | 0.68 km/s |
| 해왕성 | 水 | #4169E1 | 240 AU | 0.54 km/s |
| 명왕성 | 土 | #8B7355 | 270 AU | 0.47 km/s |

---

## 🧪 테스트 페이지

### 3D 태양계 (`/space-test`)
- 완전한 3D 태양계 시스템
- 행성 클릭으로 정보 확인
- OrbitControls (회전, 확대/축소)
- 음양오행 범례

### 로딩 애니메이션 (`/loading-test`)
- 3D 로딩 애니메이션 (35초)
- 간단한 로딩 (8.5초)
- 프로그레스 바 테스트

### 우주 테마 홈페이지 (`/page-wooju`)
- Cosmic Hero Section
- 행성 기반 카테고리 아이콘
- Glassmorphism UI
- 음양오행 Product Cards

---

## 🛠 기술 스택

### Core
- **Next.js 16.0** - React 프레임워크
- **React 19.2** - UI 라이브러리
- **TypeScript 5.9** - 타입 안전성
- **Tailwind CSS 3.4** - 유틸리티 CSS

### 3D Graphics
- **Three.js** - 3D 렌더링 엔진
- **React Three Fiber** - React용 Three.js
- **@react-three/drei** - 3D 유틸리티
- **@react-three/postprocessing** - 후처리 효과

### Fonts
- **Space Grotesk** - Display font
- **Pretendard Variable** - Body font
- **Ownglyph Saehayan** - Decorative

---

## 📊 성능

### 목표
- **Lighthouse Performance**: > 90
- **Core Web Vitals**: Green
- **3D Rendering**: 60fps (desktop), 30fps (mobile)
- **LCP**: < 2.5s
- **CLS**: < 0.1

### 최적화
- Dynamic imports (code splitting)
- GPU-accelerated animations
- Responsive 3D (DPR 1-2)
- Lazy loading
- Image optimization

---

## 📖 문서

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - 디자인 시스템 가이드
- [FONT_SETUP.md](./FONT_SETUP.md) - 폰트 설정 가이드
- [PHASE_R1_COMPLETE.md](./PHASE_R1_COMPLETE.md) - Phase R1 완료 보고서 (Design System)
- [PHASE_R2_COMPLETE.md](./PHASE_R2_COMPLETE.md) - Phase R2 완료 보고서 (3D Engine)
- [PHASE_R3_COMPLETE.md](./PHASE_R3_COMPLETE.md) - Phase R3 완료 보고서 (Loading Animations)
- [PHASE_R4_COMPLETE.md](./PHASE_R4_COMPLETE.md) - Phase R4 완료 보고서 (Text Rebranding)
- [PHASE_R5_COMPLETE.md](./PHASE_R5_COMPLETE.md) - Phase R5 완료 보고서 (UI Components)

---

## 🤝 기여

이 프로젝트는 사주우주 차세대 플랫폼의 프로토타입입니다.

---

## 📝 라이선스

Copyright © 2025 SajuWooju

---

## 🌟 특별 감사

- **Three.js** - 3D 그래픽스
- **Pmnd.rs** - React Three Fiber 생태계
- **Vercel** - Next.js 프레임워크
- **NASA** - 행성 참고 자료

---

**사주우주** - 우주의 법칙으로 읽는 나의 운명 🌌
