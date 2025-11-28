# 사주우주 통합 개발 계획서
## Sajuwooju-v2 기반 프로젝트 진행 로드맵

**작성일**: 2025-11-08
**기반 프로젝트**: sajuwooju-v2 (Vercel 배포 완료)
**목표**: 기존 NASA급 에셋과 기능을 보존하며 신규 요구사항 적용

---

## 📋 현재 상태 분석

### ✅ 이미 완료된 기능 (보존 필수)

#### 1. NASA급 3D 태양계 시스템
**파일 위치**:
- `components/3d/SolarSystem.tsx` - 완전한 태양계 시스템
- `components/3d/EnhancedPlanet.tsx` - 포토리얼리스틱 행성
- `components/3d/EnhancedSun.tsx` - 고급 태양 (코로나 + 플레어)
- `components/3d/Earth.tsx` - 지구 (Day/Night 셰이더 + 구름)
- `components/3d/Saturn.tsx` - 토성 (고리 텍스처)
- `components/3d/PhotorealisticSun.tsx` - 포토리얼리스틱 태양

**텍스처**:
- `public/textures/` - NASA급 포토리얼리스틱 텍스처
  - sun.jpg, mercury.jpg, venus.jpg, earth.jpg, earthNight.jpg, earthClouds.jpg
  - mars.jpg, jupiter.jpg, saturn.jpg, saturnRing.png
  - uranus.jpg, neptune.jpg

**기능**:
- 9개 행성 (수금지화목토천해명) + 태양
- 음양오행 매핑 (水金土火木)
- 실시간 공전/자전 애니메이션
- 포토리얼리스틱 텍스처 적용
- 대기권 글로우 효과
- 토성 고리 투명 텍스처

#### 2. Big Bang 트랜지션 효과
**파일 위치**:
- `components/landing/cosmic-landing.tsx` - 완전한 Big Bang 구현

**효과**:
- **Phase 1** (0-800ms): 초고속 행성 회전
- **Phase 2** (400-800ms): 태양 밝기 급격 증가
- **Phase 3** (800ms): 하얀 폭발 효과 (expanding circle)
- **Phase 4** (1500ms): `/main`으로 리디렉션

**CSS**:
```css
.big-bang-overlay: radial-gradient white explosion
.expanding-circle: 10px → 200vmax scale animation
cubic-bezier(0.4, 0, 0.2, 1) easing
```

#### 3. 랜딩 페이지 구조
**파일 위치**:
- `app/page.tsx` - 루트 페이지 (CosmicLanding 렌더링)
- `components/landing/cosmic-landing.tsx` - 우주 랜딩 컴포넌트

**구성**:
- Full-screen 3D 태양계
- "사주우주" 로고 (glassmorphism)
- "우주의 법칙으로 읽는 나의 운명" 태그라인
- CTA 버튼: "태양계를 클릭하세요"
- Scroll indicator (bounce animation)

#### 4. 메인 페이지 (Post-Landing)
**파일 위치**:
- `app/main/page.tsx` - 비로그인 메인 페이지

**구성**:
- MobileAppLayout (상단 헤더 + 하단 네비게이션)
- 6가지 사주 서비스 카테고리 (음양오행 기반)
  - 연애운 (火), 재물운 (金), 직업운 (木)
  - 궁합 (水), 연운 (土), 종합분석 (五行)
- Premium glassmorphism cards
- Gradient system
- Lucide icons

#### 5. 디자인 시스템
**파일 위치**:
- `app/globals-wooju.css` - 우주 테마 CSS
- `tailwind.config-wooju.ts` - Tailwind 우주 설정

**컬러 팔레트**:
```css
--space-black: #0A0E27
--star-gold: #FFD700
--cosmic-purple: #7B68EE
--nebula-pink: #FF6EC7
--aurora-green: #00FFB3
```

**폰트**:
- Space Grotesk (Display)
- Pretendard Variable (Body)
- Ownglyph Saehayan (Decorative)

**애니메이션**:
- twinkle (별 반짝임)
- orbit (행성 공전)
- nebula-pulse (성운 펄스)
- glow-pulse (글로우 펄스)

---

## 🎯 신규 요구사항 (landing-premium.html 기반)

### 1. 통계 섹션 추가 (Stats Section)
**요구사항**:
- "많은 분들이 경험하셨습니다" 제목
- 3가지 통계 카운트업 애니메이션
  - 재물운: 127,543+
  - 궁합: 89,267+
  - 재회운: 203,891+
- 우주 배경 (별 패턴 with twinkle animation)
- Glassmorphism 카드 디자인

**통합 방법**:
- `components/landing/cosmic-landing.tsx`에 stats section 추가
- 또는 별도 컴포넌트 `components/landing/stats-section.tsx` 생성
- Scroll observer로 viewport 진입 시 카운트업 시작

### 2. 개선된 텍스트 배치
**요구사항**:
- 로고와 태그라인이 3D 애니메이션을 가리지 않도록 배치
- 상단: 로고 + 태그라인 (glassmorphism)
- 하단: CTA 버튼

**통합 방법**:
- 이미 `cosmic-landing.tsx`에 구현됨
- 위치 미세 조정 필요 시 CSS 수정

---

## 📁 프로젝트 구조 (통합 후)

```
sajuwooju-v2/
├── app/
│   ├── page.tsx                    # ✅ 루트 (CosmicLanding)
│   ├── main/
│   │   └── page.tsx               # ✅ 비로그인 메인
│   ├── globals.css                # ✅ Global styles
│   └── layout.tsx                 # ✅ Root layout
│
├── components/
│   ├── 3d/                        # ✅ NASA급 3D 컴포넌트
│   │   ├── SolarSystem.tsx       # ✅ 완전한 태양계
│   │   ├── EnhancedPlanet.tsx    # ✅ 포토리얼리스틱 행성
│   │   ├── EnhancedSun.tsx       # ✅ 고급 태양
│   │   ├── Earth.tsx             # ✅ 지구 (Day/Night)
│   │   ├── Saturn.tsx            # ✅ 토성 (링)
│   │   ├── PhotorealisticSun.tsx # ✅ 포토리얼리스틱 태양
│   │   └── SpaceCanvas.tsx       # ✅ Three.js Canvas
│   │
│   ├── landing/
│   │   ├── cosmic-landing.tsx    # ✅ Big Bang 트랜지션
│   │   └── stats-section.tsx     # 🆕 통계 섹션 (추가 예정)
│   │
│   └── layout/
│       └── MobileAppLayout.tsx   # ✅ 모바일 레이아웃
│
├── public/
│   └── textures/                  # ✅ NASA급 텍스처
│       ├── sun.jpg
│       ├── mercury.jpg ~ neptune.jpg
│       └── saturnRing.png
│
├── lib/
│   ├── planets-data.ts           # ✅ 9개 행성 데이터
│   ├── planet-textures.ts        # ✅ 텍스처 설정
│   └── loading-messages.ts       # ✅ 로딩 메시지
│
└── hooks/
    └── use-planet-textures.ts    # ✅ 텍스처 로더
```

---

## 🚀 통합 작업 단계

### Phase 1: Stats Section 추가 (2시간)
**목표**: landing-premium.html의 통계 섹션을 cosmic-landing.tsx에 통합

#### 1.1 StatsSection 컴포넌트 생성
```typescript
// components/landing/stats-section.tsx
'use client';

export function StatsSection() {
  // Countup logic
  // Stars background
  // Glassmorphism cards
}
```

#### 1.2 cosmic-landing.tsx에 통합
```typescript
<CosmicLanding>
  {/* Hero section (existing) */}
  {/* Stats section (NEW) */}
  <StatsSection />
</CosmicLanding>
```

#### 1.3 CSS 스타일 추가
- Stars background with twinkle animation
- Glassmorphism stat cards
- Countup animation

**검증**:
- [ ] Scroll 시 히어로 → 통계 섹션으로 정상 전환
- [ ] 별 배경 보임 (태양계는 안보임)
- [ ] Countup 애니메이션 동작
- [ ] Glassmorphism 효과 적용

---

### Phase 2: 텍스트 배치 미세 조정 (1시간)
**목표**: 로고/태그라인이 3D 애니메이션을 가리지 않도록 최적화

#### 2.1 위치 검토
- 현재 cosmic-landing.tsx의 텍스트 위치 확인
- landing-premium.html과 비교

#### 2.2 CSS 조정
```css
.hero-top {
  top: 3rem; /* 필요시 조정 */
}

.hero-bottom {
  bottom: 4rem; /* 필요시 조정 */
}
```

**검증**:
- [ ] 텍스트가 태양계를 가리지 않음
- [ ] 모바일/데스크톱 모두 확인
- [ ] Safe area 고려 (iOS notch)

---

### Phase 3: 테스트 및 검증 (2시간)
**목표**: 모든 기능이 정상 작동하는지 확인

#### 3.1 기능 테스트
- [ ] NASA급 텍스처 로드 확인
- [ ] Big Bang 트랜지션 동작
- [ ] 통계 섹션 카운트업
- [ ] /main 리디렉션
- [ ] 메인 페이지 서비스 카드

#### 3.2 성능 테스트
- [ ] Lighthouse Performance > 90
- [ ] 3D 렌더링 60fps
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

#### 3.3 반응형 테스트
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] iOS Safari
- [ ] Android Chrome

---

## 📝 작업 우선순위

### High Priority (즉시 진행)
1. ✅ Stats Section 컴포넌트 생성
2. ✅ cosmic-landing.tsx에 통합
3. ✅ 텍스트 배치 조정
4. ✅ 테스트 및 검증

### Medium Priority (다음 단계)
5. 로그인 페이지 (카카오 로그인)
6. 사주 입력 폼 (음력 변환)
7. OpenAI API 통합
8. 사주 분석 결과 페이지

### Low Priority (추후)
9. 마이 페이지
10. 상담 내역
11. 결제 시스템
12. 푸시 알림

---

## 🛡️ 보존 필수 항목 (절대 수정 금지)

### 1. NASA급 3D 에셋
- `public/textures/` 모든 파일
- `components/3d/` 모든 컴포넌트
- `lib/planet-textures.ts`

### 2. Big Bang 트랜지션
- `components/landing/cosmic-landing.tsx` 의 트랜지션 로직
- Phase 1~4 타이밍
- expanding-circle animation

### 3. 디자인 시스템
- `app/globals-wooju.css` 우주 테마
- `tailwind.config-wooju.ts` 컬러 팔레트
- 폰트 설정 (Space Grotesk, Pretendard)

### 4. 행성 데이터
- `lib/planets-data.ts` 음양오행 매핑
- 9개 행성 설정 (반경, 속도, 색상)

---

## 🔧 개발 환경 설정

### 필수 환경 변수
```bash
# .env.local (생성 필요)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=your_key_here  # Phase 6에서 필요
KAKAO_APP_KEY=your_key_here   # Phase 5에서 필요
```

### 개발 서버 실행
```bash
cd sajuwooju-v2
npm install
npm run dev
```

### 빌드 및 프리뷰
```bash
npm run build
npm run start
```

### Vercel 배포
```bash
vercel --prod
```

---

## 📊 진행 상황 추적

### 완료된 작업 ✅
- [x] Phase R1: 디자인 시스템
- [x] Phase R2: 3D 엔진
- [x] Phase R3: 로딩 애니메이션
- [x] Phase R4: 텍스트 리브랜딩
- [x] Phase R5: UI 컴포넌트
- [x] NASA급 텍스처 적용
- [x] Big Bang 트랜지션
- [x] 랜딩 페이지 기본 구조
- [x] 메인 페이지 구조

### 진행 중 🔄
- [x] Stats Section 통합 ✅ (2025-11-08 완료)
  - [x] StatsSection 컴포넌트 생성 (components/landing/stats-section.tsx)
  - [x] Stars Background CSS 추가 (app/globals.css)
  - [x] cosmic-landing.tsx에 통합 완료
- [ ] 텍스트 배치 최적화
- [ ] 로컬 테스트 및 검증

### 예정 📅
- [ ] 로그인 시스템
- [ ] 사주 입력 폼
- [ ] OpenAI API 통합
- [ ] 사주 분석 결과

---

## 🎯 최종 목표

### 기술 목표
- **Performance**: Lighthouse 100점
- **Accessibility**: WCAG 2.1 AA
- **SEO**: Meta tags 완성
- **Mobile**: PWA 지원

### 비즈니스 목표
- **User Experience**: 우주 테마 일관성
- **Conversion**: Clear CTA flow
- **Engagement**: Interactive 3D
- **Retention**: AI 분석 가치

---

## 📞 다음 단계

1. **Stats Section 컴포넌트 생성**
   - `components/landing/stats-section.tsx` 작성
   - Countup 로직 구현
   - Stars background CSS

2. **cosmic-landing.tsx 통합**
   - Stats section 추가
   - Scroll behavior 확인
   - 반응형 레이아웃

3. **테스트 및 배포**
   - 로컬 테스트 (npm run dev)
   - Vercel 프리뷰 배포
   - 프로덕션 배포

---

**작성자**: Claude
**최종 업데이트**: 2025-11-08
**상태**: 준비 완료 ✅
