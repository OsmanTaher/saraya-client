"use client";

import { Search, X } from "lucide-react";

interface OrderStatsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function OrderStatsHeader({
  searchQuery,
  onSearchChange,
}: OrderStatsHeaderProps) {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  const hasSearchText = searchQuery.length > 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-slate-900">
          سجل وإدارة الطلبات
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          متابعة الطلبات، تحديث حالات الدفع، وتأكيد الإرسال
        </p>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="بحث بالاسم، الهاتف، أو رقم الطلب..."
          className="w-full pr-10 pl-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 shadow-sm transition-colors"
        />

        {hasSearchText && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="مسح البحث"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
