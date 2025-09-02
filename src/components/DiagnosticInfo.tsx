import React, { useState, useEffect } from 'react'
import { useAIConfig, useAuth } from '@/stores/useAppStore'
import { aiService } from '@/services/aiService'
import { AlertTriangle, CheckCircle, Settings, ExternalLink, Database, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getOldDataInfo, clearOldResumeData } from '@/utils/clearOldData'

interface DiagnosticInfoProps {
  onConfigureAI?: () => void
}

export const DiagnosticInfo: React.FC<DiagnosticInfoProps> = ({ onConfigureAI }) => {
  const { config, isConfigured } = useAIConfig()
  const { isAuthenticated, user } = useAuth()
  const [oldDataInfo, setOldDataInfo] = useState({ count: 0, hasAnalysis: false })
  const [showOldDataWarning, setShowOldDataWarning] = useState(false)

  useEffect(() => {
    const info = getOldDataInfo()
    setOldDataInfo(info)
    setShowOldDataWarning(info.count > 0 && info.hasAnalysis)
  }, [])

  const handleClearOldData = () => {
    clearOldResumeData()
    setOldDataInfo({ count: 0, hasAnalysis: false })
    setShowOldDataWarning(false)
    // Refresh the page to reload without old data
    window.location.reload()
  }

  const diagnostics = [
    {
      name: 'User Authentication',
      status: isAuthenticated,
      details: isAuthenticated 
        ? `Signed in as ${user?.name || user?.email || 'User'}`
        : 'Not signed in - authentication required for cloud storage',
      action: 'Sign In',
      icon: User
    },
    {
      name: 'Cloud Storage',
      status: isAuthenticated,
      details: isAuthenticated 
        ? 'Connected to Supabase - your data is securely stored in the cloud'
        : 'Cloud storage unavailable - sign in to enable secure data storage',
      action: 'Sign In',
      icon: Database
    },
    {
      name: 'AI Service Configuration',
      status: isConfigured && aiService.isConfigured(),
      details: isConfigured 
        ? `Provider: ${config?.provider || 'Unknown'}, Model: ${config?.model || 'Default'}`
        : 'No AI provider configured',
      action: 'Configure AI Settings',
      icon: Settings
    },
    {
      name: 'API Key',
      status: config?.apiKey && config.apiKey.length > 0,
      details: config?.apiKey 
        ? `API Key: ${config.apiKey.substring(0, 8)}...` 
        : 'No API key provided',
      action: 'Add API Key',
      icon: Settings
    },
    {
      name: 'Real Analysis Mode',
      status: isAuthenticated && isConfigured && aiService.isConfigured(),
      details: (isAuthenticated && isConfigured)
        ? 'AI analysis enabled with cloud storage'
        : 'Complete setup required for authentic analysis with cloud storage',
      action: null,
      icon: CheckCircle
    }
  ]

  const allConfigured = diagnostics.every(d => d.status)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          allConfigured ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          {allConfigured ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">System Status</h3>
          <p className="text-sm text-gray-600">
            {allConfigured 
              ? 'All systems ready for real AI analysis' 
              : 'Configuration required for authentic results'
            }
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {diagnostics.map((diagnostic, index) => {
          const IconComponent = diagnostic.icon || Settings
          return (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  diagnostic.status ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <IconComponent className={`w-4 h-4 ${
                    diagnostic.status ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{diagnostic.name}</p>
                  <p className="text-sm text-gray-600">{diagnostic.details}</p>
                </div>
              </div>
              {!diagnostic.status && diagnostic.action && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onConfigureAI}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>{diagnostic.action}</span>
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Old Data Warning */}
      {showOldDataWarning && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-2">
                ⚠️ Outdated Data Detected
              </h4>
              <p className="text-sm text-red-700 mb-3">
                Found {oldDataInfo.count} resume(s) with outdated analysis results. 
                These results should be cleared to avoid confusion.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearOldData}
                className="bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Outdated Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {!allConfigured && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">
                🚫 Complete Setup Required
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                This application provides only authentic AI analysis with secure cloud storage. 
                Complete the setup to access real analysis results and cloud data synchronization.
              </p>
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                {!isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onConfigureAI}
                    className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign Up / Sign In
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onConfigureAI}
                  className="bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure AI Settings
                </Button>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-yellow-700 hover:text-yellow-800 flex items-center"
                >
                  Get OpenAI API Key
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {allConfigured && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">✅ Ready for Real Analysis with Cloud Storage</h4>
              <p className="text-sm text-green-700">
                Your account is authenticated, cloud storage is connected, and AI service is configured. 
                All analysis results will be authentic and securely stored in the cloud.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}