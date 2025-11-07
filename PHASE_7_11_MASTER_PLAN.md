# Phase 7-11 Master Plan
원본 사이트 https://sajutight.me 100% 완벽 복제

생성일: 2025-11-06

## 현재 상태 (Phase 1-6 완료)
- 정적 페이지 100% 복제
- 제품 12개, 카테고리 11개 정확 복제
- 시각적 정확도 102%
- 모든 페이지 200 OK
- 반응형 디자인 완료

## 전체 일정

| Phase | 작업 | 예상 | 우선순위 |
|-------|------|------|---------|
| Phase 7 | 인터랙티브 기능 | 3-4일 | High |
| Phase 8 | 데이터 & 기능 | 3-4일 | High |
| Phase 9 | 성능 & SEO | 2-3일 | High |
| Phase 10 | 프로덕션 준비 | 2-3일 | High |
| Phase 11 | 로그인 (선택) | 2-3일 | Medium |
| 총계 | | 12-17일 | |

---

# Phase 7: 인터랙티브 기능 고도화 (3-4일)

## 목표
- 원본 동일한 인터랙션
- 애니메이션 정밀 복제
- 터치/마우스 완성
- 로딩 상태 구현
- 접근성 개선

## 세부 작업

### 7.1 Hover Effects (7시간)
**Product Card**:
- Playwright hover 측정
- Scale 1.0 → 1.02
- Shadow elevation
- 60fps 유지

**Category Icons**:
- Scale 1.0 → 1.1
- Opacity 변화
- Keyboard navigation
- ARIA labels

**Buttons**:
- Hover/Active/Focus states
- Ripple effect

파일: product-card.tsx, button.tsx, globals.css

### 7.2 Scroll Animations (3시간)
- useScrollAnimation 튜닝
- Stagger animation
- Fade/Slide/Scale variants
- Passive listener 최적화

파일: use-scroll-animation.ts, globals.css

### 7.3 Modal & Overlay (7시간)
**Modal**:
- Backdrop blur
- Slide-up/Fade-in
- Focus trap
- ESC/Click outside close

**Toast**:
- 4 variants
- Auto-dismiss
- Stack toasts

파일: modal.tsx, overlay.tsx, toast.tsx, toast-context.tsx (신규)

### 7.4 Loading States (5시간)
**Skeleton**:
- Shimmer animation
- Card/Text/Circle variants
- Suspense 활용

**Progress**:
- Top bar indicator
- Button loading
- Spinner

파일: skeleton.tsx, progress.tsx, spinner.tsx, loading.tsx (신규)

### 7.5 Touch Gestures (3시간)
- Hero slider swipe 개선
- Momentum scrolling
- Snap points

파일: hero-slider.tsx

## 산출물
신규 10개, 수정 7개 파일

## 검증
- Lighthouse Performance > 90
- Accessibility > 95
- 60fps 애니메이션
- WCAG 2.1 AA

---

# Phase 8: 데이터 & 기능 완성도 (3-4일)

## 목표
- 사주 계산 로직 (mock)
- 폼 제출 플로우
- CTA 버튼 동작
- 상태 관리
- API 구조 (mock)

## 세부 작업

### 8.1 사주 입력 폼 (7시간)
**DatePicker**:
- Calendar UI
- 음력 변환
- 시간 입력
- 성별 선택

**Validation**:
- 실시간 검증
- 에러 표시
- Toast notification

파일: date-picker.tsx, calendar.tsx, saju-input-form.tsx, lunar-calendar.ts, validation.ts (신규)

### 8.2 사주 계산 (11시간)
**계산 엔진**:
- 천간지지 알고리즘
- Mock 운세 데이터
- 타입 정의

**결과 페이지**:
- /result/[sessionId]
- 사주판 UI
- 운세 표시
- 공유 기능

파일: saju-calculator.ts, types/saju.ts, mock-fortunes.ts, result page, saju-result-display.tsx (신규)

### 8.3 CTA & Flow (7시간)
**CTA 연결**:
- Product Card 버튼
- 상세 페이지 버튼
- Event 배너

**상담 Flow**:
- 4단계 (선택→입력→계산→결과)
- Progress indicator
- 상태 저장

파일: consult page, step-1~4.tsx (신규)

### 8.4 상태 관리 (5시간)
- ConsultContext
- Local Storage persistence
- TypeScript types

파일: consult-context.tsx, storage.ts, use-local-storage.ts (신규)

### 8.5 API (3시간)
- POST /api/calculate-saju
- GET /api/result/[sessionId]
- Mock 응답

파일: API routes (신규)

## 산출물
신규 20개+ 파일

## Dependencies
```
lunar-javascript, html2canvas, uuid
```

## 검증
- 전체 플로우 동작
- Validation 정확
- 에러 처리 완벽

---

# Phase 9: 성능 & SEO 최적화 (2-3일)

## 목표
- Lighthouse 100점
- Image 최적화
- Font 최적화
- Meta tags 완성
- Core Web Vitals

## 세부 작업

### 9.1 Image 최적화 (7시간)
- next/image 전환
- width/height 명시
- priority 설정
- sizes 속성
- blur placeholder

파일: 모든 이미지 컴포넌트

### 9.2 Font 최적화 (3시간)
- Self-hosted fonts
- Preload 설정
- font-display: swap

파일: globals.css, layout.tsx, public/fonts

### 9.3 Code Splitting (4시간)
- Dynamic imports
- Bundle analyzer
- Tree-shaking

파일: next.config.js

### 9.4 SEO (9시간)
**Meta Tags**:
- 모든 페이지 metadata
- OG tags
- Twitter cards

**Structured Data**:
- Product schema
- Organization schema
- BreadcrumbList

**Sitemap**:
- sitemap.xml 동적 생성
- robots.txt

파일: layout.tsx, page metadata, sitemap.ts (신규)

### 9.5 Core Web Vitals (6시간)
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

파일: 최적화 대상 컴포넌트

### 9.6 Accessibility (9시간)
- ARIA labels
- Semantic HTML
- Keyboard navigation
- Color contrast
- Screen reader 테스트

파일: 모든 컴포넌트

## 산출물
수정 다수, 신규 sitemap.ts, og-image.jpg

## 검증
- Lighthouse 100/100/100/100
- Core Web Vitals Green
- WCAG 2.1 AA

---

# Phase 10: 프로덕션 준비 (2-3일)

## 목표
- Build 최적화
- 에러 처리
- 환경 변수
- 로깅/모니터링
- 배포

## 세부 작업

### 10.1 Build (7시간)
- Production build 검증
- TypeScript strict
- ESLint + Prettier
- Pre-commit hook (Husky)

파일: tsconfig.json, .eslintrc, .prettierrc

### 10.2 Error Handling (6시간)
- Error Boundaries
- 404 pages
- API error handling

파일: error.tsx, not-found.tsx, api-client.ts (신규)

### 10.3 환경 변수 (2시간)
- .env.local 설정
- .env.example 생성
- Feature flags

파일: .env.example, feature-flags.ts (신규)

### 10.4 Logging (4시간)
- Console wrapper
- Error tracking 준비 (Sentry)
- Analytics (GA4)

파일: logger.ts, analytics.ts (신규)

### 10.5 배포 (6시간)
- Vercel 배포 설정
- 환경 변수 설정
- Security headers
- Performance check

파일: vercel.json, next.config.js (headers)

### 10.6 문서화 (5시간)
- README.md
- ARCHITECTURE.md
- DEPLOYMENT.md
- CHANGELOG.md

## 산출물
신규 10개 파일, 문서 4개

## 검증
- Clean build
- 모든 에러 처리
- Vercel 배포 성공

---

# Phase 11: 로그인 기능 (선택, 2-3일)

**주의**: 사용자 개입 필요

## 목표
- 카카오 로그인 분석
- OAuth 구현
- 세션 관리
- 로그인 후 페이지
- Protected routes

## 세부 작업

### 11.1 분석 (4시간, 사용자 협조 필요)
- 원본 사이트 카카오 로그인 플로우 캡처
- 로그인 후 UI 변화 분석
- API 호출 확인

### 11.2 카카오 로그인 (5시간)
- Kakao SDK 통합
- 로그인/로그아웃 구현
- TypeScript types

파일: kakao.ts, login-button.tsx (신규)

### 11.3 세션 관리 (6시간)
- AuthContext
- Token storage
- Protected routes

파일: auth-context.tsx, auth-storage.ts, protected-route.tsx (신규)

### 11.4 로그인 후 페이지 (7시간)
- Header 변경
- 마이 페이지
- 상담 내역

파일: my/page.tsx, my/consultations/page.tsx (신규)

### 11.5 연동 기능 (6시간, optional)
- 상담 결과 저장 (사용자별)
- 찜하기/즐겨찾기

파일: save-consultation/route.ts, my/favorites/page.tsx (신규)

## 산출물
신규 15개 파일

## Dependencies
```
Kakao Developers 계정, App Key 필요
```

## 검증
- 로그인/로그아웃 동작
- 세션 유지
- Protected routes 동작

---

# 빠른 시작 가이드

## 즉시 시작 (Phase 7 - Day 1)
1. Product Card hover 분석 및 구현 (3h)
2. Category Icon 인터랙션 (2h)
3. Button 인터랙션 (2h)

## 우선순위
**High** (필수): Phase 7, 8, 9, 10  
**Medium** (권장): Phase 11  
**Low** (선택): Phase 11 고급 기능

## 성공 지표
- Lighthouse: 100/100/100/100
- Core Web Vitals: All Green
- Build: Clean, no errors
- 기능: 전체 플로우 동작

---

# 상세 문서

각 Phase별 상세 내용:
- docs/phases/PHASE_7_INTERACTIVE.md (생성 완료)
- docs/phases/PHASE_8_FUNCTIONALITY.md (참고: 본 문서)
- docs/phases/PHASE_9_PERFORMANCE.md (참고: 본 문서)
- docs/phases/PHASE_10_PRODUCTION.md (참고: 본 문서)
- docs/phases/PHASE_11_LOGIN.md (참고: 본 문서)

---

생성일: 2025-11-06  
최종 업데이트: 2025-11-06  
상태: Ready to start Phase 7

다음 단계: Phase 7 시작 (인터랙티브 기능 고도화)
