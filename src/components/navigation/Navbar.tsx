import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth, useAuthActions } from '@/stores/useAppStore'
import puterService from '@/services/puterService'
import { CompactThemeSelector } from '@/components/ThemeSelector'
import { Menu, X, Home, Upload, Settings, Palette, LogOut, User } from 'lucide-react'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const { setAuthenticated, setUser } = useAuthActions()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
    
    try {
      await puterService.auth.signOut()
      setAuthenticated(false)
      setUser(null)
      
      // Navigate to auth page
      navigate('/auth')
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Upload Resume', path: '/upload', icon: Upload },
    { name: 'AI Settings', path: '/settings', icon: Settings },
    { name: 'Themes', path: '/themes', icon: Palette },
  ]

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
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
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                AI Resume Analyzer
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-all duration-300 ${
                    isActivePath(item.path) ? 'text-blue-600' : 'group-hover:scale-110'
                  }`} />
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Theme Selector */}
              <div className="ml-4">
                <CompactThemeSelector />
              </div>
            </div>

            {/* User Menu and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center border border-blue-200/50 group-hover:scale-105 transition-all duration-300">
                    <span className="text-blue-700 font-semibold text-sm">
                      {user?.email?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-semibold text-slate-900">
                      {user?.name || 'User'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {user?.email || 'No email'}
                    </div>
                  </div>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/50 py-2 z-[110] backdrop-blur-xl">
                    <div className="px-6 py-4 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center border border-blue-200/50">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-sm text-slate-500">
                            {user?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex items-center space-x-3 w-full text-left px-6 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-300 disabled:opacity-50 group"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 z-[100]">
            <div className="container mx-auto px-6 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`group flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActivePath(item.path)
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 transition-all duration-300 ${
                      isActivePath(item.path) ? 'text-blue-600' : 'group-hover:scale-110'
                    }`} />
                    <span>{item.name}</span>
                  </button>
                ))}
                
                <div className="pt-4 border-t border-slate-200/50 mt-4">
                  <CompactThemeSelector />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdowns */}
      {(isDropdownOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-[90]" 
          onClick={() => {
            setIsDropdownOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </>
  )
}