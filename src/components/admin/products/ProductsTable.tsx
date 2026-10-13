/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import ImageModal from "@/src/components/product/ImageModal";

export interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  isActive: boolean;
}

interface ProductsTableProps {
  products: AdminProduct[];
  loading: boolean;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
}

export default function ProductsTable({
  products,
  loading,
  onToggleActive,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [zoomedImage, setZoomedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const handleOpenZoom = (imageSrc: string, imageAlt: string) => {
    setZoomedImage({ src: imageSrc, alt: imageAlt });
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-xs font-bold">
                <th className="py-3.5 px-3 sm:px-6">المنتج</th>
                <th className="py-3.5 px-3 sm:px-6">السعر</th>
                <th className="py-3.5 px-3 sm:px-6 text-center">الحالة</th>
                <th className="py-3.5 px-3 sm:px-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-slate-400 font-bold"
                  >
                    جاري تحميل المنتجات...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-slate-400 font-bold"
                  >
                    لا توجد منتجات مضافة حالياً
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const hasDiscount =
                    typeof product.oldPrice === "number" &&
                    product.oldPrice > 0;
                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-3 sm:px-6">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            onClick={() =>
                              handleOpenZoom(product.image, product.name)
                            }
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0 cursor-zoom-in hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/100x100/e2e8f0/475569?text=صورة";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block leading-snug line-clamp-2 sm:line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-[10px] hidden sm:block text-slate-400 font-medium  mt-0.5">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 sm:px-6 font-bold text-slate-900 font-mono whitespace-nowrap">
                        <div className="text-xs sm:text-sm">
                          {product.price.toFixed(2)} ج
                        </div>
                        {hasDiscount && (
                          <div className="text-[10px] sm:text-[11px] text-slate-400 line-through font-normal">
                            {product.oldPrice} ج
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 sm:px-6 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2">
                          <span
                            className={`text-[11px] sm:text-xs font-bold ${
                              product.isActive
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {product.isActive ? "نشط" : "معطل"}
                          </span>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={product.isActive}
                              onChange={() =>
                                onToggleActive(product._id, product.isActive)
                              }
                              className="peer sr-only"
                            />
                            <span className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-emerald-600"></span>
                            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                          </label>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 sm:px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(product)}
                            className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            title="تعديل"
                            aria-label={`تعديل ${product.name}`}
                          >
                            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(product._id)}
                            className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="حذف"
                            aria-label={`حذف ${product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ImageModal
        isOpen={Boolean(zoomedImage)}
        imageSrc={zoomedImage?.src || ""}
        imageAlt={zoomedImage?.alt || ""}
        onClose={handleCloseZoom}
      />
    </>
  );
}
