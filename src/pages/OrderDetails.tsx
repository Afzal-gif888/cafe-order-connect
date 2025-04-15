
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCafe } from '@/context/CafeContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Clock, CheckCircle, Receipt, ChefHat, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus } = useCafe();
  const { user } = useAuth();
  
  const order = orderId ? getOrder(orderId) : undefined;
  
  useEffect(() => {
    if (!order) {
      // If order not found, redirect to orders page
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    }
  }, [order, navigate]);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto p-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/orders')}>
            Go to Orders
          </Button>
        </main>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'preparing':
        return <ChefHat className="h-5 w-5" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  const handleUpdateStatus = (status: 'preparing' | 'ready' | 'completed' | 'cancelled') => {
    updateOrderStatus(order.id, status);
  };
  
  const isCafeteriaStaff = user?.role === 'cafeteria';
  const isClient = user?.role === 'client';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className={cn(
              order.status === 'ready' && "border-green-500"
            )}>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                  <div>
                    <CardTitle className="text-xl">
                      Order #{order.id.split('-')[1]}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.orderTime)}
                    </p>
                  </div>
                  
                  <Badge 
                    className={cn(
                      'flex items-center gap-2 px-3 py-1 text-sm', 
                      getStatusColor(order.status)
                    )}
                  >
                    {getStatusIcon(order.status)}
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </Badge>
                </div>
                
                {order.status === 'ready' && isClient && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2 text-sm text-green-800 flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Your order is ready for pickup!</p>
                      <p>Please collect your order from the cafeteria counter. Show this order details to the staff.</p>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <h3 className="font-medium mb-3">Order Items</h3>
                
                <div className="space-y-3 mb-6">
                  {order.items.map(item => (
                    <div 
                      key={item.menuItem.id} 
                      className="flex justify-between py-2 border-b"
                    >
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.menuItem.image} 
                            alt={item.menuItem.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-medium">
                            {item.menuItem.name} 
                            <span className="text-muted-foreground ml-1">
                              × {item.quantity}
                            </span>
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.menuItem.price} per item
                          </p>
                        </div>
                      </div>
                      
                      <div className="font-medium">
                        ₹{item.menuItem.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹0</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
              
              {(isCafeteriaStaff || isClient) && order.status !== 'completed' && order.status !== 'cancelled' && (
                <CardFooter className="flex flex-wrap gap-3 border-t pt-4">
                  {isCafeteriaStaff && order.status === 'pending' && (
                    <Button onClick={() => handleUpdateStatus('preparing')}>
                      <ChefHat className="mr-2 h-4 w-4" />
                      Start Preparing
                    </Button>
                  )}
                  
                  {isCafeteriaStaff && order.status === 'preparing' && (
                    <Button onClick={() => handleUpdateStatus('ready')}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Ready for Pickup
                    </Button>
                  )}
                  
                  {isClient && order.status === 'ready' && (
                    <Button onClick={() => handleUpdateStatus('completed')}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Pickup
                    </Button>
                  )}
                  
                  {isCafeteriaStaff && (order.status === 'pending' || order.status === 'preparing') && (
                    <Button 
                      variant="outline" 
                      className="text-destructive"
                      onClick={() => handleUpdateStatus('cancelled')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Order
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="mr-2 h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Order Status
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className={cn(
                      "flex items-center gap-2",
                      order.status === 'cancelled' ? "text-muted-foreground line-through" : "text-primary"
                    )}>
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center",
                        order.status === 'cancelled' ? "bg-muted-foreground/20" : "bg-primary text-primary-foreground"
                      )}>
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span>Order Placed</span>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-2",
                      (order.status === 'preparing' || order.status === 'ready' || order.status === 'completed')
                        ? "text-primary" 
                        : "text-muted-foreground",
                      order.status === 'cancelled' && "line-through"
                    )}>
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center",
                        (order.status === 'preparing' || order.status === 'ready' || order.status === 'completed')
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted-foreground/20"
                      )}>
                        {(order.status === 'preparing' || order.status === 'ready' || order.status === 'completed')
                          ? <CheckCircle className="h-3 w-3" />
                          : <span className="h-2 w-2 rounded-full bg-current" />
                        }
                      </div>
                      <span>Preparing</span>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-2",
                      (order.status === 'ready' || order.status === 'completed')
                        ? "text-primary" 
                        : "text-muted-foreground",
                      order.status === 'cancelled' && "line-through"
                    )}>
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center",
                        (order.status === 'ready' || order.status === 'completed')
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted-foreground/20"
                      )}>
                        {(order.status === 'ready' || order.status === 'completed')
                          ? <CheckCircle className="h-3 w-3" />
                          : <span className="h-2 w-2 rounded-full bg-current" />
                        }
                      </div>
                      <span>Ready for Pickup</span>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-2",
                      order.status === 'completed'
                        ? "text-primary" 
                        : "text-muted-foreground",
                      order.status === 'cancelled' && "line-through"
                    )}>
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center",
                        order.status === 'completed'
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted-foreground/20"
                      )}>
                        {order.status === 'completed'
                          ? <CheckCircle className="h-3 w-3" />
                          : <span className="h-2 w-2 rounded-full bg-current" />
                        }
                      </div>
                      <span>Completed</span>
                    </div>
                    
                    {order.status === 'cancelled' && (
                      <div className="flex items-center gap-2 text-destructive">
                        <div className="h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                          <XCircle className="h-3 w-3" />
                        </div>
                        <span>Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Customer Information
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{order.userName}</span>
                    </div>
                    {order.rollNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Roll Number:</span>
                        <span>{order.rollNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Payment Information
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span>
                      {order.paymentStatus === 'completed' ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span>₹{order.paymentStatus === 'completed' ? order.totalAmount : 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
