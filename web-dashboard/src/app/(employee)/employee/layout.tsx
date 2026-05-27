import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar role="employee" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
