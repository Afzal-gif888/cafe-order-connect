
export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  rollNumber?: string; // For students/staff
  phoneNumber: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  rollNumber?: string;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: number;
  orderTime: string;
  paymentStatus: 'pending' | 'completed';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'order_placed' | 'order_ready' | 'system';
  orderId?: string;
}
