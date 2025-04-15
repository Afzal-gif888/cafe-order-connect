
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { OrderCard } from '@/components/OrderCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCafe } from '@/context/CafeContext';
import { Order } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, CheckCircle2, Clock, ChefHat } from 'lucide-react';

const CafeteriaDashboard: React.FC = () => {
  const { orders } = useCafe();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  // Filter orders based on search query and update when orders change
  useEffect(() => {
    setFilteredOrders(
      orders.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.rollNumber && order.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, orders]);
  
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
  const preparingOrders = filteredOrders.filter(order => order.status === 'preparing');
  const readyOrders = filteredOrders.filter(order => order.status === 'ready');
  const completedOrders = filteredOrders.filter(order => 
    order.status === 'completed' || order.status === 'cancelled'
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Cafeteria Dashboard</h1>
          <p className="text-muted-foreground">
            Manage incoming orders and update order status
          </p>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order ID, customer name, or roll number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-yellow-500" />
              <Label className="text-lg font-medium">Pending</Label>
            </div>
            <p className="text-3xl font-bold">{pendingOrders.length}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <ChefHat className="h-5 w-5 text-blue-500" />
              <Label className="text-lg font-medium">Preparing</Label>
            </div>
            <p className="text-3xl font-bold">{preparingOrders.length}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <Label className="text-lg font-medium">Ready</Label>
            </div>
            <p className="text-3xl font-bold">{readyOrders.length}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
              <Label className="text-lg font-medium">Completed</Label>
            </div>
            <p className="text-3xl font-bold">{completedOrders.length}</p>
          </div>
        </div>
        
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Pending ({pendingOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="preparing" className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span>Preparing ({preparingOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ready" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Ready ({readyOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed ({completedOrders.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-0">
            {pendingOrders.length > 0 ? (
              pendingOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No pending orders at the moment.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preparing" className="mt-0">
            {preparingOrders.length > 0 ? (
              preparingOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No orders being prepared at the moment.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ready" className="mt-0">
            {readyOrders.length > 0 ? (
              readyOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No orders ready for pickup at the moment.</p>
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
                <p className="text-muted-foreground">No completed orders to show.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CafeteriaDashboard;
