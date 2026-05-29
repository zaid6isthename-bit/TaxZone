"use client";

import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Mail, Phone, Lock, ChevronRight, CheckCircle2, ShieldCheck, ArrowLeft, Smartphone } from "lucide-react";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [signInMethod, setSignInMethod] = useState<"choose" | "otp" | "email">("choose");
  const [phase, setPhase] = useState<"entry" | "otp-verify">("entry");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPhase("otp-verify");
      toast.success("OTP sent to +91 " + phone);
    }, 1200);
  };

  const handleVerifyOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuth({
        id: "c1",
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+91 " + phone,
        role: 'client',
        isFirstLogin: false
      }, "prod_token_client_123", "refresh_token_789");
      router.push("/");
      toast.success("Login Successful");
    }, 1500);
  };

  const handleAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuth({
        id: "a1",
        name: "Admin User",
        email: "admin@taxzone.in",
        phone: "+91 9000000000",
        role: 'org_admin',
        isFirstLogin: false
      }, "prod_token_admin_456", "refresh_token_admin_999");
      router.push("/admin");
      toast.success("Secure Admin Access Granted");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Dynamic Background Header */}
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
          <p className="text-white/60 font-body text-sm mt-1 uppercase tracking-[0.2em] font-bold">Production Ready</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 -mt-12 px-5 pb-12 z-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(26,79,186,0.15)] border border-gray-100 overflow-hidden animate-slide-up">
          <Tabs.Root value={activeTab} onValueChange={(v) => { setActiveTab(v); setPhase("entry"); setSignInMethod("choose"); }}>
            <Tabs.List className="flex border-b border-gray-100 h-16 bg-gray-50/50">
              <Tabs.Trigger
                value="signin"
                className={cn(
                  "flex-1 text-sm font-bold font-display transition-all relative flex items-center justify-center gap-2",
                  activeTab === "signin" ? "text-brand-primary" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {activeTab === "signin" && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                Sign In
                {activeTab === "signin" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full mx-10" />}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="signup"
                className={cn(
                  "flex-1 text-sm font-bold font-display transition-all relative flex items-center justify-center gap-2",
                  activeTab === "signup" ? "text-brand-primary" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {activeTab === "signup" && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
                New Account
                {activeTab === "signup" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full mx-10" />}
              </Tabs.Trigger>
            </Tabs.List>

            <div className="p-8">
              <Tabs.Content value="signin" className="space-y-6 focus:outline-none">
                {phase === "entry" ? (
                  <>
                    {signInMethod === "choose" && (
                      <div className="space-y-4 py-2">
                        <div
                          onClick={() => setSignInMethod("otp")}
                          className="group p-5 rounded-[20px] border-2 border-brand-primary/10 bg-brand-primary-light/20 cursor-pointer hover:bg-brand-primary-light/40 hover:border-brand-primary/30 transition-all active:scale-[0.98] relative"
                        >
                          <div className="absolute -top-3 right-6 px-3 py-1 bg-brand-primary text-white text-[10px] font-extrabold rounded-full shadow-lg tracking-wider ring-4 ring-white">CLIENT LOGIN</div>
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-brand-primary ring-1 ring-brand-primary/5 group-hover:scale-110 transition-transform">
                              <Smartphone size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-base font-bold text-brand-primary font-display leading-none">Login with OTP</p>
                              <p className="text-[12px] text-gray-500 font-body mt-2 leading-tight">Secure & passwordless access for taxpayers.</p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => setSignInMethod("email")}
                          className="group p-5 rounded-[20px] border border-gray-100 bg-white cursor-pointer hover:border-brand-primary/20 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary-light group-hover:text-brand-primary transition-colors shadow-inner">
                              <Mail size={24} />
                            </div>
                            <div>
                              <p className="text-base font-bold text-gray-800 font-display leading-none">Admin Portal</p>
                              <p className="text-[12px] text-gray-500 font-body mt-2">Firm management and staff workspace.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {signInMethod === "otp" && (
                      <div className="space-y-8 animate-fade-in">
                        <button onClick={() => setSignInMethod("choose")} className="text-[10px] font-extrabold text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2 group">
                          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                        </button>
                        <div>
                          <h2 className="text-3xl font-bold font-display text-gray-900 tracking-tight">Enter Phone</h2>
                          <p className="text-sm text-gray-500 font-body mt-2">We will verify your identity via a secure OTP.</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-24 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-base font-bold text-gray-600 shadow-inner">+91</div>
                          <TZInput
                            placeholder="Mobile Number"
                            type="tel"
                            className="flex-1 h-14 text-lg font-bold tracking-widest rounded-2xl"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <TZButton onClick={handleSendOTP} loading={isLoading} className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/20">Send Verification Code</TZButton>
                      </div>
                    )}

                    {signInMethod === "email" && (
                      <div className="space-y-8 animate-fade-in">
                        <button onClick={() => setSignInMethod("choose")} className="text-[10px] font-extrabold text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2 group">
                          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                        </button>
                        <div>
                          <h2 className="text-3xl font-bold font-display text-gray-900 tracking-tight">Staff Access</h2>
                          <p className="text-sm text-gray-500 font-body mt-2">Use your firm credentials to sign in.</p>
                        </div>
                        <div className="space-y-4">
                          <TZInput placeholder="Work Email" icon={<Mail size={20} />} className="h-14 rounded-2xl text-base" />
                          <div className="space-y-3">
                            <TZInput placeholder="Password" type="password" icon={<Lock size={20} />} className="h-14 rounded-2xl text-base" />
                            <div className="text-right">
                              <button className="text-[11px] font-bold text-brand-primary uppercase tracking-widest hover:underline">Reset Password</button>
                            </div>
                          </div>
                        </div>
                        <TZButton onClick={handleAdminLogin} loading={isLoading} className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/20">Enter Admin Portal</TZButton>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-8 animate-fade-in py-2">
                    <button onClick={() => setPhase("entry")} className="text-[10px] font-extrabold text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2 group">
                      <ArrowLeft size={14} /> Edit Number
                    </button>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary-light rounded-full mb-6 ring-[12px] ring-brand-primary-light/30">
                        <ShieldCheck size={36} className="text-brand-primary" />
                      </div>
                      <h2 className="text-2xl font-bold font-display text-gray-900 leading-tight">Verify Device</h2>
                      <p className="text-sm text-gray-500 font-body mt-2">6-digit code sent to <span className="font-bold text-gray-900">+91 {phone}</span></p>
                    </div>

                    <div className="flex gap-2.5 justify-center">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input
                          key={i}
                          type="tel"
                          maxLength={1}
                          className="w-12 h-16 text-center text-2xl font-bold font-display border border-gray-100 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all shadow-inner"
                          onChange={(e) => { if(e.target.value && i < 6) (e.target.nextSibling as HTMLElement)?.focus() }}
                        />
                      ))}
                    </div>

                    <div className="space-y-6">
                      <TZButton onClick={handleVerifyOTP} loading={isLoading} className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/20">Verify & Continue</TZButton>
                      <div className="text-center">
                         <button className="text-xs font-bold text-gray-400 font-body">Resend code in <span className="text-brand-primary">0:24</span></button>
                      </div>
                    </div>
                  </div>
                )}
              </Tabs.Content>

              <Tabs.Content value="signup" className="space-y-8 animate-fade-in focus:outline-none py-2">
                <div>
                  <h2 className="text-3xl font-bold font-display text-gray-900 tracking-tight">Create Account</h2>
                  <p className="text-sm text-gray-500 font-body mt-2">Start your compliance journey with TaxZone.</p>
                </div>
                <div className="space-y-5">
                  <TZInput placeholder="Full Legal Name" className="h-14 rounded-2xl text-base" />
                  <div className="flex gap-4">
                    <div className="w-24 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-base font-bold text-gray-600 shadow-inner">+91</div>
                    <TZInput placeholder="Mobile Number" type="tel" className="flex-1 h-14 rounded-2xl text-base" maxLength={10} />
                  </div>
                  <TZInput placeholder="Email Address (optional)" type="email" className="h-14 rounded-2xl text-base" />
                  <div className="p-5 rounded-2xl bg-[#F0F9FF] border border-brand-primary/10 flex gap-4 items-start mt-2">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={16} className="text-brand-primary" /></div>
                    <p className="text-[12px] font-medium text-gray-600 leading-relaxed">Tax reminders and filing status will be delivered via secure channels.</p>
                  </div>
                </div>
                <TZButton className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/20" onClick={() => setActiveTab("signin")}>Complete Registration</TZButton>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>

        <p className="text-center text-[11px] font-bold text-gray-400 mt-12 uppercase tracking-[0.3em] font-display opacity-50">Precision Compliance Platform</p>
      </div>
    </div>
  );
}
