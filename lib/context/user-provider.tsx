'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    // call server to clear httpOnly cookie
    fetch('/api/auth/logout', { method: 'POST' })
      .finally(() => {
        setUser(null);
        router.push('/login');
      });
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
        } else {
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
            router.push('/login');
          }
        }
      } catch (err) {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}