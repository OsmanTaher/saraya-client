/* eslint-disable @next/next/no-img-element */
"use client";

interface ProductImageBadgeProps {
  image: string;
  name: string;
  price: number;
  oldPrice?: number;
  onZoom: () => void;
}

function getOptimizedImageUrl(url: string, width = 500) {
  if (!url) return "https://placehold.co/400x300/e2e8f0/475569?text=لا+توجد+صورة";
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return url;
}

export default function ProductImageBadge({
  image,
  name,
  price,
  oldPrice,
  onZoom,
}: ProductImageBadgeProps) {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    (e.target as HTMLImageElement).src =
      "https://placehold.co/400x300/e2e8f0/475569?text=صورة+المنتج";
  };

  const hasDiscount = typeof oldPrice === "number" && oldPrice > 0;
  const optimizedSrc = getOptimizedImageUrl(image, 500);

  return (
    <div
      className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden cursor-zoom-in group"
      onClick={onZoom}
    >
      <img
        src={optimizedSrc}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={handleImageError}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-2">
        <span>{price.toFixed(2)} ج</span>
        {hasDiscount && (
          <span className="text-slate-300 line-through font-normal">
            {oldPrice} ج
          </span>
        )}
      </span>
    </div>
  );
}