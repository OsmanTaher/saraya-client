/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface OrderQuickViewModalProps {
  order: any | null;
  onClose: () => void;
}

export default function OrderQuickViewModal({
  order,
  onClose,
}: OrderQuickViewModalProps) {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-extrabold">
            مؤكد / قيد التحضير بالمطبخ
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-extrabold">
            ملغي
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-extrabold">
            قيد الانتظار والمراجعة
          </span>
        );
    }
  };

  const phoneDisplay = order.phone || order.phoneNumber || "غير محدد";
  const addressDisplay =
    order.orderType === "dine_in"
      ? `صالة المطعم - ترابيزة رقم (${order.tableNumber})`
      : order.orderType === "pickup"
        ? "الاستلام من الفرع"
        : order.address || "غير محدد";

  const deliveryFee = Number(order.deliveryFee ?? 0);
  const subtotal = Number(order.subtotal ?? 0);
  const totalPrice = Number(
    order.totalPrice ?? order.totalAmount ?? subtotal + deliveryFee,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 pl-10">
          <h3 className="text-lg font-black text-gray-800">
            تفاصيل الطلب:{" "}
            <span className="text-[#D55304]">#{order.orderNumber}</span>
          </h3>
          {getStatusBadge(order.status)}
        </div>

        <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl mb-4 space-y-2 text-xs md:text-sm text-slate-700">
          <p>
            <strong>الاسم:</strong> {order.customerName || "عميل السرايا"}
          </p>
          <p>
            <strong>الهاتف:</strong>{" "}
            <span className="font-mono">{phoneDisplay}</span>
          </p>
          <p>
            <strong>العنوان / المكان:</strong> {addressDisplay}
          </p>
          {order.paymentReceipt && (
            <p>
              <strong>الرقم المحول منه:</strong>{" "}
              <span className="font-mono text-[#D55304] font-bold">
                {order.paymentReceipt}
              </span>
            </p>
          )}
          {order.notes && (
            <p>
              <strong>ملاحظاتك:</strong> {order.notes}
            </p>
          )}
          {order.adminNote && (
            <p className="text-[#D55304]">
              <strong>ملاحظات المطعم:</strong> {order.adminNote}
            </p>
          )}
        </div>

        <h4 className="font-extrabold text-sm text-gray-800 mb-2">
          الوجبات المطلوبة:
        </h4>
        <div className="max-h-52 overflow-y-auto space-y-2 mb-4 pr-1 custom-scrollbar">
          {order.items?.map((item: any, idx: number) => {
            const unitPrice = Number(item.price ?? item.unitPrice ?? 0);
            const qty = Number(item.quantity ?? 1);
            const lineTotal = unitPrice * qty;

            return (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-xs md:text-sm"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  {item.size && (
                    <span className="text-[11px] font-bold bg-orange-100 text-[#D55304] px-2 py-0.5 rounded-md">
                      {item.size}
                    </span>
                  )}
                </div>
                <span className="text-slate-600 shrink-0 font-medium">
                  {qty} × {unitPrice.toFixed(2)} ={" "}
                  <strong className="text-slate-900 font-extrabold">
                    {lineTotal.toFixed(2)} ج.م
                  </strong>
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600 text-xs md:text-sm">
            <span>مجموع الوجبات:</span>
            <span className="font-bold">{subtotal.toFixed(2)} ج.م</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between text-gray-600 text-xs md:text-sm">
              <span>رسوم التوصيل:</span>
              <span className="font-bold">{deliveryFee.toFixed(2)} ج.م</span>
            </div>
          )}
          <div className="flex justify-between font-black text-base text-gray-900 pt-1">
            <span>الإجمالي النهائي:</span>
            <span className="text-[#D55304]">{totalPrice.toFixed(2)} ج.م</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-[#D55304] hover:bg-[#b84403] text-white py-3 rounded-xl font-extrabold text-sm transition cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
