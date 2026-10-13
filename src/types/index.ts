export interface Product {
  _id: string;
  customId: string;
  category: string;
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  maxQty: number | null;
  isActive: boolean;
  description?: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}
