"use client";

import React, { useEffect } from "react";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Truck,
  Store,
  CreditCard,
  Send,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
  ExternalLink,
  Smartphone,
} from "lucide-react";

interface CustomerInfoFormProps {
  name: string;
  setName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  isPickup: boolean;
  setIsPickup: (val: boolean) => void;
  tableNumber?: string | null;
  paymentMethod: "instapay" | "vodafone_cash";
  setPaymentMethod: (val: "instapay" | "vodafone_cash") => void;
  transferNumber: string;
  setTransferNumber: (val: string) => void;
  loading: boolean;
  error: string | null;
  isCartEmpty: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const INSTAPAY_DISPLAY = "saraya@instapay / 01080859921";
const INSTAPAY_LINK = "https://ipn.eg/S/aswany2030/instapay/4hwJiI";

const VODAFONE_CASH_DISPLAY = "01080859921";
const VODAFONE_CASH_LINK = "http://vf.eg/vfcash?id=mt&qrId=HKeNQu";

export default function CustomerInfoForm({
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  notes,
  setNotes,
  isPickup,
  setIsPickup,
  tableNumber,
  paymentMethod,
  setPaymentMethod,
  transferNumber,
  setTransferNumber,
  loading,
  error,
  isCartEmpty,
  onSubmit,
}: CustomerInfoFormProps) {
  const isDineIn = Boolean(tableNumber);
// مزامنة رقم التحويل مع رقم الهاتف تلقائياً إذا لم يقم العميل بكتابة رقم مختلف
useEffect(() => {
  if (phone) {
    setTransferNumber(phone);
  }
}, [phone]);
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-1" dir="rtl">
      {error && (
        <div className="p-3.5 bg-rose-50/90 border border-rose-200 text-rose-900 rounded-2xl text-xs flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200 text-right">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="font-bold text-rose-700 leading-relaxed flex-1">
            {error}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <User className="w-4 h-4 text-[#D55304]" />
        <h4 className="text-sm font-extrabold text-slate-800">
          {isDineIn
            ? `بيانات طلب الصالة (ترابيزة ${tableNumber})`
            : "بيانات التوصيل والإستلام"}
        </h4>
      </div>

      {isDineIn && (
        <div className="flex items-center justify-between bg-orange-50 border border-[#D55304]/30 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <UtensilsCrossed className="w-4 h-4 text-[#D55304]" />
            <span>الطلب مخصص لـ ترابيزة رقم ({tableNumber})</span>
          </div>
          <span className="bg-[#D55304] text-white px-2.5 py-0.5 rounded-full font-extrabold text-[11px]">
            داخل المطعم
          </span>
        </div>
      )}

      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
          <span>الاسم الكامل</span>
          {!isDineIn ? (
            <span className="text-[#D55304]">*</span>
          ) : (
            <span className="text-[10px] font-normal text-slate-400">
              (اختياري)
            </span>
          )}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </span>
          <input
            type="text"
            required={!isDineIn}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أحمد محمد"
            className="w-full pr-9 pl-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D55304] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
          <span>رقم الهاتف</span>
          {!isDineIn ? (
            <span className="text-[#D55304]">*</span>
          ) : (
            <span className="text-[10px] font-normal text-slate-400">
              (اختياري)
            </span>
          )}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <Phone className="w-3.5 h-3.5" />
          </span>
          <input
            type="tel"
            required={!isDineIn}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            minLength={11}
            maxLength={11}
            inputMode="numeric"
            placeholder="01xxxxxxxxx"
            className="w-full pr-9 pl-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D55304] transition-all text-left dir-ltr"
          />
        </div>
      </div>

      {!isDineIn && (
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setIsPickup(false)}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              !isPickup
                ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>توصيل للمنازل</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPickup(true)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              isPickup
                ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <div className="flex flex-col items-start leading-tight">
              <span>الإستلام من الفرع</span>
              <span
                className={`text-[9px] font-normal ${
                  isPickup ? "text-orange-100" : "text-slate-400"
                }`}
              >
                (بدون رسوم توصيل)
              </span>
            </div>
          </button>
        </div>
      )}

      {!isDineIn && !isPickup && (
        <div className="animate-in fade-in duration-200">
          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
            <span>العنوان التفصيلي</span>
            <span className="text-[#D55304]">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              type="text"
              required={!isPickup && !isDineIn}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: شارع الجمهورية - بجوار..."
              className="w-full pr-9 pl-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D55304] transition-all"
            />
          </div>
        </div>
      )}

      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>ملاحظات إضافية (اختياري)</span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: بدون بصل، صوص إضافي ..."
          className="w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D55304] transition-all resize-none"
        />
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-[#D55304]" />
          <span className="text-xs font-extrabold text-slate-800">
            طريقة الدفع
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPaymentMethod("instapay")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
              paymentMethod === "instapay"
                ? "border-[#D55304] bg-orange-50/70 text-[#D55304] shadow-2xs"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === "instapay"
                  ? "border-[#D55304]"
                  : "border-slate-300"
              }`}
            >
              {paymentMethod === "instapay" && (
                <span className="w-2 h-2 rounded-full bg-[#D55304]" />
              )}
            </span>
            <span>إنستاباي (InstaPay)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("vodafone_cash")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
              paymentMethod === "vodafone_cash"
                ? "border-[#D55304] bg-orange-50/70 text-[#D55304] shadow-2xs"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === "vodafone_cash"
                  ? "border-[#D55304]"
                  : "border-slate-300"
              }`}
            >
              {paymentMethod === "vodafone_cash" && (
                <span className="w-2 h-2 rounded-full bg-[#D55304]" />
              )}
            </span>
            <span>فودافون كاش</span>
          </button>
        </div>

        {paymentMethod === "instapay" ? (
          <a
            href={INSTAPAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-orange-50/90 hover:bg-orange-100/80 border border-[#D55304]/30 rounded-xl p-3 text-center transition-all group shadow-2xs"
          >
            <p className="text-[11px] text-slate-600 font-bold mb-1">
              اضغط هنا للتحويل مباشرة عبر تطبيق إنستاباي:
            </p>
            <div className="inline-flex items-center justify-center gap-1.5 font-extrabold text-[#D55304] text-sm font-mono dir-ltr group-hover:underline">
              <span>{INSTAPAY_DISPLAY}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </div>
          </a>
        ) : (
          <a
            href={VODAFONE_CASH_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-orange-50/90 hover:bg-orange-100/80 border border-[#D55304]/30 rounded-xl p-3 text-center transition-all group shadow-2xs"
          >
            <p className="text-[11px] text-slate-600 font-bold mb-1">
              رقم محفظة فودافون كاش للتحويل (اضغط للدفع السريع):
            </p>
            <div className="inline-flex items-center justify-center gap-1.5 font-extrabold text-[#D55304] text-base font-mono dir-ltr group-hover:underline">
              <span>{VODAFONE_CASH_DISPLAY}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </div>
          </a>
        )}

        <div>
          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
            <span>الرقم الذي حولت منه المبلغ</span>
            <span className="text-[#D55304]">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <Smartphone className="w-4 h-4 text-[#D55304]" />
            </span>
            <input
              type="tel"
              required
              // value={phone}
              value={transferNumber}
              minLength={11}
              maxLength={11}
              inputMode="numeric"
              onChange={(e) => setTransferNumber(e.target.value)}
              placeholder="اكتب الرقم أو حساب إنستاباي المحول منه..."
              className="w-full pr-9 pl-3 py-2.5 bg-white border border-[#D55304]/40 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D55304] focus:ring-2 focus:ring-[#D55304]/15 transition-all text-left dir-ltr"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            يرجى كتابة الرقم المحول منه لتأكيد طلبك فوراً في المطبخ
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || isCartEmpty}
        className="w-full bg-[#D55304] hover:bg-[#b84403] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md shadow-[#D55304]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري إرسال الطلب...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>تأكيد وإرسال الطلب</span>
          </>
        )}
      </button>
    </form>
  );
}
