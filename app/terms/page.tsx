'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            이용약관
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 py-6 pb-20">
        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제1조 (목적)</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              본 약관은 사주우주(이하 "회사")가 제공하는 사주 상담 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제2조 (정의)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                1. "서비스"란 회사가 제공하는 사주 상담, 운세 분석 등 모든 온라인 상담 서비스를 의미합니다.
              </p>
              <p>
                2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
              </p>
              <p>
                3. "회원"이란 회사와 이용계약을 체결하고 아이디(ID)와 비밀번호를 부여받은 이용자를 말합니다.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제3조 (약관의 게시와 개정)</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정된 약관은 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 전부터 적용일자 전일까지 공지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제4조 (서비스의 제공 및 변경)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                1. 회사는 다음과 같은 서비스를 제공합니다:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>사주 분석 및 운세 상담 서비스</li>
                <li>1:1 채팅 상담 서비스</li>
                <li>PDF 리포트 제공 서비스</li>
                <li>기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 제공하는 일체의 서비스</li>
              </ul>
              <p>
                2. 회사는 필요한 경우 서비스의 내용을 추가 또는 변경할 수 있습니다.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제5조 (서비스의 중단)</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 회사는 서비스 화면에 이를 공지하거나 이용자에게 통지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제6조 (회원가입)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
              </p>
              <p>
                2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제7조 (결제 및 환불)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                1. 서비스 이용료는 각 서비스별로 명시된 금액에 따릅니다.
              </p>
              <p>
                2. 결제는 신용카드, 계좌이체, 카카오페이 등 회사가 제공하는 방법을 통해 진행됩니다.
              </p>
              <p>
                3. 환불 정책은 별도의 환불 정책에 따르며, 상담이 시작되기 전까지 전액 환불이 가능합니다.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제8조 (이용자의 의무)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                이용자는 다음 행위를 하여서는 안됩니다:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>신청 또는 변경 시 허위내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              </ul>
            </div>
          </section>

          <div className="mt-8 p-4 bg-muted-100" style={{ borderRadius: '12px' }}>
            <p className="text-xs text-slate-500">
              시행일자: 2024년 1월 1일
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
