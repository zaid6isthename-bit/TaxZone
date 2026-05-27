"use client";

import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { ChevronRight, User, Mail, Phone, Bell, Shield, LogOut, HelpCircle, FileText, CreditCard } from "lucide-react";

const profileSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Personal Information", desc: "Name, PAN, Aadhar details" },
      { icon: CreditCard, label: "Tax Details", desc: "PAN, GSTIN, IT credentials" },
      { icon: FileText, label: "Filing History", desc: "All past tax filings" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", desc: "Email, SMS, push alerts" },
      { icon: Shield, label: "Privacy & Security", desc: "Password, 2FA, sessions" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", desc: "FAQs, chat support" },
      { icon: Mail, label: "Contact CA Firm", desc: "Get in touch directly" },
    ],
  },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-bold font-display text-gray-900">Profile</h1>
      </header>

      {/* Profile hero card */}
      <div className="mx-4 mt-5">
        <TZCard className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-accent-indigo">
              <span className="text-xl font-bold text-white font-display">RK</span>
            </div>
            <div>
              <h2 className="text-[18px] font-bold font-display text-gray-900">Rajesh Kumar</h2>
              <p className="text-[13px] text-gray-500">Individual Client</p>
              <TZBadge variant="success" className="mt-1 text-[10px]">Verified</TZBadge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-[13px] text-gray-600">
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">rajesh@example.com</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-gray-600">
              <Phone size={14} className="text-gray-400" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </TZCard>
      </div>

      {/* Settings Sections */}
      <div className="px-4 mt-5 space-y-5">
        {profileSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1">{section.title}</h3>
            <TZCard className="overflow-hidden divide-y divide-gray-100">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center w-full gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg shrink-0">
                    <item.icon size={18} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-gray-900">{item.label}</p>
                    <p className="text-[12px] text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </TZCard>
          </div>
        ))}

        {/* Sign Out */}
        <TZButton variant="danger" className="w-full h-12 gap-2">
          <LogOut size={18} />
          Sign Out
        </TZButton>

        <p className="text-center text-[11px] text-gray-400 pb-2">TaxZone v1.0.0 • Built with ❤️ in India</p>
      </div>
    </div>
  );
}
