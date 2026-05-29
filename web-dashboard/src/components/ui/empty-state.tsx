import * as React from "react"
import { TZButton } from "./button"

interface TZEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function TZEmptyState({
  icon,
  title,
  description,
  action,
}: TZEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
      <div className="text-gray-300 mb-5 transform transition-transform duration-500 hover:scale-110">
        {icon}
      </div>
      <h3 className="text-base font-bold font-display text-gray-700">{title}</h3>
      <p className="text-sm font-body text-gray-400 mt-2 max-w-[280px] leading-relaxed">
        {description}
      </p>
      {action && (
        <TZButton size="sm" className="mt-6 shadow-md" onClick={action.onClick}>
          {action.label}
        </TZButton>
      )}
    </div>
  );
}
