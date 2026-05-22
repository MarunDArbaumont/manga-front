import { createContext, useState } from "react";
import type { User } from "../hooks/useUser";

interface AuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null)

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}