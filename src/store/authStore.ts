import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import type { User } from '../types/user';

type UserUpdates = Partial<Omit<User, 'fullName' | 'avatar' | 'badgeStyle' | 'totalPoins' | 'isAdmin'>>;

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  updateUser: (user: UserUpdates) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (updates: UserUpdates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } as User : null,
        }));
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
