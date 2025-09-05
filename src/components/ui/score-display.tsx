import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Award, Target, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedCounter } from './animated-counter'
import { Progress } from './progress'
import { Badge } from './badge'

interface ScoreDisplayProps {
  score: number
  maxScore?: number
  title: string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  category?: 'excellent' | 'good' | 'average' | 'poor'
  showProgress?: boolean
  animated?: boolean
  className?: string
  icon?: React.ReactNode
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore = 100,
  title,
  description,
  trend,
  trendValue,
  category,
  showProgress = true,
  animated = true,
  className,
  icon
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const percentage = Math.round((score / maxScore) * 100)
  
  const getScoreCategory = () => {
    if (category) return category
    if (percentage >= 90) return 'excellent'
    if (percentage >= 75) return 'good'
    if (percentage >= 60) return 'average'
    return 'poor'
  }

  const getCategoryConfig = () => {
    const cat = getScoreCategory()
    switch (cat) {
      case 'excellent':
        return {
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          progressVariant: 'success' as const,
          badgeVariant: 'success' as const,
          icon: <Award className="w-5 h-5" />
        }
      case 'good':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          progressVariant: 'default' as const,
          badgeVariant: 'default' as const,
          icon: <Target className="w-5 h-5" />
        }
      case 'average':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          progressVariant: 'warning' as const,
          badgeVariant: 'warning' as const,
          icon: <Zap className="w-5 h-5" />
        }
      case 'poor':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          progressVariant: 'error' as const,
          badgeVariant: 'destructive' as const,
          icon: <TrendingDown className="w-5 h-5" />
        }
    }
  }

  const config = getCategoryConfig()
  const displayIcon = icon || config.icon

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'neutral':
        return <Minus className="w-4 h-4 text-slate-500" />
      default:
        return null
    }
  }

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-6 shadow-soft hover:shadow-lg transition-all duration-500",
      config.borderColor,
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      className
    )}>
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5 transition-opacity duration-300 group-hover:opacity-10",
        config.bgColor
      )} />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            config.bgColor,
            config.color
          )}>
            {displayIcon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Category Badge */}
        <Badge variant={config.badgeVariant} className="capitalize">
          {getScoreCategory()}
        </Badge>
      </div>

      {/* Score Display */}
      <div className="relative z-10 mb-4">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className={cn("text-4xl font-bold", config.color)}>
            {animated ? (
              <AnimatedCounter value={score} duration={1500} />
            ) : (
              score
            )}
          </span>
          <span className="text-xl text-slate-500">/ {maxScore}</span>
          <span className={cn("text-lg font-semibold", config.color)}>
            ({percentage}%)
          </span>
        </div>

        {/* Trend Indicator */}
        {trend && trendValue && (
          <div className="flex items-center space-x-2 text-sm">
            {getTrendIcon()}
            <span className={cn(
              "font-medium",
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-slate-600'
            )}>
              {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
              {trend !== 'neutral' && ' from last analysis'}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="relative z-10">
          <Progress 
            value={isVisible ? percentage : 0} 
            variant={config.progressVariant}
            className="h-3"
            animated={animated}
          />
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden">
        <div className={cn(
          "absolute -top-8 -right-8 w-24 h-24 rounded-full",
          config.bgColor
        )} />
      </div>
    </div>
  )
}

interface ScoreGridProps {
  scores: Array<{
    id: string
    score: number
    maxScore?: number
    title: string
    description?: string
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: number
    category?: 'excellent' | 'good' | 'average' | 'poor'
    icon?: React.ReactNode
  }>
  className?: string
}

export const ScoreGrid: React.FC<ScoreGridProps> = ({ scores, className }) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      className
    )}>
      {scores.map((scoreData, index) => (
        <ScoreDisplay
          key={scoreData.id}
          {...scoreData}
          className={cn("animate-in slide-in-from-bottom-4")}
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}