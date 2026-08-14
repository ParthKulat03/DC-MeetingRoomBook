import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/api/auth.api";
import { onUnauthorized, setToken, getToken } from "@/api/client";
import { bookingSocket } from "@/websocket/socket";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: me } = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    onUnauthorized(() => {
      setUser(null);
      navigate({ to: "/login" });
    });
    void refresh();
  }, [navigate, refresh]);

  useEffect(() => {
    if (user) bookingSocket.connect();
    else bookingSocket.disconnect();
    return () => bookingSocket.disconnect();
  }, [user]);

  const signIn = useCallback((token: string, nextUser: User) => {
    setToken(token);
    setUser(nextUser);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* logout is best-effort */
    }
    setToken(null);
    setUser(null);
    await navigate({ to: "/login" });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      signIn,
      signOut,
      refresh,
    }),
    [user, loading, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
