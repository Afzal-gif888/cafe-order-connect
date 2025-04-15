
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginTabs from '@/components/auth/LoginTabs';
import ClientLoginForm from '@/components/auth/ClientLoginForm';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import DemoInstructions from '@/components/auth/DemoInstructions';

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
          <LoginHeader />
          
          <form onSubmit={handleSubmit}>
            <LoginTabs activeTab={activeTab} onTabChange={setActiveTab}>
              <TabsContent value="client">
                <ClientLoginForm 
                  rollNumber={rollNumber}
                  setRollNumber={setRollNumber}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                />
              </TabsContent>
              
              <TabsContent value="admin">
                <AdminLoginForm 
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                />
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
            </LoginTabs>
          </form>
          
          <DemoInstructions />
        </Card>
      </div>
    </div>
  );
};

export default Login;
