"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Printer, ArrowRight, RefreshCw } from "lucide-react";
import ReceiptPrint from "@/src/components/admin/orders/ReceiptPrint";
import { Order } from "@/src/components/admin/orders/OrderCard";
import { getCookie } from "@/src/lib/cookies";
import styles from "./prints.module.css";

export default function PrintsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderNumberQuery, setOrderNumberQuery] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchOrders = async () => {
    setLoading(true);
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
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetching orders synchronizes printable data with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedOrderNumber = orderNumberQuery.trim();
  const printableOrders = orders.filter(
    (order) =>
      ["pending", "confirmed"].includes(order.status) &&
      (!normalizedOrderNumber ||
        String(order.orderNumber).includes(normalizedOrderNumber)),
  );

  return (
    <main className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0 print:m-0">
      <div className="max-w-[78mm] mx-auto mb-4 px-2 flex items-center justify-between print:hidden">
        <Link
          href="/admin/orders"
          className="p-2 bg-white text-slate-700 rounded-xl border border-slate-200"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="search"
            value={orderNumberQuery}
            onChange={(e) => setOrderNumberQuery(e.target.value)}
            placeholder="رقم الطلب"
            aria-label="البحث برقم الطلب"
            className="w-28 px-3 py-2 bg-white text-slate-700 rounded-xl border border-slate-200 text-xs text-center outline-none focus:border-indigo-400"
          />

          <button
            onClick={fetchOrders}
            className="p-2 bg-white text-slate-700 rounded-xl border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => window.print()}
            disabled={loading || printableOrders.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة ({printableOrders.length})</span>
          </button>
        </div>
      </div>

      <div
        className={`${styles.printsWrapper} bg-white shadow-sm print:shadow-none p-2 rounded-2xl print:rounded-none print:p-0`}
      >
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">
            جاري التحميل...
          </div>
        ) : (
          <div className={styles.receiptCard}>
            <ReceiptPrint orders={printableOrders} />
          </div>
        )}
      </div>
    </main>
  );
}
