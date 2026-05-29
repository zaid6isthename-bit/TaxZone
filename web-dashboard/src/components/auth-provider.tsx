"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { TZSkeleton } from "@/components/ui/skeleton";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout, isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile from public.users
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && mounted) {
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
        } else {
          if (mounted) logout();
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        if (mounted) setLoading(false);
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

        if (profile && mounted) {
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
        logout();
        router.push('/login/client');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setAuth, logout, router]);

  // Auth Guard Logic
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup');
  const isAdminPage = pathname?.startsWith('/admin');
  const isEmployeePage = pathname?.startsWith('/employee');

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isAuthPage) {
        router.replace('/login/client');
      } else if (isAuthenticated && isAuthPage) {
        if (user?.role === 'org_admin' || user?.role === 'super_admin') {
          router.replace('/admin/dashboard');
        } else if (user?.role === 'employee' || user?.role === 'ca_reviewer') {
          router.replace('/employee/dashboard');
        } else {
          router.replace('/');
        }
      } else if (isAuthenticated && isAdminPage && user?.role !== 'org_admin' && user?.role !== 'super_admin') {
        router.replace('/');
      } else if (isAuthenticated && isEmployeePage && user?.role !== 'employee' && user?.role !== 'ca_reviewer' && user?.role !== 'org_admin' && user?.role !== 'super_admin') {
        router.replace('/');
      }
    }
  }, [loading, isAuthenticated, isAuthPage, isAdminPage, isEmployeePage, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
         <TZSkeleton className="w-16 h-16 rounded-full" />
      </div>
    );
  }

  // Prevent flash of content if unauthenticated
  if (!isAuthenticated && !isAuthPage) return null;

  return <>{children}</>;
}
