 
"use client";

import React, { useState, useEffect } from "react";

interface ProductImageBadgeProps {
  image?: string;
  src?: string;
  name?: string;
  alt?: string;
  price: number;
  oldPrice?: number | null;
  onZoom?: () => void;
  onImageClick?: () => void;
  onClick?: () => void;
}

export default function ProductImageBadge({
  image,
  src,
  name,
  alt,
  price,
  oldPrice,
  onZoom,
  onImageClick,
  onClick,
}: ProductImageBadgeProps) {
  const imageUrl = (image || src || "").trim();
  const imageAlt = name || alt || "وجبة مطعم السرايا";
  const handleImageClick = onZoom || onImageClick || onClick;

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgError(false);
  }, [imageUrl]);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden bg-orange-50/40 cursor-pointer"
      onClick={handleImageClick}
    >
      {!imgError && imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-orange-50/70">
          <span className="text-5xl font-black text-[#D55304]/40 select-none">
            ؟
          </span>
        </div>
      )}

      <div className="absolute top-2.5 left-2.5 z-10 bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
        <span className="text-xs font-extrabold">{Number(price)} ج.م</span>
        {oldPrice && oldPrice > price ? (
          <span className="text-[10px] text-slate-300 line-through">
            {Number(oldPrice)} ج
          </span>
        ) : null}
      </div>
    </div>
  );
}
