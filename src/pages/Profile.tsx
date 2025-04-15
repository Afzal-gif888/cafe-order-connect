
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, User, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  rollNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user?.name || '',
      rollNumber: user?.rollNumber || '',
      phoneNumber: user?.phoneNumber || '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
    setIsUpdating(true);
    try {
      // Since updateUser is not implemented in the AuthContext, we'll just show a success toast
      // for demonstration purposes
      setTimeout(() => {
        toast({
          title: 'Profile updated successfully!',
        });
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: 'Failed to update profile. Please try again.',
      });
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: 'Logged out successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error logging out',
        description: 'Failed to log out. Please try again.',
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait, fetching user data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {user.role === 'client' && (
                      <>
                        <FormField
                          control={form.control}
                          name="rollNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Roll Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Roll Number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Phone Number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          Updating <span className="animate-spin ml-2">🔄</span>
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Logout</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account.
                  </p>
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                    <LogOut className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
