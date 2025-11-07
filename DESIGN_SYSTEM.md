# 타이트사주 디자인 시스템

## 개요

타이트사주의 디자인 시스템은 일관성 있고 확장 가능한 UI를 만들기 위한 규칙과 원칙을 정의합니다.

## 디자인 철학

### 핵심 원칙
1. **일관성** - 모든 인터페이스에서 동일한 패턴 사용
2. **접근성** - 모든 사용자가 쉽게 사용할 수 있는 디자인
3. **명확성** - 직관적이고 이해하기 쉬운 UI
4. **한국적 감성** - 사주라는 전통적 주제를 현대적으로 해석

---

## 1. 컬러 시스템

### 브랜드 컬러

#### Primary (주 색상)
사주의 오행 중 "목(木)"을 상징하는 그린 계열

```css
--primary: #14B856
```

**사용처:**
- 주요 CTA 버튼
- 브랜드 로고
- 강조 텍스트
- 활성 상태 표시

**팔레트:**
- 50: #E8F9EF (매우 밝음)
- 100: #D1F3DF
- 200: #A3E7BF
- 300: #75DB9F
- 400: #47CF7F
- 500: #14B856 (기본)
- 600: #109345
- 700: #0C6E34
- 800: #084923
- 900: #042412 (매우 어두움)

#### Secondary (보조 색상)
사주의 오행 중 "화(火)"를 상징하는 레드 계열

```css
--secondary: #FF5D5D
```

**사용처:**
- 경고 메시지
- 중요한 정보 강조
- 보조 CTA 버튼
- 특별 이벤트 배지

**팔레트:**
- 50: #FFE5E5
- 100: #FFCCCC
- 200: #FF9999
- 300: #FF6666
- 400: #FF5D5D (기본)
- 500: #FF3333
- 600: #CC0000
- 700: #990000
- 800: #660000
- 900: #330000

### 시스템 컬러

#### Success (성공)
```css
--success: rgba(23, 219, 78, 1)
```
- 성공 메시지
- 완료 상태
- 긍정적 피드백

#### Destructive (파괴적/위험)
```css
--destructive: rgba(255, 0, 0, 1)
```
- 에러 메시지
- 삭제 확인
- 위험한 액션

### 중립 컬러 (Neutral/Gray)

```css
50:  #FAFAFA
100: #F5F5F5
200: #E5E5E5
300: #D4D4D4
400: #A3A3A3
500: #737373
600: #525252
700: #404040
800: #262626
900: #171717
```

**사용처:**
- 텍스트 (700-900)
- 배경 (50-200)
- 보더 (200-400)
- 비활성 상태 (400-500)

### 시맨틱 컬러

#### 라이트 모드
```css
--background: hsl(0 0% 100%)
--foreground: hsl(240 10% 3.9%)
--card: hsl(0 0% 100%)
--card-foreground: hsl(240 10% 3.9%)
--muted: hsl(240 4.8% 95.9%)
--muted-foreground: hsl(240 3.8% 46.1%)
--border: hsl(240 5.9% 90%)
```

#### 다크 모드
```css
--background: hsl(240 10% 3.9%)
--foreground: hsl(0 0% 98%)
--card: hsl(240 10% 3.9%)
--card-foreground: hsl(0 0% 98%)
--muted: hsl(240 3.7% 15.9%)
--muted-foreground: hsl(240 5% 64.9%)
--border: hsl(240 3.7% 15.9%)
```

---

## 2. 타이포그래피

### 폰트 패밀리

#### 기본 폰트: Pretendard
- **목적**: 본문, UI 요소
- **특징**: 한글 최적화, 높은 가독성
- **웨이트**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

```css
font-family: var(--font-pretendard), Pretendard, -apple-system, sans-serif;
```

#### 디스플레이 폰트: Ownglyph Saehayan
- **목적**: 제목, 브랜드 요소
- **특징**: 한국적 서예 느낌, 고유한 개성
- **사용**: 주요 헤딩, 로고

```css
font-family: var(--font-ownglyph), serif;
```

### 폰트 크기 스케일

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 12px | 16px | 캡션, 작은 라벨 |
| sm | 14px | 20px | 보조 텍스트 |
| base | 16px | 24px | 본문 (기본) |
| lg | 18px | 28px | 중요 본문 |
| xl | 20px | 28px | 소제목 |
| 2xl | 24px | 32px | 섹션 제목 |
| 3xl | 30px | 36px | 페이지 제목 |
| 4xl | 36px | 40px | 히어로 제목 |
| 5xl | 48px | 1 | 대형 디스플레이 |
| 6xl | 60px | 1 | 특대형 디스플레이 |

### 폰트 웨이트

| Name | Weight | Usage |
|------|--------|-------|
| Regular | 400 | 본문 텍스트 |
| Medium | 500 | 강조 텍스트 |
| SemiBold | 600 | 소제목 |
| Bold | 700 | 제목, 버튼 |

### 타이포그래피 사용 예시

```tsx
// 페이지 제목
<h1 className="font-display text-4xl font-bold text-primary">
  타이트사주
</h1>

// 섹션 제목
<h2 className="text-2xl font-semibold">
  사주 궁합 보기
</h2>

// 본문
<p className="text-base text-muted-foreground">
  AI 기반의 정확한 사주 분석
</p>

// 작은 라벨
<span className="text-xs text-neutral-500">
  2024년 1월 1일
</span>
```

---

## 3. 스페이싱 시스템

### 기본 스케일

| Name | Size | Usage |
|------|------|-------|
| xs | 4px | 아이콘과 텍스트 간격 |
| sm | 8px | 밀접한 요소 간격 |
| md | 16px | 기본 여백 |
| lg | 24px | 컴포넌트 간격 |
| xl | 32px | 섹션 내부 여백 |
| 2xl | 48px | 섹션 간격 |
| 3xl | 64px | 큰 섹션 간격 |
| 4xl | 96px | 페이지 레벨 간격 |

### 사용 예시

```tsx
// 카드 내부 패딩
<div className="p-6"> {/* 24px */}

// 요소 간 마진
<div className="space-y-4"> {/* 16px 수직 간격 */}

// 큰 섹션 구분
<section className="py-16"> {/* 64px 상하 패딩 */}
```

---

## 4. Border Radius

| Name | Size | Usage |
|------|------|-------|
| none | 0 | 각진 요소 |
| sm | 4px | 작은 요소 |
| md | 8px | 기본 (버튼, 인풋) |
| lg | 12px | 카드 |
| xl | 16px | 큰 카드 |
| 2xl | 24px | 모달, 다이얼로그 |
| full | 9999px | 원형 (아바타, 배지) |

```tsx
<Button className="rounded-md"> {/* 8px */}
<Card className="rounded-lg"> {/* 12px */}
<Avatar className="rounded-full"> {/* 원형 */}
```

---

## 5. 그림자 (Shadows)

| Name | Value | Usage |
|------|-------|-------|
| sm | 0 1px 2px rgba(0,0,0,0.05) | 미세한 그림자 |
| md | 0 4px 6px rgba(0,0,0,0.1) | 기본 그림자 |
| lg | 0 10px 15px rgba(0,0,0,0.1) | 부각된 요소 |
| xl | 0 20px 25px rgba(0,0,0,0.1) | 떠있는 요소 |
| 2xl | 0 25px 50px rgba(0,0,0,0.25) | 모달, 팝오버 |
| inner | inset 0 2px 4px rgba(0,0,0,0.05) | 내부 그림자 |

```tsx
<Card className="shadow-md"> {/* 기본 카드 */}
<Modal className="shadow-2xl"> {/* 모달 */}
```

---

## 6. 애니메이션

### 타이핑 효과

타이트사주의 시그니처 애니메이션

```tsx
import { TypingText } from "@/components/ui/typing-text";

<TypingText
  text="당신의 운명을 확인하세요"
  delay={500}
/>
```

**설정:**
- Duration: 4s
- Timing: steps(60, end)
- Delay: 0.5s

### 트랜지션

```css
/* 색상 변화 */
transition: colors 0.3s ease-in;

/* 변형 */
transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 7. 컴포넌트

### Button

**Variants:**
- `default` - 주요 액션 (primary 배경)
- `secondary` - 보조 액션 (secondary 배경)
- `destructive` - 위험한 액션 (빨간색)
- `outline` - 외곽선만
- `ghost` - 배경 없음
- `link` - 링크 스타일

**Sizes:**
- `sm` - 36px 높이
- `default` - 40px 높이
- `lg` - 44px 높이
- `icon` - 40x40px 정사각형

```tsx
<Button variant="default" size="lg">
  궁합 보기
</Button>

<Button variant="outline">
  취소
</Button>
```

### Card

카드 컴포넌트는 정보를 그룹화하는 컨테이너

```tsx
<Card>
  <CardHeader>
    <CardTitle>궁합 결과</CardTitle>
    <CardDescription>두 사람의 사주 분석</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 내용 */}
  </CardContent>
  <CardFooter>
    {/* 액션 버튼 */}
  </CardFooter>
</Card>
```

### Input

```tsx
<div className="space-y-2">
  <Label htmlFor="birth">생년월일</Label>
  <Input
    id="birth"
    type="date"
    placeholder="1990-01-01"
  />
</div>
```

---

## 8. 레이아웃

### 브레이크포인트

| Name | Size | Device |
|------|------|--------|
| sm | 640px | Mobile (가로) |
| md | 768px | Tablet |
| lg | 1024px | Desktop (작음) |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large Desktop |

### Container

중앙 정렬 컨테이너 (최대 너비 제한)

```tsx
<Container className="py-16">
  {/* 내용 */}
</Container>
```

### Grid System

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

---

## 9. Z-Index 시스템

| Name | Value | Usage |
|------|-------|-------|
| base | 0 | 기본 레이어 |
| dropdown | 1000 | 드롭다운 메뉴 |
| sticky | 1100 | 고정 요소 |
| fixed | 1200 | 고정 헤더/푸터 |
| modalBackdrop | 1300 | 모달 배경 |
| modal | 1400 | 모달 |
| popover | 1500 | 팝오버 |
| tooltip | 1600 | 툴팁 |

---

## 10. 접근성 (Accessibility)

### 컬러 대비

- WCAG 2.1 AA 기준 준수
- 본문 텍스트: 최소 4.5:1 대비
- 큰 텍스트 (18px+): 최소 3:1 대비

### 포커스 상태

모든 인터랙티브 요소는 명확한 포커스 표시

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

### 키보드 네비게이션

- Tab 키로 모든 요소 접근 가능
- Enter/Space로 버튼 활성화
- Esc로 모달/다이얼로그 닫기

---

## 11. 반응형 디자인

### Mobile First

모바일을 우선으로 디자인하고 점진적으로 확장

```tsx
// 모바일: 전체 너비
// 태블릿 이상: 2열
// 데스크톱: 3열
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 텍스트 크기

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  반응형 제목
</h1>
```

---

## 12. 다크 모드

### 구현

Tailwind의 `dark:` 프리픽스 사용

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  다크 모드 지원
</div>
```

### 컬러 전환

CSS 변수를 사용하여 자동 전환

```css
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
}
```

---

## 참고 자료

- [Tailwind CSS 문서](https://tailwindcss.com)
- [Next.js 문서](https://nextjs.org)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)

---

마지막 업데이트: 2024년 1월
