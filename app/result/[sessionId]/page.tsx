/**
 * Saju Result Page
 * Phase 8.11: Result Page Design Template
 * /result/[sessionId]
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SajuResultDisplay from '@/components/result/saju-result-display';
import { prisma } from '@/lib/prisma';

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

async function getConsultationData(sessionId: string) {
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { sessionId },
    });

    if (!consultation) {
      return null;
    }

    // Parse saju data
    let sajuData = null;
    if (consultation.sajuData) {
      try {
        sajuData = JSON.parse(consultation.sajuData);
      } catch (error) {
        console.error('Failed to parse sajuData:', error);
      }
    }

    return {
      id: consultation.id,
      sessionId: consultation.sessionId,
      name: consultation.name,
      birthDate: consultation.birthDate,
      birthTime: consultation.birthTime,
      gender: consultation.gender,
      isLunar: consultation.isLunar,
      status: consultation.status,
      sajuData,
      createdAt: consultation.createdAt,
    };
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return null;
  }
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { sessionId } = params;

  const consultation = await getConsultationData(sessionId);

  if (!consultation) {
    notFound();
  }

  if (!consultation.sajuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            사주 계산 중입니다
          </h1>
          <p className="text-gray-600">
            잠시만 기다려주세요...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <SajuResultDisplay
        sessionId={consultation.sessionId}
        name={consultation.name}
        birthDate={consultation.birthDate}
        birthTime={consultation.birthTime}
        gender={consultation.gender}
        isLunar={consultation.isLunar}
        sajuData={consultation.sajuData}
        createdAt={consultation.createdAt}
      />
    </main>
  );
}
