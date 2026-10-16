/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminToken } from "@/src/lib/cookies";
import { Lock, LogIn, AlertCircle, Loader2, UtensilsCrossed } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        setError(data.message || "كلمة المرور غير صحيحة");
        return;
      }

      setAdminToken(data.token);
      router.replace("/admin/orders");
    } catch {
      setError("تعذر الاتصال بالسيرفر، تأكد من تشغيل الخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-orange-100 p-7 sm:p-8 space-y-6">
        {/* شعار وعنوان المطعم */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-2xl bg-[#D55304]/10 border border-[#D55304]/20 flex items-center justify-center mx-auto overflow-hidden shadow-xs">
            <img
              src="/logo.png"
              alt="مطعم السرايا"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <UtensilsCrossed className="w-8 h-8 text-[#D55304] hidden" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">مطعم السرايا</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            لوحة تحكم المشرف ونقطة بيع الكاشير (POS)
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              كلمة مرور المشرف / الكاشير
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-[#D55304]" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#D55304] focus:ring-2 focus:ring-[#D55304]/15 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D55304] hover:bg-[#b84403] disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl shadow-md shadow-[#D55304]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>دخول للوحة التحكم</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}