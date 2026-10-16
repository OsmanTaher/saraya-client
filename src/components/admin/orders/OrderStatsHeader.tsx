"use client";

interface OrderStatsHeaderProps {
  totalOrders?: number;
  pendingCount?: number;
  confirmedCount?: number;
}

export default function OrderStatsHeader(_props: OrderStatsHeaderProps) {
  return (
    <div className="text-right">
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">
        سجل وإدارة طلبات المطعم
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
        متابعة الطلبات اللحظية، فحص التحويلات، وإدارة حالة الطلبات
      </p>
    </div>
  );
}