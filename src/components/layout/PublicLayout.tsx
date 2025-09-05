import React from 'react'
import { Outlet, useNavigate } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { CookieConsent } from '@/components/cookie/CookieConsent'

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate()
  
  const handleAcceptCookies = () => {
    // Here you would initialize analytics services if needed
    console.log('Analytics cookies accepted')
  }
  
  const handleRejectCookies = () => {
    // Here you would disable analytics services if needed
    console.log('Analytics cookies rejected')
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>AI Resume Analyzer - Optimize Your Resume with AI</title>
        <meta name="description" content="Get instant, AI-powered feedback to optimize your resume for ATS systems and land more interviews. Free and easy to use." />
        <link rel="canonical" href="https://airesumeanalyzer.com" />
      </Helmet>
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 0 1 .707 .293l5.414 5.414a1 1 0 0 1 .293 .707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-800">AI Resume Analyzer</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/auth')}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
            
            <button 
              className="md:hidden text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Cookie Consent Banner */}
      <CookieConsent onAccept={handleAcceptCookies} onReject={handleRejectCookies} />

      {/* Public Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 0 1 .707 .293l5.414 5.414a1 1 0 0 1 .293 .707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">AI Resume Analyzer</h3>
              </div>
              <p className="text-secondary-400 mb-4 max-w-md">
                Optimize your resume with AI-powered analysis and get more interviews. 
                Trusted by professionals worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Resume Analysis</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">ATS Optimization</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Career Insights</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><a href="mailto:itisaddy7@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2025 AI Resume Analyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
