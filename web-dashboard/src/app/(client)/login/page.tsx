"use client";

import { useState } from "react";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top brand strip */}
      <div className="flex items-center justify-center pt-16 pb-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-brand-primary rounded-2xl shadow-md">
            <span className="text-2xl font-bold text-white font-display">TZ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your TaxZone account</p>
        </div>
      </div>

      <div className="flex-1 px-6 space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <TZInput
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={17} />}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-brand-primary">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <TZInput
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock size={17} />}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <TZButton
          className="w-full h-12 text-base"
          loading={isLoading}
          onClick={handleLogin}
        >
          Sign In
        </TZButton>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-medium text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <TZButton variant="outline" className="w-full h-12 text-base">
          Login with OTP
        </TZButton>
      </div>

      <div className="px-6 pb-10 pt-6 text-center">
        <p className="text-sm text-gray-500">
          New client?{" "}
          <span className="font-medium text-brand-primary">Contact your CA to get started.</span>
        </p>
      </div>
    </div>
  );
}
