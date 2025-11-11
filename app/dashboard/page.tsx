"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TodayFortune } from "@/components/dashboard/TodayFortune";
import { RecentAnalysis } from "@/components/dashboard/RecentAnalysis";
import { SAJU_SERVICES } from "@/lib/services-data";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for test user in localStorage
    if (typeof window !== "undefined") {
      const testUser = localStorage.getItem("test_user");
      if (testUser) {
        const parsedUser = JSON.parse(testUser);
        setUser({
          name: parsedUser.name,
          email: parsedUser.email,
          profileImage: parsedUser.image,
          joinDate: new Date().toISOString().split('T')[0],
          level: 1,
          isTestUser: true,
        });
        setIsLoading(false);
        return;
      }
    }

    // If no test user, redirect to signin
    router.push("/auth/signin?callbackUrl=/dashboard");
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">🌌</div>
          <p className="text-slate-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Recommended services (first 3 from SAJU_SERVICES)
  const recommendedServices = SAJU_SERVICES.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 pt-20 pb-24">
      {/* Test Mode Badge */}
      {user.isTestUser && (
        <div className="fixed top-16 right-4 z-50 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
          🚀 테스트 모드
        </div>
      )}

      {/* Welcome Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            안녕하세요, {user.name}님
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            오늘도 좋은 하루 되세요!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 space-y-8 sm:space-y-12">
        {/* Profile Card */}
        <section className="">
          <ProfileCard user={user} />
        </section>

        {/* Quick Actions */}
        <section className="">
          <QuickActions />
        </section>

        {/* Today's Fortune */}
        <section className="">
          <TodayFortune />
        </section>

        {/* Recent Analysis */}
        <section className="">
          <RecentAnalysis />
        </section>

        {/* Recommended Services */}
        <section className="">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-violet-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {user.name}님을 위한 추천 서비스
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recommendedServices.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="group glass-card p-6 hover:scale-105 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{service.icon}</span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-violet-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {service.description}
                </p>

                {/* Badge */}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${service.gradient} text-white`}
                  >
                    {service.element}
                  </span>
                  <span className="text-slate-400 text-sm">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
