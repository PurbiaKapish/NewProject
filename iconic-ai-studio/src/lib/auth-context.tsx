"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  totalCredits: number;
  usedCredits: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "iconic-ai-studio-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = useCallback(async (email: string, _password: string) => {
    setUser({
      id: "mock-user-1",
      email,
      name: email.split("@")[0],
      totalCredits: 5,
      usedCredits: 0,
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = useCallback(async (email: string, _password: string, name: string) => {
    setUser({
      id: "mock-user-1",
      email,
      name,
      totalCredits: 5,
      usedCredits: 0,
    });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setUser({
      id: "mock-user-1",
      email: "user@gmail.com",
      name: "Google User",
      totalCredits: 5,
      usedCredits: 0,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
