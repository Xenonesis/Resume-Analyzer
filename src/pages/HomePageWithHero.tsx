import React from 'react'
import { useNavigate } from 'react-router'
import { useResumes } from '@/stores/useAppStore'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useResumeData } from '@/hooks/useResumeData'
import { useAuth } from '@/stores/useAppStore'
import { Hero } from '@/components/ui/hero'

export const HomePageWithHero: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { items: resumes, isLoading: resumesLoading } = useResumes()

  // Load resume data when authenticated
  useResumeData(isAuthenticated)

  if (resumesLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <LoadingSpinner message="Loading your resume analyses..." />
      </div>
    )
  }

  const handleAnalyzeClick = () => {
    navigate('/upload')
  }

  if (resumes.length === 0) {
    return (
      <div className="min-h-screen">
        <Hero 
          title="Transform Your Career with AI-Powered Resume Analysis"
          subtitle="Get instant feedback, boost ATS compatibility, and land your dream job faster. Our advanced AI analyzes your resume against industry standards and provides actionable insights in under 30 seconds."
          eyebrow="AI-Powered Resume Analysis"
          ctaLabel="Start Your Analysis"
          onCtaClick={handleAnalyzeClick}
        />
        
        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Get comprehensive analysis results in under 30 seconds with our advanced AI algorithms.</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Insights</h3>
              <p className="text-gray-600 leading-relaxed">Receive scores across 5 key areas: ATS compatibility, content quality, structure, and more.</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Actionable Tips</h3>
              <p className="text-gray-600 leading-relaxed">Get specific recommendations to improve your resume and increase your interview chances.</p>
            </div>
          </div>

          {/* How it works section */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Three simple steps to transform your resume and boost your career prospects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg">1</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Resume</h3>
                  <p className="text-gray-600">Simply drag and drop your PDF resume or click to browse and upload your file securely.</p>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-4"></div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg">2</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI Analysis</h3>
                  <p className="text-gray-600">Our advanced AI analyzes your resume against job requirements and industry standards.</p>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform translate-x-4"></div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Get Results</h3>
                <p className="text-gray-600">Receive detailed feedback, scores, and actionable recommendations to improve your resume.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard view when user has resumes (keeping your existing dashboard logic)
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Your Resume Analytics</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Resume Dashboard
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Track your resume performance, monitor improvements, and optimize for success
          </p>
          <button 
            onClick={() => navigate('/upload')}
            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Analyze New Resume
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Analyses</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {resumes.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Resumes analyzed</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {Math.round(resumes.reduce((sum, r) => sum + r.feedback.overallScore, 0) / resumes.length)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Out of 100</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Best Score</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {Math.max(...resumes.map(r => r.feedback.overallScore))}
                </p>
                <p className="text-xs text-gray-500 mt-1">Personal best</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Companies</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {new Set(resumes.map(r => r.companyName)).size}
                </p>
                <p className="text-xs text-gray-500 mt-1">Applications</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((resume) => {
            const overallGrade = getScoreGrade(resume.feedback.overallScore)
            return (
              <div 
                key={resume.id} 
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 relative overflow-hidden"
                onClick={() => navigate(`/results/${resume.id}`)}
              >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${overallGrade.bg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className={`text-2xl font-bold ${overallGrade.color}`}>
                        {overallGrade.grade}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {resume.feedback.overallScore}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Overall Score</div>
                    </div>
                  </div>

                  {/* Company & Role */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {resume.companyName}
                    </h3>
                    <p className="text-gray-700 mb-3 font-medium">{resume.jobTitle}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                      </svg>
                      Analyzed on {new Date(resume.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">ATS Compatibility</span>
                      <span className="text-sm font-bold text-blue-600">{resume.feedback.ATS.score}/100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Content Quality</span>
                      <span className="text-sm font-bold text-green-600">{resume.feedback.content.score}/100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Skills Alignment</span>
                      <span className="text-sm font-bold text-purple-600">{resume.feedback.skills.score}/100</span>
                    </div>
                  </div>

                  {/* View Button */}
                  <div className="pt-4 border-t border-gray-200/50">
                    <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                      <span>View Detailed Analysis</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
