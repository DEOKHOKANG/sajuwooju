/**
 * Saju Result Page
 * Phase 8.11: Result Page Design Template
 * /result/[sessionId]
 *
 * NOTE: Temporarily disabled - Prisma not configured for deployment
 */

import { Metadata } from 'next';

interface ResultPageProps {
  params: {
    sessionId: string;
  };
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { sessionId } = params;

  return {
    title: `사주 분석 결과 - 타이트사주`,
    description: '당신의 사주 분석 결과를 확인해보세요',
    openGraph: {
      title: '사주 분석 결과 - 타이트사주',
      description: '당신의 사주 분석 결과를 확인해보세요',
      type: 'website',
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { sessionId } = params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          사주 분석 기능은 현재 준비 중입니다
        </h1>
        <p className="text-gray-600">
          빠른 시일 내에 이용 가능하도록 하겠습니다.
        </p>
      </div>
    </div>
  );
}
