"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";

interface OrderSuccessCardProps {
  phoneNumber: string;
  orderNumber: string;
  onReset: () => void;
}

export default function OrderSuccessCard({ phoneNumber, orderNumber, onReset }: OrderSuccessCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("فشل في نسخ رقم الطلب:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sticky top-24 text-center space-y-4">
      
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">تم استلام طلبك بنجاح!</h3>

      <div className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl py-2 px-3 max-w-xs mx-auto">
        <span className="text-xs text-slate-500 font-medium">رقم الهاتف:</span>
        <span className="font-bold text-indigo-600 font-mono text-base">{phoneNumber}</span>
      </div>
      
      <div className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl py-2 px-3 max-w-xs mx-auto">
        <span className="text-xs text-slate-500 font-medium">رقم الطلب:</span>
        <span className="font-bold text-indigo-600 font-mono text-base">{orderNumber}</span>

        
        <button
          type="button"
          onClick={handleCopy}
          title="نسخ رقم الطلب"
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            copied
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>نسخ</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-bold">
        بالله عليك أحفظ الرقمين لأجل تشوف طلبك أو تلغيه .
      </p>

      
      <button
        type="button"
        onClick={onReset}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.99]"
      >
        طلب جديد
      </button>
    </div>
  );
}