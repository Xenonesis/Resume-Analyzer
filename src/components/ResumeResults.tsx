import React, { useState, useMemo } from 'react'
import { Resume, Feedback } from '@/types'
import { PDFViewer } from './PDFViewer'
import { 
  BarChart3,
  Brain,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  Star,
  Target,
  TrendingUp,
  Zap,
  Activity,
  Users,
  Clock
} from 'lucide-react'

interface ResumeResultsProps {
  resume: Resume
  onBack?: () => void
}

export const ResumeResults: React.FC<ResumeResultsProps> = ({ resume, onBack }) => {
  // Validate and sanitize feedback data
  const validateFeedback = (feedback: any): Feedback => {
    const defaultTip = { type: 'improve' as const, tip: 'Analysis data incomplete - please try analyzing again for complete results.', explanation: 'Some feedback sections could not be loaded properly.' }
    const defaultSection = { score: 0, tips: [defaultTip] }
    const defaultATSSection = { score: 0, tips: [{ type: 'improve' as const, tip: 'ATS analysis data unavailable' }] }
    
    if (!feedback || typeof feedback !== 'object') {
      return {
        overallScore: 0,
        ATS: defaultATSSection,
        toneAndStyle: defaultSection,
        content: defaultSection,
        structure: defaultSection,
        skills: defaultSection
      }
    }
    
    return {
      overallScore: typeof feedback.overallScore === 'number' ? feedback.overallScore : 0,
      ATS: (feedback.ATS && typeof feedback.ATS.score === 'number' && Array.isArray(feedback.ATS.tips)) ? feedback.ATS : defaultATSSection,
      toneAndStyle: (feedback.toneAndStyle && typeof feedback.toneAndStyle.score === 'number' && Array.isArray(feedback.toneAndStyle.tips)) ? feedback.toneAndStyle : defaultSection,
      content: (feedback.content && typeof feedback.content.score === 'number' && Array.isArray(feedback.content.tips)) ? feedback.content : defaultSection,
      structure: (feedback.structure && typeof feedback.structure.score === 'number' && Array.isArray(feedback.structure.tips)) ? feedback.structure : defaultSection,
      skills: (feedback.skills && typeof feedback.skills.score === 'number' && Array.isArray(feedback.skills.tips)) ? feedback.skills : defaultSection
    }
  }
  
  const feedback = validateFeedback(resume.feedback)

  const ScoreCircle: React.FC<{ score: number; size?: 'sm' | 'lg' }> = ({ score, size = 'sm' }) => {
    const radius = size === 'lg' ? 45 : 35
    const strokeWidth = size === 'lg' ? 8 : 6
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (score / 100) * circumference

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-500'
      if (score >= 60) return 'text-yellow-500'
      return 'text-red-500'
    }

    return (
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={getScoreColor(score)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-2xl' : 'text-lg'} text-gray-900`}>
            {score}
          </span>
        </div>
      </div>
    )
  }

  const TipsList: React.FC<{ tips: any[] }> = ({ tips }) => {
    // Validate tips array
    if (!Array.isArray(tips) || tips.length === 0) {
      return (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">No analysis data available</p>
              <p className="text-xs text-gray-600 mt-1">Please try re-analyzing your resume for detailed feedback.</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {tips.map((tip, index) => {
          // Validate individual tip structure
          const tipText = typeof tip === 'object' && tip !== null ? (tip.tip || 'No feedback available') : String(tip)
          const tipType = typeof tip === 'object' && tip !== null && (tip.type === 'good' || tip.type === 'improve') ? tip.type : 'improve'
          const tipExplanation = typeof tip === 'object' && tip !== null ? tip.explanation : undefined
          
          return (
            <div
              key={index}
              className={`group p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${
                tipType === 'good'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500 hover:from-green-100 hover:to-emerald-100'
                  : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-orange-500 hover:from-orange-100 hover:to-yellow-100'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                  tipType === 'good' ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {tipType === 'good' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    tipType === 'good' ? 'text-green-900' : 'text-orange-900'
                  }`}>
                    {tipText}
                  </p>
                  {tipExplanation && (
                    <p className={`text-xs mt-2 leading-relaxed ${
                      tipType === 'good' ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {tipExplanation}
                    </p>
                  )}
                </div>
                <div className={`text-lg ${
                  tipType === 'good' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {tipType === 'good' ? '🎉' : '💡'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const [activeTab, setActiveTab] = useState<'analysis' | 'resume' | 'insights' | 'recommendations'>('analysis')
  const [showFullJobDescription, setShowFullJobDescription] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const overallGrade = getScoreGrade(feedback.overallScore)

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    const scores = [
      feedback.ATS.score,
      feedback.content.score,
      feedback.structure.score,
      feedback.skills.score,
      feedback.toneAndStyle.score
    ]
    
    const totalTips = Object.values(feedback).reduce((total, section) => {
      if (typeof section === 'object' && section?.tips) {
        return total + section.tips.length
      }
      return total
    }, 0)

    const goodTips = Object.values(feedback).reduce((total, section) => {
      if (typeof section === 'object' && section?.tips) {
        return total + section.tips.filter((tip: any) => tip.type === 'good').length
      }
      return total
    }, 0)

    const improveTips = totalTips - goodTips
    
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const highestScore = Math.max(...scores)
    const lowestScore = Math.min(...scores)
    const scoreVariance = scores.reduce((acc, score) => acc + Math.pow(score - averageScore, 2), 0) / scores.length
    const consistency = Math.max(0, 100 - Math.sqrt(scoreVariance))

    return {
      totalTips,
      goodTips,
      improveTips,
      averageScore: Math.round(averageScore),
      highestScore,
      lowestScore,
      consistency: Math.round(consistency),
      improvementPotential: Math.round(100 - averageScore),
      strengthsCount: scores.filter(s => s >= 80).length,
      weaknessesCount: scores.filter(s => s < 60).length
    }
  }, [feedback])

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Check if data appears to be invalid or incomplete
  const hasInvalidData = feedback.overallScore === 0 || 
                        (feedback.ATS.tips.length === 1 && feedback.ATS.tips[0].tip?.includes('Analysis data incomplete')) ||
                        !Array.isArray(feedback.ATS.tips) || 
                        feedback.ATS.tips.length === 0

  const getPriorityLevel = (score: number) => {
    if (score < 40) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-50', icon: '🚨' }
    if (score < 60) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚠️' }
    if (score < 80) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '📋' }
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' }
  }

  const getImpactLevel = (tipType: string, sectionScore: number) => {
    if (tipType === 'improve' && sectionScore < 60) return 'High Impact'
    if (tipType === 'improve' && sectionScore < 80) return 'Medium Impact'
    if (tipType === 'good') return 'Strength'
    return 'Low Impact'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Warning Banner for Invalid Data */}
        {hasInvalidData && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-800">Analysis Data Incomplete</h3>
                <p className="text-sm text-amber-700 mt-1">
                  This resume analysis appears to have incomplete or corrupted data. We recommend re-analyzing your resume to get complete and accurate feedback.
                </p>
              </div>
              <button 
                onClick={() => window.location.href = '/upload'} 
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Re-analyze</span>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full ${overallGrade.bg} flex items-center justify-center`}>
                  <span className={`text-2xl font-bold ${overallGrade.color}`}>
                    {overallGrade.grade}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Resume Analysis Report</h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                      </svg>
                      {resume.companyName}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {resume.jobTitle}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {onBack && (
                <div className="flex space-x-3">
                  <button 
                    onClick={onBack} 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Dashboard</span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/upload'} 
                    className="bg-blue-500/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Re-analyze Resume</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Overall Score Section */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 text-center">
                <div className="relative inline-block">
                  <ScoreCircle score={feedback.overallScore} size="lg" />
                  <div className="absolute -top-2 -right-2">
                    <div className={`w-8 h-8 rounded-full ${overallGrade.bg} flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${overallGrade.color}`}>
                        {overallGrade.grade}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-4">Overall Score</h3>
                <p className="text-lg text-gray-600 mt-1">
                  {feedback.overallScore >= 90 ? 'Outstanding Resume!' : 
                   feedback.overallScore >= 80 ? 'Excellent Resume!' : 
                   feedback.overallScore >= 70 ? 'Good Resume' :
                   feedback.overallScore >= 60 ? 'Decent Resume' : 'Needs Improvement'}
                </p>
              </div>
              
              <div className="lg:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Strongest Area</p>
                        <p className="text-lg font-bold text-green-900">
                          {Object.entries(feedback).reduce((max, [key, value]) => 
                            key !== 'overallScore' && typeof value === 'object' && value.score > max.score 
                              ? { key, score: value.score } 
                              : max, 
                            { key: 'structure', score: 0 }
                          ).key.charAt(0).toUpperCase() + Object.entries(feedback).reduce((max, [key, value]) => 
                            key !== 'overallScore' && typeof value === 'object' && value.score > max.score 
                              ? { key, score: value.score } 
                              : max, 
                            { key: 'structure', score: 0 }
                          ).key.slice(1)}
                        </p>
                      </div>
                      <div className="text-2xl">🎯</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Improvement Area</p>
                        <p className="text-lg font-bold text-blue-900">
                          {Object.entries(feedback).reduce((min, [key, value]) => 
                            key !== 'overallScore' && typeof value === 'object' && value.score < min.score 
                              ? { key, score: value.score } 
                              : min, 
                            { key: 'skills', score: 100 }
                          ).key.charAt(0).toUpperCase() + Object.entries(feedback).reduce((min, [key, value]) => 
                            key !== 'overallScore' && typeof value === 'object' && value.score < min.score 
                              ? { key, score: value.score } 
                              : min, 
                            { key: 'skills', score: 100 }
                          ).key.slice(1)}
                        </p>
                      </div>
                      <div className="text-2xl">📈</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'analysis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Detailed Analysis</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {analytics.totalTips}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'insights'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Insights</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Smart
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'recommendations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Action Plan</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {analytics.improveTips}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('resume')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'resume'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Resume Preview</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'analysis' ? (
          <div className="space-y-6">
            {/* Enhanced Category Scores */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Score Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { key: 'ATS', label: 'ATS Score', description: 'Applicant Tracking System', icon: '🤖', score: feedback.ATS.score },
                  { key: 'toneAndStyle', label: 'Tone & Style', description: 'Writing Quality', icon: '✍️', score: feedback.toneAndStyle.score },
                  { key: 'content', label: 'Content', description: 'Relevance & Quality', icon: '📝', score: feedback.content.score },
                  { key: 'structure', label: 'Structure', description: 'Organization', icon: '🏗️', score: feedback.structure.score },
                  { key: 'skills', label: 'Skills', description: 'Job Alignment', icon: '🎯', score: feedback.skills.score }
                ].map((category) => {
                  const grade = getScoreGrade(category.score)
                  return (
                    <div key={category.key} className="text-center group hover:scale-105 transition-transform duration-200">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 group-hover:shadow-md transition-shadow duration-200">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <ScoreCircle score={category.score} />
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${grade.bg} ${grade.color}`}>
                          Grade {grade.grade}
                        </div>
                        <h4 className="font-semibold text-gray-900 mt-2">{category.label}</h4>
                        <p className="text-xs text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Enhanced Detailed Feedback */}
            <div className="space-y-6">
              {[
                { key: 'ATS', title: 'ATS Compatibility', icon: '🤖', color: 'blue', feedback: feedback.ATS },
                { key: 'content', title: 'Content Quality', icon: '📝', color: 'green', feedback: feedback.content },
                { key: 'toneAndStyle', title: 'Tone & Style', icon: '✍️', color: 'purple', feedback: feedback.toneAndStyle },
                { key: 'structure', title: 'Structure & Format', icon: '🏗️', color: 'orange', feedback: feedback.structure },
                { key: 'skills', title: 'Skills Alignment', icon: '🎯', color: 'red', feedback: feedback.skills }
              ].map((section) => {
                const grade = getScoreGrade(section.feedback.score)
                return (
                  <div key={section.key} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className={`bg-gradient-to-r from-${section.color}-500 to-${section.color}-600 px-6 py-4`}>
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{section.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold">{section.title}</h3>
                            <p className="text-sm opacity-90">Score: {section.feedback.score}/100</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full bg-white/20 text-sm font-medium`}>
                          Grade {grade.grade}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <TipsList tips={section.feedback.tips} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : activeTab === 'insights' ? (
          /* AI Insights Tab */
          <div className="space-y-6">
            {/* Performance Analytics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-600" />
                AI-Powered Performance Analytics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-900">{analytics.consistency}%</span>
                  </div>
                  <h4 className="font-semibold text-blue-900">Consistency Score</h4>
                  <p className="text-xs text-blue-700 mt-1">How uniform your performance is across categories</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-900">{analytics.strengthsCount}</span>
                  </div>
                  <h4 className="font-semibold text-green-900">Strong Areas</h4>
                  <p className="text-xs text-green-700 mt-1">Categories scoring 80+ points</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-900">{analytics.improvementPotential}%</span>
                  </div>
                  <h4 className="font-semibold text-orange-900">Growth Potential</h4>
                  <p className="text-xs text-orange-700 mt-1">Room for improvement identified</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-900">{analytics.averageScore}</span>
                  </div>
                  <h4 className="font-semibold text-purple-900">Average Score</h4>
                  <p className="text-xs text-purple-700 mt-1">Overall performance baseline</p>
                </div>
              </div>

              {/* Score Distribution Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h4>
                <div className="space-y-4">
                  {[
                    { label: 'ATS Compatibility', score: feedback.ATS.score, color: 'bg-blue-500' },
                    { label: 'Content Quality', score: feedback.content.score, color: 'bg-green-500' },
                    { label: 'Tone & Style', score: feedback.toneAndStyle.score, color: 'bg-purple-500' },
                    { label: 'Structure & Format', score: feedback.structure.score, color: 'bg-orange-500' },
                    { label: 'Skills Alignment', score: feedback.skills.score, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center space-x-4">
                      <div className="w-32 text-sm font-medium text-gray-700">{item.label}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color} transition-all duration-1000`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-bold text-gray-900">{item.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Competitive Analysis */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-indigo-600" />
                Competitive Positioning
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                  <div className="text-3xl mb-2">
                    {feedback.overallScore >= 85 ? '🏆' : feedback.overallScore >= 70 ? '🥈' : feedback.overallScore >= 55 ? '🥉' : '📈'}
                  </div>
                  <h4 className="font-semibold text-indigo-900">Market Position</h4>
                  <p className="text-sm text-indigo-700 mt-1">
                    {feedback.overallScore >= 85 ? 'Top 10% of candidates' :
                     feedback.overallScore >= 70 ? 'Top 25% of candidates' :
                     feedback.overallScore >= 55 ? 'Above average candidate' :
                     'Below average - needs improvement'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold text-emerald-900">Hiring Probability</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    {feedback.overallScore >= 80 ? 'High likelihood' :
                     feedback.overallScore >= 65 ? 'Moderate likelihood' :
                     'Needs improvement for better chances'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold text-amber-900">ATS Pass Rate</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {feedback.ATS.score >= 80 ? 'Excellent ATS compatibility' :
                     feedback.ATS.score >= 60 ? 'Good ATS compatibility' :
                     'May struggle with ATS systems'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'recommendations' ? (
          /* Action Plan Tab */
          <div className="space-y-6">
            {/* Priority Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                Priority Action Items
              </h3>
              
              <div className="space-y-4">
                {[
                  { key: 'ATS', title: 'ATS Compatibility', score: feedback.ATS.score, tips: feedback.ATS.tips },
                  { key: 'content', title: 'Content Quality', score: feedback.content.score, tips: feedback.content.tips },
                  { key: 'structure', title: 'Structure & Format', score: feedback.structure.score, tips: feedback.structure.tips },
                  { key: 'skills', title: 'Skills Alignment', score: feedback.skills.score, tips: feedback.skills.tips },
                  { key: 'toneAndStyle', title: 'Tone & Style', score: feedback.toneAndStyle.score, tips: feedback.toneAndStyle.tips }
                ]
                .sort((a, b) => a.score - b.score) // Sort by lowest score first (highest priority)
                .map((section, index) => {
                  const priority = getPriorityLevel(section.score)
                  const improveTips = section.tips.filter((tip: any) => tip.type === 'improve')
                  
                  if (improveTips.length === 0) return null
                  
                  return (
                    <div key={section.key} className={`p-4 rounded-xl border-l-4 ${priority.bg} border-l-4`} 
                         style={{ borderLeftColor: priority.color.replace('text-', '').replace('-600', '') }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{priority.icon}</span>
                          <div>
                            <h4 className={`font-semibold ${priority.color}`}>
                              Priority #{index + 1}: {section.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Current Score: {section.score}/100 • {priority.level} Priority
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSection(section.key)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedSections[section.key] ? 
                            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          }
                        </button>
                      </div>
                      
                      {expandedSections[section.key] && (
                        <div className="space-y-3 mt-4">
                          {improveTips.map((tip: any, tipIndex: number) => (
                            <div key={tipIndex} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs font-bold">{tipIndex + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{tip.tip}</p>
                                  {tip.explanation && (
                                    <p className="text-xs text-gray-600 mt-1">{tip.explanation}</p>
                                  )}
                                  <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                      {getImpactLevel(tip.type, section.score)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Estimated time: {section.score < 40 ? '2-3 hours' : section.score < 70 ? '1-2 hours' : '30-60 minutes'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Implementation Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600" />
                Recommended Implementation Timeline
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Week 1: Critical Issues</h4>
                    <p className="text-sm text-gray-600 mb-2">Address the most urgent problems that could prevent your resume from being seen</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {Object.entries(feedback)
                        .filter(([key, value]) => key !== 'overallScore' && typeof value === 'object' && value.score < 40)
                        .map(([key, _value]) => (
                          <li key={key} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span>Fix {key.charAt(0).toUpperCase() + key.slice(1)} issues</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Week 2-3: Major Improvements</h4>
                    <p className="text-sm text-gray-600 mb-2">Enhance areas that will significantly boost your competitiveness</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {Object.entries(feedback)
                        .filter(([key, value]) => key !== 'overallScore' && typeof value === 'object' && value.score >= 40 && value.score < 70)
                        .map(([key, _value]) => (
                          <li key={key} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Improve {key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Week 4: Polish & Optimize</h4>
                    <p className="text-sm text-gray-600 mb-2">Fine-tune strong areas to make them exceptional</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {Object.entries(feedback)
                        .filter(([key, value]) => key !== 'overallScore' && typeof value === 'object' && value.score >= 70)
                        .map(([key, _value]) => (
                          <li key={key} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Optimize {key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Resume Preview Tab */
          <div>
            <PDFViewer 
              filePath={resume.resumePath} 
              fileName={resume.resumePath.split('/').pop() || 'resume.pdf'} 
            />
          </div>
        )}

        {/* Enhanced Resume Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analysis Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Company</p>
                  <p className="text-lg font-bold text-blue-900">{resume.companyName}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Position</p>
                  <p className="text-lg font-bold text-green-900">{resume.jobTitle}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1M8 7h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-800">Analyzed</p>
                  <p className="text-lg font-bold text-purple-900">{new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-800">File</p>
                  <p className="text-sm font-bold text-orange-900 truncate">{resume.resumePath.split('/').pop()}</p>
                </div>
              </div>
            </div>
          </div>
          
          {resume.jobDescription && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Job Description
                </h4>
                <button
                  onClick={() => setShowFullJobDescription(!showFullJobDescription)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  {showFullJobDescription ? 'Show Less' : 'Show More'}
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <p className={`text-sm text-gray-700 leading-relaxed ${
                  showFullJobDescription ? '' : 'line-clamp-3'
                }`}>
                  {resume.jobDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}