import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth, useAIConfig } from '@/stores/useAppStore'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { NotificationCenter } from '@/components/dashboard/NotificationCenter'
import { aiService } from '@/services/aiService'
import { Logo } from './navbar/Logo'
import { DesktopNavigation } from './navbar/DesktopNavigation'
import { MobileNavigation } from './navbar/MobileNavigation'
import { UserMenu } from './navbar/UserMenu'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const { config, isConfigured } = useAIConfig()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { signOut } = useSupabaseAuth()

  const handleNavigation = (path: string) => {
    // Check if navigating to upload and if configuration is required
    if (path === '/app/upload') {
      const hasValidConfig = isAuthenticated && 
                            isConfigured && 
                            aiService.isConfigured() && 
                            config?.apiKey && 
                            config.apiKey.length > 0

      if (!hasValidConfig) {
        navigate('/app/settings')
        return
      }
    }
    navigate(path)
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setIsMobileMenuOpen(false)
    
    try {
      await signOut()
      // Navigate to landing page
      navigate('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Temporarily show navbar regardless of auth status for testing
  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 fixed top-0 left-0 right-0 z-[100]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <DesktopNavigation handleNavigation={handleNavigation} />

            {/* User Menu and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Notification Center */}
              <NotificationCenter />
              
              {/* Mobile Navigation */}
              <MobileNavigation 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                handleNavigation={handleNavigation}
              />

              {/* User Menu */}
              <UserMenu 
                user={user}
                handleSignOut={handleSignOut}
                isSigningOut={isSigningOut}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Click outside to close dropdowns */}
      {(isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-[90]" 
          onClick={() => {
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </>
  )
}
