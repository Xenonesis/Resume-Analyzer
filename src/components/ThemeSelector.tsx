import React, { useState } from 'react'
import { useTheme, useThemeActions } from '@/stores/useAppStore'
import { themes, getTheme, applyThemeToDocument } from '@/utils/themes'
import { ThemeName } from '@/types/theme'

interface ThemeSelectorProps {
  className?: string
  showLabel?: boolean
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const currentTheme = useTheme()
  const { setTheme } = useThemeActions()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (themeName: ThemeName) => {
    setTheme(themeName)
    const theme = getTheme(themeName)
    applyThemeToDocument(theme)
    setIsOpen(false)
  }

  const currentThemeData = getTheme(currentTheme)

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ 
                background: `linear-gradient(135deg, ${currentThemeData.colors.primary[500]}, ${currentThemeData.colors.accent[500]})` 
              }}
            />
            <span className="font-medium text-gray-900">
              {currentThemeData.displayName}
            </span>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as ThemeName)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                    currentTheme === key ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-sm flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.accent[500]})` 
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {theme.displayName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {theme.name === 'default' && 'Classic blue theme'}
                      {theme.name === 'emerald' && 'Fresh green vibes'}
                      {theme.name === 'rose' && 'Warm pink tones'}
                      {theme.name === 'nighty' && 'Dark mode elegance'}
                      {theme.name === 'ocean' && 'Cool blue depths'}
                      {theme.name === 'sunset' && 'Warm orange glow'}
                      {theme.name === 'forest' && 'Natural earth tones'}
                    </div>
                  </div>
                  {currentTheme === key && (
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Compact version for navbar
export const CompactThemeSelector: React.FC = () => {
  const currentTheme = useTheme()
  const { setTheme } = useThemeActions()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (themeName: ThemeName) => {
    setTheme(themeName)
    const theme = getTheme(themeName)
    applyThemeToDocument(theme)
    setIsOpen(false)
  }

  const currentThemeData = getTheme(currentTheme)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        title={`Current theme: ${currentThemeData.displayName}`}
      >
        <div 
          className="w-5 h-5 rounded-full border border-white shadow-sm"
          style={{ 
            background: `linear-gradient(135deg, ${currentThemeData.colors.primary[500]}, ${currentThemeData.colors.accent[500]})` 
          }}
        />
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Choose Theme</h3>
              <p className="text-sm text-gray-500">Customize your experience</p>
            </div>
            
            <div className="py-2">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as ThemeName)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                    currentTheme === key ? 'bg-primary-50' : ''
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-lg border border-white shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.accent[500]})` 
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {theme.displayName}
                    </div>
                  </div>
                  {currentTheme === key && (
                    <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}