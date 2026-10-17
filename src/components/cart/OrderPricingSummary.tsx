"use client";

import { Wallet } from "lucide-react";

interface OrderPricingSummaryProps {
  totalPrice: number;
  deliveryFee: number;
  isPickup: boolean;
  isDineIn?: boolean;
  finalTotal: number;
}

export default function OrderPricingSummary({
  totalPrice,
  deliveryFee,
  isPickup,
  isDineIn = false,
  finalTotal,
}: OrderPricingSummaryProps) {
  return (
    <div className="bg-slate-50/90 p-4 rounded-xl space-y-2.5 border border-slate-100">
      <div className="flex justify-between items-center text-slate-600 text-xs sm:text-sm">
        <span>مجموع الوجبات:</span>
        <span className="font-bold text-slate-800">{totalPrice} ج.م</span>
      </div>

      {!isDineIn && (
        <div className="flex justify-between items-center text-slate-600 text-xs sm:text-sm">
          <span>رسوم التوصيل:</span>
          {isPickup ? (
            <span className="font-bold text-emerald-600">
              مجاناً
            </span>
          ) : (
            <span className="font-bold text-slate-800">{deliveryFee} ج.م</span>
          )}
        </div>
      )}

      <div className="border-t border-slate-200/80 pt-2.5 flex justify-between items-center text-slate-900 font-extrabold">
        <span className="text-sm flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-[#D55304]" />
          <span>الإجمالي النهائي:</span>
        </span>
        <span className="text-lg sm:text-xl text-[#D55304]">
          {finalTotal} ج.م
        </span>
      </div>
    </div>
  );
}