'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Category Page Error Boundary
 */
export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Category page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl">🏷️</span>
        </div>

        <h2 className="text-2xl font-semibold text-primary mb-4">
          카테고리 정보를 불러올 수 없습니다
        </h2>

        <p className="text-muted-foreground mb-8">
          요청하신 카테고리 정보를 표시하는 중 문제가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={reset}>
            다시 시도
          </Button>

          <Link href="/">
            <Button size="lg" variant="outline">
              전체 카테고리 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
