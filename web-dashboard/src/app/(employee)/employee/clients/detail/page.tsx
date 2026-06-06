"use client";

import { use } from "react";
import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZAvatar } from "@/components/ui/avatar";
import { FileText, Phone, Mail, MapPin, Calendar, Upload, Download } from "lucide-react";
import Link from "next/link";

export default function ClientDetailPage() {
  // Using static mock data since static export doesn't support dynamic routes without generateStaticParams
  const clientId = "CL-001";
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <TZAvatar name="Rajesh Kumar" size="xl" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold font-display text-gray-900">Rajesh Kumar</h1>
              <TZBadge variant="success">Active</TZBadge>
            </div>
            <p className="text-gray-500 text-sm">Individual • Client ID: {clientId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <TZButton variant="outline">Edit Profile</TZButton>
          <TZButton>New Filing</TZButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Details */}
        <div className="space-y-6">
          <TZCard className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">+91 98765 43210</p>
                  <p className="text-xs text-gray-500">Primary</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">rajesh.kumar@example.com</p>
                  <p className="text-xs text-gray-500">Personal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">123, Skyline Apartments, Andheri West</p>
                  <p className="text-xs text-gray-500">Mumbai, Maharashtra 400053</p>
                </div>
              </div>
            </div>
          </TZCard>

          <TZCard className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tax Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">PAN</span>
                <span className="text-sm font-medium font-mono text-gray-900">ABCDE1234F</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">Aadhaar</span>
                <span className="text-sm font-medium font-mono text-gray-900">XXXX XXXX 1234</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">GSTIN</span>
                <span className="text-sm font-medium font-mono text-gray-400">Not Applicable</span>
              </div>
            </div>
          </TZCard>
        </div>

        {/* Right Column - Filings & Documents */}
        <div className="lg:col-span-2 space-y-6">
          <TZCard className="p-0">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold font-display text-gray-900">Recent Filings</h3>
              <Link href="#" className="text-sm font-medium text-brand-primary hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: "Income Tax Return (ITR-1)", period: "FY 2023-24", status: "Completed", date: "15 Jul 2024", variant: "success" },
                { name: "Advance Tax Installment", period: "Q2 FY 2024-25", status: "Under Review", date: "10 Sep 2024", variant: "underReview" },
              ].map((filing, i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{filing.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-500">{filing.period}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} /> {filing.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <TZBadge variant={filing.variant as any}>{filing.status}</TZBadge>
                </div>
              ))}
            </div>
          </TZCard>

          <TZCard className="p-0">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold font-display text-gray-900">Documents</h3>
              <TZButton variant="outline" size="sm" className="gap-2 text-xs h-8">
                <Upload size={14} /> Request Document
              </TZButton>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "PAN Card Copy.pdf", size: "2.4 MB", date: "Uploaded 10 May 2023" },
                  { name: "Form 16 - FY23-24.pdf", size: "1.1 MB", date: "Uploaded 15 Jun 2024" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-brand-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-primary-light text-brand-primary rounded-lg">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 group-hover:text-brand-primary transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TZCard>
        </div>
      </div>
    </div>
  );
}
