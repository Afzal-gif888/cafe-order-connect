
import React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useCafe } from '@/context/CafeContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ClipboardList, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { getUserOrders } = useCafe();
  const navigate = useNavigate();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const userOrders = getUserOrders();
  const completedOrders = userOrders.filter(order => order.status === 'completed').length;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account information
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your personal and account details
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                    
                    {user.rollNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Roll Number</p>
                        <p className="font-medium">{user.rollNumber}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold">{userOrders.length}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold">{completedOrders}</p>
                      <p className="text-sm text-muted-foreground">Completed Orders</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold">
                        {userOrders.length > 0 
                          ? `₹${userOrders.reduce((total, order) => total + order.totalAmount, 0)}`
                          : '₹0'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/orders')}
                  className="flex items-center gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>View Orders</span>
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Role Permissions</h3>
                  
                  <div className="text-sm text-muted-foreground space-y-2">
                    {user.role === 'client' && (
                      <>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Place and manage orders</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>View order history</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Receive order notifications</span>
                        </p>
                      </>
                    )}
                    
                    {user.role === 'cafeteria' && (
                      <>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Receive and manage orders</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Update order status</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>View order analytics</span>
                        </p>
                      </>
                    )}
                    
                    {user.role === 'admin' && (
                      <>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Full system access</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Manage menu items</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>View all orders and analytics</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Manage cafeteria staff</span>
                        </p>
                      </>
                    )}
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

export default Profile;
