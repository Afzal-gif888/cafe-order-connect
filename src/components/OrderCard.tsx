
import React from 'react';
import { Order } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCafe } from '@/context/CafeContext';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, showActions = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateOrderStatus } = useCafe();
  
  const handleViewOrder = () => {
    navigate(`/orders/${order.id}`);
  };
  
  const handleUpdateStatus = (status: Order['status']) => {
    updateOrderStatus(order.id, status);
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <ChefHat className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isCafeteriaStaff = user?.role === 'cafeteria';
  
  return (
    <Card className={cn(
      "mb-4 overflow-hidden",
      order.status === 'ready' && "border-green-500"
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
        <div>
          <h3 className="font-medium text-sm flex items-center gap-1">
            Order #{order.id.split('-')[1]}
            {order.status === 'ready' && (
              <span className="text-green-600">
                <CheckCircle className="h-4 w-4 inline ml-1" />
              </span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatDate(order.orderTime)}
          </p>
        </div>
        
        <Badge className={cn('flex items-center gap-1', getStatusColor(order.status))}>
          {getStatusIcon(order.status)}
          <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="text-sm mb-2">
          <span className="font-medium">Items:</span> {order.items.reduce((total, item) => total + item.quantity, 0)}
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">Total:</span>
            <span className="text-lg font-bold ml-1">₹{order.totalAmount}</span>
          </div>
          
          <div>
            <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'outline'}>
              {order.paymentStatus === 'completed' ? 'Paid' : 'Payment Pending'}
            </Badge>
          </div>
        </div>
        
        {order.rollNumber && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Roll Number:</span> {order.rollNumber}
          </div>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" onClick={handleViewOrder}>
            View Details
          </Button>
          
          {isCafeteriaStaff && order.status === 'pending' && (
            <Button onClick={() => handleUpdateStatus('preparing')}>
              Start Preparing
            </Button>
          )}
          
          {isCafeteriaStaff && order.status === 'preparing' && (
            <Button onClick={() => handleUpdateStatus('ready')}>
              Mark as Ready
            </Button>
          )}
          
          {user?.role === 'client' && order.status === 'ready' && (
            <Button onClick={() => handleUpdateStatus('completed')}>
              Confirm Pickup
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
