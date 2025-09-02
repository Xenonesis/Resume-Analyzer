import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { ResumeQuestionnaire, QuestionnaireData } from '@/components/ResumeQuestionnaire'
import { Helmet } from 'react-helmet-async'
import { useAIConfig, useAuth } from '@/stores/useAppStore'
import { aiService } from '@/services/aiService'

export const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate()
  const { filePath } = useParams<{ filePath: string }>()
  const [searchParams] = useSearchParams()
  const fileName = searchParams.get('fileName') || 'resume.pdf'
  const { isAuthenticated } = useAuth()
  const { config, isConfigured } = useAIConfig()

  const handleQuestionnaireComplete = (data: QuestionnaireData) => {
    // Store questionnaire data in sessionStorage for the analysis page
    sessionStorage.setItem('questionnaireData', JSON.stringify(data))
    
    // Navigate to analyze page with enhanced data
    const encodedPath = encodeURIComponent(filePath || '')
    const encodedName = encodeURIComponent(fileName)
    navigate(`/app/analyze/${encodedPath}?fileName=${encodedName}`)
  }

  const handleBack = () => {
    // Check if all required configuration is complete
    const hasValidConfig = isAuthenticated && 
                          isConfigured && 
                          aiService.isConfigured() && 
                          config?.apiKey && 
                          config.apiKey.length > 0

    if (hasValidConfig) {
      navigate('/app/upload')
    } else {
      navigate('/app/settings')
    }
  }

  if (!filePath) {
    // Check if all required configuration is complete
    const hasValidConfig = isAuthenticated && 
                          isConfigured && 
                          aiService.isConfigured() && 
                          config?.apiKey && 
                          config.apiKey.length > 0

    if (hasValidConfig) {
      navigate('/app/upload')
    } else {
      navigate('/app/settings')
    }
    return null
  }

  return (
    <>
      <Helmet>
        <title>Resume Analysis Questionnaire - AI Resume Analyzer</title>
        <meta name="description" content="Complete our comprehensive questionnaire to get personalized AI resume analysis tailored to your career goals and target job." />
        <meta property="og:title" content="Resume Analysis Questionnaire - AI Resume Analyzer" />
        <meta property="og:description" content="Complete our comprehensive questionnaire to get personalized AI resume analysis tailored to your career goals and target job." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Resume Analysis Questionnaire - AI Resume Analyzer" />
        <meta name="twitter:description" content="Complete our comprehensive questionnaire to get personalized AI resume analysis tailored to your career goals and target job." />
      </Helmet>
      
      <ResumeQuestionnaire
        fileName={decodeURIComponent(fileName)}
        filePath={decodeURIComponent(filePath)}
        onComplete={handleQuestionnaireComplete}
        onBack={handleBack}
      />
    </>
  )
}