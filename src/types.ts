export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  sellerId: string;
  isVerified?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type UserRole = 'superadmin' | 'admin' | 'user';
export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
}

export enum PaymentMethod {
  ORANGE_MONEY = 'Orange Money',
  MTN_MONEY = 'MTN Mobile Money',
  WAVE = 'Wave',
  MOOV_MONEY = 'Moov Money',
  FREE_MONEY = 'Free Money'
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  prefix: string;
  operators: PaymentMethod[];
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  customerName: string;
  customerId: string;
}

export interface Stats {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  categoryDistribution: Record<string, number>;
  userCount?: number;
  activeSellers?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}