
import React, { createContext, useState, useContext, useEffect } from 'react';
import { MenuItem, CartItem, Order, Notification } from '@/types';
import { useAuth } from './AuthContext';

// Sample menu items data
const sampleMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Veg Sandwich',
    description: 'Fresh vegetables with cheese and mayo',
    price: 60,
    image: '/placeholder.svg',
    category: 'Snacks',
    available: true
  },
  {
    id: '2',
    name: 'Coffee',
    description: 'Hot brewed coffee',
    price: 30,
    image: '/placeholder.svg',
    category: 'Beverages',
    available: true
  },
  {
    id: '3',
    name: 'Veg Biryani',
    description: 'Fragrant rice with vegetables and spices',
    price: 100,
    image: '/placeholder.svg',
    category: 'Meals',
    available: true
  },
  {
    id: '4',
    name: 'Chocolate Muffin',
    description: 'Freshly baked chocolate muffin',
    price: 45,
    image: '/placeholder.svg',
    category: 'Bakery',
    available: true
  },
  {
    id: '5',
    name: 'Samosa',
    description: 'Spicy potato filled pastry',
    price: 20,
    image: '/placeholder.svg',
    category: 'Snacks',
    available: true
  },
  {
    id: '6',
    name: 'Cold Drink',
    description: 'Refreshing cold beverage',
    price: 40,
    image: '/placeholder.svg',
    category: 'Beverages',
    available: true
  }
];

// Sample orders data
const sampleOrders: Order[] = [];

interface CafeContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  notifications: Notification[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrder: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
  getCafeteriaOrders: () => Order[];
  markNotificationAsRead: (notificationId: string) => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (context === undefined) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cafeCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cafeCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.menuItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.menuItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { menuItem: item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.menuItem.id !== itemId);
      }
      return prevCart.map(item => 
        item.menuItem.id === itemId 
          ? { ...item, quantity } 
          : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (): Promise<string> => {
    if (!user) throw new Error('User must be logged in to place an order');
    if (cart.length === 0) throw new Error('Cart is empty');

    // Calculate total amount
    const totalAmount = cart.reduce(
      (sum, item) => sum + (item.menuItem.price * item.quantity), 
      0
    );

    // Create new order
    const newOrder: Order = {
      id: `order-${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id,
      userName: user.name,
      rollNumber: user.rollNumber,
      items: [...cart],
      status: 'pending',
      totalAmount,
      orderTime: new Date().toISOString(),
      paymentStatus: 'completed' // Assuming payment is completed immediately
    };

    // Add order to orders list
    setOrders(prevOrders => [...prevOrders, newOrder]);

    // Create notification for cafeteria staff
    const cafeteriaNotification: Notification = {
      id: `notif-${Math.random().toString(36).substring(2, 9)}`,
      userId: 'cafeteria', // Will be shown to all cafeteria staff
      message: `New order #${newOrder.id} received from ${user.name}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: 'order_placed',
      orderId: newOrder.id
    };

    // Add notification
    setNotifications(prevNotifications => [...prevNotifications, cafeteriaNotification]);

    // Clear cart after successful order
    clearCart();

    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status } 
          : order
      )
    );

    // If status is 'ready', send notification to the customer
    const order = orders.find(o => o.id === orderId);
    if (status === 'ready' && order) {
      const userNotification: Notification = {
        id: `notif-${Math.random().toString(36).substring(2, 9)}`,
        userId: order.userId,
        message: `Your order #${orderId} is ready for pickup!`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'order_ready',
        orderId
      };
      setNotifications(prevNotifications => [...prevNotifications, userNotification]);
    }
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  };

  const getCafeteriaOrders = () => {
    // Return all orders for cafeteria staff
    return orders;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  return (
    <CafeContext.Provider value={{
      menuItems,
      cart,
      orders,
      notifications,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      getOrder,
      getUserOrders,
      getCafeteriaOrders,
      markNotificationAsRead
    }}>
      {children}
    </CafeContext.Provider>
  );
};
