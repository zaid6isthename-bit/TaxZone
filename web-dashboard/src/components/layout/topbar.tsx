import { Bell, Search } from "lucide-react";
import { TZAvatar } from "@/components/ui/avatar";
import { TZInput } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center w-96">
        <TZInput 
          placeholder="Search clients, filings, tasks..." 
          icon={<Search size={18} />}
          className="bg-gray-50 border-gray-200"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900">Priya Sharma</p>
            <p className="text-xs text-gray-500">Tax Associate</p>
          </div>
          <div className="flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full">
            <span className="text-xs font-bold font-display">PS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
