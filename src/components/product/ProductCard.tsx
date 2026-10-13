"use client";

import { useState } from "react";
import { useCart } from "@/src/context/CartContext";
import { Product } from "@/src/types";
import ProductImageBadge from "./ProductImageBadge";
import ProductInfo from "./ProductInfo";
import ProductQuantityControl from "./ProductQuantityControl";
import  ImageModal  from "./ImageModal";
import ProductMaxAlert from "./ProductMaxAlert";




export default function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [alertTrigger, setAlertTrigger] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const cartItem = cart.find((item) => item._id === product._id);
  const currentQty = cartItem ? cartItem.cartQuantity : 0;
  const oldPrice = Number(product.oldPrice);

  const handleIncrease = () => {
    if (product.maxQty && currentQty >= product.maxQty) {
      setAlertTrigger((prev) => prev + 1);
      return;
    }

    if (currentQty === 0) {
      addToCart(product, 1);
    } else {
      updateQuantity(product._id, currentQty + 1);
    }
  };

  const handleDecrease = () => {
    if (currentQty > 0) {
      updateQuantity(product._id, currentQty - 1);
    }
  };

  const handleOpenZoom = () => {
    setIsZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  return (
    <>
      <div
        id={`product-${product._id}`}
        className="product-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
      >
        <div>
          <ProductImageBadge
            image={product.image}
            name={product.name}
            price={product.price}
            oldPrice={oldPrice}
            onZoom={handleOpenZoom}
          />

          <ProductInfo
            category={product.category}
            name={product.name}
            description={product.description}
          />
        </div>

        <ProductQuantityControl
          currentQty={currentQty}
          maxQty={product.maxQty}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </div>
      
      {alertTrigger > 0 && (
        <ProductMaxAlert trigger={alertTrigger} maxQty={product.maxQty} />
      )}

      {isZoomed && (
        <ImageModal
          isOpen={isZoomed}
          imageSrc={product.image}
          imageAlt={product.name}
          onClose={handleCloseZoom}
        />
      )}
    </>
  );
}
