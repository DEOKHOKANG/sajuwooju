# 사주우주 폰트 설정 가이드

## 폰트 시스템

### 1. Space Grotesk (Display Font)
**용도**: 제목, 큰 텍스트, 우주 테마 강조
**출처**: Google Fonts
**URL**: https://fonts.google.com/specimen/Space+Grotesk
**Weight**: 300-700

#### 설치 방법 A: Google Fonts CDN (추천)

`app/layout.tsx`에 추가:
```tsx
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={spaceGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
```

#### 설치 방법 B: Self-hosted (Production)

1. 다운로드:
   - https://fonts.google.com/specimen/Space+Grotesk
   - "Download family" 클릭
   - WOFF2 포맷 사용 (최적화)

2. 파일 배치:
   ```
   public/fonts/
   ├── SpaceGrotesk-Light.woff2
   ├── SpaceGrotesk-Regular.woff2
   ├── SpaceGrotesk-Medium.woff2
   ├── SpaceGrotesk-SemiBold.woff2
   └── SpaceGrotesk-Bold.woff2
   ```

3. `app/globals-wooju.css`에 추가:
   ```css
   @font-face {
     font-family: 'Space Grotesk';
     src: url('/fonts/SpaceGrotesk-Regular.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }

   @font-face {
     font-family: 'Space Grotesk';
     src: url('/fonts/SpaceGrotesk-Medium.woff2') format('woff2');
     font-weight: 500;
     font-style: normal;
     font-display: swap;
   }

   @font-face {
     font-family: 'Space Grotesk';
     src: url('/fonts/SpaceGrotesk-SemiBold.woff2') format('woff2');
     font-weight: 600;
     font-style: normal;
     font-display: swap;
   }

   @font-face {
     font-family: 'Space Grotesk';
     src: url('/fonts/SpaceGrotesk-Bold.woff2') format('woff2');
     font-weight: 700;
     font-style: normal;
     font-display: swap;
   }
   ```

---

### 2. Pretendard Variable (Body Font)
**용도**: 본문, 일반 텍스트, UI 요소
**출처**: 기존 설정 유지
**Weight**: 100-900 (Variable)

#### 현재 설정:
```css
@font-face {
  font-family: 'Pretendard Variable';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff')
    format('woff');
  font-weight: 400;
  font-style: normal;
}
```

#### Self-hosted 최적화 (Production):
1. 다운로드: https://github.com/orioncactus/pretendard/releases
2. WOFF2 Variable 버전 사용
3. `public/fonts/PretendardVariable.woff2`
4. CSS 업데이트:
   ```css
   @font-face {
     font-family: 'Pretendard Variable';
     src: url('/fonts/PretendardVariable.woff2') format('woff2');
     font-weight: 100 900;
     font-style: normal;
     font-display: swap;
   }
   ```

---

### 3. Ownglyph Saehayan (Decorative)
**용도**: 특별한 장식 텍스트, 브랜드 포인트
**출처**: 기존 설정 유지

#### 현재 설정:
```css
@font-face {
  font-family: 'Ownglyph Saehayan';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402@1.0/Ownglyph_Saehayan.woff2')
    format('woff2');
  font-weight: normal;
  font-style: normal;
}
```

---

## 폰트 사용 가이드

### Tailwind 클래스

```tsx
// Display font (제목, 큰 텍스트)
<h1 className="font-display text-6xl">사주우주</h1>

// Body font (본문)
<p className="font-body text-base">일반 텍스트</p>

// Decorative font (장식)
<span className="font-ownglyph text-2xl">특별한 문구</span>
```

### 타이포그래피 스케일

| 클래스 | 크기 | 용도 | 폰트 추천 |
|--------|------|------|-----------|
| `text-9xl` | 128px | Hero 타이틀 | Display |
| `text-8xl` | 96px | Hero 타이틀 | Display |
| `text-7xl` | 72px | 페이지 타이틀 | Display |
| `text-6xl` | 60px | 섹션 타이틀 | Display |
| `text-5xl` | 48px | 섹션 타이틀 | Display |
| `text-4xl` | 36px | 카드 타이틀 | Display |
| `text-3xl` | 30px | 카드 타이틀 | Display |
| `text-2xl` | 24px | 서브 타이틀 | Body |
| `text-xl` | 20px | 큰 본문 | Body |
| `text-lg` | 18px | 본문 강조 | Body |
| `text-base` | 16px | 기본 본문 | Body |
| `text-sm` | 14px | 작은 텍스트 | Body |
| `text-xs` | 12px | 캡션, 라벨 | Body |
| `text-2xs` | 10px | 메타 정보 | Body |

---

## 성능 최적화

### 1. Font Preload
`app/layout.tsx`:
```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          href="/fonts/SpaceGrotesk-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Font Display Strategy
- `font-display: swap` - FOUT 최소화, 사용자 경험 우선
- Critical 폰트만 preload
- Variable 폰트 사용으로 HTTP 요청 최소화

### 3. Subsetting (Optional)
한글 자주 사용 글자만 포함 (2,350자):
```bash
# pyftsubset 사용
pyftsubset PretendardVariable.woff2 \
  --text-file=korean-common-2350.txt \
  --flavor=woff2 \
  --output-file=PretendardVariable-subset.woff2
```

---

## 다음 단계

### Immediate (Phase R1)
- [x] Tailwind config에 폰트 정의 완료
- [ ] Space Grotesk Google Fonts 설정
- [ ] layout.tsx 업데이트
- [ ] 폰트 preload 추가

### Production (Phase R7 - Asset Creation)
- [ ] Space Grotesk WOFF2 다운로드
- [ ] Pretendard Variable WOFF2 다운로드
- [ ] Self-hosted 폰트로 전환
- [ ] Font subsetting 적용
- [ ] Performance 검증 (Lighthouse)

---

## 검증 체크리스트

- [ ] Space Grotesk 로드 확인
- [ ] Pretendard Variable 로드 확인
- [ ] FOUT/FOIT 없음
- [ ] 한글 렌더링 정상
- [ ] font-display: swap 동작
- [ ] Lighthouse Performance > 90
- [ ] CLS < 0.1

---

생성일: 2025-11-08
상태: Ready for implementation
