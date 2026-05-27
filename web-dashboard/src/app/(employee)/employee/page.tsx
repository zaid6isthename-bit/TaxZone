import { TZCard } from "@/components/ui/card";
import { Users, FileText, CheckSquare, Clock } from "lucide-react";

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Priya. Here's your overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-brand-primary-light text-brand-primary rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">124</p>
          </div>
        </TZCard>
        
        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-success-light text-success rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Filings Done (This Month)</p>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>
        </TZCard>

        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-warning-light text-warning rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Filings</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </TZCard>

        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-danger-light text-danger rounded-lg">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Overdue Tasks</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </TZCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TZCard className="h-96 p-5">
            <h3 className="text-lg font-semibold font-display mb-4">Recent Filings</h3>
            <div className="flex items-center justify-center h-[calc(100%-2rem)] text-gray-400">
              Chart / Table will go here
            </div>
          </TZCard>
        </div>
        <div>
          <TZCard className="h-96 p-5">
            <h3 className="text-lg font-semibold font-display mb-4">Upcoming Deadlines</h3>
            <div className="flex items-center justify-center h-[calc(100%-2rem)] text-gray-400">
              List will go here
            </div>
          </TZCard>
        </div>
      </div>
    </div>
  );
}
