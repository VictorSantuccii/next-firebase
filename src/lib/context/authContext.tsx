'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { userService } from '../firebase/services/userService';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  getCurrentUserId: () => string;
  isProfileComplete: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  getCurrentUserId: () => { throw new Error('Auth context not initialized'); },
  isProfileComplete: () => Promise.resolve(false),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkProfileComplete = async (userId: string) => {
    try {
      const userData = await userService.getCurrentUser();
      return !!userData?.phone; // Altere para o campo que determina cadastro completo
    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const getCurrentUserId = () => {
    if (!user) throw new Error('Usuário não autenticado');
    return user.uid;
  };

  const isProfileComplete = async () => {
    if (!user) return false;
    return checkProfileComplete(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, getCurrentUserId, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);