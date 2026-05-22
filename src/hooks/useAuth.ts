import { useEffect } from "react";
import { useUser } from "./useUser";
import type { User } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";

export const useAuth = () => {
    const { user, addUser, removeUser, setUser } = useUser()
    const { getItem } = useLocalStorage()

    useEffect(() => {
        const user = getItem("user");
        if (user) {
            addUser(JSON.parse(user));
        }
    }, []);

    const login = (user: User) => {
        addUser(user);
    };

    const logout = () => {
        removeUser();
    };

    return { user, login, logout, setUser };
}