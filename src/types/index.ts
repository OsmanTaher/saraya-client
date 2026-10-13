export interface MealSize {
  name: string;
  price: number;
}

export interface Product {
  _id: string;
  category: string;
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  description?: string;
  sizes?: MealSize[];
  isActive: boolean;
}

export interface CartItem extends Product {
  cartQuantity: number;
  selectedSize?: string;
  effectivePrice: number; // السعر الفعلي (حسب الحجم المختار أو السعر الأساسي)
}

export interface OrderItem {
  productId: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  _id: string;
  orderNumber: number;
  orderType: 'delivery' | 'dine_in' | 'cashier' | 'pickup';
  tableNumber?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  paymentMethod: 'cash' | 'instapay' | 'vodafone_cash';
  paymentReceipt?: string;
  isPaid: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
