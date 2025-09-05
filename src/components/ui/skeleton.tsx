import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
      {...props}
    />
  )
}

interface SkeletonCardProps {
  className?: string
  showAvatar?: boolean
  lines?: number
}

function SkeletonCard({ className, showAvatar = false, lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn("p-6 bg-white rounded-2xl border border-slate-200/60", className)}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={cn(
                "h-3",
                i === lines - 1 ? "w-1/2" : "w-full"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface SkeletonListProps {
  items?: number
  className?: string
}

function SkeletonList({ items = 3, className }: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonList }