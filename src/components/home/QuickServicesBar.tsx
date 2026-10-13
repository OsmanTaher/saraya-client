"use client";

import { useState } from "react";
import AboutUsModal from "./AboutUsModal";
import OrderQuickViewModal from "./OrderQuickViewModal";

export default function QuickServicesBar() {
  const [activeAccordion, setActiveAccordion] = useState<
    "none" | "track" | "cancel"
  >("none");
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [viewingOrder, setViewingOrder] = useState<unknown | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const toggleAccordion = (type: "track" | "cancel") => {
    setErrorMsg("");
    setSuccessMsg("");
    setPhoneNumber("");
    setOrderNumber("");
    setActiveAccordion((prev) => (prev === type ? "none" : type));
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${apiUrl}/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber.trim(),
          phoneNumber: phoneNumber.trim(),
          orderNumber: orderNumber.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data.message || "البيانات غير صحيحة، يرجى التأكد والمحاولة مجدداً."
        );
        return;
      }

      setViewingOrder(data.order || data);
      setActiveAccordion("none");
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${apiUrl}/orders/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber.trim(),
          phoneNumber: phoneNumber.trim(),
          orderNumber: orderNumber.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "تعذر إلغاء الطلب.");
        return;
      }

      setSuccessMsg(data.message || "تم إلغاء طلبك بنجاح.");
      setTimeout(() => {
        setActiveAccordion("none");
      }, 2000);
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-3" dir="rtl">
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-[#D55304]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon
              points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
              fill="currentColor"
            />
          </svg>
          <h2 className="font-bold text-slate-900">خدمات سريعة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="w-full h-14 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#9A3412] rounded-2xl px-5 flex items-center justify-start gap-2 font-bold text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <svg
              className="w-5 h-5 text-[#D55304]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>عن مطعم السرايا</span>
          </button>

          <button
            type="button"
            onClick={() => toggleAccordion("track")}
            className="w-full h-14 bg-[#E8F8F0] hover:bg-[#DCF4E7] text-[#065F46] rounded-2xl px-5 flex items-center justify-between font-bold text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#059669]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>تتبع طلبك</span>
            </div>
            <svg
              className={`w-4 h-4 text-[#047857] transition-transform duration-300 ${
                activeAccordion === "track" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => toggleAccordion("cancel")}
            className="w-full h-14 bg-[#FDF2F2] hover:bg-[#FCE7E7] text-[#9F1239] rounded-2xl px-5 flex items-center justify-between font-bold text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#E11D48]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M5.7 5.7l12.6 12.6" />
              </svg>
              <span>إلغاء الطلب</span>
            </div>
            <svg
              className={`w-4 h-4 text-[#BE123C] transition-transform duration-300 ${
                activeAccordion === "cancel" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {activeAccordion === "track" && (
          <div className="mt-5 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="bg-[#F6FCF9] border border-emerald-100/90 rounded-3xl p-6 max-w-lg mx-auto shadow-xs">
              <div className="flex items-center justify-between text-[#065F46] font-bold text-sm mb-4">
                <span className="flex items-center gap-1.5">
                  <span>تفاصيل طلبك</span>
                </span>
                <span className="text-xs text-emerald-600 font-bold">
                  استعلام مباشر عن حالة ووجبات الطلب
                </span>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                    رقم الهاتف (اختياري في حال إدخال رقم الطلب)
                  </label>
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-emerald-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-right text-slate-800 placeholder:text-slate-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                    رقم الطلب
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-right text-slate-800 placeholder:text-slate-300 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xs disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? "جاري البحث..." : "عرض طلبي"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeAccordion === "cancel" && (
          <div className="mt-5 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="bg-[#FFF8F8] border border-rose-100/90 rounded-3xl p-6 max-w-lg mx-auto shadow-xs">
              <div className="flex items-center justify-between text-[#9F1239] font-bold text-sm mb-4">
                <span className="flex items-center gap-1.5">
                  <span>إلغاء الطلب</span>
                </span>
                <span className="text-xs text-rose-500 font-bold">
                  متاح قبل بدء تحضير الوجبة في المطبخ فقط
                </span>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 font-semibold">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-100 mb-4 font-semibold">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleCancelSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                    رقم الطلب
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-rose-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/40 text-right text-slate-800 placeholder:text-slate-300 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xs disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? "جاري الإلغاء..." : "إلغاء طلبي"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <AboutUsModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      <OrderQuickViewModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
      />
    </section>
  );
}