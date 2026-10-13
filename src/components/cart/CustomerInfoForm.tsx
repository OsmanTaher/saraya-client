"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useRef } from "react";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Truck,
  Store,
  CreditCard,
  ImagePlus,
  Send,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
  X,
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
  paymentMethod: "cash" | "instapay" | "vodafone_cash";
  setPaymentMethod: (val: "cash" | "instapay" | "vodafone_cash") => void;
  paymentReceipt: string;
  setPaymentReceipt: (val: string) => void;
  loading: boolean;
  error: string | null;
  isCartEmpty: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const INSTAPAY_ACCOUNT =
  process.env.NEXT_PUBLIC_INSTAPAY_ACCOUNT || "saraya@instapay / 01080859921";
const VODAFONE_CASH_NUMBER =
  process.env.NEXT_PUBLIC_VODAFONE_CASH || "01080859921";

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
  paymentReceipt,
  setPaymentReceipt,
  loading,
  error,
  isCartEmpty,
  onSubmit,
}: CustomerInfoFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDineIn = Boolean(tableNumber);
  const requiresReceipt =
    paymentMethod === "instapay" || paymentMethod === "vodafone_cash";

  // ضغط وتحويل صورة الإيصال إلى Base64 لسرعة الرفع والإرسال للتلجرام
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.78);
        setPaymentReceipt(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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

      {/* عنوان قسم البيانات */}
      <div className="flex items-center gap-2 pt-1">
        <User className="w-4 h-4 text-[#D55304]" />
        <h4 className="text-sm font-extrabold text-slate-800">
          {isDineIn
            ? `بيانات طلب الصالة (ترابيزة ${tableNumber})`
            : "بيانات التوصيل والإستلام"}
        </h4>
      </div>

      {/* لافتة رقم الترابيزة في حالة المسح عبر QR Code */}
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

      {/* حقل الاسم الكامل (إجباري في الدليفري، اختياري في الصالة) */}
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

      {/* حقل رقم الهاتف (إجباري في الدليفري، اختياري في الصالة) */}
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

      {/* أزرار اختيار (توصيل للمنازل / الإستلام من الفرع) - تظهر لغير عميل الترابيزة */}
      {!isDineIn && (
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setIsPickup(false)}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${!isPickup
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
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${isPickup
                ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <div className="flex flex-col items-start leading-tight">
              <span>الإستلام من الفرع</span>
              <span
                className={`text-[9px] font-normal ${isPickup ? "text-orange-100" : "text-slate-400"
                  }`}
              >
                (بدون رسوم توصيل)
              </span>
            </div>
          </button>
        </div>
      )}

      {/* حقل العنوان التفصيلي (يظهر فقط في حالة التوصيل للمنازل) */}
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

      {/* حقل الملاحظات الإضافية */}
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

      {/* قسم طريقة الدفع مطابق للصورة */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-[#D55304]" />
          <span className="text-xs font-extrabold text-slate-800">
            طريقة الدفع
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* كاش */}
          <button
            type="button"
            onClick={() => setPaymentMethod("cash")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${paymentMethod === "cash"
                ? "border-[#D55304] bg-orange-50/60 text-[#D55304]"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === "cash"
                  ? "border-[#D55304]"
                  : "border-slate-300"
                }`}
            >
              {paymentMethod === "cash" && (
                <span className="w-2 h-2 rounded-full bg-[#D55304]" />
              )}
            </span>
            <span>{isDineIn ? "كاش للكاشير" : "كاش عند الاستلام"}</span>
          </button>

          {/* إنستاباي */}
          <button
            type="button"
            onClick={() => setPaymentMethod("instapay")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${paymentMethod === "instapay"
                ? "border-[#D55304] bg-orange-50/60 text-[#D55304]"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === "instapay"
                  ? "border-[#D55304]"
                  : "border-slate-300"
                }`}
            >
              {paymentMethod === "instapay" && (
                <span className="w-2 h-2 rounded-full bg-[#D55304]" />
              )}
            </span>
            <span>إنستاباي</span>
          </button>

          {/* فودافون كاش */}
          <button
            type="button"
            onClick={() => setPaymentMethod("vodafone_cash")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${paymentMethod === "vodafone_cash"
                ? "border-[#D55304] bg-orange-50/60 text-[#D55304]"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === "vodafone_cash"
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

        {/* عرض رقم التحويل عند اختيار إنستاباي أو فودافون كاش */}
        {requiresReceipt && (
          <div className="bg-orange-50/80 border border-[#D55304]/25 rounded-xl p-2.5 text-center text-xs space-y-0.5 animate-in fade-in duration-150">
            <p className="text-slate-600 font-medium">
              {paymentMethod === "instapay"
                ? "حساب إنستاباي للتحويل:"
                : "رقم محفظة فودافون كاش للتحويل:"}
            </p>
            <p className="font-extrabold text-[#D55304] text-sm font-mono dir-ltr select-all">
              {paymentMethod === "instapay"
                ? INSTAPAY_ACCOUNT
                : VODAFONE_CASH_NUMBER}
            </p>
          </div>
        )}

        {/* صندوق إرفاق صورة إيصال التحويل مطابق للصورة */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleReceiptChange}
            className="hidden"
          />

          {paymentReceipt ? (
            <div className="relative rounded-xl border-2 border-[#D55304]/40 bg-orange-50/30 p-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={paymentReceipt}
                  alt="إيصال التحويل"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="text-right truncate">
                  <p className="text-xs font-extrabold text-emerald-700">
                    تم إرفاق صورة الإيصال بنجاح
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#D55304] underline font-semibold cursor-pointer"
                  >
                    تغيير الصورة
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentReceipt("")}
                className="p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition cursor-pointer"
                title="حذف الصورة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-3.5 text-center transition-all cursor-pointer ${requiresReceipt
                  ? "border-[#D55304]/60 bg-orange-50/40 hover:bg-orange-50"
                  : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70"
                }`}
            >
              <div className="flex items-center justify-center gap-2 text-slate-700 font-bold text-xs">
                <ImagePlus
                  className={`w-4 h-4 ${requiresReceipt ? "text-[#D55304]" : "text-slate-400"
                    }`}
                />
                <span>ارفق صورة إيصال التحويل</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                (عند استخدام إنستاباي أو فودافون كاش)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* زر التأكيد وإرسال الطلب باللون البرتقالي #D55304 */}
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