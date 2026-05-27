import { TZCard } from "@/components/ui/card";
import { Building2, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Practice overview and team performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-brand-primary-light text-brand-primary rounded-lg">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
          </div>
        </TZCard>
        
        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-success-light text-success rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Staff</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </TZCard>

        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-info-light text-info rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Filings YTD</p>
            <p className="text-2xl font-bold text-gray-900">4,820</p>
          </div>
        </TZCard>

        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-danger-light text-danger rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Escalations</p>
            <p className="text-2xl font-bold text-gray-900">5</p>
          </div>
        </TZCard>
      </div>
    </div>
  );
}
