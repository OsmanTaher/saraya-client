 
"use client";

import { useCart, getCartItemKey } from "@/src/context/CartContext";
import {
  Receipt,
  Printer,
  RotateCcw,
  Trash2,
  Banknote,
  CreditCard,
  Wallet,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  FileText,
} from "lucide-react";

interface CashierCartPanelProps {
  notes: string;
  setNotes: (val: string) => void;
  paymentMode: "cash" | "card" | "instapay";
  setPaymentMode: (mode: "cash" | "card" | "instapay") => void;
  submitting: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  onPrintAndSubmit: () => void;
  onResetCart: () => void;
}

export default function CashierCartPanel({
  notes,
  setNotes,
  paymentMode,
  setPaymentMode,
  submitting,
  errorMsg,
  successMsg,
  onPrintAndSubmit,
  onResetCart,
}: CashierCartPanelProps) {
  const { cart, updateQuantity, removeFromCart, subtotalPrice } = useCart();
  const totalPrice = Number(subtotalPrice || 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900">
          <Receipt className="w-5 h-5 text-[#D55304]" />
          <h3 className="text-base sm:text-lg font-extrabold">
            ملخص الطلب والحساب
          </h3>
        </div>
        <span className="text-[11px] font-extrabold bg-orange-50 text-[#D55304] px-2.5 py-1 rounded-full">
          نقطة بيع الكاشير
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <ShoppingCart className="w-7 h-7 mx-auto text-slate-300" />
            <p className="text-xs font-medium">لم يتم تحديد أي وجبة بعد.</p>
          </div>
        ) : (
          cart.map((item) => {
            const itemKey =
              item.cartItemId || getCartItemKey(item._id, item.selectedSize);
            const price = Number(item.price || 0);

            return (
              <div
                key={itemKey}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/80x80/fff7ed/D55304?text=?";
                    }}
                  />
                  <div className="min-w-0 flex-1 text-right">
                    <p className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">
                      {item.name}
                    </p>
                    {item.selectedSize && (
                      <span className="text-[11px] text-slate-500 font-bold">
                        ({item.selectedSize})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.cartQuantity + 1,
                          item.selectedSize,
                        )
                      }
                      className="w-5 h-5 rounded bg-[#D55304] text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="px-1.5 text-xs font-extrabold text-[#D55304]">
                      {item.cartQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.cartQuantity - 1,
                          item.selectedSize,
                        )
                      }
                      className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                  </div>

                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm min-w-[65px] text-left">
                    {price * item.cartQuantity} ج.م
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id, item.selectedSize)}
                    className="text-rose-500 hover:text-rose-700 p-1 transition cursor-pointer"
                    title="حذف الصنف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-slate-50/90 rounded-2xl p-4 space-y-2.5 border border-slate-100 text-xs sm:text-sm">
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
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#D55304] transition-all resize-none"
          />
        </div>

        <div className="bg-orange-50/90 border border-[#D55304]/20 rounded-xl p-3 flex justify-between items-center pt-3">
          <span className="font-extrabold text-[#D55304] text-sm sm:text-base flex items-center gap-1.5">
            <Wallet className="w-4 h-4" />
            <span>الإجمالي النهائي:</span>
          </span>
          <span className="text-xl font-black text-[#D55304]">
            {totalPrice} ج.م
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
          <CreditCard className="w-4 h-4 text-[#D55304]" />
          <span>طريقة الدفع</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMode("cash")}
            className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
              paymentMode === "cash"
                ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>كاش</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("card")}
            className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
              paymentMode === "card"
                ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>فيزا / بطاقة</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("instapay")}
            className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
              paymentMode === "instapay"
                ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>إنستاباي / محفظة</span>
          </button>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          disabled={submitting || cart.length === 0}
          onClick={onPrintAndSubmit}
          className="w-full bg-[#D55304] hover:bg-[#b84403] disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-md shadow-[#D55304]/25 flex items-center justify-center gap-2 text-base transition-all active:scale-[0.99] cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري الحفظ والطباعة...</span>
            </>
          ) : (
            <>
              <Printer className="w-5 h-5" />
              <span>طباعة الإيصال</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onResetCart}
          className="w-full bg-white hover:bg-orange-50 text-[#D55304] border border-[#D55304]/40 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>طلب جديد / مسح السلة</span>
        </button>
      </div>
    </div>
  );
}
