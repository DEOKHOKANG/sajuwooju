# 🚀 Production Deployment Guide
**sajuwooju-v2 → Vercel + PostgreSQL**

생성일: 2025-11-09
프로젝트: sajuwooju (prj_t7FG2Hj3rFMKLknjH01uUW9SH73Q)

---

## 📋 Current Status

✅ **Completed**:
- [x] PostgreSQL Schema 확장 (5 CMS models)
- [x] API Routes 생성 (planets, products, categories)
- [x] Git commit & push (commit: 1baa392)
- [x] Vercel project linked

⏳ **Next Step**: Vercel 배포 및 PostgreSQL 자동 설정

---

## 🔐 Step 1: Vercel 인증 (사용자 개입 필요)

Vercel CLI는 인증이 필요합니다. 아래 두 가지 방법 중 선택하세요:

### 방법 A: 브라우저 로그인 (권장)
```bash
cd sajuwooju-v2
npx vercel login
```
- 브라우저가 자동으로 열림
- Vercel 계정으로 로그인
- CLI 자동 인증 완료

### 방법 B: Access Token 사용
1. https://vercel.com/account/tokens 에서 토큰 생성
2. `.env.local`에 추가:
```bash
VERCEL_TOKEN=your_token_here
```
3. CLI에서 사용:
```bash
npx vercel --token=$VERCEL_TOKEN
```

---

## 🤖 Step 2: 자동 배포 스크립트 실행

인증 완료 후, 아래 명령어로 완전 자동화된 배포를 실행합니다:

```bash
cd sajuwooju-v2
npm run deploy:production
```

이 스크립트는 다음을 자동으로 수행합니다:

1. ✅ Vercel 프로젝트 확인
2. ✅ PostgreSQL 데이터베이스 생성
3. ✅ 환경 변수 자동 설정:
   - `DATABASE_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `NEXT_PUBLIC_SITE_URL`
4. ✅ Prisma 마이그레이션 실행
5. ✅ Production 빌드 & 배포
6. ✅ 배포 URL 출력

---

## 📝 Step 3: 수동 배포 (대안)

자동화 스크립트가 실패하면, 수동으로 진행하세요:

### 3.1 Vercel PostgreSQL 데이터베이스 생성

#### Vercel Dashboard 방법:
1. https://vercel.com/dashboard 접속
2. "sajuwooju" 프로젝트 선택
3. **Storage** 탭 클릭
4. **Create Database** → **Postgres** 선택
5. 데이터베이스 이름: `sajuwooju-db`
6. Region: `Washington, D.C., USA (iad1)` (권장)
7. **Create** 클릭

#### Vercel CLI 방법:
```bash
cd sajuwooju-v2
npx vercel env pull
```
이 명령어는 Vercel이 자동으로 생성한 PostgreSQL 연결 문자열을 `.env.local`에 다운로드합니다.

### 3.2 환경 변수 확인
`.env.local` 파일이 다음과 같이 업데이트되었는지 확인:
```
POSTGRES_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NO_SSL="postgres://..."
```

### 3.3 Prisma 마이그레이션 실행
```bash
npx prisma migrate deploy
```

### 3.4 Vercel 배포
```bash
npx vercel --prod
```

---

## 🔄 Step 4: 배포 후 검증

배포가 완료되면 다음을 확인하세요:

### API 엔드포인트 테스트:
```bash
# Planets API
curl https://sajuwooju.vercel.app/api/planets | jq

# Products API
curl https://sajuwooju.vercel.app/api/products | jq

# Categories API
curl https://sajuwooju.vercel.app/api/categories | jq
```

### 데이터베이스 연결 확인:
```bash
npx prisma studio
```
- 브라우저에서 http://localhost:5555 열림
- Planet, FortuneCategory 등 테이블 확인

### 사이트 접속:
- Production: https://sajuwooju.vercel.app
- Landing page → Main page 네비게이션 테스트
- 3D 행성 렌더링 확인

---

## 🐛 문제 해결 (Troubleshooting)

### 문제 1: "No existing credentials found"
```bash
npx vercel login
```
브라우저에서 다시 로그인하세요.

### 문제 2: "Environment variable not found"
Vercel Dashboard에서 수동으로 환경 변수 추가:
1. Project Settings → Environment Variables
2. 다음 3개 추가:
   - `DATABASE_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `NEXT_PUBLIC_SITE_URL=https://sajuwooju.vercel.app`

### 문제 3: "Migration failed"
```bash
# .env.local 파일 확인
cat .env.local

# Prisma 재생성
npx prisma generate

# 마이그레이션 재시도
npx prisma migrate deploy
```

### 문제 4: "Build failed - Type errors"
```bash
# TypeScript 체크
npx tsc --noEmit

# 로컬 빌드 테스트
npm run build
```

---

## 📦 Next Steps (배포 후)

배포가 완료되면 다음 단계로 진행합니다:

### 1. 하드코딩 제거
컴포넌트를 API fetch로 전환:
- [ ] `components/rotating-system.tsx`
- [ ] `app/main/page.tsx`
- [ ] `app/planets/[id]/page.tsx`

### 2. Glassmorphism 디자인 시스템
- [ ] globals.css에 utility classes 추가
- [ ] 모든 카드 컴포넌트에 적용

### 3. Photorealistic 3D 텍스처
- [ ] WebP 변환
- [ ] Normal maps 추가
- [ ] LOD 구현

---

## 🔗 유용한 링크

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Storage: https://vercel.com/docs/storage/vercel-postgres
- Prisma Migrate: https://www.prisma.io/docs/orm/prisma-migrate
- GitHub Repo: https://github.com/DEOKHOKANG/sajuwooju

---

## 🤝 Support

문제가 발생하면:
1. 이 문서의 Troubleshooting 섹션 확인
2. Claude Code에게 에러 메시지와 함께 요청
3. Vercel 로그 확인: https://vercel.com/sajuwooju/logs

---

**생성자**: Claude Code
**최종 업데이트**: 2025-11-09
**Commit**: 1baa392
