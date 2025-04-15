
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { User, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<UserRole>('client');
  
  // Client credentials
  const [rollNumber, setRollNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Admin credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      let credentials;
      
      if (activeTab === 'client') {
        if (!rollNumber.trim()) {
          setError('Roll number is required');
          return;
        }
        if (!phoneNumber.trim()) {
          setError('Phone number is required');
          return;
        }
        credentials = { rollNumber, phoneNumber };
      } else {
        if (!username.trim()) {
          setError('Username is required');
          return;
        }
        if (!password.trim()) {
          setError('Password is required');
          return;
        }
        credentials = { username, password };
      }
      
      const success = await login(activeTab, credentials);
      
      if (success) {
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Cafe Order Connect</h1>
          <p className="text-muted-foreground">College Cafeteria Management System</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Choose your role to access the system
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="client" onValueChange={(value) => setActiveTab(value as UserRole)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="client" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Student/Staff</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="client">
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input 
                      id="rollNumber"
                      placeholder="Enter your roll number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="admin">
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminUsername">Username</Label>
                    <Input 
                      id="adminUsername"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Password</Label>
                    <Input 
                      id="adminPassword"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>For demo: Use "admin" for both username and password</p>
                  </div>
                </CardContent>
              </TabsContent>
              
              {error && (
                <div className="px-6 py-2">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              )}
              
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </Tabs>
          
          {/* Demo instructions */}
          <div className="p-4 pt-0 text-center text-sm text-muted-foreground">
            <p>For student demo: Use any roll number and phone</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
