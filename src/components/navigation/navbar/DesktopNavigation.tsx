import React from 'react'
import { useNavigate, useLocation } from 'react-router'
import { BarChart3, Upload, Settings, Palette } from 'lucide-react'
import { CompactThemeSelector } from '@/components/ThemeSelector'

interface NavigationItem {
  name: string
  path: string
  icon: React.ElementType
}

interface DesktopNavigationProps {
  handleNavigation: (path: string) => void
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ handleNavigation }) => {
  const location = useLocation()
  
  const navigationItems: NavigationItem[] = [
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

  return (
    <div className="hidden md:flex items-center space-x-2">
      {navigationItems.map((item) => (
        <button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
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
  )
}