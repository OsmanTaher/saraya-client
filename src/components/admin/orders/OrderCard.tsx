"use client";

import { useState } from "react";
import { Order } from "@/src/types";
import {
  Phone,
  Clock,
  Store,
  Truck,
  ShoppingBag,
  Calculator,
  Check,
  X,
  Wallet,
  FileText,
  ClipboardEdit,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (
    orderId: string,
    newStatus: "pending" | "confirmed" | "cancelled"
  ) => Promise<void>;
  onTogglePayment: (orderId: string, currentPaid: boolean) => Promise<void>;
  onUpdateAdminNote: (orderId: string, adminNote: string) => Promise<void>;
  updatingId?: string | null;
}

export default function OrderCard({
  order,
  onUpdateStatus,
  onTogglePayment,
  onUpdateAdminNote,
  updatingId,
}: OrderCardProps) {
  const isBusy = updatingId === order._id;
  const adminNote = (order as Order & { adminNote?: string }).adminNote || "";

  // حالات فتح وإغلاق ملاحظة العميل وملاحظة الأدمن
  const [showCustomerNote, setShowCustomerNote] = useState(false);
  const [showAdminNote, setShowAdminNote] = useState(false);
  const [adminNoteText, setAdminNoteText] = useState(adminNote);
  const [savingNote, setSavingNote] = useState(false);

  const hasCustomerNote = Boolean(order.notes && order.notes.trim() !== "");
  const hasSavedAdminNote = Boolean(adminNote.trim() !== "");

  // تنسيق التاريخ والوقت
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // شارة حالة الطلب في أعلى اليسار (مكتمل / قيد الإنتظار / ملغي)
  const renderStatusBadge = () => {
    if (order.status === "confirmed") {
      return (
        <span className="px-3.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
          مكتمل
        </span>
      );
    }
    if (order.status === "cancelled") {
      return (
        <span className="px-3.5 py-1 rounded-xl text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
          ملغي
        </span>
      );
    }
    return (
      <span className="px-3.5 py-1 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
        قيد الإنتظار
      </span>
    );
  };

  // تحديد أيقونة ونص مكان الطلب
  const renderOrderLocation = () => {
    if (order.orderType === "dine_in") {
      return (
        <span className="inline-flex items-center gap-1.5 text-slate-600 font-bold truncate max-w-full">
          <Store className="w-3.5 h-3.5 text-[#D55304] shrink-0" />
          <span className="truncate">
            الطاولة {order.tableNumber} - صالة المطعم
          </span>
        </span>
      );
    }
    if (order.orderType === "pickup") {
      return (
        <span className="inline-flex items-center gap-1.5 text-slate-600 font-bold truncate max-w-full">
          <ShoppingBag className="w-3.5 h-3.5 text-[#D55304] shrink-0" />
          <span className="truncate">طلبات خارجية (استلام من المطعم)</span>
        </span>
      );
    }
    if (order.orderType === "cashier") {
      return (
        <span className="inline-flex items-center gap-1.5 text-slate-600 font-bold truncate max-w-full">
          <Calculator className="w-3.5 h-3.5 text-[#D55304] shrink-0" />
          <span className="truncate">طلب كاشير مباشر</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-slate-600 font-bold truncate max-w-full">
        <Truck className="w-3.5 h-3.5 text-[#D55304] shrink-0" />
        <span className="truncate">
          توصيل - {order.address || "عنوان غير محدد"}
        </span>
      </span>
    );
  };

  const getPaymentLabel = () => {
    if (order.paymentMethod === "instapay") return "InstaPay";
    if (order.paymentMethod === "vodafone_cash") return "فودافون كاش";
    return "كاش";
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await onUpdateAdminNote(order._id, adminNoteText.trim());
      setShowAdminNote(false);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div
      className={`h-full bg-white rounded-3xl border transition-all p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs border-white`}
      dir="rtl"
    >
      {/* الجزء العلوي من البطاقة */}
      <div className="space-y-3">
        {/* 1. الصف الأول: رقم الطلب واسم العميل يميناً + شارة الحالة يساراً */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="bg-orange-50 text-[#D55304] border border-[#D55304]/20 font-black text-xs sm:text-sm px-3 py-1 rounded-xl font-mono shrink-0">
              #{order.orderNumber}
            </span>
            <h3 className="font-black text-slate-900 text-base sm:text-lg truncate">
              {order.customerName || "عميل السرايا"}
            </h3>
          </div>

          <div className="shrink-0">{renderStatusBadge()}</div>
        </div>

        {/* 2. بيانات المكان والتاريخ والهاتف */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          {renderOrderLocation()}

          {formattedDate && (
            <span className="inline-flex items-center gap-1 font-medium shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
          )}

          {order.phone && (
            <a
              href={`tel:${order.phone}`}
              className="inline-flex items-center gap-1 font-mono font-bold text-slate-600 hover:text-[#D55304] transition shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.phone}</span>
            </a>
          )}
        </div>

        {/* 3. أزرار ملاحظة العميل وملاحظة الأدمن بنظام Toggle */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-start gap-2 flex-wrap">
          {hasCustomerNote && (
            <button
              type="button"
              onClick={() => setShowCustomerNote((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                showCustomerNote
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>العميل</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showCustomerNote ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAdminNote((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
              hasSavedAdminNote
                ? "bg-[#F59E0B] hover:bg-[#D97706] text-white border-[#F59E0B] shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-500 border-slate-200/80"
            }`}
          >
            <ClipboardEdit className="w-3.5 h-3.5" />
            <span>الأدمن</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showAdminNote ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* نافذة عرض ملاحظة العميل (تظهر وتختفي بـ Toggle) */}
        {showCustomerNote && hasCustomerNote && (
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 text-right space-y-1 animate-in fade-in duration-150">
            <p className="text-xs font-extrabold text-indigo-700">
              ملاحظة كتبها العميل:
            </p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {order.notes}
            </p>
          </div>
        )}

        {/* نافذة ملاحظة الأدمن (تظهر وتختفي بـ Toggle فقط) */}
        {showAdminNote && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-right space-y-3 animate-in fade-in duration-150">
            <p className="text-xs font-extrabold text-amber-900">
              ملاحظة الأدمن الخاصة بالطلب:
            </p>
            <textarea
              rows={2}
              value={adminNoteText}
              onChange={(e) => setAdminNoteText(e.target.value)}
              placeholder="اكتب ملاحظات المطبخ أو النواقص أو باقي المبلغ..."
              className="w-full p-3 bg-white border border-amber-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#D55304] resize-none"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setAdminNoteText(order.adminNote || "");
                  setShowAdminNote(false);
                }}
                className="px-3 py-1.5 text-xs font-extrabold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={savingNote}
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-[#D55304] hover:bg-[#b84403] disabled:opacity-60 text-white text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                {savingNote && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>حفظ الملاحظة</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. جدول الوجبات المطلوبة (بارتفاع ثابت لـ 3 أصناف مع Scroll رأسي للباقي) */}
        <div className="bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-100/80 px-4 py-2 text-[11px] font-extrabold text-slate-500">
            <span className="col-span-6 text-right">المنتج</span>
            <span className="col-span-3 text-center">الكمية</span>
            <span className="col-span-3 text-left">السعر الإجمالي</span>
          </div>

          <div className="divide-y divide-slate-100 px-4 h-[132px] overflow-y-auto custom-scrollbar">
            {order.items.map((item, idx) => {
              const unitPrice = Number(item.price || 0);
              const qty = Number(item.quantity || 1);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center py-2.5 text-xs sm:text-sm"
                >
                  <div className="col-span-6 font-extrabold text-slate-800 pr-1 truncate">
                    <span>{item.name}</span>
                    {item.size && (
                      <span className="text-slate-500 font-bold">
                        {" "}
                        - {item.size}
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 text-center font-bold text-slate-700 dir-ltr">
                    {qty} ×
                  </div>
                  <div className="col-span-3 text-left font-extrabold text-slate-900">
                    {(unitPrice * qty).toFixed(2)} ج.م
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* الجزء السفلي الثابت من البطاقة */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        {/* شريط الإجمالي وطريقة الدفع وحالة الدفع */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] text-slate-400 font-bold">
              إجمالي الطلب
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900">
              {Number(order.totalPrice || 0).toFixed(2)}{" "}
              <span className="text-xs font-bold">ج.م</span>
            </span>
          </div>

          <div className="text-right">
            <span className="block text-[11px] text-slate-400 font-bold">
              طريقة الدفع
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-indigo-950">
                {getPaymentLabel()}
              </span>
              {order.paymentReceipt && (
                <span className="text-[11px] font-mono font-bold bg-orange-50 text-[#D55304] px-2 py-0.5 rounded-md border border-[#D55304]/20">
                  {order.paymentReceipt}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => onTogglePayment(order._id, order.isPaid)}
            className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
              order.isPaid
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{order.isPaid ? "تم الدفع" : "لم يُدفع"}</span>
            <span
              className={`w-8 h-4 rounded-full relative transition-colors ${
                order.isPaid ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                  order.isPaid ? "left-0.5" : "right-0.5"
                }`}
              />
            </span>
          </button>
        </div>

        {/* أزرار التأكيد (يرسل للتلجرام) والإلغاء */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isBusy || order.status === "confirmed"}
            onClick={() => onUpdateStatus(order._id, "confirmed")}
            className={`py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              order.status === "confirmed"
                ? "bg-emerald-100 text-emerald-800 cursor-default"
                : "bg-[#059669] hover:bg-[#047857] text-white shadow-xs active:scale-[0.99]"
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>
              {order.status === "confirmed"
                ? "تم التأكيد (مكتمل)"
                : "تأكيد وإرسال للمطبخ"}
            </span>
          </button>

          <button
            type="button"
            disabled={isBusy || order.status === "cancelled"}
            onClick={() => onUpdateStatus(order._id, "cancelled")}
            className={`py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              order.status === "cancelled"
                ? "bg-rose-100 text-rose-800 cursor-default"
                : "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-xs active:scale-[0.99]"
            }`}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>
              {order.status === "cancelled" ? "الطلب ملغي" : "إلغاء الطلب"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}