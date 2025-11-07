'use client';

import { useState } from 'react';
import { SajuLoader, SimpleSajuLoader } from '@/components/SajuLoader';

/**
 * Loading Test Page
 * 로딩 애니메이션 테스트 페이지
 */
export default function LoadingTestPage() {
  const [isLoading3D, setIsLoading3D] = useState(false);
  const [isLoadingSimple, setIsLoadingSimple] = useState(false);

  const handleStart3D = () => {
    setIsLoading3D(true);
  };

  const handleComplete3D = () => {
    setIsLoading3D(false);
    alert('3D 로딩 완료!');
  };

  const handleStartSimple = () => {
    setIsLoadingSimple(true);
  };

  const handleCompleteSimple = () => {
    setIsLoadingSimple(false);
    alert('간단한 로딩 완료!');
  };

  return (
    <div className="min-h-screen bg-space-black">
      {/* 3D Loader */}
      {isLoading3D && (
        <SajuLoader
          isLoading={isLoading3D}
          onComplete={handleComplete3D}
          variant="full"
          mode="3d"
        />
      )}

      {/* Simple Loader */}
      {isLoadingSimple && (
        <SimpleSajuLoader
          isLoading={isLoadingSimple}
          onComplete={handleCompleteSimple}
        />
      )}

      {/* Test Controls */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-5xl font-bold text-gradient-gold mb-8">
            로딩 애니메이션 테스트
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 3D Loader Test */}
            <div className="glass rounded-2xl p-8">
              <div className="mb-6">
                <span className="text-6xl mb-4 block">🌌</span>
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
                  3D 로딩 애니메이션
                </h2>
                <p className="text-text-secondary text-sm mb-4">
                  3D 우주 행성이 회전하는 완전한 로딩 경험
                </p>
              </div>

              <ul className="text-sm text-text-tertiary mb-6 space-y-2">
                <li>✓ 5개 행성 회전 애니메이션</li>
                <li>✓ 16개 단계 메시지</li>
                <li>✓ 그라디언트 프로그레스 바</li>
                <li>✓ Three.js 3D 렌더링</li>
                <li>✓ 약 35초 소요</li>
              </ul>

              <button
                onClick={handleStart3D}
                disabled={isLoading3D}
                className="w-full px-6 py-3 bg-gradient-nebula text-white font-display font-semibold text-lg rounded-xl hover:scale-105 hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                3D 로딩 시작
              </button>
            </div>

            {/* Simple Loader Test */}
            <div className="glass rounded-2xl p-8">
              <div className="mb-6">
                <span className="text-6xl mb-4 block">⭐</span>
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
                  간단한 로딩
                </h2>
                <p className="text-text-secondary text-sm mb-4">
                  가벼운 버전의 로딩 애니메이션
                </p>
              </div>

              <ul className="text-sm text-text-tertiary mb-6 space-y-2">
                <li>✓ 원형 프로그레스</li>
                <li>✓ 6개 단계 메시지</li>
                <li>✓ 그라디언트 바</li>
                <li>✓ 3D 없음 (가벼움)</li>
                <li>✓ 약 8.5초 소요</li>
              </ul>

              <button
                onClick={handleStartSimple}
                disabled={isLoadingSimple}
                className="w-full px-6 py-3 bg-gradient-aurora text-space-black font-display font-semibold text-lg rounded-xl hover:scale-105 hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                간단한 로딩 시작
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 glass rounded-2xl p-8">
            <h3 className="font-display text-xl font-semibold text-text-primary mb-4">
              📋 구현 내역
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-text-secondary font-medium mb-3">
                  컴포넌트
                </h4>
                <ul className="text-sm text-text-tertiary space-y-1">
                  <li>• SajuLoader (메인)</li>
                  <li>• SimpleSajuLoader (간단 버전)</li>
                  <li>• LoadingScene (3D 씬)</li>
                  <li>• ProgressBar (막대 프로그레스)</li>
                  <li>• CircularProgress (원형 프로그레스)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-text-secondary font-medium mb-3">
                  기능
                </h4>
                <ul className="text-sm text-text-tertiary space-y-1">
                  <li>• 16개 AI 분석 메시지</li>
                  <li>• 음양오행 행성 매핑</li>
                  <li>• 실시간 프로그레스 추적</li>
                  <li>• 자동 완료 콜백</li>
                  <li>• Shimmer 애니메이션 효과</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-star-gold hover:text-star-silver transition-colors"
            >
              ← 홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
