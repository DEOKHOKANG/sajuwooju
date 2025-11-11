/**
 * 사주랭킹 상세 페이지 (상용화급)
 * 로그인 게이트 적용 - 로그인 필요
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";

export default function RankingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // TODO: 실제 로그인 상태 체크 로직
    // 현재는 항상 false (로그인 필요)
    const checkLoginStatus = () => {
      // const session = getSession(); // NextAuth 사용 시
      // setIsLoggedIn(!!session);
      setIsLoggedIn(false); // 현재는 항상 로그인 필요
    };

    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    // 로그인 후 현재 페이지로 리다이렉트
    router.push(`/auth/signin?callbackUrl=/ranking/${id}`);
  };

  const handleGoBack = () => {
    router.push("/ranking");
  };

  if (isLoggedIn === null) {
    // 로딩 상태
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // 로그인 게이트
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-scale-in">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">랭킹 목록으로</span>
          </button>

          {/* 로그인 게이트 카드 */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
            {/* 잠금 아이콘 */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50 animate-pulse">
              <Lock className="w-10 h-10 text-white" />
            </div>

            {/* 제목 */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              로그인이 필요합니다
            </h2>

            {/* 설명 */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              사주 상세 정보를 보려면
              <br />
              로그인이 필요합니다
            </p>

            {/* 혜택 안내 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 mb-6">
              <h3 className="font-bold text-purple-900 mb-3 text-center">
                로그인 후 이용 가능
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold flex-shrink-0">✓</span>
                  <span>모든 사주 상세 정보 열람</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold flex-shrink-0">✓</span>
                  <span>나의 사주 분석 결과 저장</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold flex-shrink-0">✓</span>
                  <span>AI 채팅으로 궁금한 점 질문</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold flex-shrink-0">✓</span>
                  <span>무제한 사주 분석 이용</span>
                </li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                로그인하기
              </button>
              <button
                onClick={handleGoBack}
                className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                랭킹 목록 보기
              </button>
            </div>

            {/* 추가 안내 */}
            <p className="text-center text-xs text-gray-500 mt-6">
              카카오톡 또는 Google 계정으로 간편하게 시작하세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 상태 - 실제 상세 페이지 표시
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">랭킹 목록으로</span>
        </button>

        {/* 상세 페이지 콘텐츠 (TODO: 실제 데이터 연동) */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            사주 상세 페이지
          </h1>
          <p className="text-gray-600">ID: {id}</p>
          <p className="text-sm text-gray-500 mt-4">
            TODO: 실제 사주 상세 정보를 표시합니다
          </p>
        </div>
      </div>
    </div>
  );
}
