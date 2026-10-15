"use client";

/* eslint-disable @next/next/no-img-element */

import { AggregatedSummaryItem } from "./SummaryDesktopTable";

interface SummaryMobileListProps {
  items: AggregatedSummaryItem[];
}

export default function SummaryMobileList({ items }: SummaryMobileListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:hidden p-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3"
        >
          <div className="flex items-center gap-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <h3 className="font-bold text-slate-900 text-sm leading-snug">
              {item.name}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">
                الطلبات
              </span>
              <span className="font-black text-xs text-slate-700 font-mono">
                {item.ordersCount}
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">
                الكمية
              </span>
              <span className="font-black text-sm text-indigo-600 font-mono">
                {item.totalQty}
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">
                الإجمالي
              </span>
              <span className="font-black text-xs text-slate-900 font-mono">
                {item.totalPrice.toFixed(0)} ج
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
