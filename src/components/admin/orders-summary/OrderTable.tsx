"use client";

import { useState } from "react";
import { Search, Phone, MapPin, Check, X, CreditCard } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  notes?: string;
  pickupFromAssociation: boolean;
  deliveryFee: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  isPaid: boolean;
  items: OrderItem[];
  createdAt: string;
}

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onStatusChange: (
    orderId: string,
    status: "confirmed" | "cancelled",
  ) => Promise<void>;
  onTogglePayment: (
    orderId: string,
    currentPaidStatus: boolean,
  ) => Promise<void>;
}

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

export default function OrderTable({
  orders,
  loading,
  onStatusChange,
  onTogglePayment,
}: OrderTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      order.customerName.toLowerCase().includes(query) ||
      order.phoneNumber.includes(query) ||
      order.orderNumber.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "الكل", count: counts.all },
            { key: "pending", label: "قيد الانتظار", count: counts.pending },
            { key: "confirmed", label: "مؤكد", count: counts.confirmed },
            { key: "cancelled", label: "ملغي", count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as StatusFilter)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                statusFilter === tab.key
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  statusFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، الهاتف، أو رقم الطلب..."
            className="w-full pr-10 pl-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold text-sm">
          جاري تحميل الطلبات...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 font-bold text-sm">
          لا توجد طلبات مطابقة لمعايير البحث
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      #{order.orderNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {order.customerName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono dir-ltr">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {order.phoneNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {order.pickupFromAssociation
                        ? "استلام من المقر"
                        : order.address}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-extrabold px-3 py-1 rounded-lg shrink-0 ${
                    order.status === "confirmed"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : order.status === "cancelled"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {order.status === "confirmed"
                    ? "مؤكد"
                    : order.status === "cancelled"
                      ? "ملغي"
                      : "قيد المراجعة"}
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar text-xs">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-slate-700"
                  >
                    <span className="font-medium truncate max-w-[65%]">
                      {item.name}
                    </span>
                    <span className="font-bold font-mono">
                      {item.quantity} × {item.unitPrice} ج
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">
                    المبلغ الإجمالي
                  </span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {order.totalAmount.toFixed(2)} ج.م
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <CreditCard
                    className={`w-4 h-4 ${order.isPaid ? "text-emerald-600" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-xs font-bold ${order.isPaid ? "text-emerald-700" : "text-slate-500"}`}
                  >
                    {order.isPaid ? "تم الدفع" : "لم يُدفع"}
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center mr-1">
                    <input
                      type="checkbox"
                      checked={Boolean(order.isPaid)}
                      onChange={() =>
                        onTogglePayment(order._id, Boolean(order.isPaid))
                      }
                      className="peer sr-only"
                    />
                    <span className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-emerald-600"></span>
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onStatusChange(order._id, "confirmed")}
                  disabled={order.status === "confirmed"}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>تأكيد</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStatusChange(order._id, "cancelled")}
                  disabled={order.status === "cancelled"}
                  className="py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
