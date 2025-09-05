import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { 
  Upload, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Clock,
  Shield,
  Zap,
  Brain,
  Target,
  Award,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { StatsGrid } from './ui/stats-card'
import { EnhancedFileUpload } from './ui/enhanced-file-upload'
import { Modal } from './ui/modal'
import { useToast } from './ui/toast'

export const EnhancedLandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setUploadedFile(file)
    addToast({
      type: 'success',
      title: 'File uploaded successfully!',
      description: `${file.name} is ready for analysis.`,
      action: {
        label: 'Analyze Now',
        onClick: () => navigate('/app/analyze')
      }
    })
  }

  const handleGetStarted = () => {
    setShowUploadModal(true)
  }

  const statsData = [
    {
      id: 'resumes-analyzed',
      title: 'Resumes Analyzed',
      value: 50000,
      icon: <FileText className="w-5 h-5" />,
      color: 'blue' as const,
      format: 'number' as const
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: 94,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green' as const,
      format: 'percentage' as const
    },
    {
      id: 'avg-improvement',
      title: 'Avg. Score Improvement',
      value: 35,
      icon: <Award className="w-5 h-5" />,
      color: 'purple' as const,
      format: 'percentage' as const
    },
    {
      id: 'processing-time',
      title: 'Avg. Processing Time',
      value: '24s',
      icon: <Clock className="w-5 h-5" />,
      color: 'orange' as const,
      format: 'text' as const
    }
  ]

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your resume against thousands of successful applications.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes through Applicant Tracking Systems with comprehensive compatibility analysis.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Results',
      description: 'Get comprehensive feedback and actionable insights in under 30 seconds. No waiting, no delays.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Your resume data is processed securely and never stored. Complete privacy and confidentiality guaranteed.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Tech Corp',
      content: 'This tool helped me land my dream job! The AI insights were incredibly detailed and actionable.',
      rating: 5,
      avatar: '👩‍💻'
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      company: 'Growth Inc',
      content: 'Improved my resume score by 40 points. The ATS optimization features are game-changing.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      company: 'Analytics Pro',
      content: 'The detailed feedback helped me understand exactly what recruiters are looking for.',
      rating: 5,
      avatar: '👩‍🔬'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -top-20 -right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating particles */}
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

        <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="glow" className="mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              #1 AI-Powered Resume Analyzer
            </Badge>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8 animate-fade-in animation-delay-200">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Land Your Dream Job
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-white bg-clip-text text-transparent">
                with AI Precision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-400">
              Transform your resume in 30 seconds with our advanced AI. Get ATS optimization, 
              detailed scoring, and actionable insights that actually get you hired.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in animation-delay-600">
              {[
                { icon: <Zap className="w-4 h-4" />, text: '30s Analysis', color: 'bg-yellow-500/20 border-yellow-400/30' },
                { icon: <Brain className="w-4 h-4" />, text: 'AI-Powered', color: 'bg-blue-500/20 border-blue-400/30' },
                { icon: <Shield className="w-4 h-4" />, text: 'ATS Ready', color: 'bg-green-500/20 border-green-400/30' },
                { icon: <Award className="w-4 h-4" />, text: 'Expert Insights', color: 'bg-purple-500/20 border-purple-400/30' }
              ].map((pill, index) => (
                <div key={index} className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${pill.color}`}>
                  {pill.icon}
                  <span className="font-medium text-white">{pill.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-800">
              <Button
                size="xl"
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Upload className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Analyze My Resume Now
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => navigate('/demo')}
              >
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-blue-200">
              {[
                { icon: <CheckCircle className="w-4 h-4" />, text: '100% Free Forever' },
                { icon: <CheckCircle className="w-4 h-4" />, text: 'No Registration Required' },
                { icon: <CheckCircle className="w-4 h-4" />, text: 'Instant Results' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by Thousands of Job Seekers
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Join the community of successful professionals who've transformed their careers with our AI-powered insights.
            </p>
          </div>
          <StatsGrid stats={statsData} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="gradient" className="mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Stand Out</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI doesn't just scan your resume—it understands it, analyzes it, and gives you the insights you need to get hired.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Real stories from real people who've transformed their careers with our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of successful job seekers who've already improved their resumes with our AI-powered analysis.
          </p>
          <Button
            size="xl"
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Upload className="w-6 h-6 mr-3" />
            Start Your Free Analysis
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Your Resume"
        description="Upload your resume to get started with AI-powered analysis"
        size="lg"
      >
        <EnhancedFileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={() => setUploadedFile(null)}
          className="mb-6"
        />
        
        {uploadedFile && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowUploadModal(false)
              navigate('/app/analyze')
            }}>
              Analyze Resume
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}