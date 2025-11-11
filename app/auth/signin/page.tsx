'use client';

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

/**
 * 사주우주 로그인 페이지
 * Glassmorphism 디자인 적용
 */
export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const error = searchParams?.get("error");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  // TEST MODE: Skip auth and go directly to dashboard
  const handleTestLogin = () => {
    setIsLoading("test");
    // Store test user in localStorage for demo
    if (typeof window !== "undefined") {
      localStorage.setItem("test_user", JSON.stringify({
        name: "테스트 사용자",
        email: "test@sajuwooju.com",
        image: "",
        isTestUser: true
      }));
    }
    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Cosmic Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md glass-card p-8 sm:p-10 space-y-8 relative z-10">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-star-gold to-cosmic-purple rounded-full flex items-center justify-center text-3xl">
              🌌
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            사주우주
          </h1>
          <p className="text-slate-600">
            우주의 법칙으로 읽는 나의 운명
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-badge bg-red-100/90 text-red-700 p-3 rounded-lg text-center text-sm">
            {error === "OAuthAccountNotLinked"
              ? "이미 다른 방법으로 가입된 이메일입니다."
              : error === "AccessDenied"
              ? "로그인이 거부되었습니다."
              : "로그인 중 오류가 발생했습니다."}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Login */}
          <button
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading !== null}
            className="w-full glass-button-full px-4 py-3 rounded-xl flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-medium text-slate-700">
              Google로 계속하기
            </span>
          </button>

          {/* Kakao Login */}
          <button
            onClick={() => handleSocialLogin("kakao")}
            disabled={isLoading !== null}
            className="w-full glass-button-full px-4 py-3 rounded-xl flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FDD800] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "kakao" ? (
              <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-4.622a.472.472 0 0 0-.874-.367l-1.99 3.25-1.414-1.414V6.472a.472.472 0 1 0-.943 0v4.957l-1.414-1.414-1.99-3.25a.472.472 0 0 0-.874.367l1.47 4.622-1.47 4.622a.472.472 0 0 0 .874.368l1.99-3.25 1.414 1.414v1.435a.472.472 0 1 0 .943 0V14.91l1.414 1.414 1.99 3.25a.472.472 0 0 0 .874-.368l-1.47-4.622z"/>
              </svg>
            )}
            <span className="font-medium text-slate-800">
              카카오로 계속하기
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-slate-500">
              또는
            </span>
          </div>
        </div>

        {/* Test Login Button (Development/Demo) */}
        <button
          onClick={handleTestLogin}
          disabled={isLoading !== null}
          className="w-full glass-button px-4 py-3 rounded-xl text-center font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading === "test" ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>로그인 중...</span>
            </div>
          ) : (
            <>🚀 테스트 로그인 (대시보드 미리보기)</>
          )}
        </button>

        {/* Guest Mode */}
        <Link
          href="/"
          className="block w-full glass-button px-4 py-3 rounded-xl text-center font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          로그인 없이 둘러보기
        </Link>

        {/* Terms */}
        <p className="text-xs text-center text-slate-500 leading-relaxed">
          로그인하면{" "}
          <Link href="/terms" className="underline hover:text-slate-700">
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="/privacy" className="underline hover:text-slate-700">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
