import { useEffect } from 'react'
import { useAIConfig, useAIConfigActions } from '@/stores/useAppStore'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { aiService } from '@/services/aiService'
import { ToastProvider } from '@/components/ui/toast'
import { NotificationProvider, useNotification } from '@/contexts/NotificationContext'
import { NotificationToast } from '@/components/NotificationToast'

interface AppProps {
  children?: React.ReactNode
}

const AppContent: React.FC<AppProps> = ({ children }) => {
  const { config } = useAIConfig()
  const { setAIConfigured } = useAIConfigActions()
  const { notifications, removeNotification } = useNotification()

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

  return (
    <>
      {children}
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
    </>
  )
}

function App({ children }: AppProps) {
  return (
    <ToastProvider>
      <NotificationProvider>
        <AppContent>{children}</AppContent>
      </NotificationProvider>
    </ToastProvider>
  )
}

export default App
