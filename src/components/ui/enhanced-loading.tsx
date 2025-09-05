import React from 'react'
import { Brain, Zap, Target, BarChart3 } from 'lucide-react'

interface EnhancedLoadingProps {
  message?: string
  stage?: 'uploading' | 'processing' | 'analyzing' | 'generating'
  progress?: number
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({ 
  message = 'Processing your resume...', 
  stage = 'processing',
  progress = 0
}) => {
  const getStageIcon = () => {
    switch (stage) {
      case 'uploading':
        return <Target className="w-8 h-8" />
      case 'processing':
        return <Brain className="w-8 h-8" />
      case 'analyzing':
        return <BarChart3 className="w-8 h-8" />
      case 'generating':
        return <Zap className="w-8 h-8" />
      default:
        return <Brain className="w-8 h-8" />
    }
  }

  const getStageMessage = () => {
    switch (stage) {
      case 'uploading':
        return 'Uploading your resume...'
      case 'processing':
        return 'Processing document structure...'
      case 'analyzing':
        return 'Analyzing content with AI...'
      case 'generating':
        return 'Generating insights and recommendations...'
      default:
        return message
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl border border-slate-200/60 backdrop-blur-sm">
      {/* Animated Icon Container */}
      <div className="relative mb-8">
        {/* Outer Ring */}
        <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin"></div>
        
        {/* Inner Ring */}
        <div className="absolute inset-2 w-20 h-20 border-4 border-purple-200 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white animate-pulse">
            {getStageIcon()}
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -inset-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping"
              style={{
                left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full max-w-md mb-6">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-slate-600 font-medium">
            {progress}% Complete
          </div>
        </div>
      )}

      {/* Stage Message */}
      <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
        {getStageMessage()}
      </h3>
      
      {/* Animated Dots */}
      <div className="flex space-x-2 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Tips */}
      <div className="text-center max-w-md">
        <p className="text-sm text-slate-600 mb-4">
          Our AI is analyzing your resume for ATS compatibility, content quality, and formatting.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            ATS Optimization
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            Content Analysis
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Format Check
          </span>
        </div>
      </div>
    </div>
  )
}