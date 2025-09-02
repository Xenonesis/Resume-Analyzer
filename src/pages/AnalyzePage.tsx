import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { ResumeAnalyzer } from '@/components/ResumeAnalyzer'
import { Resume } from '@/types'
import { useAIConfig, useAuth } from '@/stores/useAppStore'
import { aiService } from '@/services/aiService'

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate()
  const { filePath } = useParams<{ filePath: string }>()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { config, isConfigured } = useAIConfig()

  const handleBackToUpload = () => {
    // Check if all required configuration is complete
    const hasValidConfig = isAuthenticated && 
                          isConfigured && 
                          aiService.isConfigured() && 
                          config?.apiKey && 
                          config.apiKey.length > 0

    if (hasValidConfig) {
      navigate('/app/upload')
    } else {
      navigate('/app/settings')
    }
  }

  if (!filePath) {
    handleBackToUpload()
    return null
  }

  const decodedPath = decodeURIComponent(filePath)
  const fileName = searchParams.get('fileName') 
    ? decodeURIComponent(searchParams.get('fileName')!) 
    : decodedPath.split('/').pop() || 'resume.pdf'

  const handleAnalysisComplete = (resume: Resume) => {
    navigate(`/results/${resume.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <button 
            onClick={handleBackToUpload}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Upload
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configure Analysis
          </h1>
          <p className="text-gray-600">
            Provide job details to get the most accurate analysis of your resume
          </p>
        </div>

        <ResumeAnalyzer
          filePath={decodedPath}
          fileName={fileName}
          onComplete={handleAnalysisComplete}
        />
      </div>
    </div>
  )
}