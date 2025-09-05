import React from 'react'
import { TrendingUp, TrendingDown, Minus, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedCounter } from './animated-counter'
import { Card, CardContent } from './card'

interface StatsCardProps {
  title: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  changeLabel?: string
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  format?: 'number' | 'percentage' | 'currency' | 'text'
  animated?: boolean
  className?: string
  onClick?: () => void
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  changeLabel = 'vs last period',
  icon,
  color = 'blue',
  format = 'number',
  animated = true,
  className,
  onClick
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          accent: 'border-emerald-200'
        }
      case 'purple':
        return {
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          accent: 'border-purple-200'
        }
      case 'orange':
        return {
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          accent: 'border-orange-200'
        }
      case 'red':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          accent: 'border-red-200'
        }
      default:
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          accent: 'border-blue-200'
        }
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-slate-500" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-emerald-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'percentage':
        return `${val}%`
      case 'currency':
        return `$${val.toLocaleString()}`
      case 'number':
        return val.toLocaleString()
      default:
        return val
    }
  }

  const colorClasses = getColorClasses()

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-xl",
        colorClasses.accent,
        onClick && "hover:scale-102",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              {icon && (
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                  colorClasses.iconBg,
                  colorClasses.iconColor
                )}>
                  {icon}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">
                {animated && typeof value === 'number' ? (
                  <AnimatedCounter 
                    value={value} 
                    duration={1500}
                    prefix={format === 'currency' ? '$' : ''}
                    suffix={format === 'percentage' ? '%' : ''}
                  />
                ) : (
                  formatValue(value)
                )}
              </div>

              {change !== undefined && (
                <div className="flex items-center space-x-2 text-sm">
                  {getChangeIcon()}
                  <span className={cn("font-medium", getChangeColor())}>
                    {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}
                    {Math.abs(change)}
                    {format === 'percentage' ? 'pp' : '%'}
                  </span>
                  <span className="text-slate-500">{changeLabel}</span>
                </div>
              )}
            </div>
          </div>

          {onClick && (
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Decorative gradient */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40",
          color === 'green' ? 'bg-emerald-500' :
          color === 'purple' ? 'bg-purple-500' :
          color === 'orange' ? 'bg-orange-500' :
          color === 'red' ? 'bg-red-500' :
          'bg-blue-500'
        )} />
      </CardContent>
    </Card>
  )
}

interface StatsGridProps {
  stats: Array<{
    id: string
    title: string
    value: number | string
    change?: number
    changeType?: 'increase' | 'decrease' | 'neutral'
    changeLabel?: string
    icon?: React.ReactNode
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
    format?: 'number' | 'percentage' | 'currency' | 'text'
    onClick?: () => void
  }>
  className?: string
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, className }) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
      className
    )}>
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.id}
          {...stat}
          className={cn("animate-in slide-in-from-bottom-4")}
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}