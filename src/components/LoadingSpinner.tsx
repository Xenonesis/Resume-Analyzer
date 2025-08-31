import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-6">
        <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
        </div>
      </div>
      <p className="text-gray-700 text-center font-medium mb-3">{message}</p>
      <div className="flex space-x-1">
        <div className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}></div>
        <div className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
        <div className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}