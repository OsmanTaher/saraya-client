 
"use client";

export interface PrintedOrderSnapshot {
  orderNumber: number | string;
  createdAt: string;
  paymentMethod: "cash" | "card" | "instapay";
  items: {
    name: string;
    size?: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
}

export default function CashierThermalReceipt({
  receipt,
}: {
  receipt: PrintedOrderSnapshot | null;
}) {
  if (!receipt) return null;

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: 86mm auto;
            margin: 0mm !important;
          }
          html,
          body {
            width: 86mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      <div
        className="hidden print:block w-[86mm] max-w-[86mm] mx-auto p-[10mm] box-border text-black bg-white font-sans text-xs"
        dir="rtl"
      >
        <div className="flex items-start justify-between border-b border-dashed border-black pb-2 mb-2">
          <div className="text-right">
            <h2 className="text-base font-black leading-tight">مطعم السرايا</h2>
            <p className="text-[11px]">أشهى المأكولات والمشويات</p>
            <p className="text-[11px] font-bold mt-1">
              فاتورة كاشير #{receipt.orderNumber}
            </p>
            <p className="text-[10px]">{receipt.createdAt}</p>
          </div>

          <img
            src="/logo.png"
            alt="مطعم السرايا"
            className="w-12 h-12 object-contain shrink-0 rounded-lg grayscale contrast-150"
          />
        </div>

        <table className="w-full text-right border-b border-dashed border-black pb-2 mb-2 text-[11px]">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1">الصنف</th>
              <th className="py-1 text-center">الكمية</th>
              <th className="py-1 text-left">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, idx) => (
              <tr key={idx} className="border-b border-dotted border-gray-400">
                <td className="py-1 font-bold">
                  {item.name} {item.size ? `(${item.size})` : ""}
                </td>
                <td className="py-1 text-center">{item.quantity}</td>
                <td className="py-1 text-left font-bold">
                  {item.price * item.quantity} ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-1 text-xs font-bold pb-1">
          <div className="flex justify-between text-sm font-black">
            <span>الإجمالي المطلوب:</span>
            <span>{receipt.totalPrice} ج.م</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>طريقة الدفع:</span>
            <span>
              {receipt.paymentMethod === "cash"
                ? "كاش (مدفوع)"
                : receipt.paymentMethod === "card"
                  ? "فيزا / بطاقة (مدفوع)"
                  : "إنستاباي / محفظة (مدفوع)"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}