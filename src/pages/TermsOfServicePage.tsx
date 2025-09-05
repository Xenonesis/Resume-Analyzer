import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router'

export const TermsOfServicePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Terms of Service | AI Resume Analyzer</title>
        <meta name="description" content="Terms of Service for AI Resume Analyzer - your agreement to use our services." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mb-8">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-gray-600">Last updated: September 3, 2025</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Welcome to AI Resume Analyzer. These terms of service ("Terms") govern your access to and use of our 
                services, website, and applications (collectively, the "Service"). By accessing or using the Service, 
                you agree to be bound by these Terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using our Service, you agree to be bound by these Terms and all applicable laws and 
                regulations. If you do not agree with any of these terms, you are prohibited from using or accessing 
                this site.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                AI Resume Analyzer provides an AI-powered platform that analyzes resumes and provides feedback to help 
                job seekers improve their documents for better success in the job market. The service includes but is 
                not limited to resume analysis, scoring, and recommendations.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate and complete information. You are 
                responsible for maintaining the confidentiality of your account and password and for restricting access 
                to your computer. You agree to accept responsibility for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Content</h2>
              <p className="text-gray-700 mb-4">
                You retain all rights to any content you upload, post, or display on or through the Service. By 
                uploading, posting, or displaying content, you grant us a worldwide, non-exclusive, royalty-free 
                license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute 
                such content in any and all media or distribution methods.
              </p>
              <p className="text-gray-700 mb-4">
                You are responsible for your use of the service and for any content you provide. You must not use the 
                service to:
              </p>
              <ul className="list-disc pl-8 text-gray-700 mb-4 space-y-2">
                <li>Upload content that is unlawful, harmful, threatening, or abusive</li>
                <li>Upload content that infringes on any third party's rights</li>
                <li>Upload content that contains personally identifiable information of others</li>
                <li>Interfere with or disrupt the services or servers</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by AI Resume Analyzer and 
                are protected by international copyright, trademark, patent, trade secret, and other intellectual 
                property or proprietary rights laws.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior 
                notice or liability, under our sole discretion, if you breach any of the terms or conditions of this 
                Agreement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                The Service is provided on an "as is" and "as available" basis. We expressly disclaim all warranties 
                of any kind, whether express or implied, including but not limited to the implied warranties of 
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall AI Resume Analyzer, nor its directors, employees, partners, agents, suppliers, or 
                affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from your access to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will 
                provide notice of any significant changes by updating the "Last updated" date of these Terms of Service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700 mb-4">
                Email: itisaddy7@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
