"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "iconic-ai-studio-user";
const MOCK_USER_ID = "mock-user-1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
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
      id: MOCK_USER_ID,
      email,
      name: email.split("@")[0],
      total_credits: 5,
      used_credits: 0,
      created_at: new Date().toISOString(),
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = useCallback(async (email: string, _password: string, name: string) => {
    setUser({
      id: MOCK_USER_ID,
      email,
      name,
      total_credits: 5,
      used_credits: 0,
      created_at: new Date().toISOString(),
    });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setUser({
      id: MOCK_USER_ID,
      email: "user@gmail.com",
      name: "Google User",
      total_credits: 5,
      used_credits: 0,
      created_at: new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
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
