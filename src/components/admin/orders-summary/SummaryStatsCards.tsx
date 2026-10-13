"use client";

import { Flame, Truck, Wallet, Receipt } from "lucide-react";

interface SummaryStatsCardsProps {
  topDemandItem: { name: string; qty: number } | null;
  pickupCount: number;
  deliveryCount: number;
  pendingCash: number;
  averageOrderValue: number;
}

export default function SummaryStatsCards({
  topDemandItem,
  pickupCount,
  deliveryCount,
  pendingCash,
  averageOrderValue,
}: SummaryStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Flame className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs text-slate-400 font-bold block">
            الأكثر طلباً
          </span>
          {topDemandItem ? (
            <div className="truncate">
              <span
                className="text-sm sm:text-base font-black text-slate-900 block truncate"
                title={topDemandItem.name}
              >
                {topDemandItem.name}
              </span>
              <span className="text-xs font-bold text-rose-600 font-mono">
                {topDemandItem.qty} قطعة
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-slate-400">لا يوجد</span>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-400 font-bold block">
            طريقة التسليم
          </span>
          <div className="flex items-center gap-1.5 text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5">
            <span className="text-blue-600">{pickupCount} مقر</span>
            <span className="text-slate-300 font-normal">/</span>
            <span className="text-slate-700">{deliveryCount} شحن</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-400 font-bold block">
            قيد التحصيل (كاش معلق)
          </span>
          <span className="text-base sm:text-lg font-black text-amber-600 font-mono block">
            {pendingCash.toFixed(2)} ج.م
          </span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Receipt className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-400 font-bold block">
            متوسط الفاتورة
          </span>
          <span className="text-base sm:text-lg font-black text-indigo-600 font-mono block">
            {averageOrderValue.toFixed(2)} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}
