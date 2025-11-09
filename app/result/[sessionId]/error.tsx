'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ResultErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Result Page Error Boundary
 * Phase 10.2: Result-specific Error Handling
 * /result/[sessionId]/error.tsx
 *
 * Handles errors specific to the result page such as:
 * - Invalid or expired session IDs
 * - Data retrieval failures
 * - Calculation errors
 *
 * Features:
 * - Cosmic-themed error UI
 * - Session-specific error messages
 * - Navigation to create new consultation
 * - Responsive design
 */
export default function ResultError({ error, reset }: ResultErrorProps) {
  useEffect(() => {
    // 결과 페이지 에러 로깅
    console.error('Result page error:', error);

    // TODO: 실제 배포 시 에러 추적 서비스 연동
    // logToExternalService(error, {
    //   page: 'result',
    //   context: 'result_display'
    // });
  }, [error]);

  return (
    <div className="min-h-screen bg-space relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* 떠다니는 오브 - 배경 장식 */}
        <div className="absolute top-10 right-20 w-80 h-80 bg-nebula-pink rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cosmic-purple rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" style={{ animationDelay: '-7s' }} />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-nebula-blue rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-dust" style={{ animationDelay: '-14s' }} />

        {/* 별 배경 */}
        <div className="absolute inset-0 stars-background" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            {/* Rotating orbit */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-comet-cyan border-r-cosmic-purple animate-spin" />
            <div className="absolute inset-2 rounded-full border border-transparent border-t-nebula-pink border-r-aurora-green opacity-50 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />

            {/* 중앙 아이콘 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl">⏱️</div>
            </div>
          </div>
        </div>

        {/* Main Error Message */}
        <div className="glass rounded-2xl p-8 mb-8 border border-ui-border">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-nebula mb-3 text-center">
            세션이 만료되었습니다
          </h1>

          <p className="text-text-secondary text-center text-sm sm:text-base mb-6">
            요청하신 사주 분석 결과를 불러올 수 없습니다.
          </p>

          {/* Error Details */}
          <div className="space-y-4">
            {/* Possible Reasons */}
            <div className="space-y-2">
              <p className="text-xs text-status-warning uppercase tracking-wider font-semibold">
                가능한 원인
              </p>
              <ul className="text-sm text-text-secondary space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-comet-cyan mt-1">▸</span>
                  <span>세션이 만료되었을 수 있습니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-nebula-pink mt-1">▸</span>
                  <span>올바르지 않은 링크를 사용했을 수 있습니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-aurora-green mt-1">▸</span>
                  <span>서버에 일시적인 문제가 발생했을 수 있습니다</span>
                </li>
              </ul>
            </div>

            {/* Development Error */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 pt-4 border-t border-ui-border">
                <p className="text-xs text-status-warning uppercase tracking-wider font-semibold mb-2">
                  개발자 정보
                </p>
                <div className="bg-space-dark/50 rounded-lg p-3 border border-status-error/20 overflow-auto max-h-32">
                  <p className="text-xs font-mono text-status-error break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-status-warning mt-2">
                      Error ID: <span className="font-mono">{error.digest}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {/* New Consultation Button - Primary CTA */}
          <Link
            href="/consult"
            className="w-full px-6 py-4 bg-cosmic-purple hover:bg-cosmic-purple/90 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-cosmic-purple/50 flex items-center justify-center gap-2"
          >
            <span>새로운 사주 분석 시작</span>
            <span className="text-lg">✨</span>
          </Link>

          {/* Retry / Go Home */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={reset}
              className="px-4 py-3 glass hover:bg-ui-glass-hover text-text-primary font-semibold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="text-lg">↻</span>
              <span className="text-sm">다시 시도</span>
            </button>

            <Link
              href="/"
              className="px-4 py-3 glass hover:bg-ui-glass-hover text-text-primary font-semibold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="text-lg">→</span>
              <span className="text-sm">홈으로</span>
            </Link>
          </div>
        </div>

        {/* Recovery Tips */}
        <div className="glass rounded-xl p-5 border border-ui-border/50">
          <p className="text-xs text-text-tertiary uppercase tracking-widest mb-3 font-semibold">
            💡 팁
          </p>
          <ul className="text-xs text-text-secondary space-y-2">
            <li className="flex gap-2">
              <span className="text-nebula-blue flex-shrink-0">→</span>
              <span>브라우저 캐시를 지우고 다시 시도해보세요</span>
            </li>
            <li className="flex gap-2">
              <span className="text-aurora-green flex-shrink-0">→</span>
              <span>다른 브라우저나 기기에서 접속해보세요</span>
            </li>
            <li className="flex gap-2">
              <span className="text-comet-cyan flex-shrink-0">→</span>
              <span>문제가 지속되면 고객센터에 문의하세요</span>
            </li>
          </ul>

          {/* Contact Support */}
          <div className="mt-4 pt-4 border-t border-ui-border/50">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-comet-cyan hover:text-comet-cyan/80 text-xs font-medium transition-colors"
            >
              <span>💬</span>
              <span>고객센터로 문의하기</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Error Code Badge */}
        <div className="mt-8 flex justify-center">
          <div className="glass px-4 py-2 rounded-full border border-ui-border">
            <p className="text-xs text-text-tertiary font-mono">
              Error: {error.digest?.slice(0, 8) || 'SESSION_ERROR'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
