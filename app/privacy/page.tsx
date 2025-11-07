'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
            개인정보처리방침
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 py-6 pb-20">
        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              타이트 사주(이하 "회사")는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제1조 (개인정보의 처리 목적)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>회원 가입 및 관리</li>
                <li>사주 상담 서비스 제공</li>
                <li>고지사항 전달, 본인의사 확인, 불만처리 등 원활한 의사소통 경로의 확보</li>
                <li>서비스 이용에 따른 본인확인 및 결제</li>
                <li>신규 서비스 개발 및 마케팅·광고에의 활용</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <p>
                각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>회원 가입 및 관리: 회원 탈퇴 시까지</li>
                <li>서비스 제공: 서비스 제공 완료 시까지</li>
                <li>결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제3조 (처리하는 개인정보의 항목)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                회사는 다음의 개인정보 항목을 처리하고 있습니다:
              </p>
              <div className="bg-muted-100 p-4 mb-4" style={{ borderRadius: '8px' }}>
                <h4 className="font-bold mb-2">필수항목</h4>
                <ul className="list-disc list-inside pl-2 space-y-1 text-xs">
                  <li>이름, 생년월일, 출생시간</li>
                  <li>이메일 주소, 휴대전화번호</li>
                  <li>로그인ID, 비밀번호</li>
                  <li>결제정보 (카드번호, 계좌번호 등)</li>
                </ul>
              </div>
              <div className="bg-muted-100 p-4" style={{ borderRadius: '8px' }}>
                <h4 className="font-bold mb-2">선택항목</h4>
                <ul className="list-disc list-inside pl-2 space-y-1 text-xs">
                  <li>프로필 사진</li>
                  <li>마케팅 수신 동의 여부</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제4조 (개인정보의 제3자 제공)</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제5조 (개인정보의 파기)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>
              <p>
                개인정보 파기의 절차 및 방법은 다음과 같습니다:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>파기절차: 불필요한 개인정보는 개인정보 보호책임자의 책임 하에 내부방침 절차에 따라 파기합니다.</li>
                <li>파기방법: 전자적 파일 형태의 정보는 복구 및 재생되지 않도록 안전하게 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
              <p>
                권리 행사는 회사에 대해 서면, 전화, 이메일 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제7조 (개인정보의 안전성 확보조치)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>접속기록의 보관 및 위변조 방지</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">제8조 (개인정보 보호책임자)</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-muted-100 p-4" style={{ borderRadius: '8px' }}>
                <p className="font-bold mb-2">개인정보 보호책임자</p>
                <ul className="space-y-1 text-xs">
                  <li>담당부서: 운영팀</li>
                  <li>이메일: privacy@sajutight.me</li>
                  <li>전화번호: 02-1234-5678</li>
                </ul>
              </div>
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
