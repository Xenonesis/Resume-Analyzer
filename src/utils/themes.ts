import { Theme, ThemeName, ThemeConfig } from '@/types/theme'

export const themes: Record<ThemeName, Theme> = {
  default: {
    name: 'default',
    displayName: 'Classic Blue',
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      accent: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
      },
      background: {
        primary: '#f8fafc',
        secondary: '#ffffff',
        tertiary: '#f1f5f9',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        muted: '#64748b',
      },
      border: {
        primary: '#e2e8f0',
        secondary: '#cbd5e1',
      },
    },
    gradients: {
      primary: 'from-blue-600 via-purple-600 to-blue-700',
      secondary: 'from-blue-50 via-indigo-50 to-purple-50',
      hero: 'from-blue-600 via-purple-600 to-pink-600',
      card: 'from-blue-50/30 to-purple-50/30',
    },
  },
  emerald: {
    name: 'emerald',
    displayName: 'Emerald Forest',
    colors: {
      primary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
      secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      accent: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
      },
      background: {
        primary: '#f0fdf4',
        secondary: '#ffffff',
        tertiary: '#ecfdf5',
      },
      text: {
        primary: '#064e3b',
        secondary: '#047857',
        muted: '#059669',
      },
      border: {
        primary: '#bbf7d0',
        secondary: '#86efac',
      },
    },
    gradients: {
      primary: 'from-emerald-600 via-green-600 to-teal-600',
      secondary: 'from-emerald-50 via-green-50 to-teal-50',
      hero: 'from-emerald-600 via-green-600 to-teal-600',
      card: 'from-emerald-50/30 to-green-50/30',
    },
  },
  rose: {
    name: 'rose',
    displayName: 'Rose Garden',
    colors: {
      primary: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
      },
      secondary: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
      },
      accent: {
        50: '#fef7ee',
        100: '#fdedd3',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      background: {
        primary: '#fff1f2',
        secondary: '#ffffff',
        tertiary: '#fdf2f8',
      },
      text: {
        primary: '#881337',
        secondary: '#be123c',
        muted: '#e11d48',
      },
      border: {
        primary: '#fecdd3',
        secondary: '#fda4af',
      },
    },
    gradients: {
      primary: 'from-rose-600 via-pink-600 to-orange-600',
      secondary: 'from-rose-50 via-pink-50 to-orange-50',
      hero: 'from-rose-600 via-pink-600 to-orange-600',
      card: 'from-rose-50/30 to-pink-50/30',
    },
  },
  nighty: {
    name: 'nighty',
    displayName: 'Midnight Dark',
    colors: {
      primary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      secondary: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
      },
      accent: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      background: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#e2e8f0',
        muted: '#cbd5e1',
      },
      border: {
        primary: '#334155',
        secondary: '#475569',
      },
    },
    gradients: {
      primary: 'from-slate-800 via-gray-800 to-zinc-800',
      secondary: 'from-slate-900 via-gray-900 to-zinc-900',
      hero: 'from-slate-800 via-gray-800 to-blue-800',
      card: 'from-slate-800/30 to-gray-800/30',
    },
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean Breeze',
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      secondary: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
      },
      accent: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
      },
      background: {
        primary: '#f0f9ff',
        secondary: '#ffffff',
        tertiary: '#ecfeff',
      },
      text: {
        primary: '#0c4a6e',
        secondary: '#0369a1',
        muted: '#0284c7',
      },
      border: {
        primary: '#bae6fd',
        secondary: '#7dd3fc',
      },
    },
    gradients: {
      primary: 'from-sky-600 via-cyan-600 to-teal-600',
      secondary: 'from-sky-50 via-cyan-50 to-teal-50',
      hero: 'from-sky-600 via-cyan-600 to-teal-600',
      card: 'from-sky-50/30 to-cyan-50/30',
    },
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset Glow',
    colors: {
      primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      secondary: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
      },
      accent: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      background: {
        primary: '#fff7ed',
        secondary: '#ffffff',
        tertiary: '#fefce8',
      },
      text: {
        primary: '#7c2d12',
        secondary: '#c2410c',
        muted: '#ea580c',
      },
      border: {
        primary: '#fed7aa',
        secondary: '#fdba74',
      },
    },
    gradients: {
      primary: 'from-orange-600 via-yellow-600 to-red-600',
      secondary: 'from-orange-50 via-yellow-50 to-red-50',
      hero: 'from-orange-600 via-yellow-600 to-red-600',
      card: 'from-orange-50/30 to-yellow-50/30',
    },
  },
  forest: {
    name: 'forest',
    displayName: 'Deep Forest',
    colors: {
      primary: {
        50: '#f7fee7',
        100: '#ecfccb',
        200: '#d9f99d',
        300: '#bef264',
        400: '#a3e635',
        500: '#84cc16',
        600: '#65a30d',
        700: '#4d7c0f',
        800: '#365314',
        900: '#1a2e05',
      },
      secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      accent: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
      },
      background: {
        primary: '#f7fee7',
        secondary: '#ffffff',
        tertiary: '#f0fdf4',
      },
      text: {
        primary: '#1a2e05',
        secondary: '#365314',
        muted: '#4d7c0f',
      },
      border: {
        primary: '#d9f99d',
        secondary: '#bef264',
      },
    },
    gradients: {
      primary: 'from-lime-600 via-green-600 to-yellow-600',
      secondary: 'from-lime-50 via-green-50 to-yellow-50',
      hero: 'from-lime-600 via-green-600 to-yellow-600',
      card: 'from-lime-50/30 to-green-50/30',
    },
  },
}

export const defaultThemeConfig: ThemeConfig = {
  currentTheme: 'default',
  themes,
}

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || themes.default
}

export const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement
  
  // Apply CSS custom properties for the theme
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--color-primary-${key}`, value)
  })
  
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    root.style.setProperty(`--color-secondary-${key}`, value)
  })
  
  Object.entries(theme.colors.accent).forEach(([key, value]) => {
    root.style.setProperty(`--color-accent-${key}`, value)
  })
  
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--color-bg-${key}`, value)
  })
  
  Object.entries(theme.colors.text).forEach(([key, value]) => {
    root.style.setProperty(`--color-text-${key}`, value)
  })
  
  Object.entries(theme.colors.border).forEach(([key, value]) => {
    root.style.setProperty(`--color-border-${key}`, value)
  })
  
  // Apply theme class to body for conditional styling
  document.body.className = document.body.className.replace(/theme-\w+/g, '')
  document.body.classList.add(`theme-${theme.name}`)
}