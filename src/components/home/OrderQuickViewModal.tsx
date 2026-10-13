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
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
            مؤكد
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">
            ملغي
          </span>
        );
      case "delivered":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
            تم التوصيل
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
            قيد الانتظار
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-right animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        >
          ✕
        </button>

        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-lg font-black text-gray-800">
            تفاصيل الطلب:{" "}
            <span className="text-indigo-600">#{order.orderNumber}</span>
          </h3>
          {getStatusBadge(order.status)}
        </div>

        
        <div className="bg-gray-50 p-4 rounded-2xl mb-4 space-y-2 text-xs md:text-sm">
          <p>
            <strong>الاسم:</strong> {order.customerName}
          </p>
          <p>
            <strong>الهاتف:</strong> {order.phoneNumber}
          </p>
          <p>
            <strong>العنوان:</strong> {order.address}
          </p>
          {order.notes && (
            <p>
              <strong>ملاحظاتك:</strong> {order.notes}
            </p>
          )}
          {order.adminNote && (
            <p>
              <strong>ملاحظات الإدارة:</strong> {order.adminNote}
            </p>
          )}
        </div>

        
        <h4 className="font-bold text-sm text-gray-700 mb-2">
          المنتجات المطلوبة:
        </h4>
        <div className="max-h-48 overflow-y-auto space-y-2 mb-4 pr-1">
          {order.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 text-xs md:text-sm"
            >
              <span className="font-bold text-gray-800">{item.name}</span>
              <span className="text-gray-500">
                {item.quantity} × {item.unitPrice} ={"   "}
                <strong>{(item.quantity * item.unitPrice).toFixed(2)} ج</strong>
              </span>
            </div>
          ))}
        </div>

        
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>رسوم التوصيل:</span>
            <span>{order.address == "الاستلام من الجمعية" ? "0" : "5"} ج</span>
          </div>
          <div className="flex justify-between font-black text-base text-gray-900 pt-1">
            <span>الإجمالي النهائي:</span>
            <span className="text-indigo-600">{order.totalAmount} ج.م</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
