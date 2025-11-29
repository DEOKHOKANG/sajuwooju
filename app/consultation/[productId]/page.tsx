"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Clock, Sparkles, CheckCircle, Heart, Users } from "lucide-react";
import { FEATURED_PRODUCTS } from "@/lib/products-data";
import { getContentTypeByProductId, getContentConfig, type ContentType } from "@/lib/content-configs";

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
  // 상대방 정보
  partnerName: string;
  partnerGender: "male" | "female" | "";
  partnerCalendarType: "solar" | "lunar";
  partnerYear: string;
  partnerMonth: string;
  partnerDay: string;
  partnerHour: string;
  partnerMinute: string;
  partnerUnknownTime: boolean;
  // 추가 필드 (컨텐츠별)
  [key: string]: string | boolean;
}

export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<typeof FEATURED_PRODUCTS[0] | null>(null);
  const [contentType, setContentType] = useState<ContentType>("comprehensive");
  const [isLoading, setIsLoading] = useState(false);
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
    // 상대방 정보
    partnerName: "",
    partnerGender: "",
    partnerCalendarType: "solar",
    partnerYear: "",
    partnerMonth: "",
    partnerDay: "",
    partnerHour: "",
    partnerMinute: "",
    partnerUnknownTime: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 컨텐츠 설정 가져오기
  const contentConfig = useMemo(() => getContentConfig(contentType), [contentType]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 전통 12시진 (자시~해시)
  const traditionalHours = [
    { value: "23-01", label: "자시 (子時)", time: "23:00 ~ 01:00", emoji: "🐀" },
    { value: "01-03", label: "축시 (丑時)", time: "01:00 ~ 03:00", emoji: "🐂" },
    { value: "03-05", label: "인시 (寅時)", time: "03:00 ~ 05:00", emoji: "🐅" },
    { value: "05-07", label: "묘시 (卯時)", time: "05:00 ~ 07:00", emoji: "🐇" },
    { value: "07-09", label: "진시 (辰時)", time: "07:00 ~ 09:00", emoji: "🐉" },
    { value: "09-11", label: "사시 (巳時)", time: "09:00 ~ 11:00", emoji: "🐍" },
    { value: "11-13", label: "오시 (午時)", time: "11:00 ~ 13:00", emoji: "🐴" },
    { value: "13-15", label: "미시 (未時)", time: "13:00 ~ 15:00", emoji: "🐑" },
    { value: "15-17", label: "신시 (申時)", time: "15:00 ~ 17:00", emoji: "🐵" },
    { value: "17-19", label: "유시 (酉時)", time: "17:00 ~ 19:00", emoji: "🐔" },
    { value: "19-21", label: "술시 (戌時)", time: "19:00 ~ 21:00", emoji: "🐶" },
    { value: "21-23", label: "해시 (亥時)", time: "21:00 ~ 23:00", emoji: "🐷" },
  ];

  // 분 선택지 (10분 단위)
  const minuteOptions = [
    { value: "0", label: "00분 (정각)" },
    { value: "10", label: "10분" },
    { value: "20", label: "20분" },
    { value: "30", label: "30분" },
    { value: "40", label: "40분" },
    { value: "50", label: "50분" },
  ];

  useEffect(() => {
    const foundProduct = FEATURED_PRODUCTS.find(p => p.id === parseInt(productId));
    if (foundProduct) {
      setProduct(foundProduct);
      const type = getContentTypeByProductId(foundProduct.id);
      setContentType(type);
    }
  }, [productId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 기본 필드 검증
    if (!customerInfo.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }
    if (!customerInfo.gender) {
      newErrors.gender = "성별을 선택해주세요";
    }
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

    // 상대방 정보가 필요한 경우
    if (contentConfig.requiresPartner) {
      if (!customerInfo.partnerName.trim()) {
        newErrors.partnerName = "상대방 이름을 입력해주세요";
      }
      if (!customerInfo.partnerGender) {
        newErrors.partnerGender = "상대방 성별을 선택해주세요";
      }
      if (!customerInfo.partnerYear) {
        newErrors.partnerYear = "상대방 년도를 선택해주세요";
      }
      if (!customerInfo.partnerMonth) {
        newErrors.partnerMonth = "상대방 월을 선택해주세요";
      }
      if (!customerInfo.partnerDay) {
        newErrors.partnerDay = "상대방 일을 선택해주세요";
      }
    }

    // 컨텐츠별 추가 필드 검증
    contentConfig.inputFields.forEach(field => {
      if (field.required && field.name !== "name" && field.name !== "gender" &&
          field.name !== "birthDate" && field.name !== "birthHour" &&
          !field.name.startsWith("partner")) {
        if (!customerInfo[field.name]) {
          newErrors[field.name] = `${field.label}을(를) 입력해주세요`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !product) return;

    setIsLoading(true);

    try {
      // Generate session ID
      const sessionId = `saju_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Calculate birth hour for API
      const birthHour = customerInfo.unknownTime ? "unknown" : `${customerInfo.hour}:${customerInfo.minute || "00"}`;
      const partnerBirthHour = customerInfo.partnerUnknownTime ? "unknown" : `${customerInfo.partnerHour}:${customerInfo.partnerMinute || "00"}`;

      // Prepare form data for API
      const formData = {
        contentType,
        category: contentType,
        name: customerInfo.name,
        gender: customerInfo.gender,
        calendarType: customerInfo.calendarType,
        year: parseInt(customerInfo.year),
        month: parseInt(customerInfo.month),
        day: parseInt(customerInfo.day),
        birthHour,
        productId: product.id,
        productTitle: product.title,
        // 상대방 정보 (필요한 경우)
        ...(contentConfig.requiresPartner && {
          partnerName: customerInfo.partnerName,
          partnerGender: customerInfo.partnerGender,
          partnerCalendarType: customerInfo.partnerCalendarType,
          partnerYear: parseInt(customerInfo.partnerYear),
          partnerMonth: parseInt(customerInfo.partnerMonth),
          partnerDay: parseInt(customerInfo.partnerDay),
          partnerBirthHour,
        }),
        // 추가 필드
        ...Object.fromEntries(
          contentConfig.inputFields
            .filter(f => !["name", "gender", "calendarType", "birthDate", "birthHour"].includes(f.name) &&
                        !f.name.startsWith("partner"))
            .map(f => [f.name, customerInfo[f.name]])
        ),
      };

      // Save to localStorage for later use
      localStorage.setItem(sessionId, JSON.stringify({
        ...formData,
        createdAt: new Date().toISOString(),
      }));

      // Navigate to analysis page (this will trigger the API call)
      router.push(`/saju/analyze/${sessionId}`);
    } catch (error) {
      console.error("Submit error:", error);
      setIsLoading(false);
    }
  };

  // 추가 필드 렌더링
  const renderAdditionalField = (field: typeof contentConfig.inputFields[0]) => {
    // 기본 필드는 별도로 렌더링
    if (["name", "gender", "calendarType", "birthDate", "birthHour"].includes(field.name) ||
        field.name.startsWith("partner")) {
      return null;
    }

    switch (field.type) {
      case "select":
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={customerInfo[field.name] as string || ""}
              onChange={(e) => setCustomerInfo({ ...customerInfo, [field.name]: e.target.value })}
              aria-label={field.label}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                errors[field.name] ? "border-red-400" : "border-gray-200"
              } focus:border-purple-500`}
            >
              <option value="">선택해주세요</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors[field.name] && <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>}
          </div>
        );
      case "textarea":
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              value={customerInfo[field.name] as string || ""}
              onChange={(e) => setCustomerInfo({ ...customerInfo, [field.name]: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                errors[field.name] ? "border-red-400" : "border-gray-200"
              } focus:border-purple-500 resize-none`}
            />
            {errors[field.name] && <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>}
          </div>
        );
      case "text":
        return (
          <div key={field.name} className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={customerInfo[field.name] as string || ""}
              onChange={(e) => setCustomerInfo({ ...customerInfo, [field.name]: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                errors[field.name] ? "border-red-400" : "border-gray-200"
              } focus:border-purple-500`}
            />
            {errors[field.name] && <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  // 추가 필드 목록 (기본 필드 제외)
  const additionalFields = contentConfig.inputFields.filter(
    f => !["name", "gender", "calendarType", "birthDate", "birthHour"].includes(f.name) &&
         !f.name.startsWith("partner")
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  const discountedPrice = Math.round(10000 * (100 - product.discount) / 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto w-full max-w-[600px] px-4 py-3 flex items-center gap-3">
          <Link href={`/products/${productId}`}>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-full"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
          <h1 className="font-display text-lg font-semibold text-gray-900 truncate flex-1">
            {contentConfig.name} 정보 입력
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[600px] px-4 py-6 pb-32">
        {/* Product Info Card */}
        <div className={`bg-gradient-to-r ${contentConfig.gradient} rounded-2xl p-5 mb-8 text-white shadow-lg`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">{contentConfig.icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">{product.title}</h2>
              <p className="text-sm text-white/80">{product.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <span className="text-sm text-white/70">결제 금액</span>
            <span className="text-xl font-bold">{discountedPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Section 1: 기본 정보 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
              <User className="w-5 h-5 text-purple-500" />
              내 정보
            </h3>

            {/* Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-purple-500"
                } focus:ring-2 focus:ring-purple-500/20`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                성별 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomerInfo({ ...customerInfo, gender: "male" })}
                  className={`py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 ${
                    customerInfo.gender === "male"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xl">👨</span> 남성
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerInfo({ ...customerInfo, gender: "female" })}
                  className={`py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 ${
                    customerInfo.gender === "female"
                      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xl">👩</span> 여성
                </button>
              </div>
              {errors.gender && <p className="mt-2 text-xs text-red-500">{errors.gender}</p>}
            </div>
          </section>

          {/* Section 2: 생년월일 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
              <Calendar className="w-5 h-5 text-purple-500" />
              내 생년월일
            </h3>

            {/* Calendar Type */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                양력 / 음력
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomerInfo({ ...customerInfo, calendarType: "solar" })}
                  className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    customerInfo.calendarType === "solar"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>☀️</span> 양력
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerInfo({ ...customerInfo, calendarType: "lunar" })}
                  className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    customerInfo.calendarType === "lunar"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>🌙</span> 음력
                </button>
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생년월일 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={customerInfo.year}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, year: e.target.value })}
                  className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                    errors.year ? "border-red-400" : "border-gray-200"
                  } focus:border-purple-500`}
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
                  } focus:border-purple-500`}
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
                  } focus:border-purple-500`}
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
          </section>

          {/* Section 3: 태어난 시간 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
              <Clock className="w-5 h-5 text-purple-500" />
              내 태어난 시간
            </h3>

            {/* Unknown Time Checkbox */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors mb-4">
              <input
                type="checkbox"
                checked={customerInfo.unknownTime}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  unknownTime: e.target.checked,
                  hour: e.target.checked ? "" : customerInfo.hour,
                  minute: e.target.checked ? "" : customerInfo.minute,
                })}
                className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">태어난 시간을 모르겠어요</span>
            </label>

            {!customerInfo.unknownTime && (
              <>
                {/* 12시진 선택 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시(時) - 12시진 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {traditionalHours.map((hour) => (
                      <button
                        key={hour.value}
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, hour: hour.value })}
                        className={`p-3 rounded-xl text-left transition-all ${
                          customerInfo.hour === hour.value
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{hour.emoji}</span>
                          <div>
                            <p className={`text-sm font-medium ${customerInfo.hour === hour.value ? "text-white" : "text-gray-900"}`}>
                              {hour.label}
                            </p>
                            <p className={`text-xs ${customerInfo.hour === hour.value ? "text-white/80" : "text-gray-500"}`}>
                              {hour.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.hour && <p className="mt-2 text-xs text-red-500">{errors.hour}</p>}
                </div>

                {/* 분 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    분(分) - 더 정확히 알고 계시면 선택해주세요 <span className="text-gray-400">(선택)</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {minuteOptions.map((min) => (
                      <button
                        key={min.value}
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, minute: min.value })}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          customerInfo.minute === min.value
                            ? "bg-purple-500 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {min.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Info Box */}
            <div className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                💡 <span className="font-medium">태어난 시간</span>이 정확할수록 더 정밀한 사주 분석이 가능합니다.
              </p>
            </div>
          </section>

          {/* Section 4: 상대방 정보 (궁합/재회 등 필요한 경우) */}
          {contentConfig.requiresPartner && (
            <>
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-pink-500">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
                  <Heart className="w-5 h-5 text-pink-500" />
                  상대방 정보
                </h3>

                {/* Partner Name */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상대방 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="상대방 이름을 입력해주세요"
                    value={customerInfo.partnerName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, partnerName: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                      errors.partnerName
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:ring-2 focus:ring-pink-500/20`}
                  />
                  {errors.partnerName && <p className="mt-1 text-xs text-red-500">{errors.partnerName}</p>}
                </div>

                {/* Partner Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    상대방 성별 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, partnerGender: "male" })}
                      className={`py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 ${
                        customerInfo.partnerGender === "male"
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-xl">👨</span> 남성
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, partnerGender: "female" })}
                      className={`py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 ${
                        customerInfo.partnerGender === "female"
                          ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-xl">👩</span> 여성
                    </button>
                  </div>
                  {errors.partnerGender && <p className="mt-2 text-xs text-red-500">{errors.partnerGender}</p>}
                </div>
              </section>

              {/* Partner Birth Date */}
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-pink-500">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  상대방 생년월일
                </h3>

                {/* Partner Calendar Type */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    양력 / 음력
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, partnerCalendarType: "solar" })}
                      className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        customerInfo.partnerCalendarType === "solar"
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span>☀️</span> 양력
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, partnerCalendarType: "lunar" })}
                      className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        customerInfo.partnerCalendarType === "lunar"
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span>🌙</span> 음력
                    </button>
                  </div>
                </div>

                {/* Partner Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    생년월일 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={customerInfo.partnerYear}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, partnerYear: e.target.value })}
                      aria-label="상대방 출생년도"
                      className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.partnerYear ? "border-red-400" : "border-gray-200"
                      } focus:border-pink-500`}
                    >
                      <option value="">년</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}년</option>
                      ))}
                    </select>
                    <select
                      value={customerInfo.partnerMonth}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, partnerMonth: e.target.value })}
                      aria-label="상대방 출생월"
                      className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.partnerMonth ? "border-red-400" : "border-gray-200"
                      } focus:border-pink-500`}
                    >
                      <option value="">월</option>
                      {months.map((m) => (
                        <option key={m} value={m}>{m}월</option>
                      ))}
                    </select>
                    <select
                      value={customerInfo.partnerDay}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, partnerDay: e.target.value })}
                      aria-label="상대방 출생일"
                      className={`px-3 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.partnerDay ? "border-red-400" : "border-gray-200"
                      } focus:border-pink-500`}
                    >
                      <option value="">일</option>
                      {days.map((d) => (
                        <option key={d} value={d}>{d}일</option>
                      ))}
                    </select>
                  </div>
                  {(errors.partnerYear || errors.partnerMonth || errors.partnerDay) && (
                    <p className="mt-1 text-xs text-red-500">생년월일을 모두 선택해주세요</p>
                  )}
                </div>
              </section>

              {/* Partner Birth Time */}
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-pink-500">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
                  <Clock className="w-5 h-5 text-pink-500" />
                  상대방 태어난 시간
                </h3>

                {/* Unknown Time Checkbox */}
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors mb-4">
                  <input
                    type="checkbox"
                    checked={customerInfo.partnerUnknownTime}
                    onChange={(e) => setCustomerInfo({
                      ...customerInfo,
                      partnerUnknownTime: e.target.checked,
                      partnerHour: e.target.checked ? "" : customerInfo.partnerHour,
                      partnerMinute: e.target.checked ? "" : customerInfo.partnerMinute,
                    })}
                    className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">태어난 시간을 모르겠어요</span>
                </label>

                {!customerInfo.partnerUnknownTime && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {traditionalHours.map((hour) => (
                      <button
                        key={hour.value}
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, partnerHour: hour.value })}
                        className={`p-3 rounded-xl text-left transition-all ${
                          customerInfo.partnerHour === hour.value
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{hour.emoji}</span>
                          <div>
                            <p className={`text-sm font-medium ${customerInfo.partnerHour === hour.value ? "text-white" : "text-gray-900"}`}>
                              {hour.label}
                            </p>
                            <p className={`text-xs ${customerInfo.partnerHour === hour.value ? "text-white/80" : "text-gray-500"}`}>
                              {hour.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* Section 5: 추가 정보 (컨텐츠별) */}
          {additionalFields.length > 0 && (
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
                <Users className="w-5 h-5 text-purple-500" />
                추가 정보
              </h3>
              {additionalFields.map(field => renderAdditionalField(field))}
            </section>
          )}

          {/* Completion Checklist */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">입력 확인</h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 ${customerInfo.name ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle className={`w-5 h-5 ${customerInfo.name ? "fill-green-100" : ""}`} />
                <span className="text-sm">이름 입력</span>
              </div>
              <div className={`flex items-center gap-3 ${customerInfo.gender ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle className={`w-5 h-5 ${customerInfo.gender ? "fill-green-100" : ""}`} />
                <span className="text-sm">성별 선택</span>
              </div>
              <div className={`flex items-center gap-3 ${customerInfo.year && customerInfo.month && customerInfo.day ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle className={`w-5 h-5 ${customerInfo.year && customerInfo.month && customerInfo.day ? "fill-green-100" : ""}`} />
                <span className="text-sm">생년월일 입력</span>
              </div>
              <div className={`flex items-center gap-3 ${customerInfo.hour || customerInfo.unknownTime ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle className={`w-5 h-5 ${customerInfo.hour || customerInfo.unknownTime ? "fill-green-100" : ""}`} />
                <span className="text-sm">태어난 시간 {customerInfo.unknownTime ? "(모름)" : "입력"}</span>
              </div>
              {contentConfig.requiresPartner && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <div className={`flex items-center gap-3 ${customerInfo.partnerName ? "text-green-600" : "text-gray-400"}`}>
                    <CheckCircle className={`w-5 h-5 ${customerInfo.partnerName ? "fill-green-100" : ""}`} />
                    <span className="text-sm">상대방 이름</span>
                  </div>
                  <div className={`flex items-center gap-3 ${customerInfo.partnerYear && customerInfo.partnerMonth && customerInfo.partnerDay ? "text-green-600" : "text-gray-400"}`}>
                    <CheckCircle className={`w-5 h-5 ${customerInfo.partnerYear && customerInfo.partnerMonth && customerInfo.partnerDay ? "fill-green-100" : ""}`} />
                    <span className="text-sm">상대방 생년월일</span>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        <div className="mx-auto w-full max-w-[600px] p-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-4 bg-gradient-to-r ${contentConfig.gradient} text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                분석 시작 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {contentConfig.name} 분석 시작하기
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            정보 입력 완료 후 AI가 사주를 분석합니다
          </p>
        </div>
      </div>
    </div>
  );
}
