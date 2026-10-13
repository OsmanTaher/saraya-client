"use client";

import { Truck } from "lucide-react";

interface OrderPricingSummaryProps {
  totalPrice?: number;
  deliveryFee?: number;
  isPickup?: boolean;
  isDineIn?: boolean;
  finalTotal?: number;
}

export default function OrderPricingSummary({
  totalPrice = 0,
  deliveryFee = 15,
  isPickup = false,
  isDineIn = false,
  finalTotal = 0,
}: OrderPricingSummaryProps) {
  const safeTotal = Number(totalPrice || 0);
  const safeDelivery = isPickup || isDineIn ? 0 : Number(deliveryFee || 0);
  const safeFinal =
    finalTotal !== undefined ? Number(finalTotal) : safeTotal + safeDelivery;

  return (
    <div
      className="bg-slate-50/80 p-4 rounded-2xl space-y-2.5 text-sm border border-slate-100"
      dir="rtl"
    >
      <div className="flex justify-between items-center text-slate-600 text-xs sm:text-sm">
        <span className="font-medium">مجموع الوجبات:</span>
        <span className="font-extrabold text-slate-800">
          {safeTotal.toFixed(2)} ج.م
        </span>
      </div>

      {!isPickup && !isDineIn && (
        <div className="flex justify-between items-center text-slate-600 text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <Truck className="w-4 h-4 text-slate-500 shrink-0" />
            <span>رسوم التوصيل:</span>
          </span>
          <span className="font-extrabold text-slate-800">
            {safeDelivery.toFixed(2)} ج.م
          </span>
        </div>
      )}

      <div className="border-t border-slate-200/80 pt-2.5 flex justify-between items-center text-slate-900">
        <span className="font-extrabold text-sm sm:text-base">
          الإجمالي النهائي:
        </span>
        <span className="text-lg sm:text-xl font-extrabold text-[#D55304]">
          {safeFinal.toFixed(2)} ج.م
        </span>
      </div>
    </div>
  );
}