@echo off
REM Deployment script for Windows
REM Usage: Set environment variables and run this script

echo ========================================
echo   SajuWooju Deployment Script
echo ========================================
echo.

REM Check if tokens are set
if "%GITHUB_TOKEN%"=="" (
    echo [ERROR] GITHUB_TOKEN is not set
    echo Please set it with: set GITHUB_TOKEN=your_token_here
    echo.
    pause
    exit /b 1
)

if "%VERCEL_TOKEN%"=="" (
    echo [ERROR] VERCEL_TOKEN is not set
    echo Please set it with: set VERCEL_TOKEN=your_token_here
    echo.
    pause
    exit /b 1
)

echo [1/3] Creating GitHub repository...
echo.

REM Create GitHub repository
curl -X POST ^
  -H "Authorization: token %GITHUB_TOKEN%" ^
  -H "Accept: application/vnd.github.v3+json" ^
  https://api.github.com/user/repos ^
  -d "{\"name\":\"sajuwooju\",\"description\":\"사주우주 (SajuWooju) - 우주의 법칙으로 읽는 나의 운명\",\"private\":false}"

echo.
echo [2/3] Pushing to GitHub...
echo.

git remote add origin https://github.com/efuelteam/sajuwooju.git
git push -u origin main

echo.
echo [3/3] Deploying to Vercel...
echo.

vercel --token %VERCEL_TOKEN% --prod --yes --name sajuwooju

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo GitHub: https://github.com/efuelteam/sajuwooju
echo Vercel: https://sajuwooju.vercel.app
echo.
pause
