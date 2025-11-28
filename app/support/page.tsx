'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    id: 1,
    question: '사주 상담은 어떻게 진행되나요?',
    answer: '상품 구매 후 생년월일과 시간 정보를 입력하시면, 전문 상담사가 24시간 내에 상세한 사주 분석 리포트를 제공해드립니다. 추가로 1:1 채팅 상담을 통해 궁금한 점을 질문하실 수 있습니다.',
    category: '서비스',
  },
  {
    id: 2,
    question: '환불은 가능한가요?',
    answer: '상담이 시작되기 전까지는 전액 환불이 가능합니다. 상담이 시작된 후에는 부분 환불 정책이 적용됩니다. 자세한 내용은 환불 정책 페이지를 참고해주세요.',
    category: '결제/환불',
  },
  {
    id: 3,
    question: '쿠폰은 어떻게 사용하나요?',
    answer: '상품 구매 시 결제 페이지에서 보유하신 쿠폰을 선택하여 적용하실 수 있습니다. 쿠폰함에서 사용 가능한 쿠폰을 확인하실 수 있습니다.',
    category: '쿠폰',
  },
  {
    id: 4,
    question: '리포트는 언제 받을 수 있나요?',
    answer: '결제 완료 후 생년월일 정보 입력이 완료되면, 평균 12-24시간 내에 리포트가 제공됩니다. 리포트 완성 시 푸시 알림과 이메일로 안내해드립니다.',
    category: '서비스',
  },
  {
    id: 5,
    question: '개인정보는 안전하게 보호되나요?',
    answer: '고객님의 모든 개인정보는 암호화되어 안전하게 보관되며, 상담 목적 이외에는 절대 사용되지 않습니다. 개인정보처리방침을 참고해주세요.',
    category: '개인정보',
  },
];

export default function SupportPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            고객센터
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 pb-20">
        {/* Contact Methods */}
        <section className="py-6 border-b border-border">
          <h2 className="text-sm font-bold text-primary mb-4">문의하기</h2>

          <div className="grid grid-cols-3 gap-3">
            {/* 1:1 Chat */}
            <button className="flex flex-col items-center gap-2 py-4 bg-muted-100 hover:bg-muted-200 transition-colors" style={{ borderRadius: '12px' }}>
              <MessageCircle className="w-6 h-6 text-secondary" />
              <span className="text-xs font-medium text-primary">1:1 채팅</span>
            </button>

            {/* Email */}
            <button className="flex flex-col items-center gap-2 py-4 bg-muted-100 hover:bg-muted-200 transition-colors" style={{ borderRadius: '12px' }}>
              <Mail className="w-6 h-6 text-secondary" />
              <span className="text-xs font-medium text-primary">이메일</span>
            </button>

            {/* Phone */}
            <button className="flex flex-col items-center gap-2 py-4 bg-muted-100 hover:bg-muted-200 transition-colors" style={{ borderRadius: '12px' }}>
              <Phone className="w-6 h-6 text-secondary" />
              <span className="text-xs font-medium text-primary">전화</span>
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 text-sm text-slate-600" style={{ borderRadius: '8px' }}>
            <div className="font-medium text-primary mb-1">운영시간</div>
            <div className="text-xs">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-6">
          <h2 className="text-sm font-bold text-primary mb-4">자주 묻는 질문</h2>

          <div className="space-y-2">
            {FAQS.map((faq) => (
              <div
                key={faq.id}
                className="border border-border overflow-hidden"
                style={{ borderRadius: '12px' }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-start justify-between p-4 text-left hover:bg-muted-100 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="text-xs text-secondary font-medium mb-1">
                      {faq.category}
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {faq.question}
                    </div>
                  </div>
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {expandedId === faq.id && (
                  <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-border pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-6 border-t border-border">
          <div className="bg-muted-100 p-4" style={{ borderRadius: '12px' }}>
            <h3 className="font-bold text-primary mb-2 text-sm">문의 전 확인해주세요</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex gap-2">
                <span className="text-secondary">•</span>
                <span>주문번호를 함께 알려주시면 더 빠른 상담이 가능합니다</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">•</span>
                <span>상담 내역은 마이페이지에서 확인하실 수 있습니다</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">•</span>
                <span>영업시간 외 문의는 다음 영업일에 순차적으로 답변됩니다</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
