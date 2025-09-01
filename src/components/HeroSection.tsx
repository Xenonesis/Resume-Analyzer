import { Sparkles, ChevronRight, Upload, ArrowRight, Zap, Brain, Shield, Award, CheckCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Theme } from "../types/theme"

interface HeroSectionProps {
  theme: Theme
  currentTheme: string
  onAnalyzeClick: () => void
}

export default function HeroSection({ theme, currentTheme, onAnalyzeClick }: HeroSectionProps) {
  return (
    <section 
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${theme.gradients.hero}`}
      style={{
        background: currentTheme === 'nighty' 
          ? `linear-gradient(135deg, var(--color-secondary-900), var(--color-primary-800), var(--color-secondary-900))`
          : `linear-gradient(135deg, var(--color-primary-800), var(--color-accent-700), var(--color-primary-900))`
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

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

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-8 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="group cursor-pointer mb-8 animate-fade-in">
            <span className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-4 h-4 mr-2 text-purple-300" />
              #1 AI-Powered Resume Analyzer
              <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 animate-fade-in animation-delay-200">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Land Your Dream Job
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-white bg-clip-text text-transparent">
              with AI Precision
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-400">
            Transform your resume in 30 seconds with our advanced AI. Get ATS optimization, 
            detailed scoring, and actionable insights that actually get you hired.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-12 animate-fade-in animation-delay-600">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">30s Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
              <Shield className="w-4 h-4 text-green-40" />
              <span className="font-medium">ATS Ready</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="font-medium">Expert Insights</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="animate-fade-in animation-delay-800">
            <Button
              onClick={onAnalyzeClick}
              size="lg"
              className="group bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white font-bold py-6 px-12 text-xl rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border border-purple-400/50 mb-6"
            >
              <span className="flex items-center gap-3">
                <Upload className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Analyze My Resume Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
    </section>
  )
}