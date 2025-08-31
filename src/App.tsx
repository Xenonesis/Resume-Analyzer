import { useEffect } from 'react'
import { useAuth, useAuthActions, useAIConfig, useAIConfigActions, useTheme } from '@/stores/useAppStore'
import puterService from '@/services/puterService'
import { aiService } from '@/services/aiService'
import { ModernSpinner } from '@/components/ui/modern-spinner'
import { getTheme, applyThemeToDocument } from '@/utils/themes'

function App() {
  const { isLoading } = useAuth()
  const { setAuthenticated, setUser, setAuthLoading } = useAuthActions()
  const { config } = useAIConfig()
  const { setAIConfigured } = useAIConfigActions()
  const currentTheme = useTheme()

  useEffect(() => {
    // Initialize the application
    const initializeApp = async () => {
      setAuthLoading(true)
      
      try {
        // Wait a bit for Puter.js to load
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Initialize Puter service
        await puterService.initialize()
        
        // Initialize AI service with stored configuration
        if (config) {
          aiService.setConfig(config)
          setAIConfigured(true)
        }
        
        // Check authentication status
        const isAuth = await puterService.checkAuthStatus()
        setAuthenticated(isAuth)
        
        if (isAuth) {
          try {
            const currentUser = await puterService.auth.getCurrentUser()
            setUser(currentUser)
          } catch (error) {
            console.warn('Failed to get user info:', error)
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    initializeApp()
  }, [setAuthenticated, setUser, setAuthLoading, config, setAIConfigured])

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const theme = getTheme(currentTheme)
    applyThemeToDocument(theme)
  }, [currentTheme])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center relative overflow-hidden pt-18">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 bg-white/80 backdrop-blur-xl p-16 rounded-4xl shadow-2xl border border-white/50">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Resume Analyzer</h2>
              <p className="text-slate-600">Preparing your resume analysis platform...</p>
            </div>
            
            <ModernSpinner 
              size="lg" 
              variant="gradient" 
              message="Initializing application..." 
            />
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null // Router will handle rendering
}

export default App