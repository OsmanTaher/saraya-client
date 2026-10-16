// /* eslint-disable @next/next/no-img-element */
// interface OrderItem {
//   name: string;
//   quantity: number;
//   unitPrice: number;
// }

// interface Order {
//   _id: string;
//   orderNumber: string;
//   customerName: string;
//   phoneNumber: string;
//   address: string;
//   notes?: string;
//   adminNote?: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: string;
//   pickupFromAssociation?: boolean;
// }

// export default function ReceiptPrint({ orders }: { orders: Order[] }) {
//   const printableOrders =
//     orders?.filter((order) =>
//       ["pending", "confirmed"].includes(order.status),
//     ) || [];

//   if (printableOrders.length === 0) {
//     return (
//       <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 font-bold text-sm print:hidden">
//         لا توجد فواتير مؤكدة أو قيد الانتظار للطباعة
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 print:space-y-0">
//       {printableOrders.map((order) => (
//         <div
//           key={order._id}
//           className="receipt-page w-[76mm] mx-auto p-3 bg-white text-black font-sans text-xs border border-dashed border-slate-300 print:border-none my-2 break-after-page"
//           style={{ pageBreakAfter: "always" }}
//         >
//           <div className=" flex  justify-between text-start pb-2 border-b border-dashed border-black">
//             <div>
//               <h2 className="text-sm font-black">متجر بيعلي جملة</h2>
//               <p className="text-[10px] text-gray-600 mt-0.5">
//                 فاتورة تسليم وتجهيز
//               </p>
//             </div>
//             <img
//               src="/icon.png"
//               width={30}
//               height={30}
//               className="block w-7.5 h-7.5 object-contain grayscale"
//               alt="لوجو المتجر"
//             />
//           </div>

//           <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
//             <div className="flex justify-between font-bold">
//               <span>رقم الطلب:</span>
//               <span className="font-mono">#{order.orderNumber}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>العميل:</span>
//               <span className="font-bold">{order.customerName}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>الهاتف:</span>
//               <span className="font-mono">{order.phoneNumber}</span>
//             </div>
//             <div className="text-[10px]">
//               <span>العنوان: </span>
//               <span>
//                 {order.pickupFromAssociation ||
//                 order.address === "الاستلام من الجمعية"
//                   ? "الاستلام من الجمعية"
//                   : order.address}
//               </span>
//             </div>
//             {order.notes && (
//               <div className="text-[9px] bg-slate-100 p-1 rounded mt-1 border border-slate-200">
//                 ملاحظة: {order.notes}
//               </div>
//             )}
//             {order.adminNote && (
//               <div className="text-[9px] bg-slate-100 p-1 rounded mt-1 border border-slate-200">
//                 الإدارة: {order.adminNote}
//               </div>
//             )}
//           </div>

//           <div className="py-2 border-b border-dashed border-black">
//             <div className="flex justify-between font-bold pb-1 text-[10px] border-b border-gray-200">
//               <span className="w-1/2">المنتج</span>
//               <span className="w-1/4 text-center">الكمية</span>
//               <span className="w-1/4 text-left">السعر</span>
//             </div>
//             <div className="space-y-1 pt-1">
//               {order.items?.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex justify-between items-center text-[10px]"
//                 >
//                   <span className="w-1/2 truncate">{item.name}</span>
//                   <span className="w-1/4 text-center font-mono">
//                     {item.quantity}
//                   </span>
//                   <span className="w-1/4 text-left font-mono">
//                     {item.quantity * item.unitPrice} ج
//                   </span>
//                 </div>
//               ))}
//             </div>
//             {!(
//               order.pickupFromAssociation ||
//               order.address === "الاستلام من الجمعية"
//             ) && (
//               <div className="flex justify-between items-center text-[10px] pt-1">
//                 <span className="truncate">خدمة توصيل منازل</span>
//                 <span className="font-mono text-left">10 ج</span>
//               </div>
//             )}
//           </div>

//           <div className="pt-2 flex justify-between font-bold text-xs">
//             <span>الإجمالي المطلوب:</span>
//             <span className="font-mono">
//               {order.totalAmount}
//               ج.م
//             </span>
//           </div>

//           <div className="text-center pt-2 text-[9px] text-gray-400">
//             شكراً لتعاملكم معنا
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
