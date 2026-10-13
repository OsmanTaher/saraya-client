"use client";

import {
  User,
  Phone,
  MapPin,
  HandCoins,
  Send,
  Loader2,
  AlertCircle,
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
  loading: boolean;
  error: string | null;
  isCartEmpty: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

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
  loading,
  error,
  isCartEmpty,
  onSubmit,
}: CustomerInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-2">
      {error && (
  <div className="p-3.5 bg-rose-50/90 border border-rose-200 text-rose-900 rounded-2xl text-xs flex items-start gap-3 shadow-xs animate-in fade-in duration-200 text-right">
    
    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

    <div className="flex-1 space-y-1.5">
      {error.includes("\n") ? (
        <>
          
          <p className="font-bold text-rose-800 text-xs leading-snug">
            {error.split("\n")[0]}
          </p>

          
          <div className="flex items-center gap-1.5 text-rose-700 bg-white/70 border border-rose-200/60 px-2.5 py-1.5 rounded-lg text-[11px] font-medium leading-relaxed">
            <span className="text-amber-600">💡</span>
            <span>{error.split("\n")[1]}</span>
          </div>
        </>
      ) : (
        
        <p className="font-medium text-rose-700 leading-relaxed">{error}</p>
      )}
    </div>
  </div>
)}

      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        بيانات التوصيل والاستلام
      </h4>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: محمد أحمد"
            className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          رقم الهاتف <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <Phone className="w-3.5 h-3.5" />
          </span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="01(0|1|2|5)[0-9]{8}"
            minLength={11}
            maxLength={11}
            inputMode="numeric"
            placeholder="011xxxxxxxx"
            className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-all text-left dir-ltr"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">
            الإستلام من الجمعية
          </span>
          <span className="text-[10px] text-slate-500">بدون رسوم توصيل</span>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isPickup}
            onChange={(e) => setIsPickup(e.target.checked)}
            className="peer sr-only"
          />
          <span className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-indigo-600"></span>
          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></span>
        </label>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isPickup
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-28 opacity-100"
        }`}
      >
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            العنوان التفصيلي <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              type="text"
              required={!isPickup}
              disabled={isPickup}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="المدينة، الحي، اسم الشارع، رقم المنزل"
              className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          ملاحظات إضافية (اختياري)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أي تفاصيل خاصة بالطلب أو الموعد أو لون منتج ..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
        ></textarea>
      </div>

      <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-900">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
          <HandCoins className="w-5 h-5 text-amber-800" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-amber-950">طريقة الدفع</span>
          <span className="text-xs font-medium text-amber-800">
            الدفع عند الاستلام (كاش)
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || isCartEmpty}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
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
