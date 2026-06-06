"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Smartphone, ShieldCheck } from "lucide-react";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { useAuthContext } from "@/components/auth-provider";
import { TZSkeleton } from "@/components/ui/skeleton";

export default function ClientLoginPage() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { loading } = useAuthContext();

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      if (user?.role === 'org_admin' || user?.role === 'super_admin') {
        router.replace('/admin');
      } else if (user?.role === 'employee' || user?.role === 'ca_reviewer') {
        router.replace('/employee');
      } else {
        router.replace('/');
      }
    }
  }, [loading, isAuthenticated, user?.role, router]);

  if (loading || isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <TZSkeleton className="w-16 h-16 rounded-full mb-4" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Redirecting...</p>
      </div>
    );
  }

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: "+91" + phone,
      });

      if (error) throw error;

      toast.success("OTP sent to +91 " + phone);
      router.push(`/login/client/otp?phone=${encodeURIComponent("+91" + phone)}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="h-[40vh] w-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex flex-col items-center justify-center text-white px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-gradient-start/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center mb-6 shadow-2xl ring-1 ring-white/20">
            <span className="text-4xl font-extrabold font-display">TZ</span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">TaxZone</h1>
          <p className="text-white/60 font-body text-sm mt-1 uppercase tracking-[0.2em] font-bold">Client Portal</p>
        </div>
      </div>

      <div className="flex-1 -mt-12 px-5 pb-12 z-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(26,79,186,0.15)] border border-gray-100 p-8">
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold font-display text-gray-900 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-gray-500 font-body mt-2">Enter your phone number to login or register.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-base font-bold text-gray-600 shadow-inner">+91</div>
              <TZInput
                placeholder="Mobile Number"
                type="tel"
                className="flex-1 h-14 text-lg font-bold tracking-widest rounded-2xl"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            
            <TZButton 
              onClick={handleSendOTP} 
              loading={isLoading} 
              className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/20"
            >
              Continue with Phone
            </TZButton>

            <div className="pt-4 flex justify-between border-t border-gray-50">
              <button 
                onClick={() => router.push('/signup/client')} 
                className="text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors"
              >
                Create Account
              </button>
              <button 
                onClick={() => router.push('/login/admin')} 
                className="text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
