"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  Check,
  X,
  CreditCard,
  Calendar,
  FileText,
  StickyNote,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  Loader2,
} from "lucide-react";

import { TricycleIcon } from "@/src/components/icons/TricycleIcon";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  notes?: string;
  adminNote?: string;
  deliveryFee: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  isPaid: boolean;
  items: OrderItem[];
  createdAt: string;
}

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: "confirmed" | "cancelled") => void;
  onTogglePayment: (id: string, isPaid: boolean) => void;
  onUpdateAdminNote?: (id: string, adminNote: string) => Promise<void> | void;
}

function formatOrderDate(dateStr: string): string {
  if (!dateStr) return "لا يوجد تاريخ";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "لا يوجد تاريخ";

  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "م" : "ص";
  hours = hours % 12 || 12;

  return `${month}/${day} ${hours}:${minutes} ${period}`;
}

export default function OrderCard({
  order,
  onStatusChange,
  onTogglePayment,
  onUpdateAdminNote,
}: OrderCardProps) {
  const [showCustomerNotes, setShowCustomerNotes] = useState(false);
  const [showAdminNoteEditor, setShowAdminNoteEditor] = useState(false);

  const [adminNoteText, setAdminNoteText] = useState(order.adminNote || "");
  const [currentSavedNote, setCurrentSavedNote] = useState(
    order.adminNote || "",
  );
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleSaveAdminNote = async () => {
    setIsSavingNote(true);
    try {
      if (onUpdateAdminNote) {
        await onUpdateAdminNote(order._id, adminNoteText.trim());
      } else {
        await fetch(`${apiUrl}/orders/${order._id}/admin-note`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminNote: adminNoteText.trim() }),
        });
      }

      setCurrentSavedNote(adminNoteText.trim());
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowAdminNoteEditor(false);
      }, 900);
    } catch (err) {
      console.error("Failed to save admin note:", err);
    } finally {
      setIsSavingNote(false);
    }
  };

  const hasCustomerNotes = Boolean(order.notes && order.notes.trim() !== "");

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
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

          <div className="flex items-start flex-col gap-1.5 mt-2.5 text-xs text-slate-500">
            <div className=" flex gap-3">
              <span className="flex items-center gap-1.5 font-mono dir-ltr">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.phoneNumber}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatOrderDate(order.createdAt)}
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {order.address}
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

      <div className="flex items-center gap-2 pt-0.5">
        {hasCustomerNotes && (
          <button
            type="button"
            onClick={() => setShowCustomerNotes(!showCustomerNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showCustomerNotes
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>العميل</span>
            {showCustomerNotes ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowAdminNoteEditor(!showAdminNoteEditor)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            showAdminNoteEditor || currentSavedNote
              ? "bg-amber-500 text-white"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <StickyNote className="w-3.5 h-3.5" />
          <span>الأدمن</span>
        </button>
      </div>

      {hasCustomerNotes && showCustomerNotes && (
        <div className="bg-indigo-50/70 border border-indigo-100 p-3 rounded-2xl text-xs text-indigo-950 animate-in fade-in duration-150">
          <span className="font-bold block mb-1 text-indigo-700">
            ملاحظة كتبها العميل:
          </span>
          <p className="leading-relaxed whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}

      {showAdminNoteEditor && (
        <div className=" bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-2xl space-y-2.5 animate-in fade-in duration-150 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900">
              ملاحظة الأدمن الخاصة بالطلب:
            </span>
            {currentSavedNote && (
              <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md font-medium">
                محفوظة
              </span>
            )}
          </div>

          <textarea
            rows={2}
            value={adminNoteText}
            onChange={(e) => setAdminNoteText(e.target.value)}
            placeholder="أكتب المنتجات المفقودة أو باقي المبلغ ..."
            className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none shadow-inner"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdminNoteEditor(false)}
              className="px-3 py-1.5 text-slate-500 hover:bg-slate-200/60 rounded-lg text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={isSavingNote}
              onClick={handleSaveAdminNote}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              {isSavingNote ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>تم الحفظ!</span>
                </>
              ) : (
                <span>حفظ الملاحظة</span>
              )}
            </button>
          </div>
        </div>
      )}

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
        {order.address != "الاستلام من الجمعية" && (
          <div className="flex justify-between items-center text-slate-700">
            <span>
              <TricycleIcon
                size={16}
                className="text-slate-700 shrink-0 inline"
              />
              <span className="font-medium truncate max-w-[65%]">
                خدمة توصيل منازل
              </span>
            </span>
            <span className="font-bold font-mono">10 ج</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold">
            الإجمالي المطلوب
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
              onChange={() => onTogglePayment(order._id, Boolean(order.isPaid))}
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
  );
}
