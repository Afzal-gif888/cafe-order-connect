
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types';
import { useCafe } from '@/context/CafeContext';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCafe();
  
  const cartItem = cart.find(cartItem => cartItem.menuItem.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleAddToCart = () => {
    addToCart(item);
  };
  
  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, quantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity === 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
            ₹{item.price}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
        <div className="flex items-center">
          <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
            {item.category}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {quantity === 0 ? (
          <Button 
            onClick={handleAddToCart}
            className="w-full"
            disabled={!item.available}
          >
            {item.available ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleDecreaseQuantity}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            
            <span className="font-medium">{quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleIncreaseQuantity}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
