# 사주우주 (SajuWooju) 디자인 시스템

**버전**: 1.0.0
**최종 업데이트**: 2025-11-08
**상태**: Phase R1 Complete

---

## 목차

1. [브랜드 아이덴티티](#브랜드-아이덴티티)
2. [컬러 시스템](#컬러-시스템)
3. [타이포그래피](#타이포그래피)
4. [스페이싱 & 레이아웃](#스페이싱--레이아웃)
5. [애니메이션](#애니메이션)
6. [컴포넌트 가이드](#컴포넌트-가이드)
7. [접근성](#접근성)

---

## 브랜드 아이덴티티

### 브랜드 네임
- **한글**: 사주우주
- **영문**: SajuWooju
- **도메인**: sajuwooju.com

### 브랜드 슬로건
> "우주의 법칙으로 읽는 나의 운명"

### 브랜드 비전
우주의 9개 행성(수금지화목토천해명)과 음양오행(木火土金水)을 결합하여, 고대 동양철학과 현대 천문학이 만나는 새로운 사주 해석 경험을 제공합니다.

### 브랜드 보이스
- **톤**: 신비롭지만 친근한, 우주적이지만 이해하기 쉬운
- **스타일**: 전문적이면서도 따뜻한, 과학적이면서도 영적인
- **특징**: 우주와 별에 대한 은유 사용, 감성적이고 시적인 표현

---

## 컬러 시스템

### 기본 팔레트

#### 우주 배경 (Deep Space)
```css
--space-black: #0A0E27      /* 깊은 우주 검정 */
--space-dark: #1A1F3A       /* 어두운 우주 */
--space-navy: #2D3561       /* 우주 네이비 */
--space-midnight: #151937   /* 미드나잇 우주 */
--space-deep: #0D1226       /* 심해 우주 */
```

**사용처**:
- 페이지 배경 (`bg-space-black`)
- 카드/섹션 배경 (`bg-space-dark`)
- 모달/오버레이 (`bg-space-midnight`)

#### 별빛 & 강조색 (Stars & Accents)
```css
--star-gold: #FFD700        /* 별빛 골드 */
--star-silver: #E8E8E8      /* 은빛 별 */
--cosmic-purple: #7B68EE    /* 우주 보라 */
--nebula-pink: #FF6EC7      /* 성운 핑크 */
--nebula-blue: #4ECBFF      /* 성운 블루 */
--aurora-green: #00FFB3     /* 오로라 그린 */
--comet-cyan: #00D9FF       /* 혜성 시안 */
```

**사용처**:
- CTA 버튼 (`bg-star-gold`, `bg-cosmic-purple`)
- 링크/하이라이트 (`text-star-gold`)
- 아이콘/장식 (`text-nebula-pink`, `text-aurora-green`)

### 행성 색상 (음양오행 매핑)

#### 水 (Water) - 흐름, 지혜, 유연성
```css
--planet-mercury: #B8C5D6   /* 수성 - 은회색 */
--planet-uranus: #4FD0E7    /* 천왕성 - 청록색 */
--planet-neptune: #4169E1   /* 해왕성 - 진한 파랑 */
```

#### 金 (Metal) - 단단함, 정의, 결단
```css
--planet-venus: #FFD700     /* 금성 - 황금색 */
```

#### 土 (Earth) - 안정, 중심, 포용
```css
--planet-earth: #4169E1     /* 지구 - 파랑 */
--planet-saturn: #DAA520    /* 토성 - 황갈색 */
--planet-pluto: #8B7355     /* 명왕성 - 갈색 */
```

#### 火 (Fire) - 열정, 에너지, 변화
```css
--planet-mars: #DC143C      /* 화성 - 붉은색 */
```

#### 木 (Wood) - 성장, 확장, 생명력
```css
--planet-jupiter: #FF8C00   /* 목성 - 주황색 */
```

### 그라디언트 프리셋

#### 우주 배경 그라디언트
```css
.bg-gradient-space {
  background: linear-gradient(180deg,
    #0A0E27 0%,      /* space-black */
    #151937 50%,     /* space-midnight */
    #2D3561 100%     /* space-navy */
  );
}
```

#### 성운 그라디언트
```css
.bg-gradient-nebula {
  background: linear-gradient(135deg,
    #FF6EC7 0%,      /* nebula-pink */
    #7B68EE 50%,     /* cosmic-purple */
    #4ECBFF 100%     /* nebula-blue */
  );
}
```

#### 오로라 그라디언트
```css
.bg-gradient-aurora {
  background: linear-gradient(90deg,
    #00FFB3 0%,      /* aurora-green */
    #00D9FF 50%,     /* comet-cyan */
    #4ECBFF 100%     /* nebula-blue */
  );
}
```

#### 태양 그라디언트
```css
.bg-gradient-sun {
  background: radial-gradient(circle,
    #FFE66D 0%,      /* sun-core */
    #FDB813 40%,     /* sun-yellow */
    #FF6B35 100%     /* sun-orange */
  );
}
```

### 텍스트 색상
```css
--text-primary: #FFFFFF      /* 기본 텍스트 - 흰색 */
--text-secondary: #B8C5D6    /* 보조 텍스트 - 은회색 */
--text-tertiary: #7A8499     /* 3차 텍스트 - 회색 */
--text-disabled: #4A5568     /* 비활성 - 진한 회색 */
```

### 컬러 사용 규칙

1. **대비율**: 텍스트는 WCAG AA 기준 (4.5:1) 준수
2. **계층**: primary > secondary > tertiary 순서로 중요도 표현
3. **강조**: 골드/퍼플은 중요한 CTA에만 사용
4. **행성 색**: 각 행성 관련 콘텐츠에만 해당 색상 사용

---

## 타이포그래피

### 폰트 패밀리

#### 1. Space Grotesk (Display Font)
```css
font-family: 'Space Grotesk', 'Pretendard Variable', sans-serif;
```
**용도**: 제목, 큰 텍스트, 브랜드 로고
**Weight**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
**클래스**: `font-display`

#### 2. Pretendard Variable (Body Font)
```css
font-family: 'Pretendard Variable', sans-serif;
```
**용도**: 본문, UI 텍스트, 일반 콘텐츠
**Weight**: 100-900 (Variable)
**클래스**: `font-body`

#### 3. Ownglyph Saehayan (Decorative)
```css
font-family: 'Ownglyph Saehayan', 'Pretendard Variable', sans-serif;
```
**용도**: 특별한 장식, 브랜드 포인트
**클래스**: `font-ownglyph`

### 타이포그래피 스케일 (8px 기반)

| 클래스 | 크기 | Line Height | 용도 | 폰트 |
|--------|------|-------------|------|------|
| `text-9xl` | 128px | 1 | Hero 메인 타이틀 | Display |
| `text-8xl` | 96px | 1 | Hero 타이틀 | Display |
| `text-7xl` | 72px | 1 | 페이지 타이틀 | Display |
| `text-6xl` | 60px | 1 | 섹션 타이틀 | Display |
| `text-5xl` | 48px | 1 | 큰 섹션 제목 | Display |
| `text-4xl` | 36px | 2.5rem | 카드 타이틀 | Display |
| `text-3xl` | 30px | 2.25rem | 서브 타이틀 | Display/Body |
| `text-2xl` | 24px | 2rem | 섹션 제목 | Body |
| `text-xl` | 20px | 1.875rem | 큰 본문 | Body |
| `text-lg` | 18px | 1.75rem | 강조 본문 | Body |
| `text-base` | 16px | 1.5rem | 기본 본문 | Body |
| `text-sm` | 14px | 1.25rem | 작은 텍스트 | Body |
| `text-xs` | 12px | 1rem | 캡션, 라벨 | Body |
| `text-2xs` | 10px | 0.875rem | 메타 정보 | Body |

### 타이포그래피 사용 예시

```tsx
// Hero 타이틀
<h1 className="font-display text-8xl font-bold text-gradient-gold">
  사주우주
</h1>

// 섹션 제목
<h2 className="font-display text-5xl font-semibold text-text-primary">
  나의 운명을 알아보세요
</h2>

// 본문
<p className="font-body text-base text-text-secondary">
  우주의 9개 행성이 당신의 사주를 분석합니다.
</p>

// 강조 텍스트
<span className="font-body text-lg font-medium text-star-gold">
  지금 시작하기
</span>
```

### 타이포그래피 규칙

1. **제목**: Display font 사용, font-weight 600-700
2. **본문**: Body font 사용, font-weight 400
3. **강조**: font-weight 500-600, 색상 변경 (gold/purple)
4. **계층**: h1 > h2 > h3 순서로 크기 감소 (2-3 단계 차이)

---

## 스페이싱 & 레이아웃

### 스페이싱 시스템 (8px 기반)

| 클래스 | 값 | rem | 용도 |
|--------|-----|-----|------|
| `space-0.5` | 4px | 0.25rem | 아주 작은 간격 |
| `space-1` | 8px | 0.5rem | 작은 간격 |
| `space-2` | 16px | 1rem | 기본 간격 |
| `space-3` | 24px | 1.5rem | 중간 간격 |
| `space-4` | 32px | 2rem | 큰 간격 |
| `space-5` | 40px | 2.5rem | 섹션 간격 |
| `space-6` | 48px | 3rem | 큰 섹션 간격 |
| `space-8` | 64px | 4rem | 페이지 간격 |
| `space-10` | 80px | 5rem | 큰 페이지 간격 |
| `space-12` | 96px | 6rem | Hero 간격 |

### 레이아웃 그리드

#### Container
```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem; /* 32px */
}
```

#### Grid System
```css
/* 1 column (mobile) */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }

/* 2 columns (tablet) */
@media (min-width: 768px) {
  .md:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

/* 3-4 columns (desktop) */
@media (min-width: 1024px) {
  .lg:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

#### Gap System
```css
gap-2  /* 16px */
gap-3  /* 24px */
gap-4  /* 32px */
gap-6  /* 48px */
gap-8  /* 64px */
```

### Border Radius
```css
rounded-sm    /* 4px */
rounded-md    /* 8px */
rounded-lg    /* 12px */
rounded-xl    /* 16px */
rounded-2xl   /* 24px */
rounded-3xl   /* 32px */
rounded-full  /* 9999px */
```

---

## 애니메이션

### 키프레임 애니메이션

#### 1. 별 반짝임 (Twinkle)
```css
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* 사용 */
.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}
```

#### 2. 행성 공전 (Orbit)
```css
@keyframes orbit {
  from { transform: rotate(0deg) translateX(200px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
}

/* 사용 */
.animate-orbit {
  animation: orbit 20s linear infinite;
}
```

#### 3. 성운 펄스 (Nebula Pulse)
```css
@keyframes nebula-pulse {
  0%, 100% { filter: brightness(1) blur(0px); opacity: 0.6; }
  50% { filter: brightness(1.3) blur(4px); opacity: 0.9; }
}

/* 사용 */
.animate-nebula-pulse {
  animation: nebula-pulse 4s ease-in-out infinite;
}
```

#### 4. 별똥별 (Shooting Star)
```css
@keyframes shooting-star {
  0% { transform: translateX(0) translateY(0); opacity: 1; }
  100% { transform: translateX(300px) translateY(300px); opacity: 0; }
}

/* 사용 */
.animate-shooting-star {
  animation: shooting-star 2s ease-out forwards;
}
```

#### 5. 우주 먼지 떠다님 (Float Dust)
```css
@keyframes float-dust {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10px, -10px); }
  50% { transform: translate(-5px, -20px); }
  75% { transform: translate(-10px, -10px); }
}

/* 사용 */
.animate-float-dust {
  animation: float-dust 8s ease-in-out infinite;
}
```

#### 6. 글로우 펄스 (Glow Pulse)
```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(123, 104, 238, 0.5); }
  50% { box-shadow: 0 0 40px rgba(123, 104, 238, 0.8); }
}

/* 사용 */
.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### 인터랙션 애니메이션

#### Hover Effects
```css
/* 카드 호버 */
.card-hover {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.card-hover:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* 버튼 호버 */
.button-hover {
  transition: all 150ms ease;
}
.button-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
}
```

#### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
```

#### Slide Up
```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}
```

### 애니메이션 사용 규칙

1. **성능**: `transform`과 `opacity`만 애니메이션 (GPU 가속)
2. **Duration**: 150-600ms (너무 느리지 않게)
3. **Easing**: `ease-out` (자연스러운 느낌)
4. **will-change**: 필요시에만 사용 (메모리 소비)

---

## 컴포넌트 가이드

### Button

#### Primary Button
```tsx
<button className="
  px-6 py-3
  bg-star-gold text-space-black
  font-display font-semibold text-lg
  rounded-xl
  hover:scale-105 hover:shadow-glow-gold
  transition-all duration-150
  active:scale-98
">
  지금 시작하기
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3
  bg-transparent border-2 border-star-gold text-star-gold
  font-display font-semibold text-lg
  rounded-xl
  hover:bg-star-gold/10 hover:shadow-glow-gold
  transition-all duration-150
">
  더 알아보기
</button>
```

### Card

#### Glass Card
```tsx
<div className="
  p-6
  glass
  rounded-2xl
  hover:glass-hover
  transition-all duration-200
">
  {/* 내용 */}
</div>
```

#### Planet Card
```tsx
<div className="
  p-8
  bg-space-dark
  border border-ui-border
  rounded-3xl
  hover:border-planet-jupiter
  hover:shadow-glow
  transition-all duration-300
">
  <div className="text-planet-jupiter text-5xl mb-4">🪐</div>
  <h3 className="font-display text-2xl font-semibold mb-2">목성</h3>
  <p className="text-text-secondary">木 - 성장과 확장</p>
</div>
```

### Input

```tsx
<input
  type="text"
  className="
    w-full px-4 py-3
    bg-space-dark
    border border-ui-border
    rounded-xl
    text-text-primary
    placeholder:text-text-tertiary
    focus:border-star-gold focus:ring-2 focus:ring-star-gold/20
    transition-all duration-150
  "
  placeholder="이름을 입력하세요"
/>
```

---

## 접근성

### 색상 대비
- **WCAG AA 기준**: 텍스트 4.5:1, 큰 텍스트 3:1
- **배경 vs 텍스트**: `space-black` + `text-primary` = 21:1 ✅
- **버튼**: `star-gold` + `space-black` = 13.5:1 ✅

### Keyboard Navigation
- 모든 interactive 요소 focus-visible 스타일
- Tab 순서 논리적
- Escape key로 모달 닫기

### Screen Reader
- `alt` 속성 모든 이미지에 추가
- ARIA labels 모든 버튼/링크
- Semantic HTML (`<nav>`, `<main>`, `<article>`)

---

## 다음 단계

### Phase R2: 3D 우주 엔진
- [ ] Three.js 환경 설정
- [ ] 9개 행성 3D 모델
- [ ] 태양계 orbital system
- [ ] 인터랙션 (클릭, 호버)

### Phase R3: 로딩 애니메이션
- [ ] 3D 행성 로딩 씬
- [ ] Progress bar
- [ ] AI 분석 메시지

### Phase R4: 텍스트 리브랜딩
- [ ] 모든 "sajuwooju" → "sajuwooju" 교체
- [ ] UI 카피 업데이트

---

**생성일**: 2025-11-08
**버전**: 1.0.0
**상태**: ✅ Phase R1 Complete
