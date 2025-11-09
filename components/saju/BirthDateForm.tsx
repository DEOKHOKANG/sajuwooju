/**
 * Step 3: 생년월일 입력 컴포넌트
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { birthDateSchema } from "@/lib/validation/saju-schema";
import { z } from "zod";
import { useState } from "react";

type BirthDateData = z.infer<typeof birthDateSchema>;

interface BirthDateFormProps {
  value: BirthDateData | null;
  onChange: (data: BirthDateData) => void;
  onNext: () => void;
}

export function BirthDateForm({ value, onChange, onNext }: BirthDateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BirthDateData>({
    resolver: zodResolver(birthDateSchema),
    defaultValues: value || {
      birthDate: "",
      isLunar: false,
    },
  });

  const onSubmit = (data: BirthDateData) => {
    onChange(data);
    onNext();
  };

  const isLunar = watch("isLunar");

  // Year, Month, Day 선택
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // 날짜 업데이트
  const updateDate = (y: string, m: string, d: string) => {
    if (y && m && d) {
      const formattedDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      setValue("birthDate", formattedDate);
    }
  };

  const years = Array.from({ length: 101 }, (_, i) => 2025 - i); // 2025 ~ 1925
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">생년월일을 알려주세요</h2>
        <p className="text-gray-600">정확한 분석을 위해 필요합니다</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Calendar Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border-2 border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setValue("isLunar", false)}
              className={`
                px-6 py-2 rounded-md transition-all font-medium
                ${
                  !isLunar
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              양력
            </button>
            <button
              type="button"
              onClick={() => setValue("isLunar", true)}
              className={`
                px-6 py-2 rounded-md transition-all font-medium
                ${
                  isLunar
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              음력
            </button>
          </div>
        </div>

        {/* Date Selectors */}
        <div className="grid grid-cols-3 gap-3">
          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              년
            </label>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                updateDate(e.target.value, month, day);
              }}
              className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
            >
              <option value="">년도</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월
            </label>
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                updateDate(year, e.target.value, day);
              }}
              className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
            >
              <option value="">월</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              일
            </label>
            <select
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                updateDate(year, month, e.target.value);
              }}
              className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
            >
              <option value="">일</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hidden Input for validation */}
        <input type="hidden" {...register("birthDate")} />
        <input type="hidden" {...register("isLunar")} />

        {errors.birthDate && (
          <p className="text-sm text-red-600">{errors.birthDate.message}</p>
        )}

        {/* Selected Date Display */}
        {year && month && day && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-center text-purple-700 font-medium">
              {year}년 {month}월 {day}일 ({isLunar ? "음력" : "양력"})
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          다음 단계로
        </button>
      </form>
    </div>
  );
}
