"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminToken } from "@/src/lib/cookies";
import {
  Wallet,
  ShoppingBag,
  TrendingUp,
  Clock,
  Truck,
  Store,
  Calculator,
  Flame,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface SummaryData {
  totalOrders: number;
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
  totalRevenue: number;
  averageBill: number;
  orderTypesBreakdown: {
    delivery: number;
    dine_in: number;
    cashier: number;
    pickup: number;
  };
  mostOrderedItems: {
    name: string;
    size: string;
    totalQuantity: number;
    totalRevenue: number;
    ordersCount: number;
  }[];
}

export default function AdminOrdersSummaryPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/orders/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSummary();
  }, [fetchSummary]);

  if (loading || !summary) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-7 h-7 animate-spin text-[#D55304]" />
        <span className="text-sm font-bold">
          جاري تحليل بيانات وملخص طلبات اليوم...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            ملخص طلبات وإحصائيات اليوم
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            تقرير المبيعات، متوسط الفاتورة، أنواع التوصيل، والوجبات الأكثر طلباً
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSummary}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#D55304] text-slate-700 hover:text-[#D55304] text-xs font-extrabold flex items-center gap-2 cursor-pointer transition shadow-2xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث الإحصائيات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>إجمالي المبيعات المؤكدة</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {summary.totalRevenue.toFixed(2)}{" "}
            <span className="text-xs font-bold text-slate-500">ج.م</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>متوسط قيمة الفاتورة</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#D55304] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#D55304]">
            {summary.averageBill.toFixed(2)}{" "}
            <span className="text-xs font-bold">ج.م</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>الطلبات المكتملة / الإجمالي</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {summary.confirmedCount}{" "}
            <span className="text-xs font-bold text-slate-400">
              من أصل {summary.totalOrders} طلب
            </span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>قيد الانتظار / الملغية</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-base font-black text-slate-800 pt-1">
            <span className="text-amber-600">
              {summary.pendingCount} انتظار
            </span>{" "}
            —{" "}
            <span className="text-rose-600">{summary.cancelledCount} ملغي</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
        <h2 className="text-base font-black text-slate-900">
          توزيع الطلبات حسب نوع الخدمة والتوصيل
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D55304]/10 text-[#D55304] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500">
                توصيل للمنازل
              </span>
              <span className="text-lg font-black text-slate-900">
                {summary.orderTypesBreakdown.delivery} طلب
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500">
                داخل الصالة (QR)
              </span>
              <span className="text-lg font-black text-slate-900">
                {summary.orderTypesBreakdown.dine_in} طلب
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500">
                كاشير مباشر (POS)
              </span>
              <span className="text-lg font-black text-slate-900">
                {summary.orderTypesBreakdown.cashier} طلب
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500">
                استلام من الفرع
              </span>
              <span className="text-lg font-black text-slate-900">
                {summary.orderTypesBreakdown.pickup} طلب
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#D55304]" />
          <h2 className="text-base font-black text-slate-900">
            الوجبات والأصناف الأكثر طلباً اليوم
          </h2>
        </div>

        {summary.mostOrderedItems.length === 0 ? (
          <div className="py-14 text-center text-slate-400 font-bold text-sm">
            لا توجد وجبات مؤكدة بعد لعرض الإحصائيات.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#FFF7ED] text-slate-700 text-xs font-extrabold border-b border-orange-100">
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">اسم الوجبة</th>
                  <th className="py-3.5 px-6 text-center">الحجم</th>
                  <th className="py-3.5 px-6 text-center">
                    إجمالي الكمية المباعة
                  </th>
                  <th className="py-3.5 px-6 text-left">إجمالي الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {summary.mostOrderedItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/20">
                    <td className="py-3.5 px-6 font-black text-[#D55304]">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="bg-orange-50 text-[#D55304] font-bold px-2.5 py-1 rounded-lg text-xs">
                        {item.size}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center font-black text-slate-800">
                      {item.totalQuantity} وجبة
                    </td>
                    <td className="py-3.5 px-6 text-left font-black text-emerald-700">
                      {item.totalRevenue.toFixed(2)} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
