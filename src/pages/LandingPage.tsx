import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Helmet } from 'react-helmet-async'
import {
  FileText, ChevronRight, BarChart3,
  Brain, Zap, Shield, Target, MessageSquare, Star, CheckCircle
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/auth')
  }

  // SVG Logo Components
  const GoogleLogo = () => (
    <svg viewBox="0 0 150 60" className="h-12 w-auto" aria-hidden="true">
      <g>
        <circle cx="20" cy="30" r="8" fill="#4285F4"/>
        <circle cx="35" cy="30" r="8" fill="#EA4335"/>
        <circle cx="50" cy="30" r="8" fill="#FBBC04"/>
        <circle cx="65" cy="30" r="8" fill="#34A853"/>
        <text x="80" y="35" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="18" fill="#5F6368" fontWeight="500">Google</text>
      </g>
    </svg>
  )
  
  const MicrosoftLogo = () => (
    <svg viewBox="0 0 150 60" className="h-12 w-auto" aria-hidden="true">
      <g>
        <rect x="8" y="8" width="18" height="18" fill="#F25022"/>
        <rect x="32" y="8" width="18" height="18" fill="#7FBA00"/>
        <rect x="8" y="32" width="18" height="18" fill="#00A4EF"/>
        <rect x="32" y="32" width="18" height="18" fill="#FFB900"/>
        <text x="65" y="35" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="18" fill="#5F6368" fontWeight="500">Microsoft</text>
      </g>
    </svg>
  )
  
  const AppleLogo = () => (
    <svg viewBox="0 0 150 60" className="h-12 w-auto" aria-hidden="true">
      <g>
        <path d="M35.2 12.9c-1.3 1.5-3.4 2.7-5.4 2.4-.3-2.1.6-4.3 1.8-5.7 1.3-1.5 3.5-2.6 5.3-2.7.2 2.2-.6 4.4-1.7 6zm1.8 3c-2.9-.2-5.4 1.6-6.8 1.6-1.4 0-3.5-1.5-5.8-1.5-3 .1-5.7 1.7-7.2 4.4-3.1 5.4-.8 13.4 2.2 17.8 1.5 2.1 3.2 4.5 5.5 4.4 2.2-.1 3.1-1.4 5.8-1.4s3.5 1.4 5.8 1.3c2.4-.1 3.8-2.1 5.3-4.3 1.7-2.4 2.4-4.8 2.4-4.9-.1 0-4.6-1.8-4.6-7.1-.1-4.4 3.6-6.5 3.7-6.6-2-3-5.2-3.4-6.3-3.7z" fill="#555555"/>
        <text x="70" y="35" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="18" fill="#5F6368" fontWeight="500">Apple</text>
      </g>
    </svg>
  )

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>AI Resume Analyzer - Optimize Your Resume with AI</title>
        <meta name="description" content="Get instant AI-powered resume analysis with detailed feedback, ATS compatibility scores, and actionable recommendations to boost your career prospects." />
        <meta property="og:title" content="AI Resume Analyzer - Optimize Your Resume with AI" />
        <meta property="og:description" content="Get instant AI-powered resume analysis with detailed feedback, ATS compatibility scores, and actionable recommendations to boost your career prospects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resume Analyzer - Optimize Your Resume with AI" />
        <meta name="twitter:description" content="Get instant AI-powered resume analysis with detailed feedback, ATS compatibility scores, and actionable recommendations to boost your career prospects." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:24px_24px]"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full text-sm font-semibold text-blue-700 mb-8 backdrop-blur-sm">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 50,000+ professionals
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            Optimize Your Resume with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Power</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Get instant AI-powered resume analysis with detailed feedback, ATS compatibility scores, 
            and actionable recommendations to boost your career prospects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              variant="modern" 
              size="xl"
              onClick={handleGetStarted}
              className="group min-w-[200px]"
            >
              <FileText className="w-6 h-6 mr-3" />
              Get Started Free
              <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="flex items-center space-x-2 text-slate-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-slate-600">ATS Compatibility</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">30s</div>
              <div className="text-slate-600">Analysis Time</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-2">3x</div>
              <div className="text-slate-600">More Interviews</div>
            </div>
          </div>

        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-8 text-lg">Trusted by professionals at leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
            <GoogleLogo />
            <MicrosoftLogo />
            <AppleLogo />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Powerful <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Resume Analysis</span> Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive AI-powered resume analyzer provides detailed insights across multiple dimensions to maximize your job search success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">ATS Compatibility Scoring</h3>
              <p className="text-slate-600 leading-relaxed">Ensure your resume passes through Applicant Tracking Systems with our comprehensive ATS compatibility analysis.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI-Powered Content Analysis</h3>
              <p className="text-slate-600 leading-relaxed">Advanced machine learning algorithms analyze your resume content against thousands of successful applications.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Job Target Optimization</h3>
              <p className="text-slate-600 leading-relaxed">Align your resume with specific job descriptions and requirements for better match rates.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Instant Detailed Feedback</h3>
              <p className="text-slate-600 leading-relaxed">Get comprehensive feedback and actionable insights in under 30 seconds. No waiting, no delays.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Privacy & Security First</h3>
              <p className="text-slate-600 leading-relaxed">Your resume data is processed securely and never stored on our servers. Complete privacy guaranteed.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Actionable Improvement Tips</h3>
              <p className="text-slate-600 leading-relaxed">Receive specific, prioritized recommendations to improve your resume and increase your chances of getting hired.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get professional resume analysis in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload Your Resume</h3>
              <p className="text-slate-600 leading-relaxed">
                Simply drag and drop your resume file or click to browse. We support PDF, DOC, DOCX, and TXT formats.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Our advanced AI algorithms analyze your resume across multiple dimensions including ATS compatibility and content quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Insights</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive detailed feedback, scores, and actionable recommendations to improve your resume and land more interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of professionals who have improved their resumes and landed their dream jobs.
          </p>
          
          <Button 
            variant="secondary" 
            size="xl"
            onClick={handleGetStarted}
            className="group min-w-[250px] bg-white text-blue-600 hover:bg-gray-50"
          >
            <FileText className="w-6 h-6 mr-3" />
            Start Free Analysis
            <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <div className="flex items-center justify-center space-x-6 mt-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Instant results</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Secure & private</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}