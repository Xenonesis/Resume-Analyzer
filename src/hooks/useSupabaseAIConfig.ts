/**
 * Supabase AI configuration hook
 */

import { useCallback, useEffect } from 'react'
import { useAuth, useAIConfigActions } from '@/stores/useAppStore'
import { supabaseService } from '@/services/supabaseService'
import { AIConfig, aiService } from '@/services/aiService'

export const useSupabaseAIConfig = () => {
  const { user } = useAuth()
  const { setAIConfig, setAIConfigured } = useAIConfigActions()

  const loadAIConfig = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabaseService.data.getAIConfig(user.id)
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error
      }

      if (data) {
        const config: AIConfig = {
          provider: data.provider,
          apiKey: data.api_key,
          baseUrl: data.base_url,
          model: data.model,
          temperature: data.temperature,
          maxTokens: data.max_tokens
        }

        setAIConfig(config)
        setAIConfigured(true)
        aiService.setConfig(config)
      } else {
        setAIConfig(null)
        setAIConfigured(false)
      }
    } catch (error: any) {
      console.error('Error loading AI config:', error)
      setAIConfig(null)
      setAIConfigured(false)
    }
  }, [user, setAIConfig, setAIConfigured])

  const saveAIConfig = useCallback(async (config: AIConfig) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const configData = {
        provider: config.provider,
        api_key: config.apiKey,
        base_url: config.baseUrl,
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens
      }

      const { data, error } = await supabaseService.data.saveAIConfig(user.id, configData)
      if (error) throw error

      setAIConfig(config)
      setAIConfigured(true)
      aiService.setConfig(config)

      return data
    } catch (error: any) {
      console.error('Error saving AI config:', error)
      throw error
    }
  }, [user, setAIConfig, setAIConfigured])

  const clearAIConfig = useCallback(async () => {
    if (!user) return

    try {
      // Delete the AI config from database
      const { error } = await supabaseService.getClient()
        .from('ai_configs')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setAIConfig(null)
      setAIConfigured(false)
      aiService.setConfig(null as any)
    } catch (error: any) {
      console.error('Error clearing AI config:', error)
      throw error
    }
  }, [user, setAIConfig, setAIConfigured])

  // Load AI config when user changes
  useEffect(() => {
    if (user) {
      loadAIConfig()
    } else {
      setAIConfig(null)
      setAIConfigured(false)
    }
  }, [user, loadAIConfig, setAIConfig, setAIConfigured])

  return {
    loadAIConfig,
    saveAIConfig,
    clearAIConfig
  }
}