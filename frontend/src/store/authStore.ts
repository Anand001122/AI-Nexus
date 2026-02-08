import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    user: {
        email: string;
        fullName: string;
        isPremium: boolean;
        credits: number;
    } | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: { email: string; fullName: string; isPremium: boolean; credits: number }) => void;
    setToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
            setToken: (token) => set({ token, isAuthenticated: true }),
            logout: () => set({ token: null, user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
