'use client';

import { createContext, useContext, useState } from 'react';

export interface User {
  id: number;
  email: string;
  nick: string;
  provider: string | null;
  snsId: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User;
}) {
  const [user, setUser] = useState(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
