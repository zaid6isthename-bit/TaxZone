"use client";

import { TZCard } from "@/components/ui/card";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { User, Bell, Shield, Database, Building, CreditCard, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage firm settings, branding, and billing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-1">
          {[
            { id: "general", label: "General", icon: Building, active: true },
            { id: "security", label: "Security & Auth", icon: Shield, active: false },
            { id: "notifications", label: "Notifications", icon: Bell, active: false },
            { id: "data", label: "Data Management", icon: Database, active: false },
            { id: "billing", label: "Billing & Plans", icon: CreditCard, active: false },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab.active 
                  ? "bg-brand-primary-light text-brand-primary" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <TZCard className="p-6">
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">Firm Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Firm Name</label>
                  <TZInput defaultValue="TaxZone Associates" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Registration Number</label>
                  <TZInput defaultValue="FRN-123456" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Support Email</label>
                <TZInput defaultValue="support@taxzone.in" type="email" />
              </div>
            </div>
          </TZCard>

          <TZCard className="p-6">
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-4">Branding</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-24 h-24 bg-brand-primary rounded-xl text-white font-display text-3xl font-bold shadow-md">
                TZ
              </div>
              <div className="space-y-2">
                <TZButton variant="outline" className="h-9">Upload Logo</TZButton>
                <p className="text-xs text-gray-500 max-w-[200px]">Recommended size: 256x256px. Max file size: 2MB.</p>
              </div>
            </div>
          </TZCard>
          
          <div className="flex justify-end pt-4">
            <TZButton className="gap-2 px-6">
              <Save size={16} /> Save Changes
            </TZButton>
          </div>
        </div>
      </div>
    </div>
  );
}
