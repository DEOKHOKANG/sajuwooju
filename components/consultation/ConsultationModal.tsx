"use client";

import { useState } from "react";
import { X, User, Calendar, Clock, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * 상담 신청 모달 - 사주 분석을 위한 고객 정보 입력
 * 타이트사주 스타일 미러링
 */

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
  productPrice: number;
}

interface CustomerInfo {
  name: string;
  gender: "male" | "female" | "";
  calendarType: "solar" | "lunar";
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  unknownTime: boolean;
}

export function ConsultationModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  productPrice,
}: ConsultationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    gender: "",
    calendarType: "solar",
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    unknownTime: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }
    if (!customerInfo.gender) {
      newErrors.gender = "성별을 선택해주세요";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.year) {
      newErrors.year = "년도를 선택해주세요";
    }
    if (!customerInfo.month) {
      newErrors.month = "월을 선택해주세요";
    }
    if (!customerInfo.day) {
      newErrors.day = "일을 선택해주세요";
    }
    if (!customerInfo.unknownTime && !customerInfo.hour) {
      newErrors.hour = "태어난 시간을 선택하거나 '시간 모름'을 체크해주세요";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // 상담 정보를 세션 스토리지에 저장
    const consultationData = {
      productId,
      productTitle,
      productPrice,
      customerInfo,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("consultationData", JSON.stringify(consultationData));

    // 결제 페이지 또는 결과 페이지로 이동
    // 여기서는 사주 분석 결과 페이지로 바로 이동 (무료 체험 또는 결제 후)
    const sessionId = `saju_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("sajuSessionId", sessionId);

    onClose();
    router.push(`/saju/result/${sessionId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cosmic-purple to-nebula-pink p-5 text-white relative overflow-hidden sticky top-0 z-10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">사주 분석 정보 입력</h2>
                <p className="text-xs text-white/80">{productTitle}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mt-4">
              <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-white" : "bg-white/30"}`} />
              <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-white" : "bg-white/30"}`} />
            </div>
            <div className="flex justify-between text-xs mt-1 text-white/70">
              <span>1. 기본 정보</span>
              <span>2. 생년월일시</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {step === 1 ? (
            <>
              {/* Step 1: 기본 정보 */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-cosmic-purple" />
                    이름
                  </label>
                  <input
                    type="text"
                    placeholder="이름을 입력해주세요"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-cosmic-purple"
                    } focus:ring-2 focus:ring-cosmic-purple/20`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    성별
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, gender: "male" })}
                      className={`py-4 rounded-xl font-medium text-base transition-all ${
                        customerInfo.gender === "male"
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      👨 남성
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, gender: "female" })}
                      className={`py-4 rounded-xl font-medium text-base transition-all ${
                        customerInfo.gender === "female"
                          ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      👩 여성
                    </button>
                  </div>
                  {errors.gender && <p className="mt-2 text-xs text-red-500">{errors.gender}</p>}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: 생년월일시 */}
              <div className="space-y-5">
                {/* Calendar Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 text-cosmic-purple" />
                    양력 / 음력
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, calendarType: "solar" })}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        customerInfo.calendarType === "solar"
                          ? "bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      ☀️ 양력
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, calendarType: "lunar" })}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        customerInfo.calendarType === "lunar"
                          ? "bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      🌙 음력
                    </button>
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    생년월일
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={customerInfo.year}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, year: e.target.value })}
                      className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.year ? "border-red-400" : "border-gray-200"
                      } focus:border-cosmic-purple`}
                    >
                      <option value="">년</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}년</option>
                      ))}
                    </select>
                    <select
                      value={customerInfo.month}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, month: e.target.value })}
                      className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.month ? "border-red-400" : "border-gray-200"
                      } focus:border-cosmic-purple`}
                    >
                      <option value="">월</option>
                      {months.map((m) => (
                        <option key={m} value={m}>{m}월</option>
                      ))}
                    </select>
                    <select
                      value={customerInfo.day}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, day: e.target.value })}
                      className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.day ? "border-red-400" : "border-gray-200"
                      } focus:border-cosmic-purple`}
                    >
                      <option value="">일</option>
                      {days.map((d) => (
                        <option key={d} value={d}>{d}일</option>
                      ))}
                    </select>
                  </div>
                  {(errors.year || errors.month || errors.day) && (
                    <p className="mt-1 text-xs text-red-500">생년월일을 모두 선택해주세요</p>
                  )}
                </div>

                {/* Birth Time */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-cosmic-purple" />
                    태어난 시간
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={customerInfo.hour}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, hour: e.target.value })}
                      disabled={customerInfo.unknownTime}
                      className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.hour ? "border-red-400" : "border-gray-200"
                      } focus:border-cosmic-purple disabled:bg-gray-100 disabled:text-gray-400`}
                    >
                      <option value="">시</option>
                      {hours.map((h) => (
                        <option key={h} value={h}>{h}시</option>
                      ))}
                    </select>
                    <select
                      value={customerInfo.minute}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, minute: e.target.value })}
                      disabled={customerInfo.unknownTime}
                      className="px-3 py-3 border-2 border-gray-200 rounded-xl transition-all outline-none focus:border-cosmic-purple disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">분</option>
                      <option value="0">00분</option>
                      <option value="30">30분</option>
                    </select>
                  </div>

                  {/* Unknown Time Checkbox */}
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerInfo.unknownTime}
                      onChange={(e) => setCustomerInfo({
                        ...customerInfo,
                        unknownTime: e.target.checked,
                        hour: e.target.checked ? "" : customerInfo.hour,
                        minute: e.target.checked ? "" : customerInfo.minute,
                      })}
                      className="w-4 h-4 rounded border-gray-300 text-cosmic-purple focus:ring-cosmic-purple"
                    />
                    <span className="text-sm text-gray-600">태어난 시간을 모르겠어요</span>
                  </label>
                  {errors.hour && <p className="mt-1 text-xs text-red-500">{errors.hour}</p>}
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    💡 <span className="font-medium">태어난 시간</span>이 정확할수록 더 정밀한 사주 분석이 가능합니다.
                    시간을 모르시면 대략적인 분석 결과를 제공해드립니다.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white font-bold rounded-xl hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {step === 1 ? (
                <>
                  다음 단계로
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  ✨ 사주 분석 시작
                </>
              )}
            </button>

            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
              >
                이전 단계로
              </button>
            )}
          </div>

          {/* Price Info */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              결제 금액: <span className="font-bold text-cosmic-purple">{productPrice.toLocaleString()}원</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
