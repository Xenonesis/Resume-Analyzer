import React from 'react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { useTheme } from '@/stores/useAppStore'
import { getTheme } from '@/utils/themes'

export const ThemePage: React.FC = () => {
  const currentTheme = useTheme()
  const theme = getTheme(currentTheme)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-300/10 to-accent-300/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20 mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Personalization</span>
          </div>
          <h1 className={`text-6xl font-bold bg-gradient-to-r ${theme.gradients.hero} bg-clip-text text-transparent mb-6`}>
            Choose Your Theme
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Customize your AI Resume Analyzer experience with beautiful themes that match your style and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Theme Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/30 p-8 shadow-lg sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Theme</h2>
              <ThemeSelector className="mb-6" showLabel={false} />
              
              <div className="mt-8 p-6 bg-primary-50/50 rounded-2xl border border-primary-200/50">
                <h3 className="font-semibold text-primary-900 mb-3">Current Theme</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-primary-700">Name</span>
                    <span className="text-sm font-medium text-primary-900">{theme.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-primary-700">Style</span>
                    <span className="text-sm font-medium text-primary-900">
                      {currentTheme === 'nighty' ? 'Dark' : 'Light'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/30 p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Preview</h2>
              
              {/* Mock UI Preview */}
              <div className="space-y-6">
                {/* Mock Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">AI Resume Analyzer</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">U</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-6">
                    <button className="text-primary-600 font-medium">Dashboard</button>
                    <button className="text-gray-600 hover:text-gray-900">Upload Resume</button>
                    <button className="text-gray-600 hover:text-gray-900">Settings</button>
                  </div>
                </div>

                {/* Mock Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">A</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">85</div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Software Engineer</h4>
                    <p className="text-gray-600 text-sm">Tech Company Inc.</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-accent-600">B+</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent-600">78</div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Product Manager</h4>
                    <p className="text-gray-600 text-sm">Startup Co.</p>
                  </div>
                </div>

                {/* Mock Button */}
                <div className="flex justify-center">
                  <button className={`bg-gradient-to-r ${theme.gradients.primary} text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300`}>
                    Analyze New Resume
                  </button>
                </div>

                {/* Color Palette */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Color Palette</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Primary</div>
                      <div className="flex space-x-1">
                        <div className="w-8 h-8 rounded-lg bg-primary-300"></div>
                        <div className="w-8 h-8 rounded-lg bg-primary-500"></div>
                        <div className="w-8 h-8 rounded-lg bg-primary-700"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Secondary</div>
                      <div className="flex space-x-1">
                        <div className="w-8 h-8 rounded-lg bg-secondary-300"></div>
                        <div className="w-8 h-8 rounded-lg bg-secondary-500"></div>
                        <div className="w-8 h-8 rounded-lg bg-secondary-700"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Accent</div>
                      <div className="flex space-x-1">
                        <div className="w-8 h-8 rounded-lg bg-accent-300"></div>
                        <div className="w-8 h-8 rounded-lg bg-accent-500"></div>
                        <div className="w-8 h-8 rounded-lg bg-accent-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}