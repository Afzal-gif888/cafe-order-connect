
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AdminLoginFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  username,
  setUsername,
  password,
  setPassword
}) => {
  return (
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
  );
};

export default AdminLoginForm;
