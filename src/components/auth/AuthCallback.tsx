/**
 * Auth callback component for handling OAuth redirects
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabaseService } from '@/services/supabaseService'
import { ModernSpinner } from '@/components/ui/modern-spinner'

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback
        // We just need to check if the user is now authenticated
        const session = await supabaseService.getClient().auth.getSession()
        
        if (session.data.session) {
          // User is authenticated, redirect to dashboard
          navigate('/app', { replace: true })
        } else {
          // Authentication failed, redirect to home
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ModernSpinner 
          size="lg" 
          variant="gradient" 
          message="Completing authentication..." 
        />
        <p className="mt-4 text-gray-600">Please wait while we sign you in...</p>
      </div>
    </div>
  )
}