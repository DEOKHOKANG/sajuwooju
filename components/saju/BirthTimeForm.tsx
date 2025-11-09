/**
 * Step 4: 출생 시간 입력 컴포넌트
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { birthTimeSchema } from "@/lib/validation/saju-schema";
import { z } from "zod";
import { useState } from "react";

type BirthTimeData = z.infer<typeof birthTimeSchema>;

interface BirthTimeFormProps {
  value: BirthTimeData | null;
  onChange: (data: BirthTimeData) => void;
  onSubmit: () => void;
}

// 12지지 시간대 (참고용)
const timeRanges = [
  { name: "자시 (子時)", range: "23:30 - 01:30", hour: 0 },
  { name: "축시 (丑時)", range: "01:30 - 03:30", hour: 2 },
  { name: "인시 (寅時)", range: "03:30 - 05:30", hour: 4 },
  { name: "묘시 (卯時)", range: "05:30 - 07:30", hour: 6 },
  { name: "진시 (辰時)", range: "07:30 - 09:30", hour: 8 },
  { name: "사시 (巳時)", range: "09:30 - 11:30", hour: 10 },
  { name: "오시 (午時)", range: "11:30 - 13:30", hour: 12 },
  { name: "미시 (未時)", range: "13:30 - 15:30", hour: 14 },
  { name: "신시 (申時)", range: "15:30 - 17:30", hour: 16 },
  { name: "유시 (酉時)", range: "17:30 - 19:30", hour: 18 },
  { name: "술시 (戌時)", range: "19:30 - 21:30", hour: 20 },
  { name: "해시 (亥時)", range: "21:30 - 23:30", hour: 22 },
];

export function BirthTimeForm({ value, onChange, onSubmit }: BirthTimeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BirthTimeData>({
    resolver: zodResolver(birthTimeSchema),
    defaultValues: value || {
      birthTime: "",
    },
  });

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [showTimeRanges, setShowTimeRanges] = useState(false);

  const updateTime = (h: string, m: string) => {
    if (h && m) {
      const formattedTime = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
      setValue("birthTime", formattedTime);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const onFormSubmit = (data: BirthTimeData) => {
    onChange(data);
    onSubmit();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">출생 시간을 알려주세요</h2>
        <p className="text-gray-600">정확한 시간을 모르면 대략적인 시간도 괜찮아요</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Time Pickers */}
        <div className="grid grid-cols-2 gap-4">
          {/* Hour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시
            </label>
            <select
              value={hour}
              onChange={(e) => {
                setHour(e.target.value);
                updateTime(e.target.value, minute);
              }}
              className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
            >
              <option value="">시</option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}시
                </option>
              ))}
            </select>
          </div>

          {/* Minute */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              분
            </label>
            <select
              value={minute}
              onChange={(e) => {
                setMinute(e.target.value);
                updateTime(hour, e.target.value);
              }}
              className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
            >
              <option value="">분</option>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}분
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hidden Input for validation */}
        <input type="hidden" {...register("birthTime")} />

        {errors.birthTime && (
          <p className="text-sm text-red-600">{errors.birthTime.message}</p>
        )}

        {/* Selected Time Display */}
        {hour && minute !== "" && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-center text-purple-700 font-medium">
              {hour.padStart(2, "0")}:{minute.toString().padStart(2, "0")}
            </p>
          </div>
        )}

        {/* Time Range Reference Toggle */}
        <button
          type="button"
          onClick={() => setShowTimeRanges(!showTimeRanges)}
          className="w-full py-3 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-purple-300 hover:bg-purple-50 transition-colors"
        >
          {showTimeRanges ? "시간대 참고표 닫기" : "시간대 참고표 보기"}
        </button>

        {/* Time Ranges Table */}
        {showTimeRanges && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {timeRanges.map((range) => (
                <div
                  key={range.name}
                  className="flex justify-between items-center p-2 hover:bg-white rounded transition-colors"
                >
                  <span className="font-medium text-gray-700">
                    {range.name}
                  </span>
                  <span className="text-sm text-gray-500">{range.range}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unknown Time Option */}
        <button
          type="button"
          onClick={() => {
            setHour("12");
            setMinute("0");
            updateTime("12", "0");
          }}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
        >
          출생 시간을 모르겠어요 (정오로 설정)
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          분석 시작하기
        </button>
      </form>
    </div>
  );
}
