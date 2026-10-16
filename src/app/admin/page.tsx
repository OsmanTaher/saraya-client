 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminToken } from "@/src/lib/cookies";
import {
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "كلمة المرور غير صحيحة، حاول مرة أخرى");
        triggerShake();
        return;
      }

      setAdminToken(data.token);
      router.replace("/admin/orders");
    } catch {
      setError("تعذر الاتصال بالسيرفر، تأكد من تشغيل الخادم");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[91vh] flex items-center justify-center bg-[#140C07] relative overflow-hidden p-4"
      dir="rtl"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D55304]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div
        className={`w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-200/40 p-7 sm:p-9 space-y-6 relative z-10 ${
          shake ? "animate-shake border-rose-400" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-orange-50 text-[#D55304] px-3 py-1 rounded-full border border-[#D55304]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>بوابة الإدارة المعتمدة</span>
          </span>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#D55304] transition"
          >
            <span>الموقع الرئيسي</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>

        <div className="text-center space-y-2.5 pt-1">
          <div className="w-22 h-22 rounded-3xl bg-gradient-to-br from-[#D55304] to-[#9A3412] p-0.5 mx-auto shadow-lg shadow-[#D55304]/25">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center p-2">
              <img
                src="/logo.png"
                alt="مطعم السرايا"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            مطعم السرايا
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            لوحة تحكم المشرف ونقطة بيع الكاشير (POS)
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2">
              كلمة مرور المشرف / الكاشير
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <Lock
                  className={`w-4 h-4 transition-colors ${
                    error ? "text-rose-500" : "text-[#D55304]"
                  }`}
                />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="أدخل كلمة المرور السرية..."
                className={`w-full pr-10 pl-11 py-3.5 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none transition-all ${
                  error
                    ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-[#D55304] focus:ring-2 focus:ring-[#D55304]/15"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 hover:text-[#D55304] transition cursor-pointer"
                tabIndex={-1}
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
            disabled={loading}
            className="w-full bg-gradient-to-l from-[#D55304] to-[#b84403] hover:from-[#b84403] hover:to-[#9A3412] disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#D55304]/25 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق من الصلاحية...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول للنظام</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
