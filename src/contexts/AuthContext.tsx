import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'church' | 'user';
  isPremium: boolean;
  profileImage?: string;
  churchData?: {
    denomination: string;
    address: string;
    phone: string;
    pixKey: string;
    instagram?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, type: 'church' | 'user') => Promise<void>;
  loginWithToken: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, type: 'church' | 'user') => {
    setIsLoading(true);
    try {
      // Simular login - em produção, fazer chamada para API
      const mockUser: User = {
        id: '1',
        name: type === 'church' ? 'Igreja Batista Central' : 'João Silva',
        email,
        type,
        isPremium: type === 'church', // Igreja começa premium para demo
        profileImage: undefined,
        churchData: type === 'church' ? {
          denomination: 'Batista',
          address: 'Rua das Flores, 123 - Centro',
          phone: '(11) 99999-9999',
          pixKey: 'igreja@batista.com.br',
          instagram: '@igrejabatistacentral'
        } : undefined
      };

      await AsyncStorage.setItem('auth_token', 'demo_token');
      await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loginWithToken = async (token: string, userData: User) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('loginWithToken error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = { ...user, ...userData } as User;
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithToken, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}