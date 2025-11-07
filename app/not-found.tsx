import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * 404 Not Found 페이지
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl">🔍</span>
        </div>

        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-primary mb-4">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              홈으로 돌아가기
            </Button>
          </Link>

          <Link href="/menu">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              전체 메뉴 보기
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-muted">
          <p className="text-sm text-muted-foreground mb-4">추천 페이지</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/coupons">
              <Button variant="ghost" size="sm">쿠폰함</Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" size="sm">상담 내역</Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" size="sm">고객센터</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
