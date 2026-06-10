"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { useAuthStore } from "@/lib/store";
import { TZSkeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface AuthContextType {
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ loading: true });
export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Auth state is persisted in localStorage via Zustand.
    // If tokens exist, the user is already authenticated.
    if (mountedRef.current) setLoading(false);

    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <TZSkeleton className="w-16 h-16 rounded-full mb-4" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading TaxZone...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  );
}
