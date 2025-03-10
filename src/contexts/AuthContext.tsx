
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock user for demo purposes
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        createdAt: new Date(),
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Implement actual login logic here
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: email,
        createdAt: new Date(),
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      };
      
      setUser(mockUser);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, username: string) => {
    try {
      setIsLoading(true);
      // Implement actual registration logic here
      
      // Mock successful registration
      const mockUser: User = {
        id: '1',
        name: name,
        username: username,
        email: email,
        createdAt: new Date(),
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      };
      
      setUser(mockUser);
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again with different information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Implement actual logout logic here
      
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
