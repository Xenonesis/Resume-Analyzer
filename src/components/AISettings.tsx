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
  const [fetchedModels, setFetchedModels] = useState<Record<AIProvider, string[]>>({
    openai: [],
    google: [],
    mistral: [],
    openrouter: [],
    custom: ['custom-model']
  })
  const [isFetchingModels, setIsFetchingModels] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [useCustomModel, setUseCustomModel] = useState(false)

  useEffect(() => {
    if (storedConfig) {
      setFormData(storedConfig)
      // Check if the model is in the fetched models list
      if (storedConfig.provider && storedConfig.model) {
        const models = fetchedModels[storedConfig.provider] || []
        if (!models.includes(storedConfig.model)) {
          setUseCustomModel(true)
        }
      }
    }
  }, [storedConfig])

  // Fetch models when provider or API key changes
  useEffect(() => {
    const fetchModels = async () => {
      // Don't fetch models for custom provider or if no API key
      if (formData.provider === 'custom' || !formData.apiKey) {
        return
      }

      setIsFetchingModels(true)
      try {
        const models = await aiService.fetchModelsForProvider(formData.provider, formData.apiKey)
        setFetchedModels(prev => ({
          ...prev,
          [formData.provider]: models
        }))
      } catch (error) {
        console.error(`Error fetching models for ${formData.provider}:`, error)
      } finally {
        setIsFetchingModels(false)
      }
    }

    fetchModels()
  }, [formData.provider, formData.apiKey])

  const handleProviderChange = (provider: AIProvider) => {
    const providerConfig = AI_PROVIDERS[provider]
    setFormData(prev => ({
      ...prev,
      provider,
      baseUrl: provider === 'custom' ? prev.baseUrl : providerConfig.baseUrl,
      model: ''
    }))
    setUseCustomModel(false)
    setSearchTerm('')
    setTestResult(null)
  }

  const handleModelChange = (model: string) => {
    setFormData(prev => ({
      ...prev,
      model
    }))
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
  const availableModels = (fetchedModels[formData.provider] || [])
    .filter(model => model.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              AI Configuration
            </h1>
            <p className="text-slate-600 mt-2">Configure your AI provider for intelligent resume analysis</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-slate-200 transition-colors shadow-sm border border-slate-200"
            >
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Status Banner */}
        <div className={`mb-8 p-5 rounded-2xl shadow-sm transition-all duration-300 ${
          isConfigured 
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200' 
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
        }`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
              isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
            }`}>
              {isConfigured && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="font-medium text-slate-800 text-lg">
              {isConfigured ? 'AI service configured and ready' : 'Configuration required'}
            </span>
          </div>
        </div>

        {/* Success Message - Show when configured */}
        {isConfigured && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-2">✅ Ready for Real Analysis</h3>
                <p className="text-green-700">
                  Your AI service is properly configured. All analysis results will be authentic and generated by real AI.
                  You can now upload resumes and get genuine insights.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Setup Guide - Show when not configured */}
        {!isConfigured && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                🚀 Get Started with Real AI Analysis
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                This application provides only authentic AI-powered resume analysis. 
                Follow these simple steps to configure your AI service and get real, valuable insights.
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 1: Get API Key</h3>
                <p className="text-slate-600 text-sm">
                  Choose an AI provider below and create an API key. We recommend OpenAI for best results.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 2: Configure</h3>
                <p className="text-slate-600 text-sm">
                  Enter your API key in the form below. Test the connection to ensure it works properly.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 3: Analyze</h3>
                <p className="text-slate-600 text-sm">
                  Upload your resume and get authentic AI analysis with real scores and actionable feedback.
                </p>
              </div>
            </div>

            {/* Provider Comparison */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 mb-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Choose Your AI Provider
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                  <div 
                    key={key}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                      formData.provider === key
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => handleProviderChange(key as AIProvider)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{provider.name}</h4>
                      {key === 'openai' && (
                        <span className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{provider.description}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {key === 'openai' && 'Cost: ~$0.01 per resume'}
                      {key === 'google' && 'Cost: Free tier available'}
                      {key === 'mistral' && 'Cost: ~$0.001 per resume'}
                      {key === 'openrouter' && 'Access to multiple models'}
                      {key === 'custom' && 'Self-hosted solution'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why No Mock Data */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                🚫 Why We Don't Provide Mock Data
              </h3>
              <ul className="text-sm text-yellow-700 space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Real Value:</strong> Mock data doesn't help you improve your actual resume</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Authentic Insights:</strong> Only real AI can provide meaningful, actionable feedback</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Professional Standards:</strong> We maintain high quality by ensuring all results are genuine</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Trust:</strong> You deserve honest analysis with accurate scoring</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Provider Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                AI Provider
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => handleProviderChange(key as AIProvider)}
                    className={`p-5 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-md ${
                      formData.provider === key
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-slate-900 flex items-center">
                      {provider.name}
                      {key === 'openai' && (
                        <span className="ml-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 mt-2">{provider.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                API Configuration
              </h2>
              
              {/* API Key */}
              {currentProvider.requiresApiKey && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    API Key <span className="text-red-500 ml-1">*</span>
                    <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Required
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.apiKey}
                      onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                      placeholder={`Enter your ${currentProvider.name} API key`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showApiKey ? (
                        <svg className="w-5 h-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Your API key is stored securely in your browser and never sent to our servers.
                  </p>
                </div>
              )}

              {/* Custom Base URL */}
              {formData.provider === 'custom' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    Base URL <span className="text-red-500 ml-1">*</span>
                    <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Required for custom provider
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                    placeholder="https://your-api.com/v1"
                  />
                </div>
              )}

              {/* Model Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Model Selection
                  </label>
                  {formData.provider !== 'custom' && (
                    <button
                      type="button"
                      onClick={() => setUseCustomModel(!useCustomModel)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      {useCustomModel ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Use fetched models
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Set custom model
                        </>
                      )}
                    </button>
                  )}
                </div>

                {formData.provider === 'custom' || useCustomModel ? (
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                    placeholder="Enter model name (e.g., gpt-4, gemini-pro)"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search models..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                      />
                      {isFetchingModels && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <div className="animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <select
                        value={formData.model}
                        onChange={(e) => handleModelChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 appearance-none bg-white"
                        disabled={isFetchingModels}
                      >
                        <option value="">Select a model</option>
                        {availableModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700">
                        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Advanced Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Temperature: {formData.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                      </svg>
                      Precise
                    </span>
                    <span className="font-medium text-slate-700">{formData.temperature}</span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                      Creative
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Controls randomness: Lower values are more focused and deterministic, higher values are more random and creative.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Maximum number of tokens to generate. Higher values allow for longer responses but may cost more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Test Connection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Test Connection
              </h3>
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !formData.apiKey}
                className={`w-full py-3 px-4 rounded-xl font-medium transition duration-300 flex items-center justify-center ${
                  isTestingConnection || !formData.apiKey
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isTestingConnection ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Test Connection
                  </>
                )}
              </button>
              
              {testResult && (
                <div className={`mt-4 p-4 rounded-xl text-sm transition-all duration-300 ${
                  testResult.includes('✅') 
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-200'
                    : testResult.includes('❌')
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-800 border border-red-200'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-0.5">
                      {testResult.includes('✅') ? (
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : testResult.includes('❌') ? (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>{testResult}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Configuration
              </h3>
              <button
                onClick={handleSave}
                disabled={!formData.apiKey && currentProvider.requiresApiKey}
                className={`w-full py-3 px-4 rounded-xl font-medium transition duration-300 flex items-center justify-center ${
                  (!formData.apiKey && currentProvider.requiresApiKey)
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-md hover:shadow-lg'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Configuration
              </button>
            </div>

            {/* Current Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Current Configuration
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Provider
                  </span>
                  <span className="font-medium text-slate-900">{currentProvider.name}</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Model
                  </span>
                  <span className="font-medium text-slate-900">{formData.model || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Temperature
                  </span>
                  <span className="font-medium text-slate-900">{formData.temperature}</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Max Tokens
                  </span>
                  <span className="font-medium text-slate-900">{formData.maxTokens}</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get API Keys
              </h3>
              <div className="space-y-3">
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition duration-300 group"
                >
                  <div className="font-medium text-slate-900 flex items-center">
                    OpenAI
                    <svg className="w-4 h-4 ml-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Get API key</div>
                </a>
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition duration-300 group"
                >
                  <div className="font-medium text-slate-900 flex items-center">
                    Google Gemini
                    <svg className="w-4 h-4 ml-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Create API key</div>
                </a>
                <a 
                  href="https://console.mistral.ai/api-keys/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition duration-300 group"
                >
                  <div className="font-medium text-slate-900 flex items-center">
                    Mistral AI
                    <svg className="w-4 h-4 ml-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Register for key</div>
                </a>
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition duration-300 group"
                >
                  <div className="font-medium text-slate-900 flex items-center">
                    OpenRouter
                    <svg className="w-4 h-4 ml-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Access models</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISettings