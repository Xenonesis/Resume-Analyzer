import React from 'react'
import { useNavigate } from 'react-router'
import { FileUploader } from '@/components/FileUploader'

export const UploadPage: React.FC = () => {
  const navigate = useNavigate()

  const handleUploadComplete = (filePath: string, fileName: string) => {
    // Navigate to analyze page with the file path and name
    const encodedPath = encodeURIComponent(filePath)
    const encodedName = encodeURIComponent(fileName)
    navigate(`/analyze/${encodedPath}?fileName=${encodedName}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:24px_24px]"></div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-6">
          <button 
            onClick={() => navigate('/')}
            className="group inline-flex items-center text-slate-600 hover:text-slate-900 font-medium transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mr-3 transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-sm">Back to Dashboard</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
                Upload Your Resume
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                Get comprehensive AI analysis with actionable insights to enhance your career prospects
              </p>
            </div>

            {/* Process Steps */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">1</div>
                <span className="text-sm font-medium text-slate-700">Upload</span>
              </div>
              <div className="w-16 h-px bg-slate-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-medium">2</div>
                <span className="text-sm text-slate-500">Analyze</span>
              </div>
              <div className="w-16 h-px bg-slate-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-medium">3</div>
                <span className="text-sm text-slate-500">Improve</span>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="max-w-2xl mx-auto">
            <FileUploader onUploadComplete={handleUploadComplete} />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-slate-600 leading-relaxed">Advanced machine learning algorithms analyze your resume against industry standards and best practices</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Comprehensive Scoring</h3>
              <p className="text-slate-600 leading-relaxed">Detailed evaluation across ATS compatibility, content quality, structure, and professional presentation</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Actionable Insights</h3>
              <p className="text-slate-600 leading-relaxed">Receive specific, implementable recommendations to immediately improve your resume's effectiveness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}