
import React from 'react';
import { Notification } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Bell } from 'lucide-react';
import { useCafe } from '@/context/CafeContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markNotificationAsRead } = useCafe();
  const navigate = useNavigate();
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationAsRead(notification.id);
  };
  
  const handleViewOrder = () => {
    if (notification.orderId) {
      markNotificationAsRead(notification.id);
      navigate(`/orders/${notification.orderId}`);
    }
  };
  
  const formattedTime = new Date(notification.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDate = new Date(notification.createdAt).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card 
      className={cn(
        "mb-3 cursor-pointer hover:shadow-md transition-shadow duration-200",
        !notification.read && "border-l-4 border-l-primary"
      )}
      onClick={handleViewOrder}
    >
      <CardContent className="p-4 flex items-start gap-3">
        <div className="bg-muted rounded-full p-2 flex-shrink-0">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={cn(
              "text-sm font-medium", 
              !notification.read && "font-semibold"
            )}>
              {notification.message}
            </h4>
            <span className="text-xs text-muted-foreground">
              {formattedTime}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">
            {formattedDate}
          </p>
          
          {notification.orderId && (
            <Button 
              variant="link" 
              className="px-0 py-1 h-auto text-xs"
              onClick={handleViewOrder}
            >
              View Order Details
            </Button>
          )}
        </div>
        
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-7 w-7"
            onClick={handleMarkAsRead}
          >
            <CheckCircle className="h-4 w-4" />
            <span className="sr-only">Mark as read</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
