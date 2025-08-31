import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthActions } from '@/stores/useAppStore'
import puterService from '@/services/puterService'
import { AppErrorHandler } from '@/utils/errorHandling'

interface AuthPageProps {
  onSuccess?: () => void
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setAuthenticated, setUser, setAuthLoading } = useAuthActions()

  const handleSignIn = async () => {
    setIsLoading(true)
    setAuthLoading(true)
    setError(null)

    try {
      await puterService.auth.signIn()
      
      // Check if authentication was successful
      const isAuth = await puterService.checkAuthStatus()
      setAuthenticated(isAuth)
      
      if (isAuth) {
        try {
          const currentUser = await puterService.auth.getCurrentUser()
          setUser(currentUser)
          
          if (onSuccess) {
            onSuccess()
          } else {
            navigate('/')
          }
        } catch (userError) {
          console.warn('Failed to get user info after sign in:', userError)
          // Still consider auth successful even if user info fails
          if (onSuccess) {
            onSuccess()
          } else {
            navigate('/')
          }
        }
      } else {
        throw new Error('Authentication was not successful')
      }
    } catch (error) {
      console.error('Sign in failed:', error)
      const appError = AppErrorHandler.handleAuthError(error as Error)
      setError(appError.userMessage || 'Sign in failed')
      AppErrorHandler.logError(appError, 'AuthPage.handleSignIn')
    } finally {
      setIsLoading(false)
      setAuthLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {/* Logo/Icon */}
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-gray-600 mb-8">
            Get AI-powered feedback to improve your resume and increase your chances of landing your dream job.
          </p>

          {/* Features */}
          <div className="text-left mb-8 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">ATS compatibility analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Detailed scoring & feedback</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Job-specific recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Secure cloud storage</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="btn-primary w-full mb-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In with Puter'
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500">
            Your resume data is securely stored and never shared with third parties.
          </p>
        </div>

        {/* Service Status */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${puterService.isAvailable() ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span>
              {puterService.isAvailable() ? 'Connected to Puter Cloud' : 'Running in Demo Mode'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}