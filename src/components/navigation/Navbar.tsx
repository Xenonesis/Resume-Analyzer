import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/stores/useAppStore'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { CompactThemeSelector } from '@/components/ThemeSelector'
import { Menu, X, Home, Upload, Settings, Palette, LogOut, User, BarChart3 } from 'lucide-react'
import { NotificationCenter } from '@/components/dashboard/NotificationCenter'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { signOut } = useSupabaseAuth()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setIsDropdownOpen(false)
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

  const navigationItems = [
    { name: 'Home', path: '/app', icon: Home },
    { name: 'Dashboard', path: '/app/dashboard', icon: BarChart3 },
    { name: 'Upload Resume', path: '/app/upload', icon: Upload },
    { name: 'AI Settings', path: '/app/settings', icon: Settings },
    { name: 'Themes', path: '/app/themes', icon: Palette },
  ]

  const isActivePath = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app'
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
              onClick={() => navigate('/app')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]"></div>
                </div>

                {/* AI Brain/Document hybrid icon */}
                <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none">
                  {/* Document base */}
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        d="M14 2v6h6" />

                  {/* AI Neural network dots */}
                  <circle cx="9" cy="9" r="1" fill="currentColor" opacity="0.8"/>
                  <circle cx="15" cy="9" r="1" fill="currentColor" opacity="0.8"/>
                  <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.8"/>
                  <circle cx="9" cy="15" r="1" fill="currentColor" opacity="0.8"/>
                  <circle cx="15" cy="15" r="1" fill="currentColor" opacity="0.8"/>

                  {/* Neural connections */}
                  <path stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"
                        d="M9 9 L12 12 L15 9 M9 15 L12 12 L15 15 M9 9 L9 15 M15 9 L15 15"/>
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
              {/* Notification Center */}
              <NotificationCenter />
              
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
                      {user?.email || ''}
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
                            {user?.email || ''}
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
