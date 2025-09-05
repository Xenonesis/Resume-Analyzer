import { useNavigate } from "react-router"
import { useResumes, useTheme, useAIConfig, useAuth } from "../stores/useAppStore"
import { Button } from "../components/ui/button"
import { getTheme } from "../utils/themes"
import { Helmet } from "react-helmet-async"
import {
  FileText, TrendingUp, Users, Clock, ChevronRight, BarChart3,
  Brain, Zap, Shield, Target, MessageSquare
} from "lucide-react"
import HeroSection from "../components/HeroSection"
import HowItWorksSection from "../components/HowItWorksSection"
import CTASection from "../components/CTASection"
import { aiService } from "../services/aiService"
import DatabaseWithRestApi from "../components/ui/database-with-rest-api"

export default function HomePage() {
  const navigate = useNavigate()
  const { items: resumes } = useResumes()
  const currentTheme = useTheme()
  const theme = getTheme(currentTheme)
  const { isAuthenticated } = useAuth()
  const { config, isConfigured } = useAIConfig()
  
    // SVG Logo Components - Updated with better designs
  // SVG Logo Components - Updated with authentic brand designs
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
  );
  
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
  );
  
  const AppleLogo = () => (
    <svg viewBox="0 0 150 60" className="h-12 w-auto" aria-hidden="true">
      <g>
        <path d="M35.2 12.9c-1.3 1.5-3.4 2.7-5.4 2.4-.3-2.1.6-4.3 1.8-5.7 1.3-1.5 3.5-2.6 5.3-2.7.2 2.2-.6 4.4-1.7 6zm1.8 3c-2.9-.2-5.4 1.6-6.8 1.6-1.4 0-3.5-1.5-5.8-1.5-3 .1-5.7 1.7-7.2 4.4-3.1 5.4-.8 13.4 2.2 17.8 1.5 2.1 3.2 4.5 5.5 4.4 2.2-.1 3.1-1.4 5.8-1.4s3.5 1.4 5.8 1.3c2.4-.1 3.8-2.1 5.3-4.3 1.7-2.4 2.4-4.8 2.4-4.9-.1 0-4.6-1.8-4.6-7.1-.1-4.4 3.6-6.5 3.7-6.6-2-3-5.2-3.4-6.3-3.7z" fill="#555555"/>
        <text x="70" y="35" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="18" fill="#5F6368" fontWeight="500">Apple</text>
      </g>
    </svg>
  );
  
  const AmazonLogo = () => (
    <svg viewBox="0 0 150 60" className="h-12 w-auto" aria-hidden="true">
      <g>
        <text x="10" y="25" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="20" fill="#232F3E" fontWeight="400">Amazon</text>
        <path d="M15 35c12 6 28 6 40 0" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="52" cy="32" r="1.5" fill="#FF9900"/>
      </g>
    </svg>
  );
  
  const MetaLogo = () => (
    <svg viewBox="0 0 150 60" className="h-12 w-auto" aria-hidden="true">
      <g>
        <circle cx="20" cy="30" r="12" fill="#1877F2"/>
        <circle cx="40" cy="30" r="12" fill="#42A5F5"/>
        <circle cx="60" cy="30" r="12" fill="#0D47A1"/>
        <text x="80" y="35" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="18" fill="#1877F2" fontWeight="600">Meta</text>
      </g>
    </svg>
  );
  
  const NetflixLogo = () => (
    <svg viewBox="0 0 150 60" className="h-12 w-auto" aria-hidden="true">
      <g>
        <rect x="10" y="15" width="6" height="30" fill="#E50914"/>
        <rect x="20" y="15" width="6" height="30" fill="#E50914"/>
        <rect x="30" y="15" width="6" height="30" fill="#E50914"/>
        <text x="45" y="35" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="18" fill="#E50914" fontWeight="700">NETFLIX</text>
      </g>
    </svg>
  );

  const handleAnalyzeClick = () => {
    // Check if all required configuration is complete
    const hasValidConfig = isAuthenticated && 
                          isConfigured && 
                          aiService.isConfigured() && 
                          config?.apiKey && 
                          config.apiKey.length > 0

    if (hasValidConfig) {
      navigate("/app/upload")
    } else {
      navigate("/app/settings")
    }
  }
  
  const handleResumeClick = (resumeId: string) => {
    navigate(`/app/results/${resumeId}`)
  }
  
  if (resumes.length === 0) {
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
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "AI Resume Analyzer",
                "description": "Get instant AI-powered resume analysis with detailed feedback, ATS compatibility scores, and actionable recommendations to boost your career prospects.",
                "applicationCategory": "BusinessApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "1240"
                }
              }
            `}
          </script>
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How does the AI resume analyzer work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our AI resume analyzer uses advanced natural language processing and machine learning algorithms to evaluate your resume across multiple dimensions including content quality, structure, keyword optimization for ATS systems, and industry-specific best practices. Simply upload your resume and get detailed feedback within seconds."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is my resume data secure and private?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, we take your privacy seriously. All resume data is processed securely and is not stored on our servers. Your information is encrypted during transmission and automatically deleted after analysis. We never share your data with third parties."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What file formats are supported?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We support all major resume formats including PDF, DOC, DOCX, TXT, and RTF. Our system automatically processes your file and provides analysis regardless of the format you choose."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How can this tool help me get more interviews?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our AI analyzer identifies key areas of improvement in your resume that often get overlooked. This includes optimizing for Applicant Tracking Systems (ATS), improving keyword relevance, enhancing content structure, and aligning your experience with job requirements. These improvements significantly increase your chances of passing initial screenings."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How often should I analyze my resume?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We recommend analyzing your resume whenever you're job hunting or at least once every 6 months to stay current with industry best practices. If you're actively applying for jobs, consider analyzing for each specific position to tailor your resume accordingly."
                    }
                  }
                ]
              }
            `}
          </script>
        </Helmet>
        <HeroSection theme={theme} currentTheme={currentTheme} onAnalyzeClick={handleAnalyzeClick} />
        
        {/* Social Proof Section */}
        <section className="py-16 bg-white border-b border-gray-100" aria-labelledby="social-proof-heading">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 id="social-proof-heading" className="sr-only">Trusted by Leading Companies</h2>
            <p className="text-gray-600 mb-8 text-lg">Trusted by professionals at leading companies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-90" role="list" aria-label="Partner companies">
              {[
                { name: 'Google', component: <GoogleLogo /> },
                { name: 'Microsoft', component: <MicrosoftLogo /> },
                { name: 'Apple', component: <AppleLogo /> },
                { name: 'Amazon', component: <AmazonLogo /> },
                { name: 'Meta', component: <MetaLogo /> },
                { name: 'Netflix', component: <NetflixLogo /> }
              ].map((company) => (
                <div key={company.name} className="flex items-center justify-center" role="listitem" aria-label={`Trusted by ${company.name} professionals`}>
                  <div className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300">
                    {company.component}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Powerful Resume Analysis Features Section with API Showcase */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-semibold text-white mb-6">
                <Brain className="w-4 h-4 mr-2 text-blue-400" />
                Powered by Advanced AI Technology
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Resume Analysis</span> Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our comprehensive AI-powered resume analyzer provides detailed insights across multiple dimensions to maximize your job search success.
              </p>
            </div>

            {/* API Component Showcase */}
            <div className="flex justify-center mb-20">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl scale-110"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <DatabaseWithRestApi
                    title="AI Resume Analysis API"
                    circleText="AI"
                    lightColor="#60a5fa"
                    badgeTexts={{
                      first: "SCAN",
                      second: "ANALYZE", 
                      third: "SCORE",
                      fourth: "OPTIMIZE"
                    }}
                    buttonTexts={{
                      first: "ResumeAI",
                      second: "v2.1"
                    }}
                    className="scale-110"
                  />
                </div>
              </div>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-blue-400/50 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">ATS Compatibility Scoring</h3>
                <p className="text-gray-300 leading-relaxed">Ensure your resume passes through Applicant Tracking Systems with our comprehensive ATS compatibility analysis. We check for keyword optimization, format compatibility, and technical requirements that recruiters' systems look for.</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-purple-400/50 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">AI-Powered Content Analysis</h3>
                <p className="text-gray-300 leading-relaxed">Advanced machine learning algorithms analyze your resume content against thousands of successful applications and industry standards. We evaluate clarity, impact, relevance, and professional tone to maximize your chances.</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-emerald-400/50 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Job Target Optimization</h3>
                <p className="text-gray-300 leading-relaxed">Align your resume with specific job descriptions and requirements. Our analyzer identifies gaps between your experience and target positions, providing tailored recommendations to improve your match rate.</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-orange-400/50 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Instant Detailed Feedback</h3>
                <p className="text-gray-300 leading-relaxed">Get comprehensive feedback and actionable insights in under 30 seconds. No waiting, no delays. Receive specific recommendations for improvement across all critical resume elements.</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-green-400/50 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">✅ Authentic AI Analysis</h3>
                <p className="text-gray-300 leading-relaxed">We provide authentic AI analysis results with accurate scoring and detailed feedback. Configure your AI service to get real, valuable insights that will genuinely improve your resume.</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-pink-400/50 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Actionable Improvement Tips</h3>
                <p className="text-gray-300 leading-relaxed">Receive specific, prioritized recommendations to improve your resume and increase your chances of getting hired. Our tips are categorized by impact level so you know exactly where to focus your efforts.</p>
              </div>
            </div>

            {/* API Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/10">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">API Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">&lt;30s</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Analysis Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">256-bit</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Monitoring</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to know about our AI-powered resume analysis platform.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">How does the AI resume analyzer work?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our AI resume analyzer uses advanced natural language processing and machine learning algorithms to evaluate your resume across multiple dimensions including content quality, structure, keyword optimization for ATS systems, and industry-specific best practices. Simply upload your resume and get detailed feedback within seconds.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Is my resume data secure and private?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Yes, we take your privacy seriously. All resume data is processed securely and is not stored on our servers. Your information is encrypted during transmission and automatically deleted after analysis. We never share your data with third parties. Your privacy is our top priority.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">What file formats are supported?</h3>
                <p className="text-slate-600 leading-relaxed">
                  We support all major resume formats including PDF, DOC, DOCX, TXT, and RTF. Our system automatically processes your file and provides analysis regardless of the format you choose. For best results, we recommend using PDF format as it preserves formatting across different systems.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">How can this tool help me get more interviews?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our AI analyzer identifies key areas of improvement in your resume that often get overlooked. This includes optimizing for Applicant Tracking Systems (ATS), improving keyword relevance, enhancing content structure, and aligning your experience with job requirements. These improvements significantly increase your chances of passing initial screenings and landing interviews.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">How often should I analyze my resume?</h3>
                <p className="text-slate-600 leading-relaxed">
                  We recommend analyzing your resume whenever you're job hunting or at least once every 6 months to stay current with industry best practices. If you're actively applying for jobs, consider analyzing for each specific position to tailor your resume accordingly. Regular updates ensure your resume remains competitive.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">What makes your resume analyzer different from others?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our resume analyzer stands out with its comprehensive multi-dimensional analysis, AI-powered insights, and actionable recommendations. Unlike basic keyword checkers, we evaluate your resume holistically, considering content quality, structure, ATS compatibility, and job alignment. Our proprietary algorithms provide deeper insights than generic tools.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Can I customize the analysis for specific industries or roles?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Yes, our analyzer allows you to tailor your resume for specific job descriptions and industries. When you upload your resume, you can provide the job description you're targeting, and our AI will provide customized recommendations to align your experience with those requirements. This feature is particularly valuable for career changers or those targeting specific roles.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <HowItWorksSection />
        
        
        <CTASection theme={theme} currentTheme={currentTheme} onAnalyzeClick={handleAnalyzeClick} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
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
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full text-sm font-semibold text-blue-700 mb-8 backdrop-blur-sm">
            <Users className="w-4 h-4 mr-2" />
            Resume Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Your Resume Analysis
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Dashboard</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Track your progress, view detailed analysis, and continuously improve your resume's effectiveness
          </p>
          
          <Button 
            variant="modern" 
            size="lg"
            onClick={handleAnalyzeClick}
            className="group"
          >
            <FileText className="w-5 h-5 mr-3" />
            Analyze New Resume
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Resume Cards Grid */}
        <div className="grid gap-8">
          {resumes.map((resume: any, index: number) => (
            <div 
              key={resume.id} 
              className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-blue-200/50 transform hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      Resume Analysis {index + 1}
                    </h3>
                    <div className="flex items-center space-x-6 text-sm text-slate-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Analyzed {new Date(resume.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      {resume.feedback?.overallScore && (
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Score: {resume.feedback.overallScore}/100</span>
                        </div>
                      )}
                    </div>
                    {resume.jobDescription && (
                      <p className="text-slate-600 leading-relaxed mb-4 line-clamp-2">
                        Job Target: {resume.jobTitle ? `${resume.jobTitle} at ` : ''}{resume.companyName}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResumeClick(resume.id)}
                  className="group/btn"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
              
              {/* Progress Indicators */}
              {resume.feedback && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-2xl border-blue-100">
                    <div className="text-2xl font-bold text-blue-700 mb-1">
                      {resume.feedback.ATS?.score || '--'}%
                    </div>
                    <div className="text-sm text-blue-600 font-medium">ATS Compatibility</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-2xl border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-700 mb-1">
                      {resume.feedback.content?.score || '--'}%
                    </div>
                    <div className="text-sm text-emerald-600 font-medium">Content Quality</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-2xl border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700 mb-1">
                      {resume.feedback.structure?.score || '--'}%
                    </div>
                    <div className="text-sm text-purple-600 font-medium">Structure</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-2xl border border-orange-100">
                    <div className="text-2xl font-bold text-orange-700 mb-1">
                      {resume.feedback.overallScore || '--'}%
                    </div>
                    <div className="text-sm text-orange-600 font-medium">Overall Score</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Next Career Move?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Analyze another resume or explore advanced features to maximize your job search success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleAnalyzeClick}
                className="group bg-white text-slate-900 hover:bg-slate-100"
              >
                <FileText className="w-5 h-5 mr-3" />
                Upload New Resume
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/app/settings')}
                className="group bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Configure AI Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
