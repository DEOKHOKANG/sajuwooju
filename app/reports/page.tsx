'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, Download } from 'lucide-react';
import Image from 'next/image';

interface Report {
  id: number;
  title: string;
  category: string;
  purchaseDate: string;
  status: 'completed' | 'pending';
  thumbnail: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    title: '2025년 신년운세',
    category: '신년운세',
    purchaseDate: '2025.01.15',
    status: 'completed',
    thumbnail: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1759473519135x221915343896830200/IMG%29%20%E1%84%86%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%20%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%A7%E1%86%AB.svg',
  },
  {
    id: 2,
    title: '궁합사주',
    category: '궁합',
    purchaseDate: '2024.12.20',
    status: 'completed',
    thumbnail: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754467365568x557988189999608800/%EA%B6%81%ED%95%A9%EC%82%AC%EC%A3%BC-%EC%8D%B8%EB%84%A4%EC%9D%BC.png',
  },
  {
    id: 3,
    title: '솔로탈출 사주',
    category: '솔로/연애운',
    purchaseDate: '2024.11.10',
    status: 'pending',
    thumbnail: 'https://8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io/f1754466621316x990961257053425200/%EC%86%94%EB%A1%9C%ED%83%88%EC%B6%9C%EC%82%AC%EC%A3%BC.png',
  },
];

export default function ReportsPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredReports = MOCK_REPORTS.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="mx-auto w-full max-w-[600px] px-4 py-3 flex items-center gap-3">
          <Link href="/menu">
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              style={{ borderRadius: '50%' }}
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
          </Link>
          <h1 className="font-display text-lg font-semibold text-primary">
            내 리포트
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px]">
        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 py-4 bg-white border-b border-border">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-secondary text-white'
                : 'bg-muted-100 text-slate-600'
            }`}
            style={{ borderRadius: '20px' }}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-secondary text-white'
                : 'bg-muted-100 text-slate-600'
            }`}
            style={{ borderRadius: '20px' }}
          >
            완료
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-secondary text-white'
                : 'bg-muted-100 text-slate-600'
            }`}
            style={{ borderRadius: '20px' }}
          >
            대기중
          </button>
        </div>

        {/* Reports List */}
        <div className="px-4 py-6">
          {filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-400 text-sm">
                리포트가 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-muted-100 overflow-hidden"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div
                      className="w-20 h-24 bg-gradient-to-br from-pink-100 to-pink-200 flex-shrink-0 relative overflow-hidden"
                      style={{ borderRadius: '8px' }}
                    >
                      <Image
                        src={report.thumbnail}
                        alt={report.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Report Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-bold text-primary mb-1">
                            {report.title}
                          </div>
                          <div className="text-xs text-slate-500 mb-2">
                            {report.category}
                          </div>
                        </div>
                        {report.status === 'completed' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium" style={{ borderRadius: '4px' }}>
                            완료
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium" style={{ borderRadius: '4px' }}>
                            대기중
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                        <Calendar className="w-3 h-3" />
                        <span>{report.purchaseDate}</span>
                      </div>

                      {/* Action Buttons */}
                      {report.status === 'completed' ? (
                        <div className="flex gap-2">
                          <button
                            className="flex-1 py-2 bg-secondary text-white text-xs font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1"
                            style={{ borderRadius: '6px' }}
                          >
                            <FileText className="w-3 h-3" />
                            보기
                          </button>
                          <button
                            className="flex-1 py-2 bg-white border border-border text-primary text-xs font-medium hover:bg-muted-100 transition-colors flex items-center justify-center gap-1"
                            style={{ borderRadius: '6px' }}
                          >
                            <Download className="w-3 h-3" />
                            다운로드
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">
                          상담사 분석 중입니다...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
