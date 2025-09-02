import React from 'react'
import { useNavigate } from 'react-router'
import { FileUploader } from '@/components/FileUploader'
import { DiagnosticInfo } from '@/components/DiagnosticInfo'
import { Helmet } from 'react-helmet-async'

export const UploadPage: React.FC = () => {
  const navigate = useNavigate()

  const handleUploadComplete = (filePath: string, fileName: string) => {
    // Navigate to questionnaire page with the file path and name
    const encodedPath = encodeURIComponent(filePath)
    const encodedName = encodeURIComponent(fileName)
    navigate(`/app/questionnaire/${encodedPath}?fileName=${encodedName}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative">
      <Helmet>
        <title>Upload Your Resume - AI Resume Analyzer</title>
        <meta name="description" content="Upload your resume for comprehensive AI analysis. Get detailed feedback, ATS compatibility scores, and actionable recommendations to boost your career prospects." />
        <meta property="og:title" content="Upload Your Resume - AI Resume Analyzer" />
        <meta property="og:description" content="Upload your resume for comprehensive AI analysis. Get detailed feedback, ATS compatibility scores, and actionable recommendations to boost your career prospects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Upload Your Resume - AI Resume Analyzer" />
        <meta name="twitter:description" content="Upload your resume for comprehensive AI analysis. Get detailed feedback, ATS compatibility scores, and actionable recommendations to boost your career prospects." />
      </Helmet>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:24px_24px]"></div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-6">
          <button
            onClick={() => navigate('/app')}
            className="group inline-flex items-center text-secondary-600 hover:text-secondary-900 font-medium transition-all duration-300"
            aria-label="Navigate back to dashboard homepage"
          >
            <div className="w-8 h-8 rounded-full bg-secondary-100 group-hover:bg-secondary-200 flex items-center justify-center mr-3 transition-colors duration-300" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-sm">Back to Dashboard</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
                Upload Your Resume for AI Analysis
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                Get comprehensive AI-powered resume analysis with actionable insights to enhance your career prospects and land your dream job
              </p>
            </div>

            {/* Process Steps */}
            <div className="flex items-center justify-center space-x-6 mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">1</div>
                <span className="text-sm font-medium text-secondary-700">Upload</span>
              </div>
              <div className="w-12 h-px bg-secondary-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary-200 text-secondary-500 flex items-center justify-center text-sm font-medium">2</div>
                <span className="text-sm text-secondary-500">Questionnaire</span>
              </div>
              <div className="w-12 h-px bg-secondary-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary-200 text-secondary-500 flex items-center justify-center text-sm font-medium">3</div>
                <span className="text-sm text-secondary-500">Analyze</span>
              </div>
              <div className="w-12 h-px bg-secondary-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary-200 text-secondary-500 flex items-center justify-center text-sm font-medium">4</div>
                <span className="text-sm text-secondary-500">Improve</span>
              </div>
            </div>
          </div>

          {/* Upload Instructions Section */}
          <div className="max-w-3xl mx-auto mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Resume Upload Preparation Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Technical Requirements</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Save your resume as PDF format for optimal ATS parsing and formatting preservation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Ensure file size is under 10MB for fast upload and processing</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Verify all text is machine-readable (not scanned images or embedded graphics)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Remove password protection and digital signatures if present</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Resume Optimization Tips</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Incorporate industry-specific keywords and job-related terminology</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Use clear section headings and maintain consistent formatting throughout</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Proofread carefully for spelling, grammar, and punctuation accuracy</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Quantify achievements with specific metrics and measurable results</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Enhanced Security Reassurance */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Enterprise-Grade Security & Privacy Protection</h3>
                  <div className="space-y-3 text-green-800">
                    <p className="leading-relaxed">
                      Your resume data is protected with bank-level SSL/TLS encryption and military-grade security protocols. We employ end-to-end encryption during file transmission and processing to ensure complete confidentiality of your personal and professional information.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium text-sm">No Data Storage</span>
                        </div>
                        <p className="text-xs">Files are automatically deleted after analysis completion</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium text-sm">Zero Third-Party Sharing</span>
                        </div>
                        <p className="text-xs">Your resume never leaves our secure servers</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium text-sm">GDPR Compliant</span>
                        </div>
                        <p className="text-xs">Full compliance with data protection regulations</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium text-sm">Real-Time Processing</span>
                        </div>
                        <p className="text-xs">Analysis completed in memory without permanent storage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Configuration Status */}
          <div className="max-w-2xl mx-auto mb-8">
            <DiagnosticInfo onConfigureAI={() => navigate('/app/settings')} />
          </div>

          {/* Upload Section */}
          <div className="max-w-2xl mx-auto">
            <FileUploader onUploadComplete={handleUploadComplete} />
          </div>

          {/* Enhanced Supported Formats */}
          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Resume File Format Compatibility Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-20 mx-auto mb-4 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">PDF Format</h3>
                <p className="text-sm text-blue-600 font-semibold mt-2 mb-3">⭐ Highly Recommended</p>
                <p className="text-xs text-slate-600 leading-relaxed">Best for ATS compatibility, preserves exact formatting, universally readable, maintains visual layout integrity</p>
              </div>

              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                <div className="w-16 h-20 mx-auto mb-4 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">DOCX</h3>
                <p className="text-sm text-green-600 font-medium mt-2 mb-3">✓ Well Supported</p>
                <p className="text-xs text-slate-600 leading-relaxed">Modern Word format, good ATS parsing, supports complex formatting, widely compatible with HR systems</p>
              </div>

              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                <div className="w-16 h-20 mx-auto mb-4 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">DOC</h3>
                <p className="text-sm text-yellow-600 font-medium mt-2 mb-3">⚠️ Legacy Format</p>
                <p className="text-xs text-slate-600 leading-relaxed">Older Word format, acceptable but may have parsing limitations, consider converting to DOCX for better results</p>
              </div>

              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                <div className="w-16 h-20 mx-auto mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">TXT</h3>
                <p className="text-sm text-orange-600 font-medium mt-2 mb-3">📄 Basic Support</p>
                <p className="text-xs text-slate-600 leading-relaxed">Plain text format, minimal formatting support, best for simple resumes, may lose visual structure</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Format Selection Recommendations</h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>PDF Format:</strong> Ideal for preserving exact formatting, graphics, and complex layouts. Best choice for creative resumes and ensuring consistent appearance across all devices and ATS systems.</p>
                    <p><strong>DOCX Format:</strong> Excellent compatibility with modern ATS systems, supports rich formatting while maintaining readability. Perfect for professional resumes with standard layouts.</p>
                    <p><strong>ATS Optimization Tip:</strong> Always test your resume formatting after conversion. Some ATS systems may interpret complex formatting differently, so clean, simple layouts often perform best.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-slate-600 leading-relaxed">Advanced machine learning algorithms analyze your resume against industry standards and best practices for maximum job application success</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Comprehensive Scoring</h3>
              <p className="text-slate-600 leading-relaxed">Detailed evaluation across ATS compatibility, content quality, structure, and professional presentation with actionable improvement recommendations</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Actionable Insights</h3>
              <p className="text-slate-600 leading-relaxed">Receive specific, implementable recommendations to immediately improve your resume's effectiveness and increase interview opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}