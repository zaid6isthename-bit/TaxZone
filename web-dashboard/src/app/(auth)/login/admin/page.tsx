"use client";

import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login Successful");
      // AuthGuard will route to correct dashboard based on role
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="h-[40vh] w-full bg-gradient-to-br from-gray-800 to-black flex flex-col items-center justify-center text-white px-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center mb-6 shadow-2xl ring-1 ring-white/20">
            <span className="text-4xl font-extrabold font-display">TZ</span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">TaxZone</h1>
          <p className="text-white/60 font-body text-sm mt-1 uppercase tracking-[0.2em] font-bold">Admin Portal</p>
        </div>
      </div>

      <div className="flex-1 -mt-12 px-5 pb-12 z-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-8">
          <div className="space-y-8 animate-fade-in">
            <button onClick={() => router.push('/login/client')} className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Client Login
            </button>
            <div>
              <h2 className="text-3xl font-bold font-display text-gray-900 tracking-tight">Staff Access</h2>
              <p className="text-sm text-gray-500 font-body mt-2">Use your firm credentials to sign in.</p>
            </div>
            
            <div className="space-y-4">
              <TZInput 
                placeholder="Work Email" 
                icon={<Mail size={20} />} 
                className="h-14 rounded-2xl text-base" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="space-y-3">
                <TZInput 
                  placeholder="Password" 
                  type="password" 
                  icon={<Lock size={20} />} 
                  className="h-14 rounded-2xl text-base" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <TZButton 
              onClick={handleLogin} 
              loading={isLoading} 
              className="w-full h-16 rounded-2xl text-lg font-bold bg-gray-900 hover:bg-black"
            >
              Enter Admin Portal
            </TZButton>
          </div>
        </div>
      </div>
    </div>
  );
}
