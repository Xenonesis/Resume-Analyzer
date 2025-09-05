import React, { useState } from 'react'
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Clock, 
  Award, 
  Target, 
  Brain, 
  Zap,
  Download,
  Share2,
  Settings,
  Plus
} from 'lucide-react'
import { StatsGrid } from './ui/stats-card'
import { ScoreGrid } from './ui/score-display'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { SearchFilter } from './ui/search-filter'
import { FloatingActionButton } from './ui/floating-action-button'
import { useToast } from './ui/toast'

export const EnhancedDashboard: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const { addToast } = useToast()

  // Sample data for demonstration
  const statsData = [
    {
      id: 'total-resumes',
      title: 'Total Resumes Analyzed',
      value: 1247,
      change: 12,
      changeType: 'increase' as const,
      changeLabel: 'vs last month',
      icon: <FileText className="w-5 h-5" />,
      color: 'blue' as const,
      format: 'number' as const
    },
    {
      id: 'avg-score',
      title: 'Average Score',
      value: 78.5,
      change: 5.2,
      changeType: 'increase' as const,
      changeLabel: 'vs last month',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green' as const,
      format: 'number' as const
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: 892,
      change: -3,
      changeType: 'decrease' as const,
      changeLabel: 'vs last week',
      icon: <Users className="w-5 h-5" />,
      color: 'purple' as const,
      format: 'number' as const
    },
    {
      id: 'avg-time',
      title: 'Avg. Analysis Time',
      value: '24s',
      change: 8,
      changeType: 'decrease' as const,
      changeLabel: 'improvement',
      icon: <Clock className="w-5 h-5" />,
      color: 'orange' as const,
      format: 'text' as const
    }
  ]

  const scoresData = [
    {
      id: 'ats-score',
      score: 85,
      title: 'ATS Compatibility',
      description: 'How well your resume passes ATS systems',
      trend: 'up' as const,
      trendValue: 5,
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'content-score',
      score: 92,
      title: 'Content Quality',
      description: 'Overall content strength and relevance',
      trend: 'up' as const,
      trendValue: 8,
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: 'format-score',
      score: 78,
      title: 'Format & Structure',
      description: 'Layout, formatting, and organization',
      trend: 'neutral' as const,
      trendValue: 0,
      icon: <Zap className="w-5 h-5" />
    }
  ]

  const filterGroups = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { id: 'all', label: 'All', value: 'all', count: 1247 },
        { id: 'excellent', label: 'Excellent', value: 'excellent', count: 312 },
        { id: 'good', label: 'Good', value: 'good', count: 498 },
        { id: 'needs-improvement', label: 'Needs Improvement', value: 'needs-improvement', count: 437 }
      ]
    },
    {
      id: 'date-range',
      label: 'Date Range',
      type: 'select' as const,
      options: [
        { id: 'today', label: 'Today', value: 'today' },
        { id: 'week', label: 'This Week', value: 'week' },
        { id: 'month', label: 'This Month', value: 'month' },
        { id: 'quarter', label: 'This Quarter', value: 'quarter' }
      ]
    }
  ]

  const sortOptions = [
    { id: 'date', label: 'Date', value: 'date' },
    { id: 'score', label: 'Score', value: 'score' },
    { id: 'name', label: 'Name', value: 'name' }
  ]

  const recentAnalyses = [
    {
      id: 1,
      name: 'John_Doe_Resume.pdf',
      score: 85,
      status: 'excellent',
      date: '2024-01-15',
      time: '2:30 PM'
    },
    {
      id: 2,
      name: 'Sarah_Smith_CV.pdf',
      score: 78,
      status: 'good',
      date: '2024-01-15',
      time: '1:45 PM'
    },
    {
      id: 3,
      name: 'Mike_Johnson_Resume.docx',
      score: 92,
      status: 'excellent',
      date: '2024-01-15',
      time: '12:15 PM'
    }
  ]

  const handleFloatingAction = (action: string) => {
    switch (action) {
      case 'upload':
        addToast({
          type: 'info',
          title: 'Upload Resume',
          description: 'Redirecting to upload page...'
        })
        break
      case 'settings':
        addToast({
          type: 'info',
          title: 'Settings',
          description: 'Opening settings panel...'
        })
        break
      case 'help':
        addToast({
          type: 'info',
          title: 'Help Center',
          description: 'Opening help documentation...'
        })
        break
      case 'feedback':
        addToast({
          type: 'success',
          title: 'Feedback',
          description: 'Thank you for your interest in providing feedback!'
        })
        break
    }
  }

  const floatingActions = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Upload Resume",
      onClick: () => handleFloatingAction('upload'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      onClick: () => handleFloatingAction('settings'),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Resume Analytics Dashboard
            </h1>
            <p className="text-slate-600">
              Track your resume analysis performance and insights
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={statsData} />

        {/* Scores Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Performance Scores</h2>
              <p className="text-slate-600 mt-1">Latest analysis results breakdown</p>
            </div>
            <Badge variant="gradient" className="px-3 py-1">
              <Award className="w-4 h-4 mr-1" />
              Top Performer
            </Badge>
          </div>
          <ScoreGrid scores={scoresData} />
        </div>

        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>
              Latest resume analysis results and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="mb-6">
              <SearchFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterGroups={filterGroups}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                sortOptions={sortOptions}
                placeholder="Search resumes..."
              />
            </div>

            {/* Results Table */}
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{analysis.name}</h4>
                      <p className="text-sm text-slate-600">
                        {analysis.date} at {analysis.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">{analysis.score}/100</div>
                      <Badge
                        variant={
                          analysis.status === 'excellent' ? 'success' :
                          analysis.status === 'good' ? 'default' : 'warning'
                        }
                        className="text-xs"
                      >
                        {analysis.status}
                      </Badge>
                    </div>
                    <Progress 
                      value={analysis.score} 
                      className="w-20" 
                      variant={
                        analysis.score >= 90 ? 'success' :
                        analysis.score >= 75 ? 'default' : 'warning'
                      }
                    />
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Floating Action Button */}
        <FloatingActionButton actions={floatingActions} />
      </div>
    </div>
  )
}