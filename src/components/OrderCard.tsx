import React from 'react';
import { Order } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useCafe } from '@/context/CafeContext';

interface OrderCardProps {
  order: Order;
  onStatusUpdate?: (orderId: string, newStatus: Order['status']) => void;
}

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate }) => {
  const { user } = useAuth();
  const { updateOrderStatus } = useCafe();

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (updateOrderStatus && order.id) {
      try {
        await updateOrderStatus(order.id, newStatus);
        toast({
          title: "Order status updated!",
          description: `Order ${order.id} status updated to ${newStatus}.`,
        });
        if (onStatusUpdate) {
          onStatusUpdate(order.id, newStatus);
        }
      } catch (error) {
        console.error("Failed to update order status:", error);
        toast({
          variant: "destructive",
          title: "Error updating status",
          description: "Failed to update the order status. Please try again.",
        });
      }
    }
  };

  // Replace the conditional that was causing the error
  const showStatusControls = user?.role === 'admin';

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader className="px-4 py-3">
        <CardTitle>Order ID: {order.id}</CardTitle>
        <CardDescription>
          Order placed by {order.userName} on {order.orderTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className="py-2 border-b last:border-none">
              {item.menuItem.name} x {item.quantity}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          Total Amount: ${order.totalAmount.toFixed(2)}
        </div>
        <Badge className={`mt-2 ${statusColors[order.status]}`}>
          {order.status}
        </Badge>
      </CardContent>
      {showStatusControls && (
        <CardFooter className="flex justify-between items-center p-4">
          <div className="space-x-2">
            {order.status !== 'preparing' && (
              <Button size="sm" onClick={() => handleStatusUpdate('preparing')}>
                Preparing
              </Button>
            )}
            {order.status !== 'ready' && (
              <Button size="sm" onClick={() => handleStatusUpdate('ready')}>
                Ready
              </Button>
            )}
            {order.status !== 'completed' && (
              <Button size="sm" onClick={() => handleStatusUpdate('completed')}>
                Completed
              </Button>
            )}
            {order.status !== 'cancelled' && (
              <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate('cancelled')}>
                Cancel
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderCard;
