"use client";

import { useState } from "react";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:bg-white md:items-center md:justify-center">
      <div className="w-full max-w-md bg-white md:rounded-2xl md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        {/* Top brand strip */}
        <div className="flex flex-col items-center justify-center pt-16 pb-10 md:pt-12">
          <div className="text-center">
            {/* Logo with Gradient - Exactly as in Stitch design */}
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-brand-primary to-accent-indigo rounded-[20px] shadow-lg shadow-brand-primary/20 transition-transform hover:scale-105 duration-300">
              <span className="text-3xl font-extrabold text-white font-display">TZ</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to your TaxZone account</p>
          </div>
        </div>

        <div className="px-6 pb-12 space-y-6">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 font-display">Email address</label>
            <TZInput
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={17} />}
              className="h-12 border-gray-200 focus:border-brand-primary"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-gray-700 font-display">Password</label>
              <Link href="#" className="text-xs font-semibold text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <TZInput
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock size={17} />}
                className="h-12 pr-10 border-gray-200 focus:border-brand-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <TZButton
            className="w-full h-12 text-base font-bold shadow-md shadow-brand-primary/20"
            loading={isLoading}
            onClick={handleLogin}
          >
            Sign In
          </TZButton>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <TZButton variant="secondary" className="w-full h-12 text-base font-bold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Login with OTP
          </TZButton>

          <div className="pt-4 text-center">
            <p className="text-sm text-gray-500">
              New client?{" "}
              <span className="font-bold text-brand-primary cursor-pointer hover:underline">Contact your CA to get started.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
