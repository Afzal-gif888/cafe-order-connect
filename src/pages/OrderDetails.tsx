import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCafe } from '@/context/CafeContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area"

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const { orders, updateOrder } = useCafe();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId && orders) {
      const foundOrder = orders.find(order => order.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast({
          title: "Order Not Found",
          description: "The order you are looking for does not exist.",
        })
        navigate('/orders');
      }
    }
  }, [orderId, orders, navigate]);

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (order && order.id) {
      try {
        await updateOrder(order.id, { status: newStatus });
        toast({
          title: "Order Updated",
          description: `Order status updated to ${newStatus}.`,
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update order status.",
        })
      }
    }
  };

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Loading order details...</div>;
  }

  const canUpdateStatus = user?.role === 'admin';

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/orders')}>
          ← Back to Orders
        </Button>
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Order #{orderId}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <h3 className="text-lg font-semibold">Order Information</h3>
            <p>Order Time: {format(new Date(order.orderTime), 'PPP p')}</p>
            <p>Customer: {order.userName} ({order.rollNumber})</p>
            <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
            <Badge variant="secondary">
              Status: {order.status}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Order Items</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border">
              <div className="divide-y divide-border px-2">
                {order.items.map((item, index) => (
                  <div key={index} className="py-2">
                    {item.menuItem.name} x {item.quantity} - ${item.menuItem.price.toFixed(2)}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {canUpdateStatus && (
            <div>
              <h3 className="text-lg font-semibold">Update Status</h3>
              <div className="flex gap-2">
                {order.status !== 'preparing' && (
                  <Button onClick={() => handleStatusUpdate('preparing')}>
                    Mark as Preparing
                  </Button>
                )}
                {order.status !== 'ready' && (
                  <Button onClick={() => handleStatusUpdate('ready')}>
                    Mark as Ready
                  </Button>
                )}
                {order.status !== 'completed' && (
                  <Button onClick={() => handleStatusUpdate('completed')}>
                    Mark as Completed
                  </Button>
                )}
                {order.status !== 'cancelled' && (
                  <Button variant="destructive" onClick={() => handleStatusUpdate('cancelled')}>
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
