import React from 'react'
import { Outlet } from 'react-router'
import { Navbar } from '@/components/navigation/Navbar'

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Navbar */}
      <div className="relative z-[100]">
        <Navbar />
      </div>
      
      {/* Main Content */}
      <main className="relative z-10 pt-18">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 bg-secondary-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">AI Resume Analyzer</h3>
              </div>
              <p className="text-secondary-400 max-w-md leading-relaxed mb-6">
                Transform your career with AI-powered resume analysis. Get instant feedback, 
                ATS optimization, and actionable insights to land your dream job faster.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-sm text-secondary-300">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-300">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span>Free to Use</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-300">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-3 text-secondary-400">
                <li className="hover:text-white transition-colors cursor-pointer">AI-Powered Analysis</li>
                <li className="hover:text-white transition-colors cursor-pointer">ATS Optimization</li>
                <li className="hover:text-white transition-colors cursor-pointer">Content Scoring</li>
                <li className="hover:text-white transition-colors cursor-pointer">Format Analysis</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-secondary-400">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © 2024 AI Resume Analyzer. All rights reserved.
            </p>
            <p className="text-secondary-500 text-sm mt-2 md:mt-0">
              Built with ❤️ for job seekers worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}