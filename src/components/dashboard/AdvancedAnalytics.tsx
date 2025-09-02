import React, { useMemo } from 'react'
import { Resume, getFeedbackScore } from '@/types'
import { TrendingUp, TrendingDown, Target, Award, Zap } from 'lucide-react'

interface AdvancedAnalyticsProps {
  filteredResumes: Resume[]
}

interface ComparisonMetrics {
  currentPeriod: {
    averageScore: number
    totalResumes: number
    topCategory: string
    improvementRate: number
  }
  previousPeriod: {
    averageScore: number
    totalResumes: number
    topCategory: string
    improvementRate: number
  }
  changes: {
    scoreChange: number
    volumeChange: number
    categoryChange: boolean
    improvementChange: number
  }
}

interface BenchmarkData {
  userAverage: number
  industryBenchmark: number
  topPerformerBenchmark: number
  percentile: number
  categoryBenchmarks: {
    category: string
    userScore: number
    benchmark: number
    percentile: number
  }[]
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  filteredResumes
}) => {
  // Calculate comparison metrics (current vs previous period)
  const comparisonMetrics = useMemo((): ComparisonMetrics => {
    if (filteredResumes.length === 0) {
      return {
        currentPeriod: { averageScore: 0, totalResumes: 0, topCategory: 'N/A', improvementRate: 0 },
        previousPeriod: { averageScore: 0, totalResumes: 0, topCategory: 'N/A', improvementRate: 0 },
        changes: { scoreChange: 0, volumeChange: 0, categoryChange: false, improvementChange: 0 }
      }
    }

    // Split data into two periods
    const midPoint = Math.floor(filteredResumes.length / 2)
    const currentPeriod = filteredResumes.slice(midPoint)
    const previousPeriod = filteredResumes.slice(0, midPoint)

    const calculatePeriodMetrics = (periodResumes: Resume[]) => {
      if (periodResumes.length === 0) {
        return { averageScore: 0, totalResumes: 0, topCategory: 'N/A', improvementRate: 0 }
      }

      const averageScore = periodResumes.reduce((sum, r) => sum + getFeedbackScore(r), 0) / periodResumes.length
      const totalResumes = periodResumes.length

      // Find top category
      const categoryScores = {
        ATS: periodResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'ATS'), 0) / totalResumes,
        content: periodResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'content'), 0) / totalResumes,
        structure: periodResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'structure'), 0) / totalResumes,
        skills: periodResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'skills'), 0) / totalResumes,
        toneAndStyle: periodResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'toneAndStyle'), 0) / totalResumes
      }

      const topCategory = Object.entries(categoryScores).reduce((a, b) => 
        categoryScores[a[0] as keyof typeof categoryScores] > categoryScores[b[0] as keyof typeof categoryScores] ? a : b
      )[0]

      // Calculate improvement rate (percentage of resumes above 80)
      const highScoreCount = periodResumes.filter(r => getFeedbackScore(r) >= 80).length
      const improvementRate = (highScoreCount / totalResumes) * 100

      return { averageScore, totalResumes, topCategory, improvementRate }
    }

    const current = calculatePeriodMetrics(currentPeriod)
    const previous = calculatePeriodMetrics(previousPeriod)

    const changes = {
      scoreChange: current.averageScore - previous.averageScore,
      volumeChange: ((current.totalResumes - previous.totalResumes) / Math.max(previous.totalResumes, 1)) * 100,
      categoryChange: current.topCategory !== previous.topCategory,
      improvementChange: current.improvementRate - previous.improvementRate
    }

    return {
      currentPeriod: current,
      previousPeriod: previous,
      changes
    }
  }, [filteredResumes])

  // Calculate benchmark data (simulated industry benchmarks)
  const benchmarkData = useMemo((): BenchmarkData => {
    if (filteredResumes.length === 0) {
      return {
        userAverage: 0,
        industryBenchmark: 75,
        topPerformerBenchmark: 90,
        percentile: 0,
        categoryBenchmarks: []
      }
    }

    const userAverage = filteredResumes.reduce((sum, r) => sum + getFeedbackScore(r), 0) / filteredResumes.length
    const industryBenchmark = 75 // Simulated industry average
    const topPerformerBenchmark = 90 // Simulated top 10% benchmark

    // Calculate percentile (simplified)
    const percentile = Math.min(Math.max((userAverage / topPerformerBenchmark) * 100, 0), 100)

    // Category benchmarks
    const categories = ['ATS', 'content', 'structure', 'skills', 'toneAndStyle']
    const categoryBenchmarks = categories.map(category => {
      const userScore = filteredResumes.reduce((sum, r) => 
        sum + getFeedbackScore(r, category as keyof typeof r.feedback), 0
      ) / filteredResumes.length

      // Simulated category benchmarks
      const benchmarks: Record<string, number> = {
        ATS: 78,
        content: 82,
        structure: 75,
        skills: 80,
        toneAndStyle: 77
      }

      const benchmark = benchmarks[category] || 75
      const categoryPercentile = Math.min(Math.max((userScore / 95) * 100, 0), 100)

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        userScore,
        benchmark,
        percentile: categoryPercentile
      }
    })

    return {
      userAverage,
      industryBenchmark,
      topPerformerBenchmark,
      percentile,
      categoryBenchmarks
    }
  }, [filteredResumes])

  // Performance insights
  const insights = useMemo(() => {
    const insights: string[] = []

    if (comparisonMetrics.changes.scoreChange > 5) {
      insights.push(`🎉 Great improvement! Your average score increased by ${comparisonMetrics.changes.scoreChange.toFixed(1)} points.`)
    } else if (comparisonMetrics.changes.scoreChange < -5) {
      insights.push(`⚠️ Your average score decreased by ${Math.abs(comparisonMetrics.changes.scoreChange).toFixed(1)} points. Consider reviewing recent changes.`)
    }

    if (benchmarkData.userAverage > benchmarkData.industryBenchmark) {
      insights.push(`🏆 You're performing above industry average by ${(benchmarkData.userAverage - benchmarkData.industryBenchmark).toFixed(1)} points!`)
    }

    if (comparisonMetrics.changes.improvementChange > 10) {
      insights.push(`📈 Excellent! Your high-score rate improved by ${comparisonMetrics.changes.improvementChange.toFixed(1)}%.`)
    }

    if (comparisonMetrics.changes.categoryChange) {
      insights.push(`🔄 Your top performing category changed from ${comparisonMetrics.previousPeriod.topCategory} to ${comparisonMetrics.currentPeriod.topCategory}.`)
    }

    if (benchmarkData.categoryBenchmarks.length > 0) {
      const weakestCategory = benchmarkData.categoryBenchmarks.reduce((min, cat) => 
        cat.userScore < min.userScore ? cat : min
      )
      if (weakestCategory.userScore < weakestCategory.benchmark - 5) {
        insights.push(`💡 Focus on improving ${weakestCategory.category} - it's ${(weakestCategory.benchmark - weakestCategory.userScore).toFixed(1)} points below benchmark.`)
      }
    }

    return insights
  }, [comparisonMetrics, benchmarkData])

  return (
    <div className="space-y-6">
      {/* Performance Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Performance Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {comparisonMetrics.currentPeriod.averageScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Current Period</div>
            <div className={`text-xs mt-1 flex items-center justify-center ${
              comparisonMetrics.changes.scoreChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {comparisonMetrics.changes.scoreChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {comparisonMetrics.changes.scoreChange >= 0 ? '+' : ''}{comparisonMetrics.changes.scoreChange.toFixed(1)}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {comparisonMetrics.previousPeriod.averageScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Previous Period</div>
            <div className="text-xs mt-1 text-gray-500">
              {comparisonMetrics.previousPeriod.totalResumes} resumes
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {comparisonMetrics.currentPeriod.improvementRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">High Score Rate</div>
            <div className={`text-xs mt-1 flex items-center justify-center ${
              comparisonMetrics.changes.improvementChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {comparisonMetrics.changes.improvementChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {comparisonMetrics.changes.improvementChange >= 0 ? '+' : ''}{comparisonMetrics.changes.improvementChange.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Benchmark Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-xl font-bold text-blue-600">
              {benchmarkData.userAverage.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Your Average</div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div className="text-xl font-bold text-orange-600">
              {benchmarkData.industryBenchmark}
            </div>
            <div className="text-sm text-gray-600">Industry Average</div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div className="text-xl font-bold text-green-600">
              {benchmarkData.topPerformerBenchmark}
            </div>
            <div className="text-sm text-gray-600">Top 10%</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Your Percentile</span>
            <span>{benchmarkData.percentile.toFixed(0)}th percentile</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${benchmarkData.percentile}%` }}
            ></div>
          </div>
        </div>

        {/* Category Benchmarks */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Category Benchmarks</h4>
          {benchmarkData.categoryBenchmarks.map((cat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-24">{cat.category}</span>
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(cat.userScore / 100) * 100}%` }}
                    ></div>
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-2 bg-orange-500"
                    style={{ left: `${(cat.benchmark / 100) * 100}%` }}
                    title={`Industry benchmark: ${cat.benchmark}`}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{cat.userScore.toFixed(1)}</div>
                <div className={`text-xs ${
                  cat.userScore >= cat.benchmark ? 'text-green-600' : 'text-red-600'
                }`}>
                  {cat.userScore >= cat.benchmark ? '+' : ''}{(cat.userScore - cat.benchmark).toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          AI Insights & Recommendations
        </h3>
        
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Analyze more resumes to get personalized insights and recommendations.</p>
          </div>
        )}
      </div>
    </div>
  )
}