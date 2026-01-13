import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe, login as apiLogin, logout as apiLogout, UserDto } from '../api/client';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isVendor: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await apiLogin({ email, password });
    const userData = await getMe();
    setUser(userData);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const isVendor = () => {
    return user !== null && user.vendorId !== undefined && user.vendorId !== null;
  };

  const isAdmin = () => {
    return user !== null && (user.vendorId === undefined || user.vendorId === null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isVendor, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
