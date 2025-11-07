'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Global Error Boundary
 * https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (production에서는 Sentry 등으로 전송)
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl">⚠️</span>
        </div>

        <h1 className="text-4xl font-bold text-primary mb-4">오류 발생</h1>
        <h2 className="text-2xl font-semibold text-primary mb-4">
          문제가 발생했습니다
        </h2>

        <p className="text-muted-foreground mb-8">
          일시적인 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-sm font-mono text-red-600 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={reset}>
            다시 시도
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            홈으로 돌아가기
          </Button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-muted-foreground">
            문제가 계속되면{' '}
            <a href="/support" className="text-primary underline">
              고객센터
            </a>
            로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
