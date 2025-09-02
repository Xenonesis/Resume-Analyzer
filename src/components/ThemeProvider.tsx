import React, { useEffect } from 'react'
import { useTheme } from '@/stores/useAppStore'
import { getTheme, applyThemeToDocument } from '@/utils/themes'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const currentTheme = useTheme()

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const theme = getTheme(currentTheme)
    applyThemeToDocument(theme)
  }, [currentTheme])

  // Apply theme immediately on first render (before useEffect)
  React.useMemo(() => {
    const theme = getTheme(currentTheme)
    applyThemeToDocument(theme)
  }, [currentTheme])

  return <>{children}</>
}