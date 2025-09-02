import React, { useMemo, useState } from 'react'
import { useResumes } from '@/stores/useAppStore'
import { Feedback, Resume, getFeedbackScore } from '@/types'
import { TrendingUp, FileText, Target, Clock } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { Helmet } from 'react-helmet-async'
import { ProgressChart } from '@/components/dashboard/ProgressChart'
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart'
import { DashboardFilters, FilterOptions } from '@/components/dashboard/DashboardFilters'
import { AdvancedAnalytics } from '@/components/dashboard/AdvancedAnalytics'

interface DashboardStats {
  totalResumes: number
  averageScore: number
  recentAnalyses: number
  topPerformingCategory: string
  improvementTrend: number
}

interface CategoryStats {
  category: string
  averageScore: number
  count: number
  color: string
}

interface ScoreDistribution {
  range: string
  count: number
  percentage: number
}

interface TimeSeriesData {
  date: string
  score: number
  count: number
}

const DashboardPage: React.FC = () => {
  const { items: resumes } = useResumes()

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: null,
      end: null,
      preset: 'all'
    },
    scoreRange: {
      min: 0,
      max: 100
    },
    categories: [],
    companies: [],
    sortBy: 'date',
    sortOrder: 'desc'
  })

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: null,
        end: null,
        preset: 'all'
      },
      scoreRange: {
        min: 0,
        max: 100
      },
      categories: [],
      companies: [],
      sortBy: 'date',
      sortOrder: 'desc'
    })
  }

  // Get available filter options
  const availableCompanies = useMemo(() => {
    const companies = resumes
      .map(r => r.companyName)
      .filter((company): company is string => Boolean(company))
    return [...new Set(companies)]
  }, [resumes])

  const availableCategories = useMemo(() => {
    return ['ATS', 'Content', 'Structure', 'Skills', 'Tone & Style']
  }, [])

  // Apply filters to resumes
  const filteredResumes = useMemo(() => {
    let filtered = [...resumes]

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(resume => {
        const resumeDate = new Date(resume.createdAt)
        return resumeDate >= filters.dateRange.start! && resumeDate <= filters.dateRange.end!
      })
    }

    // Score range filter
    filtered = filtered.filter(resume => {
      const score = getFeedbackScore(resume)
      return score >= filters.scoreRange.min && score <= filters.scoreRange.max
    })

    // Company filter
    if (filters.companies.length > 0) {
      filtered = filtered.filter(resume => 
        resume.companyName && filters.companies.includes(resume.companyName)
      )
    }

    // Category filter (filter by top performing category)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(resume => {
        const categoryScores = {
          ATS: getFeedbackScore(resume, 'ATS'),
          Content: getFeedbackScore(resume, 'content'),
          Structure: getFeedbackScore(resume, 'structure'),
          Skills: getFeedbackScore(resume, 'skills'),
          'Tone & Style': getFeedbackScore(resume, 'toneAndStyle')
        }
        
        const topCategory = Object.entries(categoryScores).reduce((a, b) => 
          categoryScores[a[0] as keyof typeof categoryScores] > categoryScores[b[0] as keyof typeof categoryScores] ? a : b
        )[0]
        
        return filters.categories.includes(topCategory)
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (filters.sortBy) {
        case 'score':
          aValue = getFeedbackScore(a)
          bValue = getFeedbackScore(b)
          break
        case 'company':
          aValue = a.companyName || ''
          bValue = b.companyName || ''
          break
        case 'category':
          const getTopCategory = (resume: Resume) => {
            const categoryScores = {
              ATS: getFeedbackScore(resume, 'ATS'),
              Content: getFeedbackScore(resume, 'content'),
              Structure: getFeedbackScore(resume, 'structure'),
              Skills: getFeedbackScore(resume, 'skills'),
              'Tone & Style': getFeedbackScore(resume, 'toneAndStyle')
            }
            return Object.entries(categoryScores).reduce((a, b) => 
              categoryScores[a[0] as keyof typeof categoryScores] > categoryScores[b[0] as keyof typeof categoryScores] ? a : b
            )[0]
          }
          aValue = getTopCategory(a)
          bValue = getTopCategory(b)
          break
        case 'date':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [resumes, filters])

  // Calculate dashboard statistics
  const dashboardStats = useMemo((): DashboardStats => {
    if (filteredResumes.length === 0) {
      return {
        totalResumes: 0,
        averageScore: 0,
        recentAnalyses: 0,
        topPerformingCategory: 'N/A',
        improvementTrend: 0
      }
    }

    const totalResumes = filteredResumes.length
    const averageScore = filteredResumes.reduce((sum, resume) => sum + getFeedbackScore(resume), 0) / totalResumes
    
    // Recent analyses (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentAnalyses = filteredResumes.filter(resume => new Date(resume.createdAt) >= sevenDaysAgo).length

    // Find top performing category
    const categoryScores = {
      ATS: filteredResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'ATS'), 0) / totalResumes,
      content: filteredResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'content'), 0) / totalResumes,
      structure: filteredResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'structure'), 0) / totalResumes,
      skills: filteredResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'skills'), 0) / totalResumes,
      toneAndStyle: filteredResumes.reduce((sum, r) => sum + getFeedbackScore(r, 'toneAndStyle'), 0) / totalResumes
    }
    
    const topPerformingCategory = Object.entries(categoryScores).reduce((a, b) => 
      categoryScores[a[0] as keyof typeof categoryScores] > categoryScores[b[0] as keyof typeof categoryScores] ? a : b
    )[0]

    // Calculate improvement trend (comparing first half vs second half of resumes)
    const midPoint = Math.floor(totalResumes / 2)
    const firstHalfAvg = filteredResumes.slice(0, midPoint).reduce((sum, r) => sum + getFeedbackScore(r), 0) / midPoint || 0
    const secondHalfAvg = filteredResumes.slice(midPoint).reduce((sum, r) => sum + getFeedbackScore(r), 0) / (totalResumes - midPoint) || 0
    const improvementTrend = secondHalfAvg - firstHalfAvg

    return {
      totalResumes,
      averageScore,
      recentAnalyses,
      topPerformingCategory,
      improvementTrend
    }
  }, [filteredResumes])

  // Calculate category statistics
  const categoryStats = useMemo((): CategoryStats[] => {
    if (filteredResumes.length === 0) return []

    const categories = [
      { key: 'ATS', label: 'ATS Compatibility', color: 'bg-blue-500' },
      { key: 'content', label: 'Content Quality', color: 'bg-green-500' },
      { key: 'structure', label: 'Structure', color: 'bg-purple-500' },
      { key: 'skills', label: 'Skills', color: 'bg-orange-500' },
      { key: 'toneAndStyle', label: 'Tone & Style', color: 'bg-pink-500' }
    ]

    return categories.map(cat => ({
      category: cat.label,
      averageScore: filteredResumes.reduce((sum, resume) => 
        sum + getFeedbackScore(resume, cat.key as keyof Feedback), 0
      ) / filteredResumes.length,
      count: filteredResumes.length,
      color: cat.color
    }))
  }, [filteredResumes])

  // Calculate score distribution
  const scoreDistribution = useMemo((): ScoreDistribution[] => {
    if (filteredResumes.length === 0) return []

    const ranges = [
      { range: '0-20', min: 0, max: 20 },
      { range: '21-40', min: 21, max: 40 },
      { range: '41-60', min: 41, max: 60 },
      { range: '61-80', min: 61, max: 80 },
      { range: '81-100', min: 81, max: 100 }
    ]

    return ranges.map(range => {
      const count = filteredResumes.filter(resume => {
        const score = getFeedbackScore(resume)
        return score >= range.min && score <= range.max
      }).length
      
      return {
        range: range.range,
        count,
        percentage: (count / filteredResumes.length) * 100
      }
    })
  }, [filteredResumes])

  // Calculate time series data (last 30 days)
  const timeSeriesData = useMemo((): TimeSeriesData[] => {
    if (filteredResumes.length === 0) return []

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentResumes = filteredResumes.filter(resume => new Date(resume.createdAt) >= thirtyDaysAgo)
    
    // Group by date
    const groupedByDate = recentResumes.reduce((acc, resume) => {
      const date = new Date(resume.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { scores: [], count: 0 }
      }
      acc[date].scores.push(getFeedbackScore(resume))
      acc[date].count++
      return acc
    }, {} as Record<string, { scores: number[], count: number }>)

    return Object.entries(groupedByDate).map(([date, data]) => ({
      date,
      score: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
      count: data.count
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filteredResumes])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Helmet>
        <title>Resume Analytics Dashboard - AI Resume Analyzer</title>
        <meta name="description" content="Monitor and analyze your resume performance metrics. Track improvements over time and identify areas for enhancement." />
        <meta property="og:title" content="Resume Analytics Dashboard - AI Resume Analyzer" />
        <meta property="og:description" content="Monitor and analyze your resume performance metrics. Track improvements over time and identify areas for enhancement." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Resume Analytics Dashboard - AI Resume Analyzer" />
        <meta name="twitter:description" content="Monitor and analyze your resume performance metrics. Track improvements over time and identify areas for enhancement." />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor and analyze resume performance metrics</p>
        </div>

        {/* Filters */}
        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableCompanies={availableCompanies}
          availableCategories={availableCategories}
          onReset={resetFilters}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Resumes"
            value={dashboardStats.totalResumes}
            icon={FileText}
            iconColor="text-blue-500"
          />
          
          <MetricCard
            title="Average Score"
            value={dashboardStats.averageScore.toFixed(1)}
            icon={Target}
            iconColor="text-green-500"
          />
          
          <MetricCard
            title="Recent Analyses"
            value={dashboardStats.recentAnalyses}
            subtitle="Last 7 days"
            icon={Clock}
            iconColor="text-purple-500"
          />
          
          <MetricCard
            title="Improvement Trend"
            value={`${dashboardStats.improvementTrend >= 0 ? '+' : ''}${dashboardStats.improvementTrend.toFixed(1)}`}
            icon={TrendingUp}
            iconColor={dashboardStats.improvementTrend >= 0 ? 'text-green-500' : 'text-red-500'}
            trend={{
              value: Math.abs(dashboardStats.improvementTrend),
              isPositive: dashboardStats.improvementTrend >= 0
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Performance Chart */}
          <ProgressChart
            title="Category Performance"
            data={categoryStats.map(stat => ({
              label: stat.category,
              value: stat.averageScore,
              color: stat.color,
              maxValue: 100
            }))}
            showValues={true}
          />

          {/* Score Distribution */}
          <ProgressChart
            title="Score Distribution"
            data={scoreDistribution.map((dist, index) => {
              const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500']
              return {
                label: `${dist.range} points`,
                value: dist.count,
                color: colors[index] || 'bg-gray-500',
                maxValue: Math.max(...scoreDistribution.map(d => d.count))
              }
            })}
            showValues={true}
          />
        </div>

        {/* Time Series Chart */}
        <div className="mb-8">
          <TimeSeriesChart
            data={timeSeriesData}
            title="Performance Trend (Last 30 Days)"
            height={280}
          />
        </div>

        {/* Advanced Analytics */}
        <div className="mb-8">
          <AdvancedAnalytics
            filteredResumes={filteredResumes}
          />
        </div>

        {/* Recent Resumes Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
          {filteredResumes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Top Category
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResumes.slice(0, 10).map((resume) => {
                    const topCategory = Object.entries({
                      ATS: getFeedbackScore(resume, 'ATS'),
                      Content: getFeedbackScore(resume, 'content'),
                      Structure: getFeedbackScore(resume, 'structure'),
                      Skills: getFeedbackScore(resume, 'skills'),
                      'Tone & Style': getFeedbackScore(resume, 'toneAndStyle')
                    }).reduce((a, b) => a[1] > b[1] ? a : b)[0]

                    return (
                      <tr key={resume.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {resume.companyName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {resume.jobTitle || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getFeedbackScore(resume) >= 80 ? 'bg-green-100 text-green-800' :
                            getFeedbackScore(resume) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getFeedbackScore(resume).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {topCategory}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No resume analyses yet. Upload and analyze your first resume to see data here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage