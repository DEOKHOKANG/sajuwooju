"use client";

import Link from "next/link";
import { Home, Heart, Zap, User, ArrowRight } from "lucide-react";

/**
 * Bottom Nav Preview
 * 하단 네비게이션 4가지 기능 미리보기 (상용화급)
 */

export function BottomNavPreview() {
  const navFeatures = [
    {
      href: "/main",
      label: "HOME",
      icon: Home,
      title: "당신의 운세 중심지",
      description: "매일 새로운 운세와 맞춤 추천",
      badge: null,
      gradient: "from-purple-500 to-violet-600",
    },
    {
      href: "/match",
      label: "MATCH",
      icon: Heart,
      title: "운명적 만남 찾기",
      description: "궁합 좋은 사람 추천",
      badge: "오늘 32명 매칭",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      href: "/hype",
      label: "HYPE",
      icon: Zap,
      title: "실제 후기 보기",
      description: "생생한 경험담 공유",
      badge: "현재 TOP 10",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      href: "/dashboard",
      label: "MY",
      icon: User,
      title: "내 분석 히스토리",
      description: "저장된 운세와 활동 기록",
      badge: "3개 저장됨",
      gradient: "from-indigo-500 to-purple-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
          <div className="w-2 h-2 bg-cosmic-purple rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-gray-700">4가지 핵심 기능</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          사주우주에서 할 수 있는 일
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          하단 네비게이션으로 언제든지 빠르게 이동하세요
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {navFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-gray-200 cursor-pointer overflow-hidden">
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with gradient */}
                  <div className="mb-4 flex justify-center">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center mb-3">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${feature.gradient} shadow-md`}>
                      {feature.label}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 text-center mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 text-center mb-3 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Badge */}
                  {feature.badge && (
                    <div className="flex justify-center">
                      <div className="px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full text-[10px] font-bold text-green-700">
                        ✓ {feature.badge}
                      </div>
                    </div>
                  )}

                  {/* Arrow icon */}
                  <div className="mt-4 flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors duration-300">
                      <ArrowRight className="w-4 h-4 text-gray-600 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-4">
          💡 하단 네비게이션은 모든 페이지에서 사용 가능합니다
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-200">
          <div className="flex items-center gap-1">
            {[Home, Heart, Zap, User].map((IconComponent, idx) => (
              <div key={idx} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-gray-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
