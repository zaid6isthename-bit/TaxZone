import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; fallback: string; }
>(({ className, src, fallback, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-gray-100",
      className
    )}
    {...props}
  >
    {src ? (
      <img src={src} alt="Avatar" className="aspect-square h-full w-full object-cover" />
    ) : (
      <span className="font-medium text-gray-600 uppercase tracking-widest">{fallback}</span>
    )}
  </div>
))
Avatar.displayName = "Avatar"

export { Avatar as TZAvatar }
