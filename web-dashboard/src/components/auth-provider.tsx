"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { TZSkeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface AuthContextType {
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ loading: true });
export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && mountedRef.current) {
            setAuth({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              role: profile.role,
              businessName: profile.business_name,
              gstin: profile.gstin,
              avatar: profile.avatar_url,
              isFirstLogin: false
            }, session.access_token, session.refresh_token);
          } else {
            if (mountedRef.current) logout();
          }
        } else {
          if (mountedRef.current) logout();
        }
      } catch (error) {
        console.error("Auth init error:", error);
        if (mountedRef.current) logout();
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && mountedRef.current) {
          setAuth({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
            businessName: profile.business_name,
            gstin: profile.gstin,
            avatar: profile.avatar_url,
            isFirstLogin: false
          }, session.access_token, session.refresh_token);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mountedRef.current) logout();
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
