# 사주우주 (SajuWooju) v2

AI 기반 사주 분석 서비스 with 3D 우주 비주얼

## 기술 스택

- **Framework**: Next.js 16.0.1 (App Router + Turbopack)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS
- **3D**: Three.js + React Three Fiber
- **AI**: OpenAI GPT-4
- **Form**: React Hook Form + Zod
- **Deployment**: Vercel

## 주요 기능

- 🌌 3D 우주 랜딩 페이지 (인터랙티브 태양계)
- ✨ 사주 분석 (연애운, 재물운, 건강운, 직업운, 학업운, 종합운)
- 🔮 4단계 입력 폼 (카테고리 → 기본정보 → 생년월일 → 출생시간)
- 🪐 행성별 상세 페이지 (실시간 3D 렌더링)
- 📱 반응형 디자인
- 🎨 고급 애니메이션 & UI/UX

## 로컬 개발 환경 설정

### 1. 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 2. 설치

\`\`\`bash
# 레포지토리 클론
git clone <repository-url>
cd sajuwooju-v2

# 의존성 설치
npm install
\`\`\`

### 3. 환경 변수 설정

\`.env.local\` 파일을 생성하고 아래 내용을 추가:

\`\`\`bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## Vercel 배포

### Option 1: Vercel Dashboard (권장)

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 레포지토리 연결
4. 환경 변수 설정:
   - `OPENAI_API_KEY`: OpenAI API 키
5. "Deploy" 클릭

배포 완료! 🎉

### Option 2: Vercel CLI

\`\`\`bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
\`\`\`

### 환경 변수 설정 (Vercel Dashboard)

Vercel 프로젝트 → Settings → Environment Variables:

- `OPENAI_API_KEY`: OpenAI API 키 (필수)
- `NEXT_PUBLIC_SITE_URL`: 배포 URL (자동 설정됨)

## 빌드 & 프로덕션

\`\`\`bash
# Production 빌드
npm run build

# Production 서버 실행
npm start

# TypeScript 타입 체크
npm run type-check

# Lint 검사
npm run lint
\`\`\`

## 프로젝트 구조

\`\`\`
sajuwooju-v2/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 랜딩 페이지 (/)
│   ├── main/                # 메인 페이지
│   ├── saju/                # 사주 분석
│   │   ├── new/             # 입력 폼
│   │   ├── analyze/         # 분석 처리
│   │   └── result/          # 결과 페이지
│   └── planets/             # 행성 상세
├── components/              # React 컴포넌트
│   ├── 3d/                  # Three.js 컴포넌트
│   ├── landing/             # 랜딩 페이지 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   └── saju/                # 사주 관련 컴포넌트
├── lib/                     # 유틸리티 & 로직
│   ├── prompts/             # OpenAI 프롬프트
│   ├── types/               # TypeScript 타입
│   └── validation/          # Zod 스키마
└── public/                  # 정적 파일
    └── textures/            # 3D 텍스처
\`\`\`

## 성능 최적화

- ✅ Next.js 16 Turbopack (빠른 개발 & 빌드)
- ✅ 동적 임포트 (code splitting)
- ✅ Image 최적화 (next/image)
- ✅ Font 최적화 (Pretendard Variable)
- ✅ 3D 렌더링 최적화 (React Three Fiber)

## 브라우저 지원

- Chrome/Edge (최신 버전)
- Firefox (최신 버전)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome)

## 라이센스

Copyright © 2025 SajuWooju. All rights reserved.

---

**Made with ❤️ using Next.js & Three.js**
