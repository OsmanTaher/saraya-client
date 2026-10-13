"use client";

import { Plus } from "lucide-react";
import AdminSearchBar from "@/src/components/admin/orders/AdminSearchBar";

interface ProductsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreate: () => void;
}

export default function ProductsHeader({
  searchQuery,
  onSearchChange,
  onOpenCreate,
}: ProductsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">إدارة المنتجات</h1>
          <p className="text-xs text-slate-500 mt-1">
            إضافة، تعديل، وتفعيل المنتجات في متجرك
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 text-xs sm:text-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>منتج جديد</span>
        </button>
      </div>

      <AdminSearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="ابحث عن اسم المنتج..."
        className="max-w-sm"
      />
    </div>
  );
}
