"use client";

import { useState, useEffect, useMemo } from "react";
import OrderStatsHeader from "@/src/components/admin/orders/OrderStatsHeader";
import OrderFilterTabs, {
  OrderStatusFilter,
} from "@/src/components/admin/orders/OrderFilterTabs";
import OrderCard, { Order } from "@/src/components/admin/orders/OrderCard";
import { getCookie } from "@/src/lib/cookies";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchOrders = async () => {
    try {
      const token = getCookie("toshka_admin_token");

      const res = await fetch(`${apiUrl}/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } else {
        console.error("فشل في جلب الطلبات: غير مصرح لك (401)");
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (
    orderId: string,
    status: "confirmed" | "cancelled",
  ) => {
    try {
      const token = getCookie("toshka_admin_token");
      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleTogglePayment = async (
    orderId: string,
    currentPaidStatus: boolean,
  ) => {
    try {
      const token = getCookie("toshka_admin_token");
      const res = await fetch(`${apiUrl}/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPaid: !currentPaidStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, isPaid: !currentPaidStatus } : o,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to toggle payment status:", err);
    }
  };

  const handleUpdateAdminNote = async (orderId: string, adminNote: string) => {
    const token = getCookie("toshka_admin_token");
    const res = await fetch(`${apiUrl}/orders/${orderId}/admin-note`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ adminNote }),
    });

    if (!res.ok) {
      throw new Error("Failed to update admin note");
    }

    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, adminNote } : order,
      ),
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesStatus;

      const name = (order.customerName || "").toLowerCase();
      const phone = String(order.phoneNumber || "");
      const orderNo = String(order.orderNumber || "");

      const matchesSearch =
        name.includes(query) ||
        phone.includes(query) ||
        orderNo.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const counts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }),
    [orders],
  );

  return (
    <div className="space-y-8">
      <OrderStatsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <OrderFilterTabs
        activeStatus={statusFilter}
        counts={counts}
        onStatusChange={setStatusFilter}
      />

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold">
          جاري تحميل الطلبات...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 font-bold">
          لا توجد طلبات مطابقة لهذا البحث
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
              onTogglePayment={handleTogglePayment}
              onUpdateAdminNote={handleUpdateAdminNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
