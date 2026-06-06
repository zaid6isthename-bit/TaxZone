"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TZSkeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/components/auth-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const { loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login/client');
    } else if (user?.role && user.role !== 'client') {
      if (user.role === 'org_admin' || user.role === 'super_admin') {
        router.replace('/admin');
      } else {
        router.replace('/employee');
      }
    }
  }, [loading, isAuthenticated, user?.role, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <TZSkeleton className="w-16 h-16 rounded-full mb-4" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <main className="w-full min-h-screen bg-gray-50">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
