export type ThemeName = 'default' | 'emerald' | 'rose' | 'nighty' | 'ocean' | 'sunset' | 'forest'

export interface Theme {
  name: string
  displayName: string
  colors: {
    primary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    secondary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    accent: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
    }
    border: {
      primary: string
      secondary: string
    }
  }
  gradients: {
    primary: string
    secondary: string
    hero: string
    card: string
  }
}

export interface ThemeConfig {
  currentTheme: ThemeName
  themes: Record<ThemeName, Theme>
}