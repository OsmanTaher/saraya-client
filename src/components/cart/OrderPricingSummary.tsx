"use client";

import { TricycleIcon } from "../icons/TricycleIcon";

interface OrderPricingSummaryProps {
  totalPrice: number;
  deliveryFee: number;
  isPickup: boolean;
  finalTotal: number;
}

export default function OrderPricingSummary({
  totalPrice,
  deliveryFee,
  isPickup,
  finalTotal,
}: OrderPricingSummaryProps) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-sm border border-slate-100">
      <div className="flex justify-between text-slate-600">
        <span>مجموع المنتجات:</span>
        <span className="font-bold text-slate-800">
          {totalPrice.toFixed(2)} ج
        </span>
      </div>

      <div
        className={`flex justify-between text-slate-600 transition-all duration-300 ease-in-out overflow-hidden ${
          isPickup
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-20 opacity-100"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <TricycleIcon size={18} className="text-slate-700 shrink-0 inline" />
          رسوم التوصيل:
        </span>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-bold text-slate-800">{deliveryFee} ج.م</span>
          <span className="text-xs text-slate-400 line-through">15 ج.م</span>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-slate-900">
        <span className="font-bold text-base">الإجمالي النهائي:</span>
        <span className="text-xl font-extrabold text-indigo-600">
          {finalTotal.toFixed(2)} ج
        </span>
      </div>
    </div>
  );
}
