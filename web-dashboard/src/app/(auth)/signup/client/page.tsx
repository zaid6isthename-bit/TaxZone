"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/lib/store";

export default function ClientSignupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please enter your name, email, and password");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authService.register({
        email,
        password,
        name,
        phone: phone ? "+91" + phone : undefined,
      });

      setAuth({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: response.user.role as any,
        isFirstLogin: response.user.isFirstLogin,
      }, response.accessToken, response.refreshToken);

      toast.success("Account created successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="h-[25vh] w-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex flex-col items-center justify-center text-white px-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center mt-4">
          <h1 className="text-3xl font-bold font-display tracking-tight">TaxZone</h1>
        </div>
      </div>

      <div className="flex-1 -mt-8 px-5 pb-12 z-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(26,79,186,0.15)] border border-gray-100 p-8">
          <div className="space-y-8 animate-fade-in py-2">
            <button onClick={() => router.push("/login/client")} className="text-[10px] font-extrabold text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2 group">
              <ArrowLeft size={14} /> Back to Login
            </button>
            <div>
              <h2 className="text-3xl font-bold font-display text-gray-900 tracking-tight">Create Account</h2>
              <p className="text-sm text-gray-500 font-body mt-2">Start your compliance journey with TaxZone.</p>
            </div>
            
            <div className="space-y-5">
              <TZInput 
                placeholder="Full Legal Name" 
                className="h-14 rounded-2xl text-base" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TZInput 
                placeholder="Email Address" 
                type="email" 
                className="h-14 rounded-2xl text-base" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TZInput 
                placeholder="Password" 
                type="password" 
                className="h-14 rounded-2xl text-base" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex gap-4">
                <div className="w-24 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-base font-bold text-gray-600 shadow-inner">+91</div>
                <TZInput 
                  placeholder="Mobile Number (optional)" 
                  type="tel" 
                  className="flex-1 h-14 rounded-2xl text-base" 
                  maxLength={10} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
              
              <div className="p-5 rounded-2xl bg-[#F0F9FF] border border-brand-primary/10 flex gap-4 items-start mt-2">
                <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} className="text-brand-primary" />
                </div>
                <p className="text-[12px] font-medium text-gray-600 leading-relaxed">Tax reminders and filing status will be delivered via secure channels.</p>
              </div>
            </div>
            
            <TZButton 
              onClick={handleSignup} 
              loading={isLoading} 
              className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/20"
            >
              Verify & Register
            </TZButton>
          </div>
        </div>
      </div>
    </div>
  );
}
