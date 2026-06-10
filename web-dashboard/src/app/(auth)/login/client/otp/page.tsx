"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { TZButton } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import React, { Suspense } from "react";

function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  useEffect(() => {
    if (!email) router.replace("/login/client");
  }, [email, router]);

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpString,
        type: "email",
      });

      if (error) throw error;
      toast.success("Login Successful");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <>
      <button onClick={() => router.push("/login/client")} className="text-[10px] font-extrabold text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2 group">
        <ArrowLeft size={14} /> Back
      </button>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary-light rounded-full mb-6 ring-[12px] ring-brand-primary-light/30">
          <ShieldCheck size={36} className="text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold font-display text-gray-900 leading-tight">Verify Device</h2>
        <p className="text-sm text-gray-500 font-body mt-2">6-digit code sent to <span className="font-bold text-gray-900">{email}</span></p>
      </div>

      <div className="flex gap-2.5 justify-center">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="tel"
            maxLength={1}
            value={otp[i]}
            className="w-12 h-16 text-center text-2xl font-bold font-display border border-gray-100 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all shadow-inner"
            onChange={(e) => handleChange(e.target.value.replace(/[^0-9]/g, ''), i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>

      <div className="space-y-6">
        <TZButton onClick={handleVerifyOTP} loading={isLoading} className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/20">Verify & Continue</TZButton>
      </div>
    </>
  );
}

export default function ClientOTPPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="h-[40vh] w-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex flex-col items-center justify-center text-white px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-gradient-start/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="flex-1 -mt-32 px-5 pb-12 z-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(26,79,186,0.15)] border border-gray-100 p-8">
          <div className="space-y-8 animate-fade-in py-2">
            <Suspense fallback={<div>Loading...</div>}>
              <OTPForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
