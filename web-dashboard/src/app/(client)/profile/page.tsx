"use client";

import { useAuthStore } from "@/lib/store";
import {
  User, Camera, Phone, Mail, CreditCard, Bell,
  Shield, HelpCircle, LogOut, ChevronRight, Settings, ExternalLink
} from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZAvatar } from "@/components/ui/avatar";
import { TZButton } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const sections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Information", desc: "Name, PAN, Aadhar details" },
        { icon: CreditCard, label: "Tax Details", desc: "PAN, GSTIN, IT credentials" },
        { icon: Bell, label: "Notification Preferences", desc: "Push, Email, WhatsApp" },
      ]
    },
    {
      title: "Security",
      items: [
        { icon: Shield, label: "Privacy & Security", desc: "Password, 2FA, sessions" },
        { icon: Settings, label: "Device Settings", desc: "App appearance, biometrics" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", desc: "FAQs, chat support" },
        { icon: ExternalLink, label: "Rate TaxZone", desc: "Tell us what you think" },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-gray-50 animate-fade-in">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-br from-brand-gradient-start to-brand-gradient-end px-5 pt-16 pb-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-black/5 blur-3xl" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group">
            <TZAvatar name={user?.name || "Client"} size="xl" className="ring-4 ring-white/20 shadow-xl transition-transform duration-300 group-hover:scale-105" />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 transition-all active:scale-90">
              <Camera className="w-4 h-4 text-brand-primary" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display tracking-tight leading-tight">
              {user?.name || "Client"}
            </h1>
            <p className="text-white/70 text-sm font-medium font-body mt-0.5">
              {user?.businessName || "Individual"}
            </p>
            {user?.gstin && (
              <div className="mt-2.5 inline-flex items-center px-2 py-0.5 bg-white/10 border border-white/20 rounded-md">
                <span className="text-[10px] font-mono font-bold text-white/90 uppercase tracking-widest">{user.gstin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="px-5 -mt-6 space-y-6 relative z-20 pb-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="px-1 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] font-display">
              {section.title}
            </h2>
            <TZCard className="divide-y divide-gray-50 border-none shadow-md shadow-black/5 overflow-hidden">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center w-full gap-4 px-4 py-4 text-left hover:bg-gray-50 transition-all active:bg-gray-100 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 transition-colors group-hover:bg-brand-primary-light group-hover:text-brand-primary shrink-0 shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-gray-900 font-display leading-tight">{item.label}</p>
                    <p className="text-[12px] font-medium text-gray-400 font-body mt-1 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </TZCard>
          </div>
        ))}

        {/* Danger Actions */}
        <div className="pt-2">
          <TZButton
            variant="danger"
            className="w-full h-14 rounded-2xl gap-3 font-bold text-base shadow-xl shadow-danger/10"
            onClick={handleLogout}
          >
            <LogOut size={20} strokeWidth={2.5} />
            Sign Out
          </TZButton>

          <p className="text-center text-[10px] font-bold text-gray-400 mt-8 uppercase tracking-[0.2em] font-display">
            TaxZone v1.0.0 • PROD BUILD
          </p>
        </div>
      </div>
    </div>
  );
}
