import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/stores/useAppStore'
import { AuthModal } from '@/components/auth/AuthModal'


interface AuthPageProps {
  onSuccess?: () => void
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(true)
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/app')
      }
    }
  }, [isAuthenticated, navigate, onSuccess])

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 p-8 text-center">
          {/* Logo/Icon */}
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-secondary-600 mb-8">
            Get AI-powered feedback with secure cloud storage to improve your resume and increase your chances of landing your dream job.
          </p>

          {/* Features */}
          <div className="text-left mb-8 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-secondary-700">ATS compatibility analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-secondary-700">Detailed scoring & feedback</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-secondary-700">Job-specific recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-secondary-700">Secure cloud storage with Supabase</span>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mb-4"
          >
            Get Started - Sign Up Free
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-secondary-500">
            Your resume data is securely stored in the cloud and never shared with third parties.
          </p>
        </div>

        {/* Service Status */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-secondary-500">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
            <span>Connected to Supabase Cloud</span>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose} 
      />
    </div>
  )
}