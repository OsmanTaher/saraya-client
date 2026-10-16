"use client";

 

export interface AggregatedSummaryItem {
  name: string;
  image?: string;
  ordersCount: number;
  totalQty: number;
  totalPrice: number;
}

interface SummaryDesktopTableProps {
  items: AggregatedSummaryItem[];
}

export default function SummaryDesktopTable({
  items,
}: SummaryDesktopTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-right border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold">
            <th className="py-4 px-6">اسم المنتج</th>
            <th className="py-4 px-6 text-center">عدد الطلبات</th>
            <th className="py-4 px-6 text-center">إجمالي الكمية المطلوبة</th>
            <th className="py-4 px-6 text-left">إجمالي القيمة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <span>{item.name}</span>
              </td>
              <td className="py-4 px-6 text-center font-bold text-slate-500 font-mono">
                {item.ordersCount}
              </td>
              <td className="py-4 px-6 text-center font-black text-indigo-600 font-mono text-base">
                {item.totalQty}
              </td>
              <td className="py-4 px-6 text-left font-bold font-mono text-slate-900">
                {item.totalPrice.toFixed(2)} ج.م
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
