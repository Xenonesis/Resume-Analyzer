import { Sparkles, ArrowRight, Star, Users, CheckCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Theme } from "../types/theme"

interface CTASectionProps {
  theme: Theme
  currentTheme: string
  onAnalyzeClick: () => void
}

export default function CTASection({ theme, currentTheme, onAnalyzeClick }: CTASectionProps) {
  return (
    <section 
      className={`py-24 bg-gradient-to-r ${theme.gradients.hero} relative overflow-hidden`}
      style={{
        background: currentTheme === 'nighty' 
          ? `linear-gradient(135deg, var(--color-secondary-900), var(--color-primary-800), var(--color-secondary-900))`
          : `linear-gradient(135deg, var(--color-primary-800), var(--color-accent-700), var(--color-primary-900))`
      }}
    >
      <div className="absolute inset-0">
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: `var(--color-primary-500, #3b82f6)` }}
        ></div>
        <div 
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: `var(--color-accent-500, #a855f7)` }}
        ></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Career?
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of professionals who've already improved their resumes and landed their dream jobs with our AI-powered analysis.
        </p>
        
        <Button
          onClick={onAnalyzeClick}
          size="lg"
          className="group bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white font-bold py-6 px-12 text-xl rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border border-purple-400/50"
        >
          <span className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            Start Your Free Analysis
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </Button>
        
        <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>50,000+ Users</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </section>
  )
}