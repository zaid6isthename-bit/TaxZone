"use client";

import * as React from "react";
import { TZAvatar } from "@/components/ui/avatar";
import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { Bell, Settings, Upload, ChevronRight, Calendar, Phone, MessageCircle } from "lucide-react";

export default function ClientDashboard() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      {/* Top AppBar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-gradient-to-r from-brand-primary to-accent-indigo">
            <span className="text-sm font-bold font-display">RK</span>
          </div>
          <span className="text-base font-semibold font-display text-gray-900">Hi, Rajesh 👋</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-1 text-gray-700">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
          </button>
          <button className="p-1 text-gray-700">
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Pending Action Banner */}
      <div className="mx-4 mt-4 mb-2">
        <div className="flex items-center justify-between p-4 border border-brand-primary rounded-xl bg-brand-primary-light animate-pulse-border">
          <div className="flex items-center gap-3">
            <Upload className="text-brand-primary" size={24} />
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">Documents Requested</h3>
              <p className="text-[13px] text-gray-500">3 documents need your attention</p>
            </div>
          </div>
          <ChevronRight className="text-brand-primary" size={20} />
        </div>
      </div>

      {/* Your Filings */}
      <section className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 font-display">Your Filings</h2>
          <button className="text-sm font-medium text-brand-primary">See All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {/* Card 1 */}
          <TZCard className="min-w-[220px] snap-center shrink-0 p-4" interactive>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[11px] font-bold text-brand-primary bg-brand-primary-light rounded-sm">GSTR-1</span>
            </div>
            <h3 className="mb-1 text-[14px] font-semibold text-gray-900">October 2024</h3>
            <TZBadge variant="underReview" className="mb-4">Under Review</TZBadge>
            <div className="w-full h-1 mb-2 bg-gray-200 rounded-full">
              <div className="h-full rounded-full bg-brand-primary w-[60%]"></div>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500">
              <Calendar size={12} />
              <span>Due 31 Oct</span>
            </div>
          </TZCard>

          {/* Card 2 */}
          <TZCard className="min-w-[220px] snap-center shrink-0 p-4" interactive>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[11px] font-bold text-brand-primary bg-brand-primary-light rounded-sm">ITR</span>
            </div>
            <h3 className="mb-1 text-[14px] font-semibold text-gray-900">FY 2024-25</h3>
            <TZBadge variant="inProgress" className="mb-4">In Progress</TZBadge>
            <div className="w-full h-1 mb-2 bg-gray-200 rounded-full">
              <div className="h-full rounded-full bg-brand-primary w-[40%]"></div>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500">
              <Calendar size={12} />
              <span>Due 31 Jul</span>
            </div>
          </TZCard>
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="px-4 mb-6">
        <h2 className="mb-3 text-base font-semibold text-gray-900 font-display">Upcoming Deadlines</h2>
        <div className="flex flex-col gap-3">
          {[
            { date: "31", month: "Oct", title: "GSTR-1 October", status: "Under Review", variant: "underReview" },
            { date: "20", month: "Nov", title: "GSTR-3B November", status: "Not Started", variant: "secondary" },
            { date: "31", month: "Dec", title: "GSTR-9 Annual", status: "Not Started", variant: "secondary" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-11 h-12 bg-brand-primary-light rounded-lg">
                  <span className="text-[18px] font-bold text-brand-primary font-display leading-tight">{item.date}</span>
                  <span className="text-[11px] font-medium text-brand-primary">{item.month}</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <TZBadge variant={item.variant as any}>{item.status}</TZBadge>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          ))}
        </div>
      </section>

      {/* Your CA Team */}
      <section className="px-4 mb-4">
        <TZCard className="p-4">
          <h2 className="mb-3 text-[14px] font-bold text-gray-900 font-display">Your CA Team</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-full">
                <span className="text-sm font-bold font-display">PS</span>
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-gray-900">Priya Sharma</h4>
                <p className="text-[13px] text-gray-500">Tax Associate</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center w-10 h-10 border rounded-full border-brand-primary text-brand-primary hover:bg-brand-primary-light">
                <Phone size={18} />
              </button>
              <button className="flex items-center justify-center w-10 h-10 border rounded-full border-success text-success hover:bg-success-light">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </TZCard>
      </section>

    </div>
  );
}
