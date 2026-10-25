// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../api/client';

interface AuthContextData {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // <-- Ovde je true na početku

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('accessToken');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Greška pri čitanju iz AsyncStorage:', error);
      } finally {
        setLoading(false); // <-- Ovde je false kada završi
      }
    }
    loadStorageData();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const authData = data.data;

      await AsyncStorage.setItem('user', JSON.stringify(authData.user));
      await AsyncStorage.setItem('accessToken', authData.accessToken);
      await AsyncStorage.setItem('refreshToken', authData.refreshToken);

      setUser(authData.user);
    } catch (error: any) {
      throw new Error(error.message || 'Greška pri prijavi');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
    } catch (error) {
      console.error('Greška pri odjavi:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth mora biti unutar AuthProvider');
  return context;
};