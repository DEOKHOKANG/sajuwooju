/**
 * HYPE 페이지 (상용화급)
 * 사주 컨셉별 랭킹 & HYPE 시스템
 */

"use client";

import { useState } from "react";
import { Zap, TrendingUp, User, Heart } from "lucide-react";

interface HypeUser {
  id: string;
  rank: number;
  name: string;
  birthYear: number;
  zodiac: string;
  dominantElement: "木" | "火" | "土" | "金" | "水";
  concept: string;
  hypeCount: number;
  isFollowing: boolean;
  isHyped: boolean;
}

const CONCEPTS = [
  { id: "all", label: "전체", gradient: "from-purple-500 to-pink-500" },
  { id: "lucky", label: "대박운", gradient: "from-amber-500 to-orange-500" },
  { id: "love", label: "연애운", gradient: "from-pink-500 to-rose-500" },
  { id: "wealth", label: "재물운", gradient: "from-green-500 to-emerald-500" },
  { id: "career", label: "직업운", gradient: "from-blue-500 to-cyan-500" },
  { id: "health", label: "건강운", gradient: "from-teal-500 to-green-500" },
];

export default function HypePage() {
  const [selectedConcept, setSelectedConcept] = useState("all");
  const [rankings, setRankings] = useState<HypeUser[]>([
    {
      id: "1",
      rank: 1,
      name: "김*호",
      birthYear: 1990,
      zodiac: "말띠",
      dominantElement: "火",
      concept: "대박운",
      hypeCount: 15234,
      isFollowing: false,
      isHyped: false,
    },
    {
      id: "2",
      rank: 2,
      name: "이*영",
      birthYear: 1988,
      zodiac: "용띠",
      dominantElement: "金",
      concept: "재물운",
      hypeCount: 13892,
      isFollowing: false,
      isHyped: false,
    },
    {
      id: "3",
      rank: 3,
      name: "박*수",
      birthYear: 1992,
      zodiac: "원숭이띠",
      dominantElement: "木",
      concept: "직업운",
      hypeCount: 12456,
      isFollowing: true,
      isHyped: true,
    },
    {
      id: "4",
      rank: 4,
      name: "최*민",
      birthYear: 1995,
      zodiac: "돼지띠",
      dominantElement: "水",
      concept: "연애운",
      hypeCount: 11234,
      isFollowing: false,
      isHyped: false,
    },
    {
      id: "5",
      rank: 5,
      name: "정*아",
      birthYear: 1991,
      zodiac: "양띠",
      dominantElement: "土",
      concept: "건강운",
      hypeCount: 10567,
      isFollowing: false,
      isHyped: false,
    },
  ]);

  const handleHype = (userId: string) => {
    setRankings((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              isHyped: !user.isHyped,
              hypeCount: user.isHyped ? user.hypeCount - 1 : user.hypeCount + 1,
            }
          : user
      )
    );
  };

  const handleFollow = (userId: string) => {
    setRankings((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">HYPE</h1>
          </div>
          <p className="text-center text-purple-100 text-sm md:text-base">
            사주 랭킹에 HYPE를 보내보세요
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>총 {rankings.length}명</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>{rankings.reduce((sum, u) => sum + u.hypeCount, 0).toLocaleString()} HYPE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Filter */}
      <div className="sticky top-[112px] z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CONCEPTS.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedConcept === concept.id
                    ? `bg-gradient-to-r ${concept.gradient} text-white shadow-lg scale-105`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {concept.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="max-w-4xl mx-auto p-4 space-y-4 mt-4">
        {rankings.map((user, index) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
                      user.rank <= 3
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {getMedalEmoji(user.rank)}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {user.concept}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                    <span>{user.birthYear}년생</span>
                    <span>•</span>
                    <span>{user.zodiac}</span>
                    <span>•</span>
                    <span className="font-medium">{user.dominantElement} 기운</span>
                  </div>

                  {/* HYPE Count */}
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-gray-900">
                      {user.hypeCount.toLocaleString()} HYPE
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleHype(user.id)}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        user.isHyped
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Zap className={`w-4 h-4 ${user.isHyped ? "fill-white" : ""}`} />
                        <span>{user.isHyped ? "HYPED" : "HYPE"}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleFollow(user.id)}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        user.isFollowing
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {user.isFollowing ? (
                          <>
                            <Heart className="w-4 h-4 fill-white" />
                            <span>팔로잉</span>
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4" />
                            <span>팔로우</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect Line */}
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
