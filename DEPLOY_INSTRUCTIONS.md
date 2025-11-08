# 🚀 배포 안내서

**프로젝트**: sajuwooju (사주우주)
**완료 상태**: Phase R1-R5 완료
**배포 대상**: GitHub + Vercel

---

## 📋 사전 준비

### 1. GitHub Personal Access Token 생성

1. GitHub 접속: https://github.com/settings/tokens
2. "Generate new token (classic)" 클릭
3. 권한 선택:
   - ✅ `repo` (전체)
   - ✅ `workflow`
   - ✅ `admin:org` (조직 사용 시)
4. "Generate token" 클릭
5. **토큰 복사** (다시 볼 수 없음!)

### 2. Vercel Token 생성

1. Vercel 접속: https://vercel.com/account/tokens
2. "Create Token" 클릭
3. Token Name: `SajuWooju Deployment`
4. Scope: Full Account
5. "Create" 클릭
6. **토큰 복사**

---

## 🖥️ 방법 1: Windows 배치 파일 사용 (추천)

### 단계별 실행

**1. 환경 변수 설정**
```cmd
# 명령 프롬프트 또는 PowerShell에서
set GITHUB_TOKEN=ghp_your_github_token_here
set VERCEL_TOKEN=your_vercel_token_here
```

**2. 배포 스크립트 실행**
```cmd
cd d:\saju\sajutight-v2
scripts\deploy.bat
```

스크립트가 자동으로 다음을 수행합니다:
1. GitHub 레포지토리 생성 (`sajuwooju`)
2. 코드 푸시
3. Vercel 배포

---

## 🐧 방법 2: Bash 스크립트 사용 (Linux/Mac/WSL)

**1. 환경 변수 설정**
```bash
export GITHUB_TOKEN=ghp_your_github_token_here
export VERCEL_TOKEN=your_vercel_token_here
```

**2. GitHub 레포지토리 생성 & 푸시**
```bash
cd sajutight-v2
chmod +x scripts/create-github-repo.sh
./scripts/create-github-repo.sh
```

**3. Vercel 배포**
```bash
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

---

## 🔧 방법 3: 수동 배포

### Step 1: GitHub 레포지토리 생성

**웹 인터페이스 사용**:
1. https://github.com/new 접속
2. Repository name: `sajuwooju`
3. Description: `사주우주 (SajuWooju) - 우주의 법칙으로 읽는 나의 운명 🌌`
4. Public 선택
5. "Create repository" 클릭

**Git 설정 및 푸시**:
```bash
cd sajutight-v2
git remote add origin https://github.com/efuelteam/sajuwooju.git
git push -u origin main
```

### Step 2: Vercel 배포

**옵션 A: Vercel CLI**
```bash
# 로그인 (한 번만)
vercel login

# 프로젝트 배포
vercel --prod --name sajuwooju
```

**옵션 B: Vercel 웹 인터페이스**
1. https://vercel.com/new 접속
2. "Import Git Repository" 클릭
3. `sajuwooju` 선택
4. Project Settings:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Environment Variables (선택사항):
   ```
   NEXT_PUBLIC_SITE_URL=https://sajuwooju.vercel.app
   ```
6. "Deploy" 클릭

---

## ✅ 배포 후 확인 사항

### 1. GitHub 확인
- [ ] 레포지토리 생성됨: https://github.com/efuelteam/sajuwooju
- [ ] 모든 커밋 푸시됨 (3개 커밋)
- [ ] README.md 정상 표시
- [ ] 파일 구조 정확

### 2. Vercel 확인
- [ ] 프로젝트 생성됨
- [ ] 빌드 성공 (Build logs 확인)
- [ ] 배포 완료
- [ ] 도메인 접근 가능: https://sajuwooju.vercel.app

### 3. 기능 테스트
방문: https://sajuwooju.vercel.app

#### 테스트할 페이지:
- [ ] **홈페이지** (`/`): 원본 디자인
- [ ] **우주 테마 홈** (`/page-wooju`): 우주 테마 확인
- [ ] **3D 태양계** (`/space-test`): 행성 인터랙션
- [ ] **로딩 테스트** (`/loading-test`): 로딩 애니메이션

#### 확인 사항:
- [ ] 모든 이미지 로딩됨
- [ ] 3D 행성 정상 렌더링
- [ ] 애니메이션 부드러움 (60fps)
- [ ] 모바일 반응형 동작
- [ ] 별빛 애니메이션 동작
- [ ] Glassmorphism 효과 적용

### 4. 성능 확인
```bash
# Lighthouse 실행
lighthouse https://sajuwooju.vercel.app --view
```

**목표 점수**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

---

## 🔄 재배포 (업데이트 푸시)

### 코드 수정 후
```bash
cd sajutight-v2

# 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# GitHub에 푸시
git push origin main

# Vercel은 자동 배포 (GitHub 연동된 경우)
# 또는 수동 배포:
vercel --prod
```

---

## 🌐 커스텀 도메인 설정 (선택)

### 1. 도메인 구매
- sajuwooju.com 구매 (Namecheap, GoDaddy 등)

### 2. Vercel에 도메인 추가
1. Vercel 프로젝트 > Settings > Domains
2. 도메인 입력: `sajuwooju.com`, `www.sajuwooju.com`
3. DNS 레코드 설정:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. DNS 전파 대기 (최대 48시간)

---

## 🐛 문제 해결

### GitHub 푸시 실패
```bash
# 에러: remote origin already exists
git remote remove origin
git remote add origin https://github.com/efuelteam/sajuwooju.git
git push -u origin main
```

### Vercel 빌드 실패
**일반적인 원인**:
1. Node.js 버전 불일치
   - 해결: Vercel 설정에서 Node.js 18 지정
2. Dependencies 누락
   - 해결: `npm install` 로컬에서 확인
3. TypeScript 에러
   - 해결: `npm run type-check` 로컬에서 수정

**빌드 로그 확인**:
- Vercel Dashboard > Deployments > 실패한 배포 클릭
- Logs 탭에서 에러 확인

### 3D 렌더링 안 됨
**원인**: SSR에서 Three.js 로딩 실패
**해결**: Dynamic import 확인
```typescript
const SpaceCanvas = dynamic(() => import("@/components/3d/SpaceCanvas"), {
  ssr: false
});
```

### 이미지 로딩 안 됨
**원인**: Image domain 설정 누락
**해결**: `next.config.ts` 확인
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io',
    }
  ]
}
```

---

## 📞 지원

### 리소스
- **GitHub Docs**: https://docs.github.com
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

### 프로젝트 문서
- [README.md](./README.md) - 프로젝트 개요
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 상세 배포 가이드
- [PHASE_R5_COMPLETE.md](./PHASE_R5_COMPLETE.md) - 최신 완료 보고서

---

## 📊 현재 상태

### Git 커밋 이력
```
aa81778 - docs: README 업데이트 - Phase R5 문서 추가
e8b2358 - feat: Phase R5 UI 컴포넌트 리브랜딩 완료
ab3abc7 - feat: 사주우주 (SajuWooju) 리브랜딩 Phase R1-R4 완료
```

### 완료된 Phase
- ✅ Phase R1: Design System (우주 테마 색상, 폰트)
- ✅ Phase R2: 3D Universe Engine (Nine.js 태양계)
- ✅ Phase R3: Loading Animations (AI 분석 로딩)
- ✅ Phase R4: Text Rebranding (523개 텍스트 교체)
- ✅ Phase R5: UI Components (우주 테마 홈페이지)

### 다음 Phase (선택)
- Phase R6: 페이지별 리브랜딩
- Phase R7: 에셋 생성 (로고, OG 이미지)
- Phase R8: Header/Footer 리브랜딩
- Phase R9: 최종 통합 & 성능 최적화

---

**작성일**: 2025-11-08
**프로젝트**: 사주우주 (SajuWooju)
**상태**: 배포 준비 완료 ✅
