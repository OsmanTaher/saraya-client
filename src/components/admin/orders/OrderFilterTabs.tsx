"use client";

export type OrderFilterStatus = "all" | "confirmed" | "pending" | "cancelled";

interface OrderFilterTabsProps {
  activeFilter: OrderFilterStatus;
  setActiveFilter: (filter: OrderFilterStatus) => void;
  counts: {
    all: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

export default function OrderFilterTabs({
  activeFilter,
  setActiveFilter,
  counts,
}: OrderFilterTabsProps) {
  const tabs: { id: OrderFilterStatus; label: string; count: number }[] = [
    { id: "all", label: "الكل", count: counts.all },
    { id: "confirmed", label: "مكتمل", count: counts.confirmed },
    { id: "pending", label: "قيد الإنتظار", count: counts.pending },
    { id: "cancelled", label: "ملغي", count: counts.cancelled },
  ];

  return (
    <div
      className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar"
      dir="rtl"
    >
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer border ${
              isActive
                ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-[#D55304]/40 hover:bg-orange-50/40"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}