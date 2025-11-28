# 🔐 인증 시스템 설정 가이드

**사주우주** 프로젝트의 NextAuth.js v5 인증 시스템 설정 방법입니다.

생성일: 2025-11-10
Commit: b0ae65c

---

## 📋 개요

### 구현된 기능
- ✅ Google OAuth 로그인
- ✅ Kakao OAuth 로그인
- ✅ Database Session 관리 (PostgreSQL)
- ✅ 보호된 라우트 (Middleware)
- ✅ 사용자 프로필 페이지
- ✅ 로그인/로그아웃 UI
- ✅ 헤더 사용자 아바타
- ✅ 대시보드 세션 통합

---

## 🔧 환경 변수 설정

### 1. `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 추가하세요:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here  # openssl rand -base64 32 로 생성

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Kakao OAuth
KAKAO_CLIENT_ID=your-kakao-rest-api-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# Database (기존 환경 변수 유지)
DATABASE_URL=your-postgres-connection-string
POSTGRES_URL_NON_POOLING=your-direct-connection-string
```

---

## 🔑 OAuth Provider 설정

### Google OAuth 설정

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com

2. **프로젝트 생성 또는 선택**
   - 기존 프로젝트가 있으면 선택, 없으면 새로 생성

3. **OAuth 2.0 클라이언트 ID 생성**
   - 좌측 메뉴: **API 및 서비스** → **사용자 인증 정보**
   - **사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
   - 애플리케이션 유형: **웹 애플리케이션**

4. **승인된 리디렉션 URI 설정**
   ```
   개발:
   http://localhost:3000/api/auth/callback/google

   프로덕션:
   https://your-domain.com/api/auth/callback/google
   ```

5. **클라이언트 ID와 Secret 복사**
   - `.env.local`에 `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET` 추가

### Kakao OAuth 설정

1. **Kakao Developers 접속**
   - https://developers.kakao.com

2. **애플리케이션 추가**
   - 내 애플리케이션 → 애플리케이션 추가하기
   - 앱 이름, 사업자명 입력

3. **플랫폼 설정**
   - 앱 설정 → 플랫폼 → Web 플랫폼 등록
   - 사이트 도메인: `http://localhost:3000` (개발), `https://your-domain.com` (프로덕션)

4. **Kakao 로그인 활성화**
   - 제품 설정 → Kakao 로그인 → 활성화 설정 ON
   - Redirect URI 등록:
     ```
     http://localhost:3000/api/auth/callback/kakao
     https://your-domain.com/api/auth/callback/kakao
     ```

5. **동의 항목 설정**
   - 제품 설정 → Kakao 로그인 → 동의 항목
   - 필수 동의: 프로필 정보(닉네임/프로필 사진), 카카오계정(이메일)

6. **REST API 키 복사**
   - 앱 설정 → 앱 키 → REST API 키
   - `.env.local`에 `KAKAO_CLIENT_ID` 추가

7. **Client Secret 생성 (선택)**
   - 제품 설정 → Kakao 로그인 → 보안
   - Client Secret 코드 생성 → 활성화 상태로 변경
   - `.env.local`에 `KAKAO_CLIENT_SECRET` 추가

---

## 🗄️ 데이터베이스 마이그레이션

### 로컬 개발 환경

```bash
# 마이그레이션 적용
npx prisma migrate dev

# Prisma Client 재생성
npx prisma generate

# 데이터베이스 확인
npx prisma studio
```

### Vercel 프로덕션 배포

마이그레이션은 자동으로 적용됩니다:
- `package.json`의 `postinstall` 스크립트에 `prisma generate` 포함
- Vercel 배포 시 자동으로 Prisma Client 생성

---

## 🚀 로컬 실행

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
open http://localhost:3000/auth/signin
```

### 테스트 플로우

1. **로그인 페이지 접속**
   - `http://localhost:3000/auth/signin`

2. **소셜 로그인 클릭**
   - Google 또는 Kakao 선택

3. **로그인 완료 후 리디렉션**
   - `/dashboard`로 자동 이동

4. **보호된 페이지 접근**
   - `/dashboard` - 대시보드
   - `/profile` - 프로필
   - `/saved` - 저장함
   - `/chat` - AI 채팅

5. **로그아웃**
   - `/profile` 페이지에서 로그아웃 버튼 클릭

---

## 🔒 보안 설정

### NEXTAUTH_SECRET 생성

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

생성된 값을 `.env.local`의 `NEXTAUTH_SECRET`에 추가:

```bash
NEXTAUTH_SECRET=generated-secret-key-here
```

### 프로덕션 환경 변수

Vercel 대시보드에서 환경 변수 추가:
- Settings → Environment Variables
- 모든 OAuth 키와 Secret 추가
- `NEXTAUTH_URL`을 프로덕션 도메인으로 설정

---

## 📁 주요 파일 구조

```
sajuwooju-v2/
├── auth.ts                           # NextAuth.js 설정
├── middleware.ts                     # 라우트 보호
├── types/next-auth.d.ts              # TypeScript 확장
├── app/
│   ├── api/auth/[...nextauth]/      # NextAuth API Route
│   ├── auth/signin/                 # 로그인 페이지
│   ├── profile/                     # 프로필 페이지
│   └── dashboard/                   # 대시보드 (세션 통합)
├── components/layout/
│   └── mobile-header.tsx            # 헤더 (프로필 아이콘)
└── prisma/
    ├── schema.prisma                # User, Account, Session 모델
    └── migrations/
        └── 20251110014500_add_nextauth_fields/  # 인증 마이그레이션
```

---

## 🐛 문제 해결

### 1. "OAuth Error: Missing Client ID"

**원인**: 환경 변수가 설정되지 않았습니다.

**해결**:
```bash
# .env.local 파일 확인
cat .env.local

# 개발 서버 재시작
npm run dev
```

### 2. "Database Connection Error"

**원인**: DATABASE_URL이 잘못되었거나 마이그레이션이 적용되지 않았습니다.

**해결**:
```bash
# 연결 테스트
npx prisma db push

# 마이그레이션 재실행
npx prisma migrate deploy
```

### 3. "Session Not Found"

**원인**: SessionProvider가 누락되었거나 middleware 설정 오류입니다.

**해결**:
- `app/layout.tsx`에 `<SessionProvider>` 확인
- `middleware.ts`의 matcher 패턴 확인

### 4. Kakao 로그인 시 "invalid_client"

**원인**: Redirect URI가 Kakao Developers에 등록되지 않았습니다.

**해결**:
- Kakao Developers → Redirect URI 정확히 등록
- `http://localhost:3000/api/auth/callback/kakao`

---

## ✅ 체크리스트

배포 전 확인 사항:

- [ ] Google OAuth 클라이언트 ID/Secret 발급
- [ ] Kakao REST API 키/Client Secret 발급
- [ ] `.env.local` 모든 환경 변수 설정
- [ ] NEXTAUTH_SECRET 생성 및 설정
- [ ] 로컬에서 로그인/로그아웃 테스트
- [ ] Vercel 환경 변수 모두 추가
- [ ] 프로덕션 Redirect URI 모두 등록
- [ ] Prisma 마이그레이션 적용 확인
- [ ] 보호된 라우트 접근 테스트

---

## 📚 참고 문서

- **NextAuth.js v5**: https://authjs.dev
- **Prisma Adapter**: https://authjs.dev/reference/adapter/prisma
- **Google OAuth**: https://console.cloud.google.com
- **Kakao Developers**: https://developers.kakao.com

---

## 🎯 다음 단계

1. **이메일/비밀번호 인증 추가**
   - Credentials Provider 구현

2. **소셜 계정 연동**
   - 같은 이메일 계정 연결 로직

3. **사용자 역할 관리**
   - 일반/프리미엄/관리자 권한

4. **세션 만료 알림**
   - 자동 로그아웃 전 알림

5. **계정 삭제 기능**
   - GDPR 준수

---

생성일: 2025-11-10
최종 업데이트: 2025-11-10
작성자: Claude Code
버전: 1.0.0
