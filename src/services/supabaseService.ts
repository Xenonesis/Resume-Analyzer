/**
 * Supabase service for AI Resume Analyzer
 * Handles authentication, file storage, and resume data
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export interface SupabaseAuthService {
  signIn(email: string, password: string): Promise<{ user: User | null; error: any }>
  signUp(email: string, password: string): Promise<{ user: User | null; error: any }>
  signInWithProvider(provider: 'google' | 'github'): Promise<{ error: any }>
  signOut(): Promise<{ error: any }>
  getCurrentUser(): Promise<User | null>
  getCurrentSession(): Promise<Session | null>
  onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void
}

export interface SupabaseStorageService {
  uploadFile(bucket: string, path: string, file: File): Promise<{ data: any; error: any }>
  downloadFile(bucket: string, path: string): Promise<{ data: Blob | null; error: any }>
  deleteFile(bucket: string, path: string): Promise<{ error: any }>
  getPublicUrl(bucket: string, path: string): { data: { publicUrl: string } }
  listFiles(bucket: string, path?: string): Promise<{ data: any[] | null; error: any }>
}

export interface SupabaseDataService {
  // Resume operations
  getResumes(userId: string): Promise<{ data: any[] | null; error: any }>
  createResume(resume: any): Promise<{ data: any | null; error: any }>
  updateResume(id: string, updates: any): Promise<{ data: any | null; error: any }>
  deleteResume(id: string): Promise<{ error: any }>
  
  // AI Config operations
  getAIConfig(userId: string): Promise<{ data: any | null; error: any }>
  saveAIConfig(userId: string, config: any): Promise<{ data: any | null; error: any }>
}

class SupabaseService {
  private supabase: SupabaseClient
  private initialized = false

  constructor() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
    }

    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    this.initialized = true
  }

  // Authentication Service
  get auth(): SupabaseAuthService {
    return {
      signIn: async (email: string, password: string) => {
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password
        })
        return { user: data.user, error }
      },

      signUp: async (email: string, password: string) => {
        const { data, error } = await this.supabase.auth.signUp({
          email,
          password
        })
        return { user: data.user, error }
      },

      signInWithProvider: async (provider: 'google' | 'github') => {
        const { error } = await this.supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        return { error }
      },

      signOut: async () => {
        const { error } = await this.supabase.auth.signOut()
        return { error }
      },

      getCurrentUser: async () => {
        const { data: { user } } = await this.supabase.auth.getUser()
        return user
      },

      getCurrentSession: async () => {
        const { data: { session } } = await this.supabase.auth.getSession()
        return session
      },

      onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        const { data: { subscription } } = this.supabase.auth.onAuthStateChange(callback)
        return () => subscription.unsubscribe()
      }
    }
  }

  // File Storage Service
  get storage(): SupabaseStorageService {
    return {
      uploadFile: async (bucket: string, path: string, file: File) => {
        const { data, error } = await this.supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: true
          })
        return { data, error }
      },

      downloadFile: async (bucket: string, path: string) => {
        const { data, error } = await this.supabase.storage
          .from(bucket)
          .download(path)
        return { data, error }
      },

      deleteFile: async (bucket: string, path: string) => {
        const { error } = await this.supabase.storage
          .from(bucket)
          .remove([path])
        return { error }
      },

      getPublicUrl: (bucket: string, path: string) => {
        return this.supabase.storage
          .from(bucket)
          .getPublicUrl(path)
      },

      listFiles: async (bucket: string, path = '') => {
        const { data, error } = await this.supabase.storage
          .from(bucket)
          .list(path)
        return { data, error }
      }
    }
  }

  // Database Service
  get data(): SupabaseDataService {
    return {
      // Resume operations
      getResumes: async (userId: string) => {
        const { data, error } = await this.supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        return { data, error }
      },

      createResume: async (resume: any) => {
        const { data, error } = await this.supabase
          .from('resumes')
          .insert([resume])
          .select()
          .single()
        return { data, error }
      },

      updateResume: async (id: string, updates: any) => {
        const { data, error } = await this.supabase
          .from('resumes')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()
        return { data, error }
      },

      deleteResume: async (id: string) => {
        const { error } = await this.supabase
          .from('resumes')
          .delete()
          .eq('id', id)
        return { error }
      },

      // AI Config operations
      getAIConfig: async (userId: string) => {
        const { data, error } = await this.supabase
          .from('ai_configs')
          .select('*')
          .eq('user_id', userId)
          .single()
        return { data, error }
      },

      saveAIConfig: async (userId: string, config: any) => {
        const { data, error } = await this.supabase
          .from('ai_configs')
          .upsert({
            user_id: userId,
            ...config,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        return { data, error }
      }
    }
  }

  // Utility methods
  isInitialized(): boolean {
    return this.initialized
  }

  getClient(): SupabaseClient {
    return this.supabase
  }

  // Initialize database tables (for development)
  async initializeTables(): Promise<void> {
    // This would typically be done via Supabase migrations
    // but we can provide SQL for manual setup
    console.log('Database tables should be created via Supabase dashboard or migrations')
  }
}

// Create singleton instance
export const supabaseService = new SupabaseService()

export default supabaseService