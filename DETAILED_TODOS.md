# 사주우주 상세 작업 TODO 리스트
## Sajuwooju-v2 통합 개발 실행 계획

**작성일**: 2025-11-08
**기반**: INTEGRATION_PLAN.md
**상태**: 실행 중

---

## 📋 Phase 1: Stats Section 추가 (2-3시간)

### ✅ 1.1 StatsSection 컴포넌트 생성
- [ ] 파일 생성: `components/landing/stats-section.tsx`
- [ ] TypeScript 인터페이스 정의
- [ ] Countup 로직 구현
- [ ] IntersectionObserver 설정
- [ ] Glassmorphism 카드 UI

**상세 작업**:
```typescript
// 1. 컴포넌트 구조
- StatsSection 메인 컴포넌트
- StatCard 서브 컴포넌트
- useCountup 커스텀 훅

// 2. 데이터 구조
interface StatItem {
  id: string;
  label: string;
  target: number;
  gradient: string;
  glowColor: string;
}

// 3. 애니메이션
- Countup: 0 → target (2초)
- IntersectionObserver threshold: 0.5
- Easing: linear
```

### ✅ 1.2 Stars Background CSS 추가
- [ ] `app/globals.css`에 stars-background 클래스 추가
- [ ] Radial-gradient 별 패턴 (5개 레이어)
- [ ] ::before pseudo-element (3개 추가 레이어)
- [ ] Twinkle animation (3s ease-in-out infinite)

**CSS 코드**:
```css
.stars-background {
  position: absolute;
  background-image: 5 radial-gradient layers;
  animation: twinkle 3s ease-in-out infinite;
}

.stars-background::before {
  content: '';
  background-image: 3 additional layers;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```

### ✅ 1.3 cosmic-landing.tsx에 통합
- [ ] StatsSection import
- [ ] Hero section 아래에 배치
- [ ] Scroll behavior 확인
- [ ] z-index 계층 검증

**파일 수정**: `components/landing/cosmic-landing.tsx`
```typescript
import { StatsSection } from './stats-section';

export function CosmicLanding() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Hero Section (existing) */}
      <HeroSection />

      {/* Stats Section (NEW) */}
      <StatsSection />
    </div>
  );
}
```

---

## 📋 Phase 2: 텍스트 배치 미세 조정 (30분-1시간)

### ✅ 2.1 cosmic-landing.tsx 텍스트 위치 검토
- [ ] 현재 .hero-top, .hero-bottom 위치 확인
- [ ] landing-premium.html과 비교
- [ ] 3D 애니메이션 가림 여부 체크

### ✅ 2.2 CSS 미세 조정
- [ ] Safe area inset 고려 (iOS notch)
- [ ] Glassmorphism 효과 검증
- [ ] 모바일/데스크톱 반응형 확인

**CSS 조정**:
```css
.hero-top {
  padding-top: calc(env(safe-area-inset-top) + 3rem);
}

.hero-bottom {
  bottom: calc(env(safe-area-inset-bottom) + 4rem);
}
```

---

## 📋 Phase 3: 테스트 및 검증 (1-2시간)

### ✅ 3.1 기능 테스트
- [ ] NASA급 텍스처 로드 확인
- [ ] Big Bang 트랜지션 동작 (4 phases)
- [ ] Stats section countup 애니메이션
- [ ] /main 리디렉션 동작
- [ ] Scroll 동작 (hero → stats)

### ✅ 3.2 성능 테스트
- [ ] Lighthouse Performance > 90
- [ ] 3D 렌더링 60fps (desktop)
- [ ] 3D 렌더링 30fps (mobile)
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms

### ✅ 3.3 반응형 테스트
- [ ] Desktop 1920x1080
- [ ] Desktop 1366x768
- [ ] Tablet 768x1024 (iPad)
- [ ] Mobile 375x667 (iPhone SE)
- [ ] Mobile 390x844 (iPhone 12)

### ✅ 3.4 브라우저 테스트
- [ ] Chrome (Desktop/Mobile)
- [ ] Safari (Desktop/Mobile)
- [ ] Firefox (Desktop)
- [ ] Edge (Desktop)

---

## 📋 Phase 4: 로그인 시스템 (3-4시간) - 추후

### 4.1 카카오 로그인 설정
- [ ] Kakao Developers 앱 생성
- [ ] JavaScript 키 발급
- [ ] Redirect URI 설정
- [ ] 동의 항목 설정

### 4.2 로그인 컴포넌트
- [ ] `components/auth/kakao-login.tsx` 생성
- [ ] Kakao SDK 로드
- [ ] 로그인/로그아웃 로직
- [ ] 사용자 정보 가져오기

### 4.3 AuthContext 생성
- [ ] `contexts/auth-context.tsx`
- [ ] useAuth hook
- [ ] Token storage (LocalStorage)
- [ ] Session management

---

## 📋 Phase 5: 사주 입력 폼 (4-5시간) - 추후

### 5.1 DatePicker 컴포넌트
- [ ] `components/ui/date-picker.tsx`
- [ ] Calendar UI
- [ ] 양력/음력 토글
- [ ] lunar-javascript 라이브러리

### 5.2 SajuInputForm
- [ ] `components/saju/input-form.tsx`
- [ ] 이름, 생년월일, 시간, 성별
- [ ] Validation (react-hook-form + zod)
- [ ] 에러 메시지

---

## 📋 Phase 6: OpenAI API 통합 (5-6시간) - 추후

### 6.1 API Route 생성
- [ ] `app/api/analyze-saju/route.ts`
- [ ] OpenAI GPT-4 연동
- [ ] 프롬프트 템플릿 설계
- [ ] Rate limiting

### 6.2 Loading Scene
- [ ] 3D 로딩 애니메이션
- [ ] 16단계 분석 메시지
- [ ] Progress bar

---

## 📋 Phase 7: 사주 분석 결과 (4-5시간) - 추후

### 7.1 결과 페이지
- [ ] `app/result/[sessionId]/page.tsx`
- [ ] 사주판 UI (4기둥)
- [ ] 12가지 운세 분야 표시
- [ ] 오행 색상 코딩

### 7.2 공유 기능
- [ ] 카카오톡 공유
- [ ] 링크 복사
- [ ] 이미지 생성 (html2canvas)

---

## 🎯 즉시 실행 항목 (Phase 1)

### Task 1: StatsSection 컴포넌트 생성 ⏳
**파일**: `components/landing/stats-section.tsx`
**예상 시간**: 1시간

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';

interface StatItem {
  id: string;
  label: string;
  target: number;
  gradient: string;
  glowRgb: string;
}

const STATS: StatItem[] = [
  {
    id: 'wealth',
    label: '재물운',
    target: 127543,
    gradient: 'from-amber-500 to-orange-600',
    glowRgb: '245, 158, 11',
  },
  {
    id: 'compatibility',
    label: '궁합',
    target: 89267,
    gradient: 'from-pink-500 to-rose-600',
    glowRgb: '236, 72, 153',
  },
  {
    id: 'reunion',
    label: '재회운',
    target: 203891,
    gradient: 'from-violet-500 to-purple-600',
    glowRgb: '139, 92, 246',
  },
];

export function StatsSection() {
  // Implementation...
}
```

### Task 2: CSS Stars Background 추가 ⏳
**파일**: `app/globals.css`
**예상 시간**: 30분

### Task 3: cosmic-landing.tsx 통합 ⏳
**파일**: `components/landing/cosmic-landing.tsx`
**예상 시간**: 30분

---

## 📊 진행 상황 추적

### 완료 ✅
- [x] INTEGRATION_PLAN.md 작성
- [x] DETAILED_TODOS.md 작성

### 진행 중 🔄
- [ ] StatsSection 컴포넌트 생성
- [ ] Stars background CSS
- [ ] cosmic-landing.tsx 통합

### 대기 중 ⏳
- [ ] 텍스트 배치 조정
- [ ] 테스트 및 검증
- [ ] 로그인 시스템
- [ ] 사주 입력 폼
- [ ] OpenAI API 통합
- [ ] 결과 페이지

---

## 🚀 다음 3시간 실행 계획

### Hour 1: StatsSection 컴포넌트
1. `components/landing/stats-section.tsx` 생성
2. TypeScript 타입 정의
3. Countup 로직 구현
4. Glassmorphism UI

### Hour 2: CSS & 통합
1. `app/globals.css` stars-background 추가
2. `cosmic-landing.tsx`에 통합
3. Scroll behavior 확인

### Hour 3: 테스트
1. 로컬 dev 서버 실행
2. 기능 테스트 (countup, scroll, stars)
3. 반응형 테스트 (mobile/desktop)
4. Lighthouse 성능 측정

---

**작성자**: Claude
**최종 업데이트**: 2025-11-08 22:30
**상태**: Phase 1 시작 준비 완료 ✅
