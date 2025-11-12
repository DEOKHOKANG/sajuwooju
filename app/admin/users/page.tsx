"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Mock data
  const users = [
    { id: 1, name: "김사주", email: "kim@example.com", role: "user", createdAt: "2025-11-01", status: "active" },
    { id: 2, name: "이운세", email: "lee@example.com", role: "premium", createdAt: "2025-11-05", status: "active" },
    { id: 3, name: "박명리", email: "park@example.com", role: "user", createdAt: "2025-11-10", status: "inactive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* 헤더 */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard">
              <button className="text-slate-400 hover:text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                대시보드로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">사용자 관리</h2>
          <p className="text-slate-400">등록된 사용자 목록 및 관리</p>
        </div>

        <Card variant="bordered" className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">전체 사용자 (3명)</CardTitle>
              <Button variant="primary" size="sm">
                + 새 사용자
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">ID</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">이름</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">이메일</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">등급</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">가입일</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">상태</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-slate-300">{user.id}</td>
                      <td className="p-4 text-white font-medium">{user.name}</td>
                      <td className="p-4 text-slate-300">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "premium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-slate-700 text-slate-300"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{user.createdAt}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">편집</Button>
                          <Button variant="danger" size="sm">삭제</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Development Notice */}
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-4">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">개발 노트</h3>
              <p className="text-sm text-slate-300">
                현재 표시된 데이터는 mock 데이터입니다.
                실제 Prisma API와 연동하면 데이터베이스의 실시간 사용자 정보가 표시됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
