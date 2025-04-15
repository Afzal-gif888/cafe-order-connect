
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCafe } from '@/context/CafeContext';
import { useAuth } from '@/context/AuthContext';
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, placeOrder } = useCafe();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };
  
  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };
  
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    setPaymentError('');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Place order
      const orderId = await placeOrder();
      
      // Navigate to order confirmation
      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError(error instanceof Error ? error.message : 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
          <p className="text-muted-foreground">
            Review your items before checkout
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Cart Items ({cart.length})
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Browse the menu and add items to your cart
                    </p>
                    <Button onClick={() => navigate('/')}>
                      Go to Menu
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div 
                        key={item.menuItem.id} 
                        className="flex items-center justify-between py-3 border-b"
                      >
                        <div className="flex items-center">
                          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.menuItem.image} 
                              alt={item.menuItem.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="ml-4">
                            <h3 className="font-medium">{item.menuItem.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.menuItem.price} per item
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleDecreaseQuantity(item.menuItem.id, item.quantity)}
                            >
                              <Minus className="h-4 w-4" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            
                            <Input
                              className="w-14 h-8 mx-1 text-center"
                              value={item.quantity}
                              readOnly
                            />
                            
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleIncreaseQuantity(item.menuItem.id, item.quantity)}
                            >
                              <Plus className="h-4 w-4" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                          
                          <div className="text-right min-w-[80px]">
                            <div className="font-medium">
                              ₹{item.menuItem.price * item.quantity}
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.menuItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              
              {cart.length > 0 && (
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                  
                  <div className="text-right">
                    <div className="text-muted-foreground text-sm">
                      Total ({cart.reduce((total, item) => total + item.quantity, 0)} items)
                    </div>
                    <div className="text-2xl font-bold">
                      ₹{getTotalPrice()}
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                </div>
                
                {user && user.role === 'client' && (
                  <div className="mt-4 bg-muted p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Order Details</div>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{user.name}</span>
                      </div>
                      {user.rollNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Roll Number:</span>
                          <span>{user.rollNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{user.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentError && (
                  <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {paymentError}
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  size="lg"
                  disabled={cart.length === 0 || isProcessing}
                  onClick={handleCheckout}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">◌</span>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Place Order & Pay ₹{getTotalPrice()}
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
