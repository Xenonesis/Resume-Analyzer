import React from 'react'

interface ModernSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'dots' | 'pulse'
  message?: string
}

export const ModernSpinner: React.FC<ModernSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  message 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin">
              <div className="absolute inset-1 bg-white rounded-full"></div>
            </div>
            <div className="absolute inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        )
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              ></div>
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse`}>
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-75"></div>
          </div>
        )
      
      default:
        return (
          <div className={`${sizeClasses[size]} border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin`}></div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderSpinner()}
      {message && (
        <p className="text-sm text-slate-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}