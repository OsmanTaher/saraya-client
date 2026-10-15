"use client";

import { useState } from "react";
import { useCart, getCartItemKey } from "@/src/context/CartContext";
import { Product } from "@/src/types";
import ProductImageBadge from "./ProductImageBadge";
import ProductInfo from "./ProductInfo";
import ProductQuantityControl from "./ProductQuantityControl";
import ImageModal from "./ImageModal";

export default function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [isZoomed, setIsZoomed] = useState(false);

  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string>(
    hasSizes ? product.sizes![0].name : "",
  );

  const activePrice = hasSizes
    ? (product.sizes!.find((s) => s.name === selectedSize)?.price ??
      product.price)
    : product.price;

  const oldPrice = product.oldPrice ? Number(product.oldPrice) : undefined;

  const itemKey = getCartItemKey(product._id, selectedSize);
  const cartItem = cart.find(
    (item) =>
      (item.cartItemId || getCartItemKey(item._id, item.selectedSize)) ===
      itemKey,
  );
  const currentQty = cartItem ? cartItem.cartQuantity : 0;

  const handleIncrease = () => {
    if (currentQty === 0) {
      addToCart(product, 1, selectedSize, activePrice);
    } else {
      updateQuantity(product._id, currentQty + 1, selectedSize);
    }
  };

  const handleDecrease = () => {
    if (currentQty > 0) {
      updateQuantity(product._id, currentQty - 1, selectedSize);
    }
  };

  return (
    <>
      <div
        id={`product-${product._id}`}
        className="product-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md"
      >
        <div>
          <ProductImageBadge
            image={product.image}
            name={product.name}
            price={activePrice}
            oldPrice={oldPrice}
            onZoom={() => setIsZoomed(true)}
          />

          <ProductInfo
            category={product.category}
            name={product.name}
            description={product.description}
          />
        </div>

        <ProductQuantityControl
          currentQty={currentQty}
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </div>

      {isZoomed && (
        <ImageModal
          isOpen={isZoomed}
          imageSrc={product.image}
          imageAlt={product.name}
          onClose={() => setIsZoomed(false)}
        />
      )}
    </>
  );
}
