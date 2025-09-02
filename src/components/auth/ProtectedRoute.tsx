import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/stores/useAppStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children
}) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Always redirect non-authenticated users to landing page
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to landing page')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}