/**
 * AI Service abstraction for multiple providers
 * Supports OpenAI, Google Gemini, Mistral, OpenRouter, and other OpenAI-compatible APIs
 */

export type AIProvider = 'openai' | 'google' | 'mistral' | 'openrouter' | 'custom'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  baseUrl?: string // For custom/self-hosted endpoints
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface AIResponse {
  text: string
  usage?: {
    tokens: number
    cost?: number
  }
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIProviderConfig {
  name: string
  baseUrl: string
  models: string[]
  requiresApiKey: boolean
  description: string
}

// Updated to use empty arrays for models that will be fetched dynamically
export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [], // Will be fetched dynamically
    requiresApiKey: true,
    description: 'OpenAI GPT models including GPT-4 and GPT-3.5-turbo'
  },
  google: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [], // Will be fetched dynamically
    requiresApiKey: true,
    description: 'Google\'s Gemini AI models'
  },
  mistral: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    models: [], // Will be fetched dynamically
    requiresApiKey: true,
    description: 'Mistral AI open-source and commercial models'
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [], // Will be fetched dynamically
    requiresApiKey: true,
    description: 'Access to multiple AI models through OpenRouter'
  },
  custom: {
    name: 'Custom/Self-hosted',
    baseUrl: '',
    models: ['custom-model'],
    requiresApiKey: true,
    description: 'Custom or self-hosted OpenAI-compatible API'
  }
}

class AIService {
  private config: AIConfig | null = null

  setConfig(config: AIConfig): void {
    this.config = config
  }

  getConfig(): AIConfig | null {
    return this.config
  }

  isConfigured(): boolean {
    return this.config !== null && this.config.apiKey.length > 0
  }

  async analyzeResume(resumeText: string, instructions: string): Promise<AIResponse> {
    if (!this.config) {
      throw new Error('AI service not configured. Please set up your API key in settings.')
    }

    // Validate input text
    if (!resumeText || resumeText.trim().length < 100) {
      throw new Error('Resume text is too short or empty. Please ensure the PDF contains readable text content.')
    }

    // Enhanced system prompt for more accurate analysis
    const systemPrompt = `You are a professional resume analyzer with expertise in ATS systems, HR practices, and career development. 

CRITICAL REQUIREMENTS:
1. Analyze the ACTUAL resume content provided - do not use generic or template responses
2. Provide specific, actionable feedback based on the real content
3. Scores must reflect genuine analysis, not arbitrary numbers
4. Tips must be relevant to the specific resume and job requirements
5. Response must be ONLY valid JSON - no explanations, markdown, or code blocks

Your analysis must be:
- Accurate and based on actual resume content
- Contextually relevant to the job requirements
- Specific and actionable
- Professional and constructive
- Varied in scoring (avoid identical scores across categories)

Respond ONLY with valid JSON starting with { and ending with }.`

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `${instructions}\n\nResume content to analyze:\n\n${resumeText}`
      }
    ]

    try {
      let response: AIResponse;
      
      switch (this.config.provider) {
        case 'openai':
        case 'openrouter':
        case 'custom':
          response = await this.callOpenAICompatible(messages)
          break
        case 'google':
          response = await this.callGoogleGemini(messages)
          break
        case 'mistral':
          response = await this.callMistralAI(messages)
          break
        default:
          throw new Error(`Unsupported AI provider: ${this.config.provider}`)
      }

      // Validate response contains actual content
      if (!response.text || response.text.trim().length < 100) {
        throw new Error('AI response is too short or empty. Please check your API configuration.')
      }

      return response;
      
    } catch (error) {
      console.error('AI analysis failed:', error)
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`)
    }
  }

  private async callOpenAICompatible(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.config) throw new Error('AI service not configured')

    const baseUrl = this.config.baseUrl || AI_PROVIDERS[this.config.provider].baseUrl
    const url = `${baseUrl}/chat/completions`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...(this.config.provider === 'openrouter' && {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Resume Analyzer'
        })
      },
      body: JSON.stringify({
        model: this.config.model || AI_PROVIDERS[this.config.provider].models[0],
        messages: messages,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 2000,
        // Add parameters to encourage JSON-only responses
        ...(this.config.provider === 'custom' && {
          response_format: { type: 'json_object' },
          stop: null
        })
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`AI API error (${response.status}): ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      text: data.choices[0]?.message?.content || '',
      usage: {
        tokens: data.usage?.total_tokens || 0,
        cost: this.calculateCost(data.usage?.total_tokens || 0)
      }
    }
  }

  private async callGoogleGemini(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.config) throw new Error('AI service not configured')

    const model = this.config.model || 'gemini-pro'
    const url = `${AI_PROVIDERS.google.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`

    // Convert messages to Gemini format
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: this.config.temperature || 0.7,
          maxOutputTokens: this.config.maxTokens || 2000
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Google Gemini API error (${response.status}): ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      text: data.candidates[0]?.content?.parts[0]?.text || '',
      usage: {
        tokens: data.usageMetadata?.totalTokenCount || 0
      }
    }
  }

  private async callMistralAI(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.config) throw new Error('AI service not configured')

    const url = `${AI_PROVIDERS.mistral.baseUrl}/chat/completions`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || AI_PROVIDERS.mistral.models[0],
        messages: messages,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Mistral AI API error (${response.status}): ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      text: data.choices[0]?.message?.content || '',
      usage: {
        tokens: data.usage?.total_tokens || 0
      }
    }
  }

  private calculateCost(tokens: number): number {
    if (!this.config) return 0

    // Rough cost estimation (prices change frequently, this is just for reference)
    const costPer1000Tokens = {
      'gpt-4': 0.03,
      'gpt-4-turbo': 0.01,
      'gpt-3.5-turbo': 0.002,
      'gemini-pro': 0.001,
      'gemini-1.5-pro': 0.001,
      'gemini-2.0-flash-exp': 0.0005,
      'gemini-2.5-pro-preview': 0.002,
      'mistral-7b-instruct': 0.0002,
      'mixtral-8x7b-instruct': 0.0007
    } as any

    const modelCost = costPer1000Tokens[this.config.model || ''] || 0
    return (tokens / 1000) * modelCost
  }

  getAvailableProviders(): Record<AIProvider, AIProviderConfig> {
    return AI_PROVIDERS
  }

  getProviderModels(provider: AIProvider): string[] {
    return AI_PROVIDERS[provider]?.models || []
  }

  /**
   * Fetch available models from OpenAI API
   */
  async fetchOpenAIModels(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch OpenAI models: ${response.statusText}`);
      }

      const data = await response.json();
      // Filter for chat models and sort them
      return data.data
        .filter((model: any) => model.id.includes('gpt'))
        .map((model: any) => model.id)
        .sort();
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
      return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']; // Fallback models
    }
  }

  /**
   * Fetch available models from Google Gemini API
   */
  async fetchGoogleModels(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Google models: ${response.statusText}`);
      }

      const data = await response.json();
      // Filter for gemini models and sort them
      return data.models
        .filter((model: any) => model.name.includes('gemini'))
        .map((model: any) => model.name.replace('models/', ''))
        .sort();
    } catch (error) {
      console.error('Error fetching Google models:', error);
      return ['gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.5-pro-preview']; // Fallback models
    }
  }

  /**
   * Fetch available models from Mistral AI API
   */
  async fetchMistralModels(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Mistral models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data
        .map((model: any) => model.id)
        .sort();
    } catch (error) {
      console.error('Error fetching Mistral models:', error);
      return ['mistral-7b-instruct', 'mixtral-8x7b-instruct', 'mistral-large-latest']; // Fallback models
    }
  }

  /**
   * Fetch available models from OpenRouter API
   */
  async fetchOpenRouterModels(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch OpenRouter models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data
        .map((model: any) => model.id)
        .sort();
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      return ['openai/gpt-4', 'anthropic/claude-3-opus', 'google/gemini-pro', 'mistralai/mixtral-8x7b-instruct']; // Fallback models
    }
  }

  /**
   * Fetch models for a specific provider
   */
  async fetchModelsForProvider(provider: AIProvider, apiKey: string): Promise<string[]> {
    switch (provider) {
      case 'openai':
        return this.fetchOpenAIModels(apiKey);
      case 'google':
        return this.fetchGoogleModels(apiKey);
      case 'mistral':
        return this.fetchMistralModels(apiKey);
      case 'openrouter':
        return this.fetchOpenRouterModels(apiKey);
      case 'custom':
        // For custom providers, we don't fetch models automatically
        return ['custom-model'];
      default:
        return [];
    }
  }
}

// Create singleton instance
export const aiService = new AIService()

export default aiService
