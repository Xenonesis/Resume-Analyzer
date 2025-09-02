import React, { useState } from 'react'
import { ExternalLink, Key, Settings, CheckCircle, Database, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/stores/useAppStore'

interface SetupGuideProps {
    onNavigateToSettings?: () => void
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ onNavigateToSettings }) => {
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { isAuthenticated, user } = useAuth()

    const providers = [
        {
            name: 'OpenAI',
            description: 'Most popular and reliable option',
            apiKeyUrl: 'https://platform.openai.com/api-keys',
            cost: '$0.002 per 1K tokens (~$0.01 per resume)',
            recommended: true
        },
        {
            name: 'Google Gemini',
            description: 'Free tier available, good performance',
            apiKeyUrl: 'https://makersuite.google.com/app/apikey',
            cost: 'Free tier available',
            recommended: false
        },
        {
            name: 'Mistral AI',
            description: 'European alternative, competitive pricing',
            apiKeyUrl: 'https://console.mistral.ai/',
            cost: '$0.0002 per 1K tokens (~$0.001 per resume)',
            recommended: false
        }
    ]

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    🚀 Get Started with Real AI Analysis
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    This application provides only authentic AI-powered resume analysis with secure cloud storage.
                    Follow these simple steps to set up your account and configure your AI service.
                </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`bg-white rounded-2xl shadow-lg border-2 p-6 text-center ${isAuthenticated ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isAuthenticated ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                        <User className={`w-6 h-6 ${isAuthenticated ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Sign Up</h3>
                    <p className="text-gray-600 text-sm mb-3">
                        Create your account to securely store resumes and analysis results in the cloud.
                    </p>
                    {isAuthenticated ? (
                        <div className="flex items-center justify-center text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Signed in as {user?.name}
                        </div>
                    ) : (
                        <Button
                            onClick={() => setShowAuthModal(true)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Sign Up / Sign In
                        </Button>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Cloud Storage</h3>
                    <p className="text-gray-600 text-sm">
                        Your resumes and analysis are automatically saved to secure cloud storage with Supabase.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Key className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: AI Setup</h3>
                    <p className="text-gray-600 text-sm">
                        Choose an AI provider and add your API key for authentic analysis results.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: Analyze</h3>
                    <p className="text-gray-600 text-sm">
                        Upload your resume and get authentic AI analysis with real scores and actionable feedback.
                    </p>
                </div>
            </div>

            {/* Provider Options */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your AI Provider</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {providers.map((provider, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border-2 ${provider.recommended
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                                {provider.recommended && (
                                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                        Recommended
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                            <p className="text-xs text-gray-500 mb-3">Cost: {provider.cost}</p>
                            <a
                                href={provider.apiKeyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                                Get API Key
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Supabase Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold text-green-800 mb-3">
                    ☁️ Secure Cloud Storage with Supabase
                </h2>
                <ul className="text-sm text-green-700 space-y-2">
                    <li>• <strong>Automatic Backup:</strong> Your resumes and analysis are safely stored in the cloud</li>
                    <li>• <strong>Cross-Device Access:</strong> Access your data from any device, anywhere</li>
                    <li>• <strong>Real-time Sync:</strong> Changes are instantly synchronized across all your devices</li>
                    <li>• <strong>Enterprise Security:</strong> Bank-level encryption and security standards</li>
                    <li>• <strong>No Data Loss:</strong> Never lose your resume analysis or uploaded files</li>
                </ul>
            </div>

            {/* Why No Mock Data */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold text-yellow-800 mb-3">
                    🚫 Why We Don't Provide Mock Data
                </h2>
                <ul className="text-sm text-yellow-700 space-y-2">
                    <li>• <strong>Real Value:</strong> Mock data doesn't help you improve your actual resume</li>
                    <li>• <strong>Authentic Insights:</strong> Only real AI can provide meaningful, actionable feedback</li>
                    <li>• <strong>Professional Standards:</strong> We maintain high quality by ensuring all results are genuine</li>
                    <li>• <strong>Trust:</strong> You deserve honest analysis with accurate scoring</li>
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
                {!isAuthenticated ? (
                    <Button
                        onClick={() => setShowAuthModal(true)}
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 mr-4"
                    >
                        <User className="w-5 h-5 mr-2" />
                        Get Started - Sign Up Free
                    </Button>
                ) : null}

                <Button
                    onClick={onNavigateToSettings}
                    size="lg"
                    variant={isAuthenticated ? "default" : "outline"}
                    className={isAuthenticated
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                        : "px-8 py-3"
                    }
                >
                    <Settings className="w-5 h-5 mr-2" />
                    Configure AI Settings
                </Button>

                <p className="text-sm text-gray-500">
                    {isAuthenticated
                        ? "Your data is securely stored in the cloud. Configure AI to start analyzing resumes."
                        : "Setup takes less than 2 minutes. Your data is stored securely in the cloud."
                    }
                </p>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </div>
    )
}