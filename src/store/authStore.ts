import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import { User } from '../models/user';

type UserUpdates = Partial<Omit<User, 'fullName' | 'avatar' | 'badgeStyle' | 'totalPoints' | 'isAdmin'>>;

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
        set((state) => {
          if (!state.user) return { user: null };
          
          // Re-instantiate to maintain class methods/getters
          const merged: any = { ...state.user, ...updates };
          const userInstance = User.fromDTO({
            id: merged.id,
            first_name: merged.firstName || merged.first_name,
            last_name: merged.lastName || merged.last_name,
            email: merged.email,
            role: merged.role,
            avatar_url: merged.avatarUrl || merged.avatar_url,
            bio: merged.bio || ""
          });

          return { user: userInstance };
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.user && !(state.user instanceof User)) {
          // If the user object is present but not a class instance, convert it
          // This happens after loading from localStorage
          const dto: any = state.user;
          state.user = User.fromDTO({
            id: dto.id,
            first_name: dto.firstName || dto.first_name,
            last_name: dto.lastName || dto.last_name,
            email: dto.email,
            role: dto.role,
            avatar_url: dto.avatarUrl || dto.avatar_url,
            bio: dto.bio || ""
          });
        }
      }
    }
  )
);
