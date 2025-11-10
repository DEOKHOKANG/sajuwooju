import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LogOut, User, Mail, Calendar, Shield } from "lucide-react";

/**
 * 사용자 프로필 페이지
 * 로그인 필수 (middleware에서 보호)
 */
export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-8 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cosmic-purple to-nebula-pink flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">
                {user?.name || "사용자"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {(user as any)?.role === "premium" ? "프리미엄 회원" : "일반 회원"}
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            {user?.email && (
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-5 h-5 text-cosmic-purple" />
                <span className="text-sm">{user.email}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="w-5 h-5 text-cosmic-purple" />
              <span className="text-sm">
                가입일: {new Date((user as any)?.createdAt || Date.now()).toLocaleDateString("ko-KR")}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Shield className="w-5 h-5 text-cosmic-purple" />
              <span className="text-sm capitalize">
                {(user as any)?.role || "user"} 계정
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/60 transition-all duration-300">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-700">계정 설정</span>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full glass-card p-4 flex items-center justify-between hover:bg-red-50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-600">로그아웃</span>
              </div>
            </button>
          </form>
        </div>

        {/* Stats (Optional - can be expanded) */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">내 활동</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-cosmic-purple">0</p>
              <p className="text-xs text-slate-500">상담 내역</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-cosmic-purple">0</p>
              <p className="text-xs text-slate-500">저장한 상품</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-cosmic-purple">0</p>
              <p className="text-xs text-slate-500">AI 대화</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
