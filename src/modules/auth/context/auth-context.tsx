"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  currentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "@/modules/auth/services/auth-client";
import type { AuthUser } from "@/modules/auth/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  // Bootstrap the session once on mount: current-user + silent cookie refresh.
  useEffect(() => {
    let active = true;
    currentUser()
      .then((resolved) => {
        if (active) {
          setUser(resolved);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setStatus("unauthenticated");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const resolved = await loginRequest(email, password);
    setUser(resolved);
    setStatus("authenticated");
  }

  async function logout(): Promise<void> {
    await logoutRequest();
    setUser(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider value={{ status, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
