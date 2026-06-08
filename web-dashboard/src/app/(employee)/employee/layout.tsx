"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useAuthContext } from "@/components/auth-provider";
import { TZSkeleton } from "@/components/ui/skeleton";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login/admin');
    } else if (user?.role && user.role !== 'employee' && user.role !== 'ca_reviewer') {
      if (user.role === 'org_admin' || user.role === 'super_admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
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

  return <>{children}</>;
}
