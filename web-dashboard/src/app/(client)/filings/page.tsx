"use client";

import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { ChevronRight, Search, Calendar, Filter, FileText } from "lucide-react";
import Link from "next/link";

const filings = [
  {
    type: "GSTR-1",
    period: "October 2024",
    dueDate: "31 Oct 2024",
    status: "Under Review",
    progress: 60,
    variant: "underReview",
  },
  {
    type: "GSTR-3B",
    period: "October 2024",
    dueDate: "20 Nov 2024",
    status: "Not Started",
    progress: 0,
    variant: "secondary",
  },
  {
    type: "ITR-1",
    period: "FY 2024-25",
    dueDate: "31 Jul 2025",
    status: "In Progress",
    progress: 40,
    variant: "inProgress",
  },
  {
    type: "GSTR-9",
    period: "Annual FY 2023-24",
    dueDate: "31 Dec 2024",
    status: "Not Started",
    progress: 0,
    variant: "secondary",
  },
  {
    type: "TDS Return",
    period: "Q2 FY 2024-25",
    dueDate: "15 Oct 2024",
    status: "Completed",
    progress: 100,
    variant: "completed",
  },
];

export default function FilingsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-bold font-display text-gray-900 mb-3">My Filings</h1>
        <TZInput
          placeholder="Search filings..."
          icon={<Search size={17} />}
          className="bg-gray-50"
        />
      </header>

      <div className="flex gap-2 p-4 overflow-x-auto">
        {["All", "In Progress", "Under Review", "Completed", "Not Started"].map((f) => (
          <button
            key={f}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
              f === "All"
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-brand-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {filings.map((filing, i) => (
          <TZCard key={i} className="p-4" interactive>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-primary-light rounded-lg text-brand-primary">
                  <FileText size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded-sm">
                    {filing.type}
                  </span>
                  <h3 className="mt-1 text-[15px] font-semibold text-gray-900">{filing.period}</h3>
                </div>
              </div>
              <TZBadge variant={filing.variant as any}>{filing.status}</TZBadge>
            </div>

            {filing.progress > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-500">Progress</span>
                  <span className="text-[11px] font-medium text-brand-primary">{filing.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all"
                    style={{ width: `${filing.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <Calendar size={13} />
                <span>Due {filing.dueDate}</span>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
          </TZCard>
        ))}
      </div>
    </div>
  );
}
