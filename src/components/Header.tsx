
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCafe } from '@/context/CafeContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart, notifications } = useCafe();
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter(
    notif => !notif.read && (notif.userId === user?.id || notif.userId === user?.role)
  );

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToNotifications = () => {
    navigate('/notifications');
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 
            className="text-2xl font-bold cursor-pointer" 
            onClick={() => navigate('/')}
          >
            Cafe Order Connect
          </h1>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'client' && (
              <Button 
                variant="ghost" 
                className="relative"
                onClick={navigateToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getTotalCartItems()}
                  </Badge>
                )}
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              className="relative"
              onClick={navigateToNotifications}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost"
              className="flex items-center gap-2"
              onClick={navigateToProfile}
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user.name}</span>
            </Button>
            
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </div>
    </header>
  );
};
