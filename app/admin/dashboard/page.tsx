"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/Card";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 인증 확인
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "총 사용자",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: "👥",
      href: "/admin/users",
    },
    {
      title: "오늘 상담",
      value: "56",
      change: "+8.2%",
      trend: "up",
      icon: "📊",
      href: "/admin/consultations",
    },
    {
      title: "오늘 결제",
      value: "₩1,234,000",
      change: "+15.3%",
      trend: "up",
      icon: "💰",
      href: "/admin/payments",
    },
    {
      title: "활성 상품",
      value: "24",
      change: "+2",
      trend: "up",
      icon: "🛍️",
      href: "/admin/products",
    },
  ];

  const quickLinks = [
    { title: "사용자 관리", icon: "👥", href: "/admin/users", description: "사용자 목록 및 관리" },
    { title: "상담 관리", icon: "📊", href: "/admin/consultations", description: "사주 상담 내역" },
    { title: "상품 관리", icon: "🛍️", href: "/admin/products", description: "상품 등록 및 수정" },
    { title: "결제 관리", icon: "💳", href: "/admin/payments", description: "결제 내역 확인" },
    { title: "배너 관리", icon: "🎨", href: "/admin/banners", description: "이벤트 배너 관리" },
    { title: "후기 관리", icon: "⭐", href: "/admin/testimonials", description: "사용자 후기 관리" },
    { title: "행성 데이터", icon: "🪐", href: "/admin/planets", description: "행성 정보 관리" },
    { title: "설정", icon: "⚙️", href: "/admin/settings", description: "시스템 설정" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* 헤더 */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌌</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">사주우주 어드민</h1>
                <p className="text-xs text-slate-400">Administrator Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">대시보드</h2>
          <p className="text-slate-400">사주우주 관리 시스템에 오신 것을 환영합니다</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card
                variant="elevated"
                className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{stat.icon}</span>
                    <div className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded">
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <Card variant="bordered" className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">빠른 링크</CardTitle>
            <CardDescription className="text-slate-400">
              자주 사용하는 관리 메뉴
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <div className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all duration-300 cursor-pointer group">
                    <div className="text-3xl mb-2">{link.icon}</div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-xs text-slate-400">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Development Notice */}
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🚀</span>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">개발 중인 기능</h3>
              <p className="text-sm text-slate-300 mb-3">
                현재 어드민 시스템의 핵심 기능들을 구축 중입니다.
              </p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✅ 디자인 시스템 및 UI 컴포넌트 라이브러리</li>
                <li>✅ 인증 시스템 (임시 구현)</li>
                <li>✅ 대시보드 레이아웃</li>
                <li>🔄 각 관리 페이지 (진행 중)</li>
                <li>🔄 실시간 통계 및 차트</li>
                <li>🔄 Prisma API 완전 연동</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
