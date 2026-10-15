"use client";

import { useState } from "react";
import {
  Headset,
  Info,
  CheckCircle2,
  ChevronDown,
  Compass,
} from "lucide-react";
import AboutUsModal from "./AboutUsModal";
import OrderQuickViewModal from "./OrderQuickViewModal";
import ContactUsModal from "./ContactUsModal";

export default function QuickServicesBar() {
  const [activeAccordion, setActiveAccordion] = useState<"none" | "track">(
    "none",
  );
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [viewingOrder, setViewingOrder] = useState<unknown | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const toggleTrackAccordion = () => {
    setErrorMsg("");
    setPhoneNumber("");
    setOrderNumber("");
    setActiveAccordion((prev) => (prev === "track" ? "none" : "track"));
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phoneNumber.trim();
    const cleanOrder = orderNumber.trim();

    if (!cleanPhone || !cleanOrder) {
      setErrorMsg("يرجى إدخال رقم الهاتف ورقم الطلب معاً.");
      return;
    }

    const phoneRegex = /^01(0|1|2|5)[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg("يرجى إدخال رقم هاتف صحيح مكون من 11 رقماً.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          phoneNumber: cleanPhone,
          orderNumber: cleanOrder,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data.message ||
            "بيانات الطلب غير صحيحة، يرجى التأكد والمحاولة مجدداً.",
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

  return (
    <section className="container mx-auto px-4 py-3" dir="rtl">
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-[#D55304]" />
          <h2 className="font-extrabold text-slate-900">خدمات سريعة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="w-full h-14 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#D55304]/20 text-[#9A3412] rounded-2xl px-5 flex items-center justify-start gap-2.5 font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div className="w-8 h-8 rounded-xl bg-[#D55304]/10 flex items-center justify-center text-[#D55304]">
              <Info className="w-4 h-4" />
            </div>
            <span>عن مطعم السرايا</span>
          </button>

          <button
            type="button"
            onClick={toggleTrackAccordion}
            className="w-full h-14 bg-[#E8F8F0] hover:bg-[#DCF4E7] border border-emerald-200/60 text-[#065F46] rounded-2xl px-5 flex items-center justify-between font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#059669]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>تتبع طلبك</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#047857] transition-transform duration-300 ${
                activeAccordion === "track" ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="w-full h-14 bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-blue-200/70 text-[#1E40AF] rounded-2xl px-5 flex items-center justify-between font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#2563EB]">
                <Headset className="w-4 h-4" />
              </div>
              <span>تواصل معنا وشاركنا رأيك</span>
            </div>
            <span className="text-[11px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
              دعم وآراء
            </span>
          </button>
        </div>

        {activeAccordion === "track" && (
          <div className="mt-5 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="bg-[#F6FCF9] border border-emerald-100/90 rounded-3xl p-6 max-w-lg mx-auto shadow-xs">
              <div className="flex items-center justify-between text-[#065F46] font-extrabold text-sm mb-4">
                <span>تفاصيل طلبك</span>
                <span className="text-xs text-emerald-600 font-bold">
                  استعلام مباشر عن حالة ووجبات الطلب
                </span>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    minLength={11}
                    maxLength={11}
                    inputMode="numeric"
                    placeholder="01xxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-emerald-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-right text-slate-800 placeholder:text-slate-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                    رقم الطلب <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 1001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-emerald-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-right text-slate-800 placeholder:text-slate-300 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xs disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? "جاري البحث..." : "عرض طلبي"}
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
      <ContactUsModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <OrderQuickViewModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
      />
    </section>
  );
}
