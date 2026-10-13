"use client";

interface ProductQuantityControlProps {
  currentQty: number;
  maxQty?: number | null;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function ProductQuantityControl({
  currentQty,
  maxQty,
  onIncrease,
  onDecrease,
}: ProductQuantityControlProps) {
  return (
    <div className="p-4 pt-0 flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-400">
        الكمية {maxQty ? `(أقصى حد ${maxQty})` : "غير محدود"}
      </span>
      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
        <button
          type="button"
          onClick={onDecrease}
          disabled={currentQty === 0}
          className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-all font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-10 text-center text-xs font-bold text-slate-800">
          {currentQty}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-all font-bold text-sm"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
