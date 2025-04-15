
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { User, ShieldCheck } from 'lucide-react';

interface LoginTabsProps {
  activeTab: UserRole;
  onTabChange: (value: UserRole) => void;
  children: React.ReactNode;
}

const LoginTabs: React.FC<LoginTabsProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={(value) => onTabChange(value as UserRole)}>
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
      {children}
    </Tabs>
  );
};

export default LoginTabs;
