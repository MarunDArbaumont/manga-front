import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, setAuthErrorHandler } from "../api/api";
import { endpoints } from "../api/endpoints";
import { AuthContext, type AuthContextValue, type User } from "./useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef<Promise<void> | null>(null);
  const sessionVersion = useRef(0);

  // Re-checks the session with the server. Concurrent calls share one request.
  const refresh = useCallback((): Promise<void> => {
    if (inFlight.current) return inFlight.current;

    const version = sessionVersion.current;
    inFlight.current = (async () => {
      try {
        const currentUser = await api<User>(endpoints.me, { skipAuthHandler: true });
        if (sessionVersion.current === version) setUser(currentUser);
      } catch {
        if (sessionVersion.current === version) setUser(null);
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
        await api(endpoints.csrf);
      } catch {
        // The session check below determines whether the user is authenticated.
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
        // Ignore any session check that was already in flight.
        const version = sessionVersion.current + 1;
        sessionVersion.current = version;
        inFlight.current = null;

        const currentUser = await api<User>(endpoints.login, {
          method: "POST",
          body: { username, password },
          skipAuthHandler: true,
        });

        // If the user logged out while the login request was in flight,
        // don't restore the old session.
        if (sessionVersion.current === version) setUser(currentUser);
      },
      logout: async () => {
        // Clear locally first so the UI reacts even if the request fails.
        sessionVersion.current += 1;
        inFlight.current = null;
        setUser(null);

        try {
          await api(endpoints.logout, { method: "POST", skipAuthHandler: true });
        } catch {
          // The local session is already cleared; don't block the user.
        }
      },
    }),
    [user, loading, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
