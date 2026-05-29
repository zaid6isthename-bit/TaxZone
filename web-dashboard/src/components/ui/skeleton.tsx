import { cn } from "@/lib/utils"

function TZSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-gray-200 rounded-lg animate-progress-flow bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  )
}

export { TZSkeleton }
