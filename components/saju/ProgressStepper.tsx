/**
 * 사주 입력 폼 진행 상태 표시 컴포넌트
 */

"use client";

import { FormStep } from "@/lib/types/saju-form";

interface ProgressStepperProps {
  currentStep: FormStep;
  totalSteps: number;
}

const stepLabels = [
  "카테고리 선택",
  "기본 정보",
  "생년월일",
  "출생 시간",
];

export function ProgressStepper({
  currentStep,
  totalSteps,
}: ProgressStepperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = (i + 1) as FormStep;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-2
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : isActive
                      ? "bg-white border-2 border-purple-500 text-purple-500 ring-4 ring-purple-100"
                      : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
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
                ) : (
                  <span className="text-sm font-semibold">{step}</span>
                )}
              </div>
              <span
                className={`
                  text-xs font-medium text-center
                  ${isActive ? "text-purple-500" : "text-gray-400"}
                `}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Step Indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {currentStep}/{totalSteps} 단계 진행 중
        </p>
      </div>
    </div>
  );
}
