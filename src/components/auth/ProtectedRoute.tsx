import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/stores/useAppStore'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children
}) => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Temporarily skip authentication for testing
    console.log("Authentication check - isLoading:", isLoading, "isAuthenticated:", isAuthenticated)
    // if (!isLoading && !isAuthenticated) {
    //   navigate('/auth')
    // }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    )
  }

  // Temporarily skip authentication check for testing
  // if (!isAuthenticated) {
  //   return null // Will redirect via useEffect
  // }

  return <>{children}</>
}