import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useResumes } from '@/stores/useAppStore'
import { ResumeResults } from '@/components/ResumeResults'
import { ModernSpinner } from '@/components/ui/modern-spinner'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  FileText, 
  AlertCircle, 
  Download, 
  Share2, 
  Bookmark,
  TrendingUp,
  Clock,
  Target,
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeId } = useParams<{ resumeId: string }>()
  const { items: resumes, isLoading } = useResumes()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [analysisTime, setAnalysisTime] = useState<string>('')

  const resume = resumes.find(r => r.id === resumeId)

  useEffect(() => {
    if (resume?.createdAt) {
      const now = new Date()
      const created = new Date(resume.createdAt)
      const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 1) {
        setAnalysisTime('Just now')
      } else if (diffInMinutes < 60) {
        setAnalysisTime(`${diffInMinutes} minutes ago`)
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60)
        setAnalysisTime(`${hours} hour${hours > 1 ? 's' : ''} ago`)
      } else {
        const days = Math.floor(diffInMinutes / 1440)
        setAnalysisTime(`${days} day${days > 1 ? 's' : ''} ago`)
      }
    }
  }, [resume])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5" />
    if (score >= 60) return <AlertTriangle className="w-5 h-5" />
    return <XCircle className="w-5 h-5" />
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Exceptional', description: 'Outstanding performance across all metrics' }
    if (score >= 80) return { level: 'Excellent', description: 'Strong performance with minor improvements needed' }
    if (score >= 70) return { level: 'Good', description: 'Solid foundation with room for enhancement' }
    if (score >= 60) return { level: 'Fair', description: 'Meets basic requirements but needs improvement' }
    if (score >= 40) return { level: 'Below Average', description: 'Significant improvements required' }
    return { level: 'Poor', description: 'Major restructuring needed' }
  }

  const calculateImprovementPotential = (feedback: any) => {
    if (!feedback) return 0
    const scores = [
      feedback.ATS?.score || 0,
      feedback.content?.score || 0,
      feedback.structure?.score || 0,
      feedback.skills?.score || 0,
      feedback.toneAndStyle?.score || 0
    ]
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
    return Math.max(0, 100 - averageScore)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center pt-18">
        <Helmet>
          <title>Loading Resume Analysis - AI Resume Analyzer</title>
          <meta name="description" content="Loading your comprehensive resume analysis. Please wait while we prepare detailed insights and recommendations." />
        </Helmet>
        <div className="bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/50">
          <ModernSpinner 
            size="lg" 
            variant="gradient" 
            message="Loading comprehensive analysis..." 
          />
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Preparing detailed insights and recommendations</p>
          </div>
        </div>
      </div>
    )
  }

  if (!resumeId) {
    navigate('/')
    return null
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center pt-18">
        <Helmet>
          <title>Resume Analysis Not Found - AI Resume Analyzer</title>
          <meta name="description" content="The resume analysis you're looking for doesn't exist or may have been removed from our system." />
        </Helmet>
        <div className="bg-white/90 backdrop-blur-sm p-16 rounded-3xl shadow-2xl border border-white/50 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Analysis Not Found</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The resume analysis you're looking for doesn't exist or may have been removed from our system.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              variant="modern"
              size="lg"
              className="w-full group"
            >
              <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/upload')}
              variant="outline"
              size="lg"
              className="w-full group"
            >
              <FileText className="w-5 h-5 mr-3" />
              Analyze New Resume
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const overallScore = resume.feedback?.overallScore || 0
  const performanceLevel = getPerformanceLevel(overallScore)
  const improvementPotential = calculateImprovementPotential(resume.feedback)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-18">
      <Helmet>
        <title>{`Resume Analysis Results - Score: ${overallScore}/100`}</title>
        <meta name="description" content={`Detailed resume analysis report with overall score of ${overallScore}/100. Get actionable insights to improve your resume.`} />
        <meta property="og:title" content={`Resume Analysis Results - Score: ${overallScore}/100`} />
        <meta property="og:description" content={`Detailed resume analysis report with overall score of ${overallScore}/100. Get actionable insights to improve your resume.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Resume Analysis Results - Score: ${overallScore}/100`} />
        <meta name="twitter:description" content={`Detailed resume analysis report with overall score of ${overallScore}/100. Get actionable insights to improve your resume.`} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "${window.location.origin}/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Upload",
                  "item": "${window.location.origin}/upload"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Analysis",
                  "item": "${window.location.origin}/analyze"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Results",
                  "item": "${window.location.origin}/results/${resumeId}"
                }
              ]
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Review",
              "itemReviewed": {
                "@type": "Product",
                "name": "Resume Document"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "${overallScore}",
                "bestRating": "100",
                "worstRating": "0"
              },
              "reviewBody": "Comprehensive AI-powered analysis of resume document with detailed feedback on content quality, structure, ATS compatibility, and actionable recommendations for improvement. Overall score of ${overallScore}/100 indicates ${performanceLevel.level.toLowerCase()} performance."
            }
          `}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Navigation Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="group hover:bg-white/80 hover:shadow-md transition-all duration-200"
              aria-label="Return to resume dashboard homepage"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" aria-hidden="true" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`transition-all duration-200 ${isBookmarked ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Enhanced Header Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header Background */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
              <div className="flex items-start justify-between text-white">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      Resume Analysis Report
                    </h1>
                    <div className="flex items-center space-x-6 text-blue-100">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {analysisTime}
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        {resume.jobTitle || 'Position Analysis'}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Comprehensive Review
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Score Badge */}
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <div className="text-4xl font-bold mb-1">
                      {overallScore}
                    </div>
                    <div className="text-sm opacity-90">Overall Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Performance Level */}
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getScoreColor(overallScore)}`}>
                    {getScoreIcon(overallScore)}
                    <span className="ml-2">{performanceLevel.level}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{performanceLevel.description}</p>
                </div>

                {/* Improvement Potential */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-blue-600">{improvementPotential.toFixed(0)}%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Improvement Potential</p>
                  <p className="text-xs text-gray-500">Room for growth</p>
                </div>

                {/* Analysis Depth */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-2xl font-bold text-green-600">5</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Analysis Categories</p>
                  <p className="text-xs text-gray-500">Comprehensive review</p>
                </div>

                {/* AI Insights */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-2xl font-bold text-purple-600">
                      {resume.feedback ? Object.values(resume.feedback).reduce((total, section) => {
                        if (typeof section === 'object' && section?.tips) {
                          return total + section.tips.length
                        }
                        return total
                      }, 0) : 0}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">AI Recommendations</p>
                  <p className="text-xs text-gray-500">Actionable insights</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Professional Analysis
                  </span>
                  <span className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    AI-Powered Insights
                  </span>
                </div>
                
                <Button
                  onClick={() => navigate('/upload')}
                  variant="outline"
                  size="sm"
                  className="group"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Re-analyze Resume
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Component */}
        <ResumeResults
          resume={resume}
          onBack={() => navigate('/')}
        />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Analysis</h3>
            <p className="text-gray-600 mb-6">Share this resume analysis with others</p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShowShareModal(false)
              }}>
                Copy Link
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowShareModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}