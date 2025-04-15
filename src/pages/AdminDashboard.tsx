
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCafe } from '@/context/CafeContext';
import { MenuItem } from '@/types';
import { ShoppingCart, Users, Coffee, AlertCircle, CheckCircle, PlusCircle, Pencil, Trash2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { menuItems, orders } = useCafe();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Filter menu items based on search query
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate total revenue from completed orders
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Count total number of orders and completed orders
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  
  // Mock function for editing menu item
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    // In a real implementation, this would open a modal/form for editing
    console.log('Edit item:', item);
  };
  
  // Mock function for deleting menu item
  const handleDeleteItem = (itemId: string) => {
    // In a real implementation, this would show a confirmation dialog and delete the item
    console.log('Delete item:', itemId);
  };
  
  // Mock function for adding new menu item
  const handleAddItem = () => {
    // In a real implementation, this would open a modal/form for adding a new item
    console.log('Add new item');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage menu items, view statistics, and oversee cafeteria operations
          </p>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-primary mb-2" />
              <h2 className="text-3xl font-bold">₹{totalRevenue}</h2>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Coffee className="h-8 w-8 text-primary mb-2" />
              <h2 className="text-3xl font-bold">{totalOrders}</h2>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary mb-2" />
              <h2 className="text-3xl font-bold">{completedOrders}</h2>
              <p className="text-sm text-muted-foreground">Completed Orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <AlertCircle className="h-8 w-8 text-primary mb-2" />
              <h2 className="text-3xl font-bold">{completionRate}%</h2>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="menu" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>
                    Add, edit, or remove items from the cafeteria menu
                  </CardDescription>
                </div>
                
                <Button onClick={handleAddItem} className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="search-menu" className="sr-only">Search Menu Items</Label>
                  <Input
                    id="search-menu"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">₹{item.price}</TableCell>
                            <TableCell className="text-center">
                              {item.available ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Out of Stock
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                            No menu items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View and manage all orders placed in the cafeteria
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length > 0 ? (
                        orders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.split('-')[1]}</TableCell>
                            <TableCell>{order.userName}</TableCell>
                            <TableCell>{order.rollNumber || 'N/A'}</TableCell>
                            <TableCell>
                              {new Date(order.orderTime).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                            <TableCell className="text-right">₹{order.totalAmount}</TableCell>
                            <TableCell className="text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : order.status === 'ready'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-0">
            <Card className="pt-6">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage cafeteria staff and student accounts
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">User Management</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      This feature would allow adding, editing, and removing cafeteria staff and managing student accounts.
                    </p>
                    <Button disabled>Coming Soon</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
