# ⚡ 빠른 배포 가이드

**프로젝트**: sajuwooju (사주우주)
**목표**: GitHub 레포지토리 생성 + Vercel 배포

---

## 🚀 한 줄 배포 (Windows)

### 사전 준비
1. GitHub Token 준비
2. Vercel Token 준비

### 실행
```cmd
set GITHUB_TOKEN=your_github_token && set VERCEL_TOKEN=your_vercel_token && cd d:\saju\sajutight-v2 && scripts\deploy.bat
```

---

## 📝 단계별 안내

### 1단계: 환경 변수 설정 (PowerShell)
```powershell
$env:GITHUB_TOKEN="ghp_your_github_token_here"
$env:VERCEL_TOKEN="your_vercel_token_here"
```

### 2단계: 배포 실행
```powershell
cd d:\saju\sajutight-v2
.\scripts\deploy.bat
```

---

## 🎯 자동으로 수행되는 작업

1. ✅ GitHub 레포지토리 생성 (`sajuwooju`)
2. ✅ Git remote 설정
3. ✅ 코드 푸시 (3개 커밋)
4. ✅ Vercel 프로젝트 생성
5. ✅ Production 빌드
6. ✅ 배포 완료

---

## 🌐 배포 후 URL

- **GitHub**: https://github.com/efuelteam/sajuwooju
- **Vercel**: https://sajuwooju.vercel.app

### 테스트 페이지
- `/` - 원본 홈페이지
- `/page-wooju` - 우주 테마 홈페이지 ⭐
- `/space-test` - 3D 태양계
- `/loading-test` - 로딩 애니메이션

---

## ⚠️ 주의사항

### GitHub Token 권한
- ✅ `repo` (전체)
- ✅ `workflow`

### Vercel Token 범위
- ✅ Full Account

### 빌드 실패 시
```bash
# 로컬에서 먼저 빌드 테스트
cd sajutight-v2
npm run build
```

---

## 🔄 재배포

코드 수정 후:
```bash
git add .
git commit -m "feat: 업데이트"
git push origin main
# Vercel 자동 배포됨
```

---

**준비 완료!** 토큰을 설정하고 배포 스크립트를 실행하세요.
