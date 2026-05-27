import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserState {
  user: any | null;
  role: 'client' | 'employee' | 'admin' | null;
  isAuthenticated: boolean;
  setUser: (user: any, role: 'client' | 'employee' | 'admin') => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        role: null,
        isAuthenticated: false,
        setUser: (user, role) => set({ user, role, isAuthenticated: true }),
        logout: () => set({ user: null, role: null, isAuthenticated: false }),
      }),
      {
        name: 'taxzone-auth-storage',
      }
    )
  )
);

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  }))
);
