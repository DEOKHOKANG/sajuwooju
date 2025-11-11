/**
 * 사주 입력 폼 메인 페이지 (4단계 Multi-step)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressStepper } from "@/components/saju/ProgressStepper";
import { CategorySelector } from "@/components/saju/CategorySelector";
import { BasicInfoForm } from "@/components/saju/BasicInfoForm";
import { BirthDateForm } from "@/components/saju/BirthDateForm";
import { BirthTimeForm } from "@/components/saju/BirthTimeForm";
import { FortuneCategory } from "@/lib/prompts";
import { FormStep, SajuFormData } from "@/lib/types/saju-form";

export default function SajuNewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Partial<SajuFormData>>({});

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as FormStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as FormStep);
    }
  };

  const handleCategoryChange = (category: FortuneCategory) => {
    setFormData({ ...formData, category });
  };

  const handleBasicInfoChange = (data: { name: string; gender: "male" | "female" }) => {
    setFormData({ ...formData, ...data });
  };

  const handleBirthDateChange = (data: { calendarType: "solar" | "lunar"; year: number; month: number; day: number }) => {
    setFormData({ ...formData, ...data });
  };

  const handleBirthTimeChange = (data: { birthTime: string }) => {
    setFormData({ ...formData, ...data });
  };

  const handleFinalSubmit = async () => {
    // Validate all data
    if (
      !formData.category ||
      !formData.name ||
      !formData.gender ||
      !formData.year ||
      !formData.month ||
      !formData.day ||
      !formData.birthTime
    ) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // Save to localStorage
    const sessionId = `saju-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(
      sessionId,
      JSON.stringify({
        ...formData,
        createdAt: new Date().toISOString(),
      })
    );

    // Navigate to loading/analysis page
    router.push(`/saju/analyze/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            사주 분석 시작하기
          </h1>
          <p className="text-gray-600">
            정확한 정보를 입력하면 더 정확한 분석을 받을 수 있습니다
          </p>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} />

        {/* Form Steps */}
        <div className="mt-12">
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <CategorySelector
                value={formData.category || null}
                onChange={handleCategoryChange}
              />
              {formData.category && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={goToNextStep}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    다음 단계로
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <BasicInfoForm
                value={
                  formData.name && formData.gender
                    ? { name: formData.name, gender: formData.gender }
                    : null
                }
                onChange={handleBasicInfoChange}
                onNext={goToNextStep}
              />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={goToPreviousStep}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← 이전 단계로
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <BirthDateForm
                value={
                  formData.calendarType && formData.year && formData.month && formData.day
                    ? {
                        calendarType: formData.calendarType,
                        year: formData.year,
                        month: formData.month,
                        day: formData.day
                      }
                    : null
                }
                onChange={handleBirthDateChange}
                onNext={goToNextStep}
              />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={goToPreviousStep}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← 이전 단계로
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <BirthTimeForm
                value={formData.birthTime ? { birthTime: formData.birthTime } : null}
                onChange={handleBirthTimeChange}
                onSubmit={handleFinalSubmit}
              />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={goToPreviousStep}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← 이전 단계로
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Summary (Debug) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-12 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Form Data (Debug):</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
