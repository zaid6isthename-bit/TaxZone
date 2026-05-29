"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Mail, Phone, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [signInMethod, setSignInMethod] = useState<"choose" | "otp" | "email">("choose");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Gradient Panel */}
      <div className="h-[42vh] w-full bg-gradient-to-br from-brand-gradient-start to-brand-gradient-end flex flex-col items-center justify-center text-white px-6">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <span className="text-3xl font-extrabold font-display">TZ</span>
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight">TaxZone</h1>
        <p className="text-white/80 font-body text-sm mt-1">India's CA Practice Platform</p>
      </div>

      {/* White Auth Card */}
      <div className="flex-1 -mt-10 px-4 pb-10">
        <div className="w-full max-w-md mx-auto bg-white rounded-[24px] shadow-2xl shadow-brand-primary/10 overflow-hidden animate-slide-up">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-gray-100 h-14">
              <Tabs.Trigger
                value="signin"
                className={cn(
                  "flex-1 text-sm font-bold font-display transition-all relative",
                  activeTab === "signin" ? "text-brand-primary" : "text-gray-400"
                )}
              >
                Sign In
                {activeTab === "signin" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full mx-8" />}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="signup"
                className={cn(
                  "flex-1 text-sm font-bold font-display transition-all relative",
                  activeTab === "signup" ? "text-brand-primary" : "text-gray-400"
                )}
              >
                Sign Up
                {activeTab === "signup" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full mx-8" />}
              </Tabs.Trigger>
            </Tabs.List>

            <div className="p-6">
              <Tabs.Content value="signin" className="space-y-6 animate-fade-in">
                {signInMethod === "choose" && (
                  <div className="space-y-4">
                    <div
                      onClick={() => setSignInMethod("otp")}
                      className="group p-4 rounded-xl border-1.5 border-brand-primary bg-brand-primary-light/50 cursor-pointer hover:bg-brand-primary-light transition-all active:scale-[0.98] relative"
                    >
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-brand-primary text-white text-[9px] font-bold rounded-full">RECOMMENDED</div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-primary">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-primary">Login with OTP</p>
                          <p className="text-xs text-gray-500 font-body">No password needed. We'll send a code.</p>
                        </div>
                        <ChevronRight className="ml-auto text-brand-primary group-hover:translate-x-1 transition-transform" size={18} />
                      </div>
                    </div>

                    <div
                      onClick={() => setSignInMethod("email")}
                      className="group p-4 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-brand-primary/30 hover:bg-gray-50 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">Login with Email</p>
                          <p className="text-xs text-gray-500 font-body">For employees and admins.</p>
                        </div>
                        <ChevronRight className="ml-auto text-gray-300 group-hover:translate-x-1 transition-transform" size={18} />
                      </div>
                    </div>
                  </div>
                )}

                {signInMethod === "otp" && (
                  <div className="space-y-6 animate-fade-in">
                    <button onClick={() => setSignInMethod("choose")} className="text-xs font-bold text-brand-primary flex items-center gap-1">← Back</button>
                    <div>
                      <h2 className="text-xl font-bold font-display text-gray-900">Enter your mobile number</h2>
                      <p className="text-sm text-gray-500 font-body mt-1">We'll send a 6-digit OTP via SMS and WhatsApp.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-11 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-bold text-gray-500">+91</div>
                      <TZInput placeholder="10-digit number" type="tel" className="flex-1" />
                    </div>
                    <TZButton onClick={handleLogin} loading={isLoading} className="w-full">Send OTP</TZButton>
                  </div>
                )}

                {signInMethod === "email" && (
                  <div className="space-y-6 animate-fade-in">
                    <button onClick={() => setSignInMethod("choose")} className="text-xs font-bold text-brand-primary flex items-center gap-1">← Back</button>
                    <div>
                      <h2 className="text-xl font-bold font-display text-gray-900">Sign in with Email</h2>
                      <p className="text-sm text-gray-500 font-body mt-1">For employees and admin portals.</p>
                    </div>
                    <div className="space-y-4">
                      <TZInput placeholder="Email or Phone" icon={<Mail size={16} />} />
                      <div className="space-y-1">
                        <TZInput placeholder="Password" type="password" icon={<Lock size={16} />} />
                        <div className="text-right">
                          <button className="text-[11px] font-bold text-brand-primary">Forgot Password?</button>
                        </div>
                      </div>
                    </div>
                    <TZButton onClick={handleLogin} loading={isLoading} className="w-full">Sign In</TZButton>
                  </div>
                )}
              </Tabs.Content>

              <Tabs.Content value="signup" className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold font-display text-gray-900">Create your account</h2>
                  <p className="text-sm text-gray-500 font-body mt-1">Register as a TaxZone client.</p>
                </div>
                <div className="space-y-4">
                  <TZInput placeholder="Full Name" />
                  <div className="flex gap-2">
                    <div className="w-16 h-11 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-bold text-gray-500">+91</div>
                    <TZInput placeholder="Mobile Number" type="tel" className="flex-1" />
                  </div>
                  <TZInput placeholder="Email Address (optional)" type="email" />
                </div>
                <TZButton className="w-full" onClick={handleLogin}>Continue →</TZButton>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
