import React from 'react'
import { Navigate } from 'react-router'
import { useAIConfig, useAuth } from '@/stores/useAppStore'
import { aiService } from '@/services/aiService'

interface ConfigurationGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ConfigurationGuard: React.FC<ConfigurationGuardProps> = ({ 
  children, 
  redirectTo = '/app/settings' 
}) => {
  const { isAuthenticated } = useAuth()
  const { config, isConfigured } = useAIConfig()

  // Check if all required configuration is complete
  const hasValidConfig = isAuthenticated && 
                        isConfigured && 
                        aiService.isConfigured() && 
                        config?.apiKey && 
                        config.apiKey.length > 0

  if (!hasValidConfig) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}