import React, { useState, useEffect } from 'react'
import { useAIConfig, useAIConfigActions } from '@/stores/useAppStore'
import { aiService, AIConfig, AIProvider, AI_PROVIDERS } from '@/services/aiService'

interface AISettingsProps {
  onClose?: () => void
}

export const AISettings: React.FC<AISettingsProps> = ({ onClose }) => {
  const { config: storedConfig, isConfigured } = useAIConfig()
  const { setAIConfig, setAIConfigured } = useAIConfigActions()

  const [formData, setFormData] = useState<AIConfig>({
    provider: 'openai',
    apiKey: '',
    baseUrl: '',
    model: '',
    temperature: 0.7,
    maxTokens: 2000
  })
  
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (storedConfig) {
      setFormData(storedConfig)
    }
  }, [storedConfig])

  const handleProviderChange = (provider: AIProvider) => {
    const providerConfig = AI_PROVIDERS[provider]
    setFormData(prev => ({
      ...prev,
      provider,
      baseUrl: provider === 'custom' ? prev.baseUrl : providerConfig.baseUrl,
      model: providerConfig.models[0] || ''
    }))
    setTestResult(null)
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.apiKey && AI_PROVIDERS[formData.provider].requiresApiKey) {
        setTestResult('API key is required for this provider')
        return
      }

      if (formData.provider === 'custom' && !formData.baseUrl) {
        setTestResult('Base URL is required for custom provider')
        return
      }

      // Save configuration
      aiService.setConfig(formData)
      setAIConfig(formData)
      setAIConfigured(true)
      setTestResult('Configuration saved successfully!')
      
      // Auto close after saving
      setTimeout(() => {
        if (onClose) onClose()
      }, 1500)
    } catch (error) {
      setTestResult(`Error saving configuration: ${error}`)
    }
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setTestResult(null)

    try {
      // Create a temporary config for testing
      const testConfig = { ...formData }
      aiService.setConfig(testConfig)

      // Test with a simple prompt
      const response = await aiService.analyzeResume(
        'John Doe\nSoftware Engineer\nExperience: 5 years in web development',
        'Please provide a brief analysis of this resume in JSON format with just an overallScore field.'
      )

      if (response.text) {
        setTestResult('✅ Connection successful! AI service is working.')
      } else {
        setTestResult('❌ Connection failed: No response received')
      }
    } catch (error: any) {
      setTestResult(`❌ Connection failed: ${error.message || error}`)
    } finally {
      setIsTestingConnection(false)
    }
  }

  const currentProvider = AI_PROVIDERS[formData.provider]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:24px_24px]"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light text-slate-900 mb-3 tracking-tight">AI Configuration</h1>
              <p className="text-xl text-slate-600 font-light">Configure your AI provider for intelligent resume analysis</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
            <span className="text-sm font-medium text-slate-700">
              {isConfigured ? 'AI service configured and ready' : 'Configuration required'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 shadow-lg">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Choose AI Provider</h2>
                <p className="text-slate-600">Select your preferred AI service for resume analysis</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => handleProviderChange(key as AIProvider)}
                    className={`group p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                      formData.provider === key
                        ? 'border-slate-900 bg-slate-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 text-lg mb-1">{provider.name}</div>
                        <div className="text-slate-600 leading-relaxed">{provider.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        formData.provider === key
                          ? 'border-slate-900 bg-slate-900'
                          : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {formData.provider === key && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Configuration Fields */}
              <div className="space-y-6">
                {/* API Key */}
                {currentProvider.requiresApiKey && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      API Key <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={formData.apiKey}
                        onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors duration-200 pr-12 bg-white/50"
                        placeholder={`Enter your ${currentProvider.name} API key`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showApiKey ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Base URL */}
                {formData.provider === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Base URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.baseUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors duration-200 bg-white/50"
                      placeholder="https://your-api.com/v1"
                    />
                  </div>
                )}

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Model
                  </label>
                  {formData.provider === 'custom' ? (
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors duration-200 bg-white/50"
                      placeholder="Enter your custom model name"
                    />
                  ) : (
                    <select
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors duration-200 bg-white/50"
                    >
                      {currentProvider.models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Advanced Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Temperature
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors duration-200 bg-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="4000"
                      step="100"
                      value={formData.maxTokens}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors duration-200 bg-white/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Test Connection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Test Connection</h3>
                <p className="text-slate-600">Verify your configuration works correctly</p>
              </div>
              
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !formData.apiKey}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  isTestingConnection || !formData.apiKey
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isTestingConnection ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Testing connection...</span>
                  </div>
                ) : (
                  'Test Connection'
                )}
              </button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`p-6 rounded-2xl border ${
                testResult.includes('✅') 
                  ? 'bg-emerald-50 border-emerald-200'
                  : testResult.includes('❌')
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`font-medium ${
                  testResult.includes('✅') 
                    ? 'text-emerald-800'
                    : testResult.includes('❌')
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}>{testResult}</p>
              </div>
            )}

            {/* Save Configuration */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Save Configuration</h3>
                <p className="text-slate-600">Apply settings to start analyzing resumes</p>
              </div>
              
              <button
                onClick={handleSave}
                disabled={!formData.apiKey && currentProvider.requiresApiKey}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  (!formData.apiKey && currentProvider.requiresApiKey)
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                Save Configuration
              </button>
            </div>

            {/* Current Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Current Status</h3>
                <p className="text-slate-600">Overview of your AI configuration</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Provider</span>
                  <span className="font-semibold text-slate-900">{currentProvider.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Model</span>
                  <span className="font-semibold text-slate-900">{formData.model || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-600">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                    <span className={`font-semibold ${
                      isConfigured ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {isConfigured ? 'Ready' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Getting API Keys</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">OpenAI</h4>
              <p className="text-gray-600 mb-2">Get your API key from the OpenAI platform</p>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Get API Key →
              </a>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Google Gemini</h4>
              <p className="text-gray-600 mb-2">Create an API key in Google AI Studio</p>
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Get API Key →
              </a>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Mistral AI</h4>
              <p className="text-gray-600 mb-2">Register and get your API key from Mistral</p>
              <a 
                href="https://console.mistral.ai/api-keys/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Get API Key →
              </a>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">OpenRouter</h4>
              <p className="text-gray-600 mb-2">Access multiple models with one API key</p>
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Get API Key →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISettings