"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Admin } from "@/types";
import * as authService from "@/services/authService";
import { clearSession, getStoredUser, getToken, setSession } from "@/utils/tokenStorage";
import { normalizeError } from "@/utils/errorHandler";

interface AuthContextValue {
  user: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      setUser(getStoredUser());

      try {
        const freshUser = await authService.getProfile();

        if (freshUser.role !== "admin") {
          clearSession();
          setUser(null);
        } else {
          setUser(freshUser);
        }
      } catch {
        clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { user: loggedInUser, token } = await authService.login(email, password);
      setSession(token, loggedInUser);
      setUser(loggedInUser);
    } catch (error) {
      throw new Error(normalizeError(error).message || (error as Error).message);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
