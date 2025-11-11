/**
 * 오행 분석 컴포넌트 (상용화급)
 * 음양오행 통계 및 분석
 */

"use client";

import type { WuXingAnalysis as WuXingAnalysisType } from "@/lib/lunar-calendar";

interface WuXingAnalysisProps {
  analysis: WuXingAnalysisType;
}

// 오행 색상 및 아이콘
const WU_XING_INFO: {
  [key: string]: { name: string; color: string; icon: string; description: string };
} = {
  木: {
    name: "목(木)",
    color: "emerald",
    icon: "🌳",
    description: "성장, 확장, 창의성"
  },
  火: {
    name: "화(火)",
    color: "red",
    icon: "🔥",
    description: "열정, 활력, 변화"
  },
  土: {
    name: "토(土)",
    color: "amber",
    icon: "⛰️",
    description: "안정, 신뢰, 중재"
  },
  金: {
    name: "금(金)",
    color: "yellow",
    icon: "💎",
    description: "결단, 집중, 의지"
  },
  水: {
    name: "수(水)",
    color: "blue",
    icon: "💧",
    description: "지혜, 유연, 순응"
  },
};

export function WuXingAnalysis({ analysis }: WuXingAnalysisProps) {
  const maxCount = Math.max(...Object.values(analysis.elements));
  const totalCount = Object.values(analysis.elements).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* 제목 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          오행 분석
        </h2>
        <p className="text-gray-600">음양오행의 균형과 특성</p>
      </div>

      {/* 오행 분포 차트 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
        <div className="space-y-4">
          {Object.entries(analysis.elements).map(([element, count]) => {
            const info = WU_XING_INFO[element];
            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={element} className="group">
                {/* 오행 레이블 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{info.icon}</span>
                    <div>
                      <div className="font-bold text-gray-900">{info.name}</div>
                      <div className="text-xs text-gray-500">{info.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{count}</span>
                    <span className="text-sm text-gray-500">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>

                {/* 프로그레스 바 */}
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${info.color}-400 to-${info.color}-600 transition-all duration-1000 ease-out group-hover:scale-105`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 분석 결과 카드 */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 우세한 오행 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <div className="text-center mb-3">
            <div className="text-4xl mb-2">
              {WU_XING_INFO[analysis.dominant].icon}
            </div>
            <div className="text-sm text-purple-600 font-semibold mb-1">우세한 기운</div>
            <div className="text-2xl font-bold text-purple-900">
              {WU_XING_INFO[analysis.dominant].name}
            </div>
          </div>
          <p className="text-sm text-gray-700 text-center">
            {WU_XING_INFO[analysis.dominant].description}의 특성이 강합니다
          </p>
        </div>

        {/* 부족한 오행 */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="text-center mb-3">
            <div className="text-4xl mb-2">⚖️</div>
            <div className="text-sm text-blue-600 font-semibold mb-1">부족한 기운</div>
            <div className="text-xl font-bold text-blue-900">
              {analysis.lacking.length === 0 ? (
                "없음"
              ) : (
                analysis.lacking.map((e) => WU_XING_INFO[e].name).join(", ")
              )}
            </div>
          </div>
          {analysis.lacking.length > 0 ? (
            <p className="text-sm text-gray-700 text-center">
              이 기운을 보완하면 좋습니다
            </p>
          ) : (
            <p className="text-sm text-gray-700 text-center">
              모든 오행이 고르게 분포되어 있습니다
            </p>
          )}
        </div>

        {/* 균형 상태 */}
        <div className={`bg-gradient-to-br ${
          analysis.balanced
            ? "from-green-50 to-emerald-50 border-green-200"
            : "from-orange-50 to-amber-50 border-orange-200"
        } rounded-2xl p-6 border-2`}>
          <div className="text-center mb-3">
            <div className="text-4xl mb-2">
              {analysis.balanced ? "✅" : "⚠️"}
            </div>
            <div className={`text-sm font-semibold mb-1 ${
              analysis.balanced ? "text-green-600" : "text-orange-600"
            }`}>
              균형 상태
            </div>
            <div className={`text-2xl font-bold ${
              analysis.balanced ? "text-green-900" : "text-orange-900"
            }`}>
              {analysis.balanced ? "균형" : "불균형"}
            </div>
          </div>
          <p className="text-sm text-gray-700 text-center">
            {analysis.balanced
              ? "오행이 조화롭게 배치되어 있습니다"
              : "특정 오행이 강하거나 약합니다"
            }
          </p>
        </div>
      </div>

      {/* 보완 조언 */}
      {analysis.lacking.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-6 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">오행 보완 조언</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                부족한 <strong>{analysis.lacking.map((e) => WU_XING_INFO[e].name).join(", ")}</strong> 기운을 보완하면
                더 균형 잡힌 운세를 만들 수 있습니다. 해당 오행의 색상, 방향, 직업 등을 참고하세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
