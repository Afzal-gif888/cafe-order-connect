
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { OrderCard } from '@/components/OrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCafe } from '@/context/CafeContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ClipboardList } from 'lucide-react';

const Orders: React.FC = () => {
  const { getUserOrders } = useCafe();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get user orders
  const userOrders = getUserOrders();
  
  // Get orders by status
  const activeOrders = userOrders.filter(
    order => order.status !== 'completed' && order.status !== 'cancelled'
  );
  const completedOrders = userOrders.filter(
    order => order.status === 'completed' || order.status === 'cancelled'
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your cafeteria orders
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="active" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="active" className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Active Orders ({activeOrders.length})</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  <span>Order History ({completedOrders.length})</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-0">
                {activeOrders.length > 0 ? (
                  activeOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No active orders</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any active orders at the moment
                    </p>
                    <Button onClick={() => navigate('/')}>
                      Order Now
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                {completedOrders.length > 0 ? (
                  completedOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No order history</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't completed any orders yet
                    </p>
                    <Button onClick={() => navigate('/')}>
                      Place Your First Order
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Order Information
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">About Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    Track the status of your cafeteria orders and view your order history.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Order Status Guide</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </div>
                      <span><strong>Pending</strong> - Your order has been received by the cafeteria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </div>
                      <span><strong>Preparing</strong> - The cafeteria is preparing your food</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </div>
                      <span><strong>Ready</strong> - Your order is ready for pickup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </div>
                      <span><strong>Completed</strong> - Your order has been picked up</span>
                    </li>
                  </ul>
                </div>
                
                {userOrders.length > 0 && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/')}
                    >
                      Place New Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
