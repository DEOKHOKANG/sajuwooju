import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TodayFortune } from "@/components/dashboard/TodayFortune";
import { RecentAnalysis } from "@/components/dashboard/RecentAnalysis";
import { SAJU_SERVICES } from "@/lib/services-data";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default async function DashboardPage() {
  // Get authenticated session
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  // User data from session
  const user = {
    name: session.user.name || "사용자",
    email: session.user.email || "",
    profileImage: session.user.image || "",
    joinDate: new Date().toISOString().split('T')[0], // Placeholder
    level: 1, // Placeholder - can be fetched from database
  };

  // Recommended services (first 3 from SAJU_SERVICES)
  const recommendedServices = SAJU_SERVICES.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 pt-20 pb-24">
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
        <section
          
          className=""
          style={{ animationDelay: "100ms" }}
          
        >
          <ProfileCard user={user} />
        </section>

        {/* Quick Actions */}
        <section
          
          className=""
          style={{ animationDelay: "200ms" }}
          
        >
          <QuickActions />
        </section>

        {/* Two Column Layout for Fortune and Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Today's Fortune */}
          <section
            
            className=""
            style={{ animationDelay: "300ms" }}
            
          >
            <TodayFortune />
          </section>

          {/* Placeholder for future widget */}
          <section
            className=""
            style={{ animationDelay: "350ms" }}
          >
            <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden h-full">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-teal-400/20" />
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

              {/* Border */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-blue-200/50" />

              <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[200px] text-center space-y-3">
                <Sparkles className="w-12 h-12 text-blue-500 opacity-50" />
                <p className="text-sm text-gray-500">추가 위젯 영역</p>
              </div>
            </div>
          </section>
        </div>

        {/* Recent Analysis */}
        <section
          
          className=""
          style={{ animationDelay: "400ms" }}
          
        >
          <RecentAnalysis />
        </section>

        {/* Recommended Services */}
        <section
          
          className=""
          style={{ animationDelay: "500ms" }}
          
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                추천 서비스
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {user.name}님을 위한 맞춤 운세 서비스
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendedServices.map((service, index) => (
                <Link key={service.id} h>
                  <div
                    className="group relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-80`}
                    />

                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500`}
                    />

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-4">
                      {/* Icon */}
                      <div className="text-5xl sm:text-6xl">{service.icon}</div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-white/90">
                        {service.description}
                      </p>

                      {/* Element Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {service.element}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
