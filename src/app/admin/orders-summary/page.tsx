"use client";

import { useState, useEffect, useMemo } from "react";
import { Boxes } from "lucide-react";
import SummaryStatsCards from "@/src/components/admin/orders-summary/SummaryStatsCards";
import SummaryDesktopTable, {
  AggregatedSummaryItem,
} from "@/src/components/admin/orders-summary/SummaryDesktopTable";
import SummaryMobileList from "@/src/components/admin/orders-summary/SummaryMobileList";
import AdminSearchBar from "@/src/components/admin/orders/AdminSearchBar";
import { getCookie } from "@/src/lib/cookies";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

interface Order {
  _id: string;
  status: "pending" | "confirmed" | "cancelled";
  address?: string;
  totalAmount?: number;
  isPaid?: boolean;
  items: OrderItem[];
}

export default function AdminOrdersSummaryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = getCookie("toshka_admin_token");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${apiUrl}/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : data.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch summary orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiUrl, token]);

  const allSummaryItems = useMemo(() => {
    const map = new Map<string, AggregatedSummaryItem>();

    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        order.items?.forEach((item) => {
          const itemTotal = item.totalPrice || item.unitPrice * item.quantity;
          const existing = map.get(item.name);

          if (existing) {
            existing.ordersCount += 1;
            existing.totalQty += item.quantity;
            existing.totalPrice += itemTotal;
          } else {
            map.set(item.name, {
              name: item.name,
              image: item.image,
              ordersCount: 1,
              totalQty: item.quantity,
              totalPrice: itemTotal,
            });
          }
        });
      });

    return Array.from(map.values());
  }, [orders]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allSummaryItems;
    return allSummaryItems.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [allSummaryItems, searchQuery]);

  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.status !== "cancelled");
  }, [orders]);

  const stats = useMemo(() => {
    const topItem = allSummaryItems.reduce<AggregatedSummaryItem | null>(
      (max, curr) => {
        if (!max || curr.totalQty > max.totalQty) return curr;
        return max;
      },
      null,
    );

    const pickupCount = activeOrders.filter(
      (o) => (o.address || "").trim() === "الاستلام من الجمعية",
    ).length;
    const deliveryCount = activeOrders.length - pickupCount;

    const pendingCash = activeOrders
      .filter((o) => !o.isPaid)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalRevenue = activeOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );
    const averageOrderValue =
      activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;

    return {
      topDemandItem: topItem
        ? { name: topItem.name, qty: topItem.totalQty }
        : null,
      pickupCount,
      deliveryCount,
      pendingCash,
      averageOrderValue,
    };
  }, [allSummaryItems, activeOrders]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              ملخص تجميعات البضاعة
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              إجمالي الكميات والمنتجات المطلوبة لسحبها وتجهيزها من المخزن
            </p>
          </div>
        </div>

        <AdminSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="ابحث عن اسم منتج..."
          className="sm:w-72"
        />
      </div>

      <SummaryStatsCards
        topDemandItem={stats.topDemandItem}
        pickupCount={stats.pickupCount}
        deliveryCount={stats.deliveryCount}
        pendingCash={stats.pendingCash}
        averageOrderValue={stats.averageOrderValue}
      />

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-bold">
          جاري تجميع بيانات البضاعة...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 font-bold text-sm">
          لا توجد بضاعة مطلوبة مطابقة حالياً
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-2 sm:p-0">
          <SummaryDesktopTable items={filteredItems} />
          <SummaryMobileList items={filteredItems} />
        </div>
      )}
    </div>
  );
}
