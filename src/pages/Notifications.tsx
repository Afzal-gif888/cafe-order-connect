
import React from 'react';
import { Header } from '@/components/Header';
import { NotificationItem } from '@/components/NotificationItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, ArrowLeft } from 'lucide-react';
import { useCafe } from '@/context/CafeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const { notifications, markNotificationAsRead } = useCafe();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter notifications for the current user or role
  const userNotifications = notifications.filter(
    notification => notification.userId === user?.id || notification.userId === user?.role
  );
  
  const unreadNotifications = userNotifications.filter(notification => !notification.read);
  const readNotifications = userNotifications.filter(notification => notification.read);
  
  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      markNotificationAsRead(notification.id);
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your orders and cafeteria updates
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Unread Notifications</h2>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All as Read
                  </Button>
                </div>
                
                {unreadNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            )}
            
            {/* All Notifications */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                {unreadNotifications.length > 0 ? 'Earlier Notifications' : 'Notifications'}
              </h2>
              
              {readNotifications.length > 0 ? (
                readNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))
              ) : (
                <p className="text-muted-foreground">No earlier notifications</p>
              )}
              
              {userNotifications.length === 0 && (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                  <p className="text-muted-foreground">
                    You don't have any notifications at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Info
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">About Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Notifications keep you updated about your orders and important cafeteria updates.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Types of Notifications</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bell className="h-3 w-3" />
                      </div>
                      <span>Order updates - When your order status changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bell className="h-3 w-3" />
                      </div>
                      <span>Pickup notifications - When your order is ready</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bell className="h-3 w-3" />
                      </div>
                      <span>System notifications - Important system announcements</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
