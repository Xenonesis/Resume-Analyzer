import { useEffect } from 'react'
import { useAIConfig, useAIConfigActions, useTheme } from '@/stores/useAppStore'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { aiService } from '@/services/aiService'
import { getTheme, applyThemeToDocument } from '@/utils/themes'

interface AppProps {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  const { config } = useAIConfig()
  const { setAIConfigured } = useAIConfigActions()
  const currentTheme = useTheme()

  // Initialize Supabase authentication
  useSupabaseAuth()

  useEffect(() => {
    // Initialize AI service with stored configuration
    if (config) {
      aiService.setConfig(config)
      setAIConfigured(true)
    }
    
    // Application initialized
  }, [config, setAIConfigured])

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const theme = getTheme(currentTheme)
    applyThemeToDocument(theme)
  }, [currentTheme])

  return <>{children}</>
}

export default App