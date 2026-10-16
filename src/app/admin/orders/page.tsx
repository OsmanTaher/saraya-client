"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Order } from "@/src/types";
import { getAdminToken } from "@/src/lib/cookies";
import OrderStatsHeader from "@/src/components/admin/orders/OrderStatsHeader";
import AdminSearchBar from "@/src/components/admin/orders/AdminSearchBar";
import OrderFilterTabs, {
  OrderFilterStatus,
} from "@/src/components/admin/orders/OrderFilterTabs";
import OrderCard from "@/src/components/admin/orders/OrderCard";
import { Loader2, RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderFilterStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("تعذر جلب سجل الطلبات");
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء تحميل الطلبات",
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: "pending" | "confirmed" | "cancelled",
  ) => {
    setUpdatingId(orderId);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateAdminNote = async (orderId: string, adminNote: string) => {
    setUpdatingId(orderId);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/orders/${orderId}/admin-note`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNote }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      }
    } catch (err) {
      console.error("Failed to update admin note:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTogglePayment = async (orderId: string, currentPaid: boolean) => {
    setUpdatingId(orderId);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPaid: !currentPaid }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      }
    } catch (err) {
      console.error("Failed to toggle payment:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    return {
      all: orders.length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      pending: orders.filter((o) => o.status === "pending").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab =
        activeFilter === "all" ? true : order.status === activeFilter;

      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.trim().toLowerCase();
      const matchOrderNum = String(order.orderNumber || "").includes(q);
      const matchName = (order.customerName || "").toLowerCase().includes(q);
      const matchPhone = (order.phone || "").includes(q);
      const matchTable = (order.tableNumber || "").includes(q);
      const matchTransfer = (order.paymentReceipt || "").includes(q);

      return (
        matchOrderNum || matchName || matchPhone || matchTable || matchTransfer
      );
    });
  }, [orders, activeFilter, searchQuery]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <OrderStatsHeader />

        <div className="flex items-center gap-2.5 flex-1 md:justify-end">
          <AdminSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <button
            type="button"
            onClick={fetchOrders}
            title="تحديث الطلبات"
            className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-[#D55304] text-slate-600 hover:text-[#D55304] flex items-center justify-center shrink-0 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <OrderFilterTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-7 h-7 animate-spin text-[#D55304]" />
          <span className="text-sm font-bold">جاري تحميل سجل الطلبات...</span>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-3xl p-6 text-center font-bold text-sm">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 py-16 text-center text-slate-400 font-bold text-sm">
          لا توجد طلبات مطابقة للعرض في هذا التبويب حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              onTogglePayment={handleTogglePayment}
              onUpdateAdminNote={handleUpdateAdminNote}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
