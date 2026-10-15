"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  MessageCircle,
  Send,
  MessageSquarePlus,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTACT_PHONE = "01080859921";
const WHATSAPP_URL = "https://wa.me/201080859921";
const TELEGRAM_URL = "https://t.me/+201080859921";

export default function ContactUsModal({
  isOpen,
  onClose,
}: ContactUsModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${apiUrl}/orders/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: customerPhone.trim(),
          message: feedback.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "تعذر إرسال المقترح، حاول مرة أخرى.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setFeedback("");
        setCustomerName("");
        setCustomerPhone("");
        setSubmitted(false);
      }, 3500);
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto text-right text-gray-800 leading-relaxed animate-in fade-in zoom-in-95 duration-200 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
        >
          ✕
        </button>

        <div className="border-b border-gray-100 pb-4 mb-5">
          <h2 className="text-xl md:text-2xl font-black text-[#D55304] mb-1.5 flex items-center gap-2">
            <span>📞</span> تواصل معنا
          </h2>
          <p className="text-xs md:text-sm text-gray-600">
            يسعدنا دائماً تواصلكم معنا للاستفسارات أو المتابعة، كما نرحب بآرائكم
            ومقترحاتكم لتطوير خدمات مطعم السرايا.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase">
            قنوات التواصل المباشر
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">واتساب</span>
              <span className="font-mono font-bold text-xs text-emerald-700 dir-ltr">
                {CONTACT_PHONE}
              </span>
            </a>

            <a
              href={`tel:${CONTACT_PHONE}`}
              className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border border-[#D55304]/25 text-[#9A3412] transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#D55304] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">اتصال هاتفي</span>
              <span className="font-mono font-bold text-xs text-[#D55304] dir-ltr">
                {CONTACT_PHONE}
              </span>
            </a>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/80 text-sky-900 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <Send className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">تلجرام</span>
              <span className="font-mono font-bold text-xs text-sky-700 dir-ltr">
                {CONTACT_PHONE}
              </span>
            </a>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquarePlus className="w-5 h-5 text-[#D55304]" />
            <h3 className="font-extrabold text-slate-900 text-sm md:text-base">
              إبداء رأيك ومقترحاتك
            </h3>
          </div>

          {errorMsg && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-center space-y-1.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-extrabold text-sm">
                شكراً لك! وصلت رسالتك الآن إلى إدارة مطعم السرايا.
              </p>
              <p className="text-xs text-emerald-700">
                رأيك يساعدنا دائماً على تطوير الموقع وتقديم الأفضل.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم (اختياري)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D55304] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D55304] transition text-left dir-ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تعليقك أو مقترحك لتحسين الموقع والخدمة{" "}
                  <span className="text-[#D55304]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="اكتب هنا رأيك في الوجبات أو أي تحسينات تقترحها على الموقع..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D55304] transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D55304] hover:bg-[#b84403] disabled:opacity-60 text-white py-3 rounded-xl font-extrabold text-xs sm:text-sm transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الرأي والمقترح</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
