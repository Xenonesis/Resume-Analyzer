import { useEffect } from 'react'
import { useAIConfig, useAIConfigActions } from '@/stores/useAppStore'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { aiService } from '@/services/aiService'

interface AppProps {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  const { config } = useAIConfig()
  const { setAIConfigured } = useAIConfigActions()

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

  return <>{children}</>
}

export default App