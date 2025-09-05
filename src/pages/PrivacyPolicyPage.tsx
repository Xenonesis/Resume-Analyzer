import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router'
import { getCookieConsent, setCookieConsent } from '@/utils/cookieUtils'

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate()
  const [cookiePreference, setCookiePreference] = useState<'accepted' | 'rejected' | null>(null)

  useEffect(() => {
    // Load current cookie preference when component mounts
    const currentPreference = getCookieConsent()
    setCookiePreference(currentPreference)
  }, [])

  const handleAcceptCookies = () => {
    setCookieConsent('accepted')
    setCookiePreference('accepted')
  }

  const handleRejectCookies = () => {
    setCookieConsent('rejected')
    setCookiePreference('rejected')
  }

  return (
    <>
      <Helmet>
        <title>Privacy Policy | AI Resume Analyzer</title>
        <meta name="description" content="Privacy policy for AI Resume Analyzer - how we collect, use, and protect your personal information." />
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
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: September 3, 2025</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                At AI Resume Analyzer, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you use our services 
                and tell you about your privacy rights.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Important Information and Who We Are</h2>
              <p className="text-gray-700 mb-4">
                AI Resume Analyzer is a service that helps job seekers improve their resumes using AI-powered analysis. 
                We are committed to ensuring that your privacy is protected. Should we ask you to provide certain information 
                by which you can be identified when using this service, then you can be assured that it will only be used 
                in accordance with this privacy statement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. The Data We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect and process the following data:
              </p>
              <ul className="list-disc pl-8 text-gray-700 mb-4 space-y-2">
                <li>Information you provide when creating an account (name, email address)</li>
                <li>Resume files you upload for analysis</li>
                <li>Feedback and preferences you provide</li>
                <li>Usage data and analytics to improve our service</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Data</h2>
              <p className="text-gray-700 mb-4">
                We use your data to:
              </p>
              <ul className="list-disc pl-8 text-gray-700 mb-4 space-y-2">
                <li>Provide and improve our resume analysis service</li>
                <li>Communicate with you about your account and our services</li>
                <li>Personalize your experience</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to ensure a level of security appropriate 
                to the risk, including:
              </p>
              <ul className="list-disc pl-8 text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit</li>
                <li>Secure server infrastructure</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal data only for as long as necessary to provide our services and for legitimate 
                business purposes, such as improving our services, complying with legal obligations, resolving disputes, 
                and enforcing our agreements.
              </p>
              <p className="text-gray-700 mb-4">
                Resume files are automatically deleted from our servers after 30 days of inactivity.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are 
                small text files that are placed on your device when you visit our website. They help us understand how 
                you interact with our site and improve your user experience.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Types of Cookies We Use</h3>
              <ul className="list-disc pl-8 text-gray-700 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly.</li>
                <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website.</li>
                <li><strong>Functionality Cookies:</strong> These allow our website to remember your preferences.</li>
                <li><strong>Marketing Cookies:</strong> These are used to deliver relevant advertisements to you.</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Cookie Preferences</h3>
                <p className="text-gray-700 mb-4">
                  You can control and manage your cookie preferences below. Your choice will be saved and applied to your browsing experience.
                </p>
                
                {cookiePreference === null ? (
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                      onClick={handleRejectCookies}
                      className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Reject Non-Essential Cookies
                    </button>
                    <button
                      onClick={handleAcceptCookies}
                      className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-lg rounded-lg transition-all"
                    >
                      Accept All Cookies
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-gray-700 mb-2">
                      Your current cookie preference: 
                      <span className={`font-semibold ml-2 ${cookiePreference === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                        {cookiePreference === 'accepted' ? 'All Cookies Accepted' : 'Non-Essential Cookies Rejected'}
                      </span>
                    </p>
                    <button
                      onClick={() => setCookiePreference(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mt-2"
                    >
                      Change Preferences
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc pl-8 text-gray-700 mb-4 space-y-2">
                <li>The right to access your personal data</li>
                <li>The right to rectify inaccurate personal data</li>
                <li>The right to erase your personal data</li>
                <li>The right to restrict processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this privacy policy or our treatment of your data, please contact us at:
              </p>
              <p className="text-gray-700 mb-4">
                Email: itisaddy7@gmail.com
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the 
                new privacy policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
