import React from 'react'
import { useLocation } from 'react-router'
import { BarChart3, Upload, Settings, Palette, X, Menu } from 'lucide-react'
import { CompactThemeSelector } from '@/components/ThemeSelector'
import { useNotification } from '@/contexts/NotificationContext'

interface NavigationItem {
  name: string
  path: string
  icon: React.ElementType
}

interface MobileNavigationProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  handleNavigation: (path: string) => void
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  handleNavigation 
}) => {
  const location = useLocation()
  const { showNotification } = useNotification()
  
  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', path: '/app/dashboard', icon: BarChart3 },
    { name: 'Upload Resume', path: '/app/upload', icon: Upload },
    { name: 'AI Settings', path: '/app/settings', icon: Settings },
    { name: 'Themes', path: '/app/themes', icon: Palette },
  ]

  const handleItemClick = (item: NavigationItem) => {
    if (item.path === '/app/upload') {
      showNotification('Navigating to Resume Upload...', 'info')
    }
    handleNavigation(item.path)
    setIsMobileMenuOpen(false)
  }

  const isActivePath = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 z-[100]">
          <div className="container mx-auto px-6 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item)}
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
    </>
  )
}
