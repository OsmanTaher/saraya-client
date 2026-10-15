"use client";

interface ProductInfoProps {
  category: string;
  name: string;
  description?: string;
}

export default function ProductInfo({
  category,
  name,
  description,
}: ProductInfoProps) {
  return (
    <div className="px-4 pt-3.5 pb-2 space-y-1 text-right">
      <span className="inline-block sm:hidden text-[10px] font-bold text-[#D55304] bg-orange-50 px-2.5 py-0.5 rounded-md mb-0.5">
        {category}
      </span>
      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
