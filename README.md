# 타이트사주 v2.0

AI 기반 사주 궁합 서비스의 차세대 플랫폼

## 디자인 시스템

이 프로젝트는 체계적인 디자인 시스템을 기반으로 구축되었습니다.

### 컬러 팔레트

#### Primary (주 색상 - 우드/그린 계열)
- `#14B856` - 메인 브랜드 컬러
- 사주의 목(木) 요소를 상징

#### Secondary (보조 색상 - 파이어/레드 계열)
- `#FF5D5D` - 액센트 컬러
- 사주의 화(火) 요소를 상징

#### Success
- `rgba(23, 219, 78, 1)` - 성공 상태

#### Destructive
- `rgba(255, 0, 0, 1)` - 경고/오류 상태

### 타이포그래피

#### 폰트 패밀리
- **기본 폰트**: Pretendard (한글 최적화 sans-serif)
- **디스플레이 폰트**: Ownglyph Saehayan (한글 서예 스타일)

#### 폰트 크기
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px
- 6xl: 60px

### 스페이싱
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px

### 컴포넌트 라이브러리

기본 UI 컴포넌트:
- Button (variant: default, destructive, outline, secondary, ghost, link)
- Card (Header, Title, Description, Content, Footer)
- Input
- Label
- Badge
- TypingText (타이핑 애니메이션 효과)

레이아웃 컴포넌트:
- Header (고정 헤더, 네비게이션)
- Footer (사이트맵, 법적 정보)
- Container (반응형 컨테이너)

## 기술 스택

### 프론트엔드
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5.9+
- **Styling**: TailwindCSS 4.1+
- **UI Components**: Custom component library (shadcn/ui 기반)
- **Icons**: Lucide React
- **Font**: Pretendard, Ownglyph Saehayan

### 개발 도구
- **Linter**: ESLint (Next.js config)
- **Type Checking**: TypeScript strict mode
- **Package Manager**: npm

## 시작하기

### 필수 요구사항
- Node.js 18.17 이상
- npm 9 이상

### 설치

\`\`\`bash
cd sajutight-v2
npm install
\`\`\`

### 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

### 타입 체크

\`\`\`bash
npm run type-check
\`\`\`

### 린트

\`\`\`bash
npm run lint
\`\`\`

## 프로젝트 구조

\`\`\`
sajutight-v2/
├── app/                    # Next.js App Router
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈 페이지
├── components/
│   ├── ui/                # 기본 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   └── typing-text.tsx
│   └── layout/            # 레이아웃 컴포넌트
│       ├── header.tsx
│       ├── footer.tsx
│       └── container.tsx
├── lib/
│   ├── utils.ts           # 유틸리티 함수
│   └── design-tokens.ts   # 디자인 토큰 정의
├── public/
│   └── fonts/             # 웹 폰트
├── styles/                # 추가 스타일
├── tailwind.config.ts     # Tailwind 설정
├── tsconfig.json          # TypeScript 설정
├── next.config.ts         # Next.js 설정
└── package.json
\`\`\`

## 디자인 토큰 사용법

디자인 토큰은 `lib/design-tokens.ts`에 정의되어 있습니다.

\`\`\`typescript
import { colors, spacing, typography } from "@/lib/design-tokens";

// 컴포넌트에서 사용
const MyComponent = () => (
  <div style={{
    color: colors.primary.DEFAULT,
    padding: spacing.md
  }}>
    타이트사주
  </div>
);
\`\`\`

## Tailwind 클래스 사용

\`\`\`tsx
// Primary 색상
<button className="bg-primary text-primary-foreground">버튼</button>

// Secondary 색상
<button className="bg-secondary text-secondary-foreground">버튼</button>

// 타이핑 애니메이션
<div className="typing-effect">애니메이션 텍스트</div>

// 디스플레이 폰트
<h1 className="font-display">타이트사주</h1>
\`\`\`

## 애니메이션

### 타이핑 효과
\`\`\`tsx
import { TypingText } from "@/components/ui/typing-text";

<TypingText text="궁합을 확인해보세요" delay={500} />
\`\`\`

## 라이센스

ISC

## 문의

프로젝트 관련 문의사항은 이슈로 등록해주세요.
