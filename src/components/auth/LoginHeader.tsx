
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const LoginHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>
        Choose your role to access the system
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
