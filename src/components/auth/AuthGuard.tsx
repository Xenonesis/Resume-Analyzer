import React from 'react'
import { useAuth } from '@/stores/useAppStore'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

/**
 * Higher-order component that conditionally renders content based on authentication status
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = null, 
  requireAuth = true 
}) => {
  const { isAuthenticated } = useAuth()

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  if (!requireAuth && isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Component that only renders when user is authenticated
 */
export const AuthenticatedOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requireAuth={true}>{children}</AuthGuard>
)

/**
 * Component that only renders when user is NOT authenticated
 */
export const UnauthenticatedOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requireAuth={false}>{children}</AuthGuard>
)