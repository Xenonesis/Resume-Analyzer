/**
 * Supabase authentication hook with robust error handling
 */

import { useEffect } from 'react'
import { useAuthActions } from '@/stores/useAppStore'
import { supabaseService } from '@/services/supabaseService'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User as AppUser } from '@/types'

export const useSupabaseAuth = () => {
  const { setAuthenticated, setUser } = useAuthActions()

  useEffect(() => {
    let mounted = true

    // Initialize auth
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabaseService.getClient().auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          throw error
        }
        
        if (!mounted) return
        
        const user = session?.user || null
        setAuthenticated(!!user)
        setUser(user ? convertSupabaseUser(user) : null)
        
        // Only log once during initialization
        if (user) {
          console.log('Supabase auth initialized successfully')
        }
      } catch (error) {
        console.error('Supabase auth initialization error:', error)
        if (mounted) {
          // On error, assume no authentication but don't crash
          setAuthenticated(false)
          setUser(null)
        }
      }
    }

    // Initialize auth
    initializeAuth()

    // Set up auth state listener
    let subscription: any = null
    
    try {
      const { data: { subscription: authSubscription } } = supabaseService.getClient().auth.onAuthStateChange(
        (event, session) => {
          if (!mounted) return
          
          // Only log auth state changes once to reduce noise
          if (event === 'SIGNED_OUT') {
            console.log(`Supabase auth: ${event}`)
          }
          
          const user = session?.user || null
          setAuthenticated(!!user)
          setUser(user ? convertSupabaseUser(user) : null)
        }
      )
      
      subscription = authSubscription
    } catch (error) {
      console.error('Error setting up auth state listener:', error)
    }

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [setAuthenticated, setUser])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseService.getClient().auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        throw error
      }
      
      // Sign in successful
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Sign in failed:', error)
      return { success: false, error: error.message || 'Sign in failed' }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseService.getClient().auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        throw error
      }
      
      // Sign up successful
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Sign up failed:', error)
      return { success: false, error: error.message || 'Sign up failed' }
    }
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabaseService.getClient().auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Provider sign in error:', error)
        throw error
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Provider sign in failed:', error)
      return { success: false, error: error.message || 'Provider sign in failed' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabaseService.getClient().auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Sign out failed:', error)
      return { success: false, error: error.message || 'Sign out failed' }
    }
  }

  return {
    signIn,
    signUp,
    signInWithProvider,
    signOut
  }
}

// Helper function to convert Supabase user to app user format
const convertSupabaseUser = (supabaseUser: SupabaseUser): AppUser => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.full_name || 
        supabaseUser.user_metadata?.name || 
        supabaseUser.email?.split('@')[0] || 
        'User',
  avatar: supabaseUser.user_metadata?.avatar_url || 
          supabaseUser.user_metadata?.picture || 
          null,
  createdAt: new Date(supabaseUser.created_at)
})