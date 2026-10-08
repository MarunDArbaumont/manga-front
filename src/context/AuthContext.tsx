import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, setAuthErrorHandler } from "../api/api";

export interface User {
  id: number;
  username: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef<Promise<void> | null>(null);

  // Re-checks the session with the server. Concurrent calls share one request.
  const refresh = useCallback((): Promise<void> => {
    if (inFlight.current) return inFlight.current;

    inFlight.current = (async () => {
      try {
        setUser(await api<User>("/auth/me/", { skipAuthHandler: true }));
      } catch {
        setUser(null);
      } finally {
        inFlight.current = null;
      }
    })();

    return inFlight.current;
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        await api("/auth/csrf/");
      } finally {
        await refresh();
        setLoading(false);
      }
    })();
  }, [refresh]);

  // Any 401/403 from the app triggers a session check
  useEffect(() => {
    setAuthErrorHandler(() => {
      void refresh();
    });
    return () => setAuthErrorHandler(null);
  }, [refresh]);

  // Re-check when the user comes back to the tab
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      refresh,
      login: async (username, password) => {
        setUser(
          await api<User>("/auth/login/", {
            method: "POST",
            body: { username, password },
            skipAuthHandler: true,
          })
        );
      },
      logout: async () => {
        await api("/auth/logout/", { method: "POST" });
        setUser(null);
      },
    }),
    [user, loading, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}