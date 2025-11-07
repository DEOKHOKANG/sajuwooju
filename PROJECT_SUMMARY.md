# 사주우주 v2.0 - 프로젝트 요약

## 완료된 작업

### ✅ 1. 현재 사이트 분석
- 기존 Bubble.io 기반 사이트 분석 완료
- 디자인 요소 추출 (컬러, 타이포그래피, 애니메이션)
- 핵심 기능 파악 (사주궁합, 만세력, 상담)
- 통합된 서비스 목록 확인 (Analytics, 결제, 소셜)

### ✅ 2. 기술 스택 설정
**프론트엔드:**
- Next.js 16.0.1 (App Router)
- React 19.2.0
- TypeScript 5.9.3
- TailwindCSS 4.1.16
- Custom UI Component Library

**개발 도구:**
- ESLint (Next.js config)
- PostCSS + Autoprefixer
- Lucide React (아이콘)

### ✅ 3. 디자인 시스템 구축

#### 컬러 팔레트
```typescript
Primary (목/우드): #14B856
Secondary (화/파이어): #FF5D5D
Success: rgba(23, 219, 78, 1)
Destructive: rgba(255, 0, 0, 1)
```

#### 타이포그래피
- **기본 폰트**: Pretendard (400, 500, 600, 700)
- **디스플레이 폰트**: Ownglyph Saehayan
- **크기**: 12px ~ 60px (8단계)

#### 스페이싱
- xs (4px) ~ 4xl (96px)

#### 디자인 토큰
- `lib/design-tokens.ts`에 모든 토큰 정의
- 컬러, 타이포그래피, 스페이싱, Border Radius, 그림자, 애니메이션, z-index

### ✅ 4. UI 컴포넌트 라이브러리

#### 기본 컴포넌트
1. **Button** (`components/ui/button.tsx`)
   - Variants: default, secondary, destructive, outline, ghost, link
   - Sizes: sm, default, lg, icon

2. **Card** (`components/ui/card.tsx`)
   - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

3. **Input** (`components/ui/input.tsx`)
   - 표준 폼 인풋

4. **Label** (`components/ui/label.tsx`)
   - 폼 라벨

5. **Badge** (`components/ui/badge.tsx`)
   - Variants: default, secondary, destructive, outline

6. **TypingText** (`components/ui/typing-text.tsx`)
   - 타이핑 애니메이션 효과 (시그니처 기능)

#### 레이아웃 컴포넌트
1. **Header** (`components/layout/header.tsx`)
   - 고정 헤더
   - 네비게이션 (사주궁합, 만세력, 상담, 소개)
   - 로그인/시작하기 버튼

2. **Footer** (`components/layout/footer.tsx`)
   - 4열 그리드 레이아웃
   - 서비스, 정보, 법적 고지 섹션
   - 브랜드 정보

3. **Container** (`components/layout/container.tsx`)
   - 반응형 컨테이너

### ✅ 5. 프로젝트 구조

```
sajuwooju-v2/
├── app/
│   ├── globals.css          # 글로벌 스타일 (Tailwind + 커스텀)
│   ├── layout.tsx           # 루트 레이아웃 (폰트 설정)
│   └── page.tsx             # 홈 페이지
├── components/
│   ├── ui/                  # 재사용 가능한 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   └── typing-text.tsx
│   └── layout/              # 레이아웃 컴포넌트
│       ├── header.tsx
│       ├── footer.tsx
│       └── container.tsx
├── lib/
│   ├── utils.ts             # cn() 유틸리티
│   └── design-tokens.ts     # 디자인 토큰 정의
├── public/
│   └── fonts/               # 웹 폰트 (Pretendard, Ownglyph)
├── tailwind.config.ts       # Tailwind 설정
├── tsconfig.json            # TypeScript 설정
├── next.config.ts           # Next.js 설정
├── package.json             # 의존성 & 스크립트
├── README.md                # 프로젝트 가이드
├── DESIGN_SYSTEM.md         # 디자인 시스템 상세 문서
└── .gitignore               # Git 무시 파일
```

### ✅ 6. 설정 파일

#### package.json 스크립트
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

#### Tailwind Config
- 커스텀 컬러 (primary, secondary, success, destructive)
- 커스텀 폰트 (Pretendard, Ownglyph)
- 커스텀 애니메이션 (typing, accordion)
- tailwindcss-animate 플러그인

#### TypeScript Config
- Strict 모드 활성화
- Path alias: `@/*`
- Next.js 플러그인 통합

### ✅ 7. 문서화
1. **README.md** - 프로젝트 개요, 시작 가이드
2. **DESIGN_SYSTEM.md** - 디자인 시스템 상세 문서 (5,000+ 단어)
3. **PROJECT_SUMMARY.md** - 이 파일

---

## 다음 단계

### Phase 1: 폰트 파일 준비
```
public/fonts/
├── Pretendard-Regular.woff2
├── Pretendard-Medium.woff2
├── Pretendard-SemiBold.woff2
├── Pretendard-Bold.woff2
└── Ownglyph-Saehayan.woff2
```

**액션:**
- Pretendard 폰트 다운로드: https://github.com/orioncactus/pretendard
- Ownglyph Saehayan 폰트 확보 (현재 사이트에서 추출 또는 구매)

### Phase 2: 메인 페이지 개발
- 히어로 섹션 (타이핑 애니메이션)
- 서비스 소개 섹션
- CTA (Call-to-Action) 섹션
- 후기/리뷰 섹션

### Phase 3: 사주 궁합 페이지
- 생년월일시 입력 폼 (2인)
- 음력/양력 변환
- 사주 계산 로직
- 결과 페이지

### Phase 4: 만세력 페이지
- 날짜 선택 인터페이스
- 만세력 테이블 생성
- 운세 정보 표시

### Phase 5: 어드민 대시보드
- 사용자 관리
- 통계 대시보드
- 결제 관리
- 컨텐츠 관리

### Phase 6: 백엔드 개발
- Database 설계 (PostgreSQL + Prisma)
- API Routes (Next.js)
- 인증 시스템 (NextAuth.js)
- 결제 통합 (토스페이먼츠/포트원)

### Phase 7: 배포
- Vercel 배포
- 도메인 연결
- 환경 변수 설정
- 모니터링 (Sentry)

---

## 개발 명령어

### 개발 서버 시작
```bash
cd sajuwooju-v2
npm run dev
```

브라우저: http://localhost:3000

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 타입 체크
```bash
npm run type-check
```

### 린트
```bash
npm run lint
```

---

## 기술적 결정 사항

### 1. Next.js App Router 선택 이유
- 최신 React Server Components 활용
- 향상된 라우팅 및 레이아웃 시스템
- 빌트인 최적화 (이미지, 폰트, 메타데이터)
- Vercel 배포 최적화

### 2. TailwindCSS 선택 이유
- 빠른 개발 속도
- 일관된 디자인 시스템
- 작은 번들 사이즈 (PurgeCSS)
- 커스터마이징 용이

### 3. TypeScript 선택 이유
- 타입 안정성
- 개발자 경험 향상 (IntelliSense)
- 리팩토링 용이
- 버그 사전 방지

### 4. Custom Component Library 선택 이유
- shadcn/ui 베이스 (복사-붙여넣기 방식)
- 완전한 커스터마이징 가능
- 의존성 최소화
- 번들 사이즈 최적화

---

## 디자인 하이라이트

### 시그니처 기능: 타이핑 애니메이션
```tsx
<TypingText text="당신의 운명을 확인하세요" />
```

### 한국적 감성
- Ownglyph Saehayan 폰트 (서예 스타일)
- 오행 컬러 시스템 (목: 그린, 화: 레드)
- 전통과 현대의 조화

### 접근성
- WCAG 2.1 AA 기준 준수
- 키보드 네비게이션 지원
- 명확한 포커스 표시
- 시맨틱 HTML

---

## 성능 최적화 전략

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷
- Lazy loading

### 2. 폰트 최적화
- `next/font` 사용
- font-display: swap
- WOFF2 포맷
- 로컬 폰트 (CDN 의존성 제거)

### 3. 코드 스플리팅
- App Router 자동 코드 스플리팅
- Dynamic imports (필요시)

### 4. CSS 최적화
- TailwindCSS PurgeCSS
- Critical CSS inline

---

## 보안 고려사항

### 1. 환경 변수
```bash
# .env.local (Git에 포함하지 않음)
DATABASE_URL=
NEXTAUTH_SECRET=
PAYMENT_API_KEY=
```

### 2. API 보안
- Rate limiting
- CORS 설정
- API 키 검증

### 3. 인증
- NextAuth.js 사용 권장
- JWT 토큰
- Secure cookies

---

## 예상 일정

| Phase | 작업 | 기간 |
|-------|------|------|
| ✅ Phase 0 | 디자인 시스템 구축 | **완료** |
| Phase 1 | 폰트 파일 준비 | 1일 |
| Phase 2 | 메인 페이지 개발 | 3-5일 |
| Phase 3 | 사주 궁합 페이지 | 1-2주 |
| Phase 4 | 만세력 페이지 | 1주 |
| Phase 5 | 어드민 대시보드 | 2-3주 |
| Phase 6 | 백엔드 개발 | 3-4주 |
| Phase 7 | 배포 및 QA | 1-2주 |

**총 예상 기간**: 2-3개월

---

## 팀 구성 권장사항

- **프론트엔드 개발자**: 1-2명
- **백엔드 개발자**: 1명
- **디자이너**: 1명 (파트타임)
- **QA**: 1명 (파트타임)

---

## 연락처 & 지원

프로젝트 관련 질문이나 이슈는 GitHub Issues에 등록해주세요.

---

**마지막 업데이트**: 2024년 1월
**버전**: 2.0.0-alpha
**상태**: 디자인 시스템 구축 완료 ✅
