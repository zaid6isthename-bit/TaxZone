"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZAvatar } from "@/components/ui/avatar";
import { TZSkeleton } from "@/components/ui/skeleton";
import { FileText, Phone, Mail, Calendar, Upload } from "lucide-react";
import Link from "next/link";
import { clientsService, Client } from "@/services/clients";
import { filingsService, Filing } from "@/services/filings";

function ClientDetailContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id') || '';

  const { data: client, isLoading } = useQuery({
    queryKey: ['client-detail', clientId],
    queryFn: () => clientsService.getById(clientId),
    enabled: !!clientId,
  });

  const { data: filingsData } = useQuery({
    queryKey: ['client-filings', clientId],
    queryFn: () => filingsService.list({ clientId }),
    enabled: !!clientId,
  });

  const filings: Filing[] = filingsData?.data || [];

  if (isLoading) {
    return <div className="space-y-6"><TZSkeleton className="h-48 w-full" /><TZSkeleton className="h-64 w-full" /></div>;
  }

  if (!client) {
    return <p className="text-center py-12 text-gray-400">Client not found</p>;
  }

  const statusVariant = client.onboardingStatus === 'active' ? 'success' : client.onboardingStatus === 'onboarding' ? 'warning' : 'secondary';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <TZAvatar name={client.displayName} size="xl" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold font-display text-gray-900">{client.displayName}</h1>
              <TZBadge variant={statusVariant}>{client.onboardingStatus}</TZBadge>
            </div>
            <p className="text-gray-500 text-sm">{client.businessType} • {client.clientUser?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <TZButton variant="outline">Edit Profile</TZButton>
          <TZButton>New Filing</TZButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <TZCard className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact Information</h3>
            <div className="space-y-4">
              {client.clientUser?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.clientUser.phone}</p>
                    <p className="text-xs text-gray-500">Primary</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{client.clientUser?.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
            </div>
          </TZCard>

          <TZCard className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tax Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">PAN</span>
                <span className="text-sm font-medium font-mono text-gray-900">{client.pan || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">GSTIN</span>
                <span className="text-sm font-medium font-mono text-gray-900">{client.gstin || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Assigned Employee</span>
                <span className="text-sm font-medium text-gray-900">{client.assignedEmployee?.name || 'Unassigned'}</span>
              </div>
            </div>
          </TZCard>

          {client.assignedEmployee && (
            <TZCard className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Assigned CA</h3>
              <div className="flex items-center gap-3">
                <TZAvatar name={client.assignedEmployee.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{client.assignedEmployee.name}</p>
                  <p className="text-xs text-gray-500">{client.assignedEmployee.email}</p>
                </div>
              </div>
            </TZCard>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <TZCard className="p-0">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold font-display text-gray-900">Recent Filings</h3>
              <Link href="#" className="text-sm font-medium text-brand-primary hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {filings.length === 0 ? (
                <p className="p-5 text-gray-400 text-sm">No filings yet</p>
              ) : filings.slice(0, 5).map((filing) => (
                <div key={filing.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><FileText size={20} /></div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{filing.category}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-500">{new Date(filing.periodStart).toLocaleDateString()} - {new Date(filing.periodEnd).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> {new Date(filing.dueAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <TZBadge variant={filing.status === 'completed' ? 'success' : filing.status === 'in_progress' ? 'inProgress' : 'secondary'}>{filing.status.replace(/_/g, ' ')}</TZBadge>
                </div>
              ))}
            </div>
          </TZCard>

          <TZCard className="p-0">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold font-display text-gray-900">Documents</h3>
              <TZButton variant="outline" size="sm" className="gap-2 text-xs h-8"><Upload size={14} /> Request Document</TZButton>
            </div>
            <div className="p-5">
              {(client as any).documents?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(client as any).documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-brand-primary/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary-light text-brand-primary rounded-lg"><FileText size={16} /></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{doc.originalFilename}</p>
                          <p className="text-xs text-gray-500">{doc.mimeType}</p>
                        </div>
                      </div>
                      <TZBadge variant={doc.verificationStatus === 'approved' ? 'success' : 'warning'} className="text-[10px]">{doc.verificationStatus}</TZBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">No documents uploaded</p>
              )}
            </div>
          </TZCard>
        </div>
      </div>
    </div>
  );
}

export default function ClientDetailPage() {
  return (
    <Suspense fallback={<div className="p-8"><TZSkeleton className="h-96 w-full" /></div>}>
      <ClientDetailContent />
    </Suspense>
  );
}
