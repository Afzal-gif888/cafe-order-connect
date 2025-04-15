import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCafe } from '@/context/CafeContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock } from 'lucide-react';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useCafe();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const fetchedOrder = getOrder(orderId);
      setOrder(fetchedOrder);
    }
  }, [orderId, getOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground">
              The order you are looking for does not exist.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 py-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Order Details</h1>
          <p className="text-muted-foreground">
            View the details of your order
          </p>
        </div>

        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="px-4 py-3">
            <CardTitle>Order ID: {order.id}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul>
              {order.items.map((item, index) => (
                <li key={index} className="py-2 border-b last:border-none">
                  {item.menuItem.name} x {item.quantity} - ${item.menuItem.price * item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              Total Amount: ${order.totalAmount.toFixed(2)}
            </div>
            <div className="mt-2">
              Order Time: {new Date(order.orderTime).toLocaleString()}
            </div>
            <Badge className={`mt-2 ${statusColors[order.status]}`}>
              {order.status}
            </Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderDetails;
