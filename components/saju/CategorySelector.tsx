/**
 * Step 1: 카테고리 선택 컴포넌트
 */

"use client";

import { FortuneCategory } from "@/lib/prompts";

interface CategorySelectorProps {
  value: FortuneCategory | null;
  onChange: (category: FortuneCategory) => void;
}

interface CategoryOption {
  id: FortuneCategory;
  title: string;
  description: string;
  element: string;
  icon: string;
  gradient: string;
}

const categories: CategoryOption[] = [
  {
    id: "love",
    title: "연애운",
    description: "사랑과 인연의 흐름을 알아보세요",
    element: "火",
    icon: "💕",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "wealth",
    title: "재물운",
    description: "재물과 투자의 기회를 확인하세요",
    element: "金",
    icon: "💰",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: "career",
    title: "직업운",
    description: "직장과 이직의 방향을 파악하세요",
    element: "木",
    icon: "💼",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "compatibility",
    title: "궁합",
    description: "두 사람의 조화를 분석합니다",
    element: "水",
    icon: "❤️",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "yearly",
    title: "연운",
    description: "올해의 전체 운세를 확인하세요",
    element: "土",
    icon: "📅",
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    id: "comprehensive",
    title: "종합분석",
    description: "모든 영역의 운세를 한눈에",
    element: "五行",
    icon: "🔮",
    gradient: "from-purple-500 to-pink-500",
  },
];

export function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">어떤 운세를 보시겠어요?</h2>
        <p className="text-gray-600">원하시는 분야를 선택해주세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSelected = value === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onChange(category.id)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                hover:scale-105 hover:shadow-xl
                ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-lg ring-4 ring-purple-100"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
              `}
            >
              {/* Element Badge */}
              <div className="absolute top-4 right-4 text-2xl opacity-30">
                {category.element}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-3">{category.icon}</div>

              {/* Title */}
              <h3
                className={`
                text-xl font-bold mb-2
                ${isSelected ? "text-purple-700" : "text-gray-900"}
              `}
              >
                {category.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600">{category.description}</p>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute bottom-4 right-4">
                  <div
                    className={`
                    w-6 h-6 rounded-full bg-gradient-to-r ${category.gradient}
                    flex items-center justify-center
                  `}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Category Info */}
      {value && (
        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-center text-purple-700 font-medium">
            {categories.find((c) => c.id === value)?.title} 분석을 시작합니다
          </p>
        </div>
      )}
    </div>
  );
}
