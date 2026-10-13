"use client";

export type OrderStatusFilter = "all" | "pending" | "confirmed" | "cancelled";

interface OrderFilterTabsProps {
  activeStatus: OrderStatusFilter;
  counts: {
    all: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  onStatusChange: (status: OrderStatusFilter) => void;
}

export default function OrderFilterTabs({
  activeStatus,
  counts,
  onStatusChange,
}: OrderFilterTabsProps) {
  const tabs: { key: OrderStatusFilter; label: string; count: number }[] = [
    { key: "all", label: "الكل", count: counts.all },
    { key: "pending", label: "قيد الانتظار", count: counts.pending },
    { key: "confirmed", label: "مؤكد", count: counts.confirmed },
    { key: "cancelled", label: "ملغي", count: counts.cancelled },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onStatusChange(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeStatus === tab.key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeStatus === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
