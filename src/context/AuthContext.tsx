
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, credentials: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('cafeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - would connect to backend in production
  const login = async (role: UserRole, credentials: any): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      let loggedInUser: User;
      
      if (role === 'client') {
        // Validate student/staff credentials (roll number & phone)
        if (!credentials.rollNumber || !credentials.phoneNumber) {
          throw new Error('Roll number and phone number are required');
        }
        
        loggedInUser = {
          id: `client-${Math.random().toString(36).substring(2, 9)}`,
          name: `Student ${credentials.rollNumber}`,
          role: 'client',
          rollNumber: credentials.rollNumber,
          phoneNumber: credentials.phoneNumber
        };
      } else if (role === 'admin') {
        // Validate admin credentials (username & password)
        if (!credentials.username || !credentials.password) {
          throw new Error('Username and password are required');
        }
        
        loggedInUser = {
          id: `admin-${Math.random().toString(36).substring(2, 9)}`,
          name: 'Admin User',
          role: 'admin',
          phoneNumber: '0000000000'
        };
      } else {
        throw new Error('Invalid role');
      }
      
      // Store user in local storage for session persistence
      localStorage.setItem('cafeUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('cafeUser');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
