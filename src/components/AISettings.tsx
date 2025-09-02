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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Configuration</h1>
            <p className="text-slate-600 mt-2">Configure your AI provider for intelligent resume analysis</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Status Banner */}
        <div className={`mb-8 p-4 rounded-xl ${isConfigured ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <span className="font-medium text-slate-800">
              {isConfigured ? 'AI service configured and ready' : 'Configuration required'}
            </span>
          </div>
        </div>

        {/* Success Message - Show when configured */}
        {isConfigured && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">✅ Ready for Real Analysis</h3>
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
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 1: Get API Key</h3>
                <p className="text-slate-600 text-sm">
                  Choose an AI provider below and create an API key. We recommend OpenAI for best results.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 2: Configure</h3>
                <p className="text-slate-600 text-sm">
                  Enter your API key in the form below. Test the connection to ensure it works properly.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Your AI Provider</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">OpenAI</h4>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Most popular and reliable option</p>
                  <p className="text-xs text-slate-500 mb-3">Cost: ~$0.01 per resume</p>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    Get API Key
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="p-4 rounded-lg border-2 border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 mb-2">Google Gemini</h4>
                  <p className="text-sm text-slate-600 mb-3">Free tier available, good performance</p>
                  <p className="text-xs text-slate-500 mb-3">Cost: Free tier available</p>
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    Get API Key
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="p-4 rounded-lg border-2 border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 mb-2">Mistral AI</h4>
                  <p className="text-sm text-slate-600 mb-3">European alternative, competitive pricing</p>
                  <p className="text-xs text-slate-500 mb-3">Cost: ~$0.001 per resume</p>
                  <a
                    href="https://console.mistral.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    Get API Key
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Why No Mock Data */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">
                🚫 Why We Don't Provide Mock Data
              </h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• <strong>Real Value:</strong> Mock data doesn't help you improve your actual resume</li>
                <li>• <strong>Authentic Insights:</strong> Only real AI can provide meaningful, actionable feedback</li>
                <li>• <strong>Professional Standards:</strong> We maintain high quality by ensuring all results are genuine</li>
                <li>• <strong>Trust:</strong> You deserve honest analysis with accurate scoring</li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">AI Provider</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => handleProviderChange(key as AIProvider)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.provider === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-900">{provider.name}</div>
                    <div className="text-sm text-slate-600 mt-1">{provider.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">API Configuration</h2>
              
              {/* API Key */}
              {currentProvider.requiresApiKey && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.apiKey}
                      onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      placeholder={`Enter your ${currentProvider.name} API key`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showApiKey ? (
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Base URL */}
              {formData.provider === 'custom' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Base URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="https://your-api.com/v1"
                  />
                </div>
              )}

              {/* Model Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Model Selection
                  </label>
                  {formData.provider !== 'custom' && (
                    <button
                      type="button"
                      onClick={() => setUseCustomModel(!useCustomModel)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {useCustomModel ? 'Use fetched models' : 'Set custom model'}
                    </button>
                  )}
                </div>

                {formData.provider === 'custom' || useCustomModel ? (
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="Enter model name (e.g., gpt-4, gemini-pro)"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search models..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none bg-white"
                        disabled={isFetchingModels}
                      >
                        <option value="">Select a model</option>
                        {availableModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Advanced Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Precise</span>
                    <span className="font-medium text-slate-700">{formData.temperature}</span>
                    <span>Creative</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Test Connection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Test Connection</h3>
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !formData.apiKey}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  isTestingConnection || !formData.apiKey
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isTestingConnection ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Testing...
                  </div>
                ) : (
                  'Test Connection'
                )}
              </button>
              
              {testResult && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  testResult.includes('✅') 
                    ? 'bg-emerald-50 text-emerald-800'
                    : testResult.includes('❌')
                    ? 'bg-red-50 text-red-800'
                    : 'bg-blue-50 text-blue-800'
                }`}>
                  {testResult}
                </div>
              )}
            </div>

            {/* Save Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Save Configuration</h3>
              <button
                onClick={handleSave}
                disabled={!formData.apiKey && currentProvider.requiresApiKey}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  (!formData.apiKey && currentProvider.requiresApiKey)
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Save Configuration
              </button>
            </div>

            {/* Current Configuration */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Configuration</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Provider</span>
                  <span className="font-medium text-slate-900">{currentProvider.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Model</span>
                  <span className="font-medium text-slate-900">{formData.model || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Temperature</span>
                  <span className="font-medium text-slate-900">{formData.temperature}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Max Tokens</span>
                  <span className="font-medium text-slate-900">{formData.maxTokens}</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Get API Keys</h3>
              <div className="space-y-3">
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-slate-900">OpenAI</div>
                  <div className="text-sm text-slate-600">Get API key</div>
                </a>
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-slate-900">Google Gemini</div>
                  <div className="text-sm text-slate-600">Create API key</div>
                </a>
                <a 
                  href="https://console.mistral.ai/api-keys/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-slate-900">Mistral AI</div>
                  <div className="text-sm text-slate-600">Register for key</div>
                </a>
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-slate-900">OpenRouter</div>
                  <div className="text-sm text-slate-600">Access models</div>
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
