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
    <div className="p-4 space-y-1 text-right">
      <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
        {category}
      </span>
      <h3 className="font-bold text-slate-900 text-sm leading-snug">{name}</h3>
      {description && (
        <p className="text-xs text-slate-500 line-clamp-2">{description}</p>
      )}
    </div>
  );
}
