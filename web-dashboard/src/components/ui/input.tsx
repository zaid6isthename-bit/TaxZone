import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <div className="relative flex w-full items-center">
          {icon && (
            <div className="absolute left-3.5 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm font-body text-gray-900 transition-all duration-200",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-11" : "pl-4",
              error ? "border-danger" : "border-gray-200",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[11px] font-medium text-danger pl-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input as TZInput }
