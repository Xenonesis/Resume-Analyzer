"use client"

import { ChevronRight, FileText, Brain, Sparkles, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/stores/useAppStore"
import { getTheme } from "@/utils/themes"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
}

export function Hero({
  eyebrow = "AI-Powered Resume Analysis",
  title,
  subtitle,
  ctaLabel = "Analyze Resume",
  onCtaClick,
}: HeroProps) {
  const currentTheme = useTheme()
  const theme = getTheme(currentTheme)
  
  return (
    <section className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${theme.gradients.hero}`} style={{
      background: currentTheme === 'nighty' 
        ? `linear-gradient(135deg, var(--color-secondary-900), var(--color-primary-800), var(--color-secondary-900))`
        : `linear-gradient(135deg, var(--color-primary-800), var(--color-accent-700), var(--color-primary-900))`
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs - theme aware */}
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-30"
          style={{ backgroundColor: `var(--color-primary-500, #3b82f6)` }}
        ></div>
        <div 
          className="absolute -top-20 -right-32 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 opacity-20"
          style={{ backgroundColor: `var(--color-accent-500, #a855f7)` }}
        ></div>
        <div 
          className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full blur-3xl animate-pulse delay-2000 opacity-25"
          style={{ backgroundColor: `var(--color-secondary-500, #64748b)` }}
        ></div>
        <div 
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500 opacity-20"
          style={{ backgroundColor: `var(--color-primary-400, #60a5fa)` }}
        ></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          {eyebrow && (
            <div className="group cursor-pointer mb-8 animate-fade-in">
              <span className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-4 h-4 mr-2 text-purple-300" />
                {eyebrow}
                <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 animate-fade-in animation-delay-200">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-400">
            {subtitle}
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-12 animate-fade-in animation-delay-600">
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">30s Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">ATS Ready</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">PDF Analysis</span>
            </div>
          </div>

          {/* CTA Button */}
          {ctaLabel && (
            <div className="animate-fade-in animation-delay-800">
              <Button
                onClick={onCtaClick}
                size="lg"
                className="group bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white font-bold py-4 px-8 md:px-12 text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border border-purple-400/50"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  {ctaLabel}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              
              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>100% Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>No Registration Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-20"></div>
    </section>
  )
}
