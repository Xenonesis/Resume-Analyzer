import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "default" | "success" | "warning" | "error" | "gradient"
    showValue?: boolean
    animated?: boolean
  }
>(({ className, value, variant = "default", showValue = false, animated = false, ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500"
      case "warning":
        return "bg-amber-500"
      case "error":
        return "bg-red-500"
      case "gradient":
        return "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      default:
        return "bg-primary-600"
    }
  }

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-slate-200/80 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-700 ease-out",
            getVariantClasses(),
            animated && "animate-pulse"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white drop-shadow-sm">
            {value}%
          </span>
        </div>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }