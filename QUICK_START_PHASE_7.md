# Phase 7 빠른 시작 가이드
**즉시 시작 가능 - 사용자 개입 불필요**

## 오늘 시작하기 (Day 1 - 6-8시간)

### 시작 전 준비
```bash
cd d:/saju/sajuwooju-v2
npm install
npm run dev
# 서버: http://localhost:3000 (또는 다른 포트)
```

### 1일차 작업 (7시간)

#### 오전 (3시간) - Product Card Hover
1. **분석** (30분)
   ```bash
   # Playwright로 원본 사이트 hover 효과 측정
   node scripts/detect-hover-effects.js
   ```

2. **구현** (2.5시간)
   - 파일 열기: `components/product-card.tsx`
   - Hover 효과 추가:
     ```tsx
     // Scale transform
     className="transition-transform duration-300 hover:scale-[1.02]"
     
     // Box shadow
     className="shadow-sm hover:shadow-md transition-shadow duration-300"
     ```
   - 60fps 확인 (DevTools Performance 탭)

#### 점심 후 (2시간) - Category Icons
3. **Category Hover** (2시간)
   - 파일: `app/page.tsx` (category section)
   - 구현:
     ```tsx
     // Category icon wrapper
     <div className="transition-all duration-200 
                     hover:scale-110 hover:opacity-90
                     focus:outline focus:outline-2 focus:outline-primary">
     ```
   - ARIA labels 추가:
     ```tsx
     <div role="button" 
          aria-label={`${cat.label} 카테고리 보기`}
          tabIndex={0}>
     ```

#### 오후 (2시간) - Button 인터랙션
4. **All Buttons** (2시간)
   - 파일: `components/ui/button.tsx`
   - Hover/Active/Focus states:
     ```tsx
     // Hover
     hover:bg-primary-dark
     
     // Active
     active:scale-98
     
     // Focus
     focus:ring-2 focus:ring-primary focus:ring-offset-2
     ```

### 검증 체크리스트
```bash
# 브라우저 확인
- [ ] Product Card hover 시 scale/shadow 변화
- [ ] Category icon hover 시 scale 변화
- [ ] 모든 버튼에 hover 피드백
- [ ] 키보드 Tab으로 focus 이동 가능
- [ ] 60fps 유지 (DevTools Performance)
```

---

## 2일차 작업 (7시간)

### Scroll Animation + Modal

#### 오전 (3시간) - Scroll Animation 정밀화
```bash
# 파일: hooks/use-scroll-animation.ts
```

개선 사항:
- Stagger animation 추가
- 다양한 variant (fade, slide, scale)
- Passive listener

#### 오후 (4시간) - Modal 시스템
```bash
# 신규 파일 생성
touch components/ui/modal.tsx
touch components/ui/overlay.tsx
```

구현:
- Backdrop blur
- Focus trap
- ESC/Click outside close
- Slide-up (mobile), Fade-in (desktop)

---

## 3일차 작업 (7시간)

### Toast + Loading

#### Toast System (3시간)
```bash
touch components/ui/toast.tsx
touch contexts/toast-context.tsx
```

#### Skeleton Loading (3시간)
```bash
touch components/ui/skeleton.tsx
touch app/loading.tsx
touch app/products/[id]/loading.tsx
```

#### Progress Indicators (1시간)
```bash
touch components/ui/progress.tsx
touch components/ui/spinner.tsx
```

---

## 4일차 작업 (4시간)

### Touch Gestures + 최종 검증

#### Swipe 개선 (3시간)
- Hero Slider momentum scrolling
- Snap points 정밀화

#### 최종 검증 (1시간)
```bash
# Lighthouse 실행
npm run build
npm run start

# Chrome DevTools > Lighthouse
# 목표: Performance > 90, Accessibility > 95
```

---

## 도움말

### 파일 구조
```
components/
  ui/
    button.tsx          ← 수정
    modal.tsx           ← 신규
    overlay.tsx         ← 신규
    toast.tsx           ← 신규
    skeleton.tsx        ← 신규
    progress.tsx        ← 신규
    spinner.tsx         ← 신규
  product-card.tsx      ← 수정
  hero-slider.tsx       ← 수정

contexts/
  toast-context.tsx     ← 신규

hooks/
  use-scroll-animation.ts  ← 수정

app/
  page.tsx              ← 수정
  loading.tsx           ← 신규
  globals.css           ← 수정
```

### 유용한 명령어
```bash
# 개발 서버
npm run dev

# 타입 체크
npm run type-check

# Lint
npm run lint

# Build (Lighthouse 전)
npm run build
npm run start
```

### 디버깅
```javascript
// 60fps 확인
console.log(performance.now());

// Animation 측정
element.addEventListener('transitionend', (e) => {
  console.log('Transition ended:', e.propertyName);
});

// Intersection Observer 디버깅
observer.observe(element);
console.log('Observing:', element);
```

### 참고 문서
- Tailwind CSS Transitions: https://tailwindcss.com/docs/transition-property
- MDN Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- React Portal: https://react.dev/reference/react-dom/createPortal
- Lighthouse: https://developer.chrome.com/docs/lighthouse

---

## 문제 해결

### hover 효과가 안 보여요
- `transition-*` 클래스 추가 확인
- GPU acceleration: `will-change-transform` 추가
- 브라우저 캐시 삭제

### 애니메이션이 끊겨요
- DevTools Performance 탭 확인
- `requestAnimationFrame` 사용 고려
- 너무 많은 요소 동시 애니메이션 피하기

### TypeScript 에러
```bash
npm run type-check
# 에러 확인 후 타입 수정
```

### ESLint 에러
```bash
npm run lint
# Auto-fix 시도
npm run lint -- --fix
```

---

## 성공 기준

Phase 7 완료 시:
- [ ] 모든 hover 효과 원본과 동일
- [ ] 스크롤 애니메이션 60fps
- [ ] Modal 접근성 100%
- [ ] Toast 시스템 동작
- [ ] Skeleton loading 모든 페이지
- [ ] Swipe gesture 자연스러움
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95

---

**Phase 7 완료 후**: Phase 8 시작 (데이터 & 기능)

자세한 내용: `PHASE_7_11_MASTER_PLAN.md` 참고
