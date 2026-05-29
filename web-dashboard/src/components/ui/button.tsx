import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type TZButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
type TZButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const VARIANT_CLASSES: Record<TZButtonVariant, string> = {
  primary:   'bg-brand-primary text-white hover:bg-brand-primary-hover active:scale-[0.98] shadow-sm',
  secondary: 'bg-brand-primary-light text-brand-primary hover:bg-brand-primary hover:text-white',
  outline:   'border border-gray-200 text-gray-700 hover:bg-gray-50',
  ghost:     'text-gray-600 hover:bg-gray-100',
  danger:    'bg-danger text-white hover:bg-red-700 active:scale-[0.98] shadow-sm',
  link:      'text-brand-primary hover:underline p-0 h-auto',
};

const SIZE_CLASSES: Record<TZButtonSize, string> = {
  xs: 'h-7  px-2.5 text-xs rounded-lg',
  sm: 'h-8  px-3   text-sm rounded-lg',
  md: 'h-10 px-4   text-sm rounded-xl',
  lg: 'h-11 px-5   text-base rounded-xl',
  xl: 'h-12 px-6   text-base rounded-xl',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  loading?: boolean
  variant?: TZButtonVariant
  size?: TZButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 disabled:pointer-events-none disabled:opacity-50",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {size !== 'xs' && <span>Loading...</span>}
          </div>
        ) : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button as TZButton }
