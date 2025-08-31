import { useNavigate } from "react-router"
import { useResumes, useTheme } from "../stores/useAppStore"
import { Button } from "../components/ui/button"
import { getTheme } from "../utils/themes"
import { 
  FileText, TrendingUp, Users, Clock, ChevronRight, BarChart3, Sparkles, 
  Brain, Zap, Shield, Star, CheckCircle, ArrowRight, Upload, Target,
  Award, Rocket, Download, Play, MessageSquare
} from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const { items: resumes } = useResumes()
  const currentTheme = useTheme()
  const theme = getTheme(currentTheme)

  const handleAnalyzeClick = () => {
    navigate("/upload")
  }

  const handleResumeClick = (resumeId: string) => {
    navigate(`/results/${resumeId}`)
  }

  if (resumes.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
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
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
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
                  <Shield className="w-4 h-4 text-green-400" />
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
                  onClick={handleAnalyzeClick}
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

        {/* Social Proof Section */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-600 mb-8 text-lg">Trusted by professionals at leading companies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'].map((company) => (
                <div key={company} className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-300">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Everything You Need to 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Stand Out</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our AI doesn't just scan your resume—it understands it, analyzes it, and gives you the insights you need to get hired.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">AI-Powered Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Advanced machine learning algorithms analyze your resume against thousands of successful applications and industry standards.</p>
              </div>
              
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">ATS Optimization</h3>
                <p className="text-slate-600 leading-relaxed">Ensure your resume passes through Applicant Tracking Systems with our comprehensive ATS compatibility analysis.</p>
              </div>
              
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Instant Results</h3>
                <p className="text-slate-600 leading-relaxed">Get comprehensive feedback and actionable insights in under 30 seconds. No waiting, no delays.</p>
              </div>
              
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Scoring</h3>
                <p className="text-slate-600 leading-relaxed">Comprehensive scoring across multiple dimensions including content quality, structure, and presentation.</p>
              </div>
              
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Actionable Insights</h3>
                <p className="text-slate-600 leading-relaxed">Get specific, actionable recommendations to improve your resume and increase your chances of getting hired.</p>
              </div>
              
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Privacy First</h3>
                <p className="text-slate-600 leading-relaxed">Your resume data is processed securely and never stored. Complete privacy and confidentiality guaranteed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <Play className="w-4 h-4 mr-2" />
                How It Works
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Get Results in 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our streamlined process makes it incredibly easy to get professional resume feedback in minutes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload Your Resume</h3>
                <p className="text-slate-600 leading-relaxed">Simply drag and drop your PDF resume or browse to select it. We support all standard resume formats.</p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Our advanced AI analyzes your resume against industry standards, ATS requirements, and best practices.</p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Download className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Insights</h3>
                <p className="text-slate-600 leading-relaxed">Receive detailed feedback, scores, and actionable recommendations to improve your resume instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
              onClick={handleAnalyzeClick}
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
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
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-2xl border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700 mb-1">
                      {resume.feedback.ATS?.score || '--'}%
                    </div>
                    <div className="text-sm text-blue-600 font-medium">ATS Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-2xl border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-700 mb-1">
                      {resume.feedback.content?.score || '--'}%
                    </div>
                    <div className="text-sm text-emerald-600 font-medium">Content</div>
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
                    <div className="text-sm text-orange-600 font-medium">Overall</div>
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
                onClick={() => navigate('/settings')}
                className="group bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
