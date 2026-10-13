"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { setCookie } from "@/src/lib/cookies";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "كلمة المرور غير صحيحة");
      }

      setCookie("toshka_admin_token", data.token, 1);
      router.push("/admin/orders");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "فشل تسجيل الدخول، يرجى المحاولة لاحقاً",
      );
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 select-none">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          opacity: 0.65,
        }}
      />

      <div className="fixed -top-24 -right-24 w-96 h-96 bg-[#5850EC]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div
        className={`relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-4xl p-8 sm:p-10 border border-slate-200 shadow-[0_20px_50px_rgba(88,80,236,0.1)] transition-transform duration-300 ${
          isShaking ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
      >
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#5850EC]/15 rounded-2xl rotate-6 animate-pulse" />
          <div className="relative w-full h-full bg-[#5850EC] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#5850EC]/30">
            <Lock className="w-8 h-8 stroke-[2.2]" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-bounce" />
        </div>

        <div className="text-center space-y-1.5 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            بوابة الإدارة
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            أدخل مفتاح الأمان المخصص للوصول إلى لوحة التحكم
          </p>
        </div>

        <div
          className={`grid transition-all duration-300 ease-out overflow-hidden ${
            error
              ? "grid-rows-[1fr] opacity-100 mb-5 translate-y-0"
              : "grid-rows-[0fr] opacity-0 mb-0 -translate-y-2"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs font-bold shadow-sm">
              <div className="w-6 h-6 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="flex-1 leading-relaxed">{error}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 mr-1">
              مفتاح المرور السري
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••"
                className="w-full pr-4 pl-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono tracking-wider focus:bg-white focus:outline-none focus:border-[#5850EC] focus:ring-4 focus:ring-[#5850EC]/10 transition-all duration-200 text-left dir-ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full relative group overflow-hidden bg-[#5850EC] hover:bg-[#4a42dc] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl shadow-[#5850EC]/25 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>تأكيد وتسجيل الدخول</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#5850EC] transition-colors"
          >
            <span>العودة إلى الصفحة الرئيسية للمتجر</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
