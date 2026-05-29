import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'employee' | 'ca_reviewer' | 'manager' | 'org_admin' | 'super_admin';
  businessName?: string;
  gstin?: string;
  avatar?: string;
  isFirstLogin: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  unreadCount: number;
  isSidebarCollapsed: boolean;
  setAuth: (user: User, at: string, rt: string) => void;
  logout: () => void;
  setUnreadCount: (n: number) => void;
  toggleSidebar: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      unreadCount: 0,
      isSidebarCollapsed: false,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      logout: () => {
        supabase.auth.signOut();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      setUnreadCount: (unreadCount) => set({ unreadCount }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: 'taxzone-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
