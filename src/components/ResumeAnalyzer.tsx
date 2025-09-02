import React, { useState, useEffect } from 'react'
import { useAnalysisActions, useAIConfig } from '@/stores/useAppStore'
import { useResumeData } from '@/hooks/useResumeData'
import { aiService } from '@/services/aiService'
import { useSupabaseResumes } from '@/hooks/useSupabaseResumes'
import { useResumes } from '@/stores/useAppStore'
import { generateId } from '@/utils/uuid'
import { Resume, Feedback } from '@/types'
import { QuestionnaireData } from './ResumeQuestionnaire'
import { getFileFromSession } from '@/utils/fileStorage'
import { PdfDiagnostic } from './PdfDiagnostic'

interface ResumeAnalyzerProps {
  filePath: string
  fileName: string
  onComplete?: (resume: Resume) => void
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  filePath,
  fileName,
  onComplete
}) => {
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { setAnalyzing, setAnalysisProgress, setAnalysisError } = useAnalysisActions()
  const { isConfigured } = useAIConfig()
  const { items: resumes } = useResumes()
  const { downloadResume } = useSupabaseResumes()
  const { saveNewResume } = useResumeData(true) // Pass true for isAuthenticated since this component is only used when authenticated

  // Load questionnaire data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem('questionnaireData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as QuestionnaireData
        setQuestionnaireData(data)
      } catch (error) {
        console.error('Failed to parse questionnaire data:', error)
      }
    }
  }, [])


  // Helper function to validate feedback structure
  const validateFeedback = (feedback: any): feedback is Feedback => {
    return (
      feedback && typeof feedback === 'object' &&
      typeof feedback.overallScore === 'number' &&
      feedback.ATS && typeof feedback.ATS === 'object' && typeof feedback.ATS.score === 'number' && Array.isArray(feedback.ATS.tips) &&
      feedback.toneAndStyle && typeof feedback.toneAndStyle === 'object' && typeof feedback.toneAndStyle.score === 'number' && Array.isArray(feedback.toneAndStyle.tips) &&
      feedback.content && typeof feedback.content === 'object' && typeof feedback.content.score === 'number' && Array.isArray(feedback.content.tips) &&
      feedback.structure && typeof feedback.structure === 'object' && typeof feedback.structure.score === 'number' && Array.isArray(feedback.structure.tips) &&
      feedback.skills && typeof feedback.skills === 'object' && typeof feedback.skills.score === 'number' && Array.isArray(feedback.skills.tips)
    )
  }

  const handleAnalyze = async () => {
    if (!questionnaireData) {
      setError('Questionnaire data not found. Please go back and complete the questionnaire.')
      return
    }

    if (!questionnaireData.jobContext.companyName || !questionnaireData.jobContext.jobTitle) {
      setError('Please ensure company name and job title are provided in the questionnaire.')
      return
    }

    // Check if AI service is configured
    if (!isConfigured || !aiService.isConfigured()) {
      setError('🚫 AI service not configured. Please configure your AI provider and API key in Settings to get analysis results.')
      return
    }

    setIsAnalyzing(true)
    setAnalyzing(true)
    setError(null)

    try {
      // Step 1: Create analysis instructions
      setProgress('Preparing analysis...')
      setAnalysisProgress('Preparing analysis...')
      
      const instructions = `
COMPREHENSIVE RESUME ANALYSIS REQUEST

CANDIDATE PROFILE:
- Current Status: ${questionnaireData.currentStatus.employmentStatus} (${questionnaireData.currentStatus.experienceLevel})
- Experience: ${questionnaireData.currentStatus.yearsOfExperience}
- Current Role: ${questionnaireData.currentStatus.currentRole || 'Not specified'}
- Current Company: ${questionnaireData.currentStatus.currentCompany || 'Not specified'}
- Notice Period: ${questionnaireData.currentStatus.noticePeriod || 'Not specified'}

DREAM JOB ASPIRATIONS:
- Target Role: ${questionnaireData.dreamJob.title}
- Target Company: ${questionnaireData.dreamJob.company || 'Open to opportunities'}
- Industry: ${questionnaireData.dreamJob.industry}
- Location Preference: ${questionnaireData.dreamJob.location || 'Flexible'}
- Salary Range: ${questionnaireData.dreamJob.salaryRange || 'Not specified'}
- Work Type: ${questionnaireData.dreamJob.workType}

CAREER GOALS & CHALLENGES:
- Career Goals: ${questionnaireData.additionalInfo.careerGoals}
- Key Skills: ${questionnaireData.additionalInfo.keySkills.join(', ') || 'Not specified'}
- Certifications: ${questionnaireData.additionalInfo.certifications.join(', ') || 'None listed'}
- Current Challenges: ${questionnaireData.additionalInfo.challenges.join(', ') || 'None specified'}
- Application Deadline: ${questionnaireData.additionalInfo.applicationDeadline || 'No deadline specified'}

SPECIFIC JOB APPLICATION:
- Company: ${questionnaireData.jobContext.companyName}
- Job Title: ${questionnaireData.jobContext.jobTitle}
- Job Description: ${questionnaireData.jobContext.jobDescription || 'Not provided - analyze for general best practices'}
- Application Source: ${questionnaireData.jobContext.applicationSource || 'Not specified'}
- Referral Contact: ${questionnaireData.jobContext.referral || 'None'}
- Special Requirements: ${questionnaireData.additionalInfo.specificRequirements || 'None'}

ANALYSIS REQUIREMENTS:
Analyze the provided resume content against the target position. Provide honest, accurate scoring based on:

1. ATS COMPATIBILITY (0-100):
   - Keyword optimization for the specific job
   - File format and structure compatibility
   - Section organization and headers
   - Font and formatting choices

2. TONE AND STYLE (0-100):
   - Professional language and tone
   - Consistency in voice
   - Appropriate level of formality
   - Grammar and writing quality

3. CONTENT QUALITY (0-100):
   - Relevance to target position
   - Achievement quantification
   - Skills demonstration
   - Experience presentation

4. STRUCTURE AND FORMATTING (0-100):
   - Visual hierarchy and readability
   - Section organization
   - Length appropriateness
   - White space usage

5. SKILLS ALIGNMENT (0-100):
   - Match with job requirements
   - Technical skills relevance
   - Soft skills demonstration
   - Skill presentation quality

SCORING GUIDELINES:
- 90-100: Exceptional, industry-leading quality
- 80-89: Strong, above-average performance
- 70-79: Good, meets most standards
- 60-69: Adequate, needs some improvement
- 50-59: Below average, requires significant work
- 0-49: Poor, major issues need addressing

FEEDBACK REQUIREMENTS:
- Provide 3-5 specific tips per category
- Include both strengths ("good") and improvements ("improve")
- Base all feedback on actual resume content
- Make tips actionable and specific
- Reference specific sections or content when possible

CRITICAL: Analyze the ACTUAL resume content provided. Do not use generic responses. Scores must reflect genuine analysis of the specific resume against the job requirements.

RESPONSE FORMAT: Valid JSON only, no explanations or markdown.

{
  "overallScore": number,
  "ATS": {
    "score": number,
    "tips": [{"type": "good" | "improve", "tip": "specific actionable tip"}]
  },
  "toneAndStyle": {
    "score": number,
    "tips": [{"type": "good" | "improve", "tip": "specific tip", "explanation": "detailed reasoning"}]
  },
  "content": {
    "score": number,
    "tips": [{"type": "good" | "improve", "tip": "specific tip", "explanation": "detailed reasoning"}]
  },
  "structure": {
    "score": number,
    "tips": [{"type": "good" | "improve", "tip": "specific tip", "explanation": "detailed reasoning"}]
  },
  "skills": {
    "score": number,
    "tips": [{"type": "good" | "improve", "tip": "specific tip", "explanation": "detailed reasoning"}]
  }
}
`

      // Step 2: Read and extract text from PDF file
      setProgress('Extracting text from PDF...')
      setAnalysisProgress('Extracting text from PDF...')
      
      let resumeText = ''
      let file: File | null = null
      
      try {
        // Find the resume by file path
        const resume = resumes.find(r => r.filePath === filePath)
        
        if (resume) {
          // Resume found in database - download from Supabase Storage
          console.log('Resume found in database, downloading from Supabase...')
          try {
            const fileBlob = await downloadResume(resume)
            file = new File([fileBlob], resume.fileName, { type: 'application/pdf' })
            console.log(`Downloaded resume file: ${file.name} (${file.size} bytes)`)
          } catch (downloadError) {
            console.warn('Failed to download from Supabase, trying session storage fallback:', downloadError)
            // Fall through to session storage fallback
          }
        }
        
        if (!file) {
          // Try to get the file from session storage as fallback
          console.log('Attempting to retrieve file from session storage...')
          file = getFileFromSession(filePath)
          
          if (!file) {
            throw new Error('Resume not found in database and no fallback file available. Please re-upload your resume.')
          }
          
          console.log(`Retrieved file from session storage: ${file.name} (${file.size} bytes)`)
        }
        
        // Validate file before processing
        if (!file || file.size === 0) {
          throw new Error('Retrieved file is empty or invalid')
        }
        
        // Quick PDF validation
        const { validatePdfFile, quickPdfTextCheck } = await import('@/utils/pdfValidator')
        const validation = validatePdfFile(file)
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid PDF file')
        }
        
        // Quick text check
        const textCheck = await quickPdfTextCheck(file)
        if (!textCheck.hasText && textCheck.warning) {
          console.warn('PDF text check warning:', textCheck.warning)
        }
        
        // Import PDF processor dynamically
        const { extractTextFromPdf } = await import('@/utils/pdfProcessor')
        
        // Extract text from PDF using PDF.js
        console.log('Starting PDF text extraction...')
        console.log('File details:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified).toISOString()
        })
        
        resumeText = await extractTextFromPdf(file)
        
        console.log('PDF text extraction completed:', {
          textLength: resumeText.length,
          firstChars: resumeText.substring(0, 100) + '...'
        })
        
        // Validate extracted text
        if (!resumeText || resumeText.trim().length < 50) {
          throw new Error('Insufficient text extracted from PDF. The file might be image-based, corrupted, or contain very little text content.')
        }
        
        console.log(`Successfully extracted ${resumeText.length} characters from PDF`)
        
      } catch (fileError) {
        console.error('Error extracting text from PDF:', fileError)
        const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown error occurred'
        
        // Provide more specific error guidance
        let userMessage = errorMessage
        if (errorMessage.includes('not found in database')) {
          userMessage = 'Resume file not found. Please re-upload your resume and try again.'
        } else if (errorMessage.includes('image-based')) {
          userMessage = 'This PDF contains only images or scanned content. Please upload a PDF with selectable text content.'
        } else if (errorMessage.includes('password')) {
          userMessage = 'This PDF is password-protected. Please upload an unprotected PDF file.'
        } else if (errorMessage.includes('corrupted') || errorMessage.includes('damaged')) {
          userMessage = 'The PDF file appears to be corrupted. Please try uploading a different version.'
        } else if (errorMessage.includes('Failed to load PDF.js')) {
          userMessage = 'PDF processing library failed to load. Please check your internet connection and try again.'
        }
        
        throw new Error(`🚫 Cannot analyze resume: ${userMessage}`)
      }

      // Step 3: Analyze with AI
      setProgress('Analyzing resume with AI...')
      setAnalysisProgress('Analyzing resume with AI...')
      
      const aiResponse = await aiService.analyzeResume(resumeText, instructions)
      
      // Step 4: Parse AI response
      setProgress('Processing feedback...')
      setAnalysisProgress('Processing feedback...')

      let feedback: Feedback
      try {
        // Clean the response text - remove markdown code blocks and trim whitespace
        let cleanedText = aiResponse.text.trim()
        
        // Remove markdown code blocks if present
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*$/g, '')
        cleanedText = cleanedText.replace(/```\s*/g, '').trim()
        
        // Try to parse the cleaned response directly
        try {
          feedback = JSON.parse(cleanedText)
          console.log('Successfully parsed AI response:', feedback)
        } catch (directParseError) {
          console.warn('Direct parsing failed, attempting to extract JSON:', directParseError)
          
          // Try to find JSON content within the response
          // Look for the first { and find its matching }
          const firstBraceIndex = cleanedText.indexOf('{')
          if (firstBraceIndex === -1) {
            throw new Error('No JSON object found in response')
          }
          
          let braceCount = 0
          let jsonEndIndex = -1
          
          for (let i = firstBraceIndex; i < cleanedText.length; i++) {
            if (cleanedText[i] === '{') {
              braceCount++
            } else if (cleanedText[i] === '}') {
              braceCount--
              if (braceCount === 0) {
                jsonEndIndex = i
                break
              }
            }
          }
          
          if (jsonEndIndex === -1) {
            throw new Error('Incomplete JSON object found in response')
          }
          
          const jsonString = cleanedText.substring(firstBraceIndex, jsonEndIndex + 1)
          feedback = JSON.parse(jsonString)
          console.log('Successfully extracted and parsed JSON from response:', feedback)
        }
        
        // Validate the feedback structure
        if (!validateFeedback(feedback)) {
          console.error('Invalid feedback structure received:', feedback)
          throw new Error('AI returned incomplete analysis data. Please try again or check your AI service configuration.')
        }

        // Enhanced validation to ensure authentic AI analysis
        const scores = [
          feedback.overallScore,
          feedback.ATS.score,
          feedback.content.score,
          feedback.structure.score,
          feedback.skills.score,
          feedback.toneAndStyle.score
        ]
        
        // Validate score ranges
        const invalidScores = scores.filter(score => score < 0 || score > 100 || !Number.isInteger(score))
        if (invalidScores.length > 0) {
          throw new Error('🚫 AI returned invalid scores. Scores must be integers between 0-100.')
        }
        
        // Check for suspicious patterns that indicate invalid AI responses
        const allSameScore = scores.every(score => score === scores[0])
        const allRoundNumbers = scores.every(score => score % 5 === 0)
        const suspiciouslyHigh = scores.every(score => score >= 75)
        const suspiciouslyLow = scores.every(score => score <= 25)
        
        // Detect invalid score patterns
        if (allSameScore) {
          throw new Error('🚫 AI returned identical scores for all categories. Please try again with a different AI model or check your configuration.')
        }
        
        if (allRoundNumbers && (suspiciouslyHigh || suspiciouslyLow)) {
          console.warn('Detected potentially suspicious AI response pattern:', scores)
          throw new Error('🚫 AI response shows suspicious scoring patterns. Please verify your AI service is properly configured and try again.')
        }
        
        // Validate that tips arrays contain meaningful content
        const allTipArrays = [
          feedback.ATS.tips,
          feedback.content.tips,
          feedback.structure.tips,
          feedback.skills.tips,
          feedback.toneAndStyle.tips
        ]
        
        for (const tips of allTipArrays) {
          if (!Array.isArray(tips) || tips.length === 0) {
            console.error('Tips validation failed:', tips)
            throw new Error('🚫 AI analysis is incomplete - missing feedback tips. Please try again.')
          }
          // Tips validation passed - reduced logging
        }
        
        // Validate that the analysis is contextually relevant to the job details
        const analysisText = JSON.stringify(feedback).toLowerCase()
        
        // Check if the analysis mentions the company or job title (if provided)
        if (questionnaireData.jobContext.companyName.length > 3 && !analysisText.includes(questionnaireData.jobContext.companyName.toLowerCase())) {
          console.warn('AI analysis may not be contextually relevant to the specified company')
        }
        
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        console.log('Raw AI response:', aiResponse.text)
        
        // Provide more helpful error messages based on the response content
        let errorMessage = 'AI response does not contain valid JSON.'
        
        if (aiResponse.text.includes('I cannot') || aiResponse.text.includes('I\'m sorry')) {
          errorMessage = 'AI declined to analyze the resume. Please try with different content.'
        } else if (aiResponse.text.length < 50) {
          errorMessage = 'AI response was too short. Please check your API configuration and try again.'
        } else if (!aiResponse.text.includes('{')) {
          errorMessage = 'AI did not return JSON format. Please try again or check your AI model settings.'
        } else {
          errorMessage = 'AI response format is invalid. This might be due to model settings or API issues.'
        }
        
        // Throw proper error for invalid AI response
        console.error('AI response parsing failed:', parseError)
        console.log('Raw AI response that failed to parse:', aiResponse.text)
        throw new Error(`🚫 AI analysis failed: ${errorMessage} Please check your AI service configuration and try again.`)
      }

      // Step 4: Create resume preview image
      setProgress('Creating preview...')
      setAnalysisProgress('Creating preview...')
      
      let imagePath = `${filePath}_preview.png`
      
      try {
        // Generate actual PDF preview
        const { convertPdfToImage } = await import('@/utils/pdfProcessor')
        const resume = resumes.find(r => r.filePath === filePath)
        if (resume) {
          const fileBlob = await downloadResume(resume)
          const file = new File([fileBlob], resume.fileName, { type: 'application/pdf' })
          const previewDataUrl = await convertPdfToImage(file)
          
          // In a real implementation, you would upload this preview image to storage
          // For now, we'll store the data URL (note: this is not ideal for production)
          imagePath = previewDataUrl
        }
      } catch (previewError) {
        console.warn('Could not generate PDF preview:', previewError)
        // Use fallback image path
        imagePath = `${filePath}_preview.png`
      }

      // Step 5: Create resume object
      const resume: Resume = {
        id: generateId(),
        name: fileName,
        fileName: fileName,
        filePath: filePath,
        resumePath: filePath,
        imagePath,
        fileSize: 0, // Will be updated when we have the actual file
        uploadedAt: new Date(),
        updatedAt: new Date(),
        createdAt: new Date(),
        analysis: feedback,
        feedback,
        status: 'analyzed' as const,
        companyName: questionnaireData.jobContext.companyName,
        jobTitle: questionnaireData.jobContext.jobTitle,
        jobDescription: questionnaireData.jobContext.jobDescription,
        userId: 'temp-user-id' // This will be set properly when we have auth
      }

      // Step 6: Save to storage
      setProgress('Saving results...')
      setAnalysisProgress('Saving results...')
      
      // Save to localStorage and update state
      saveNewResume(resume)
      
      setProgress('Analysis complete!')
      setAnalysisProgress('Analysis complete!')
      
      if (onComplete) {
        onComplete(resume)
      }

    } catch (error) {
      console.error('Analysis failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed'
      setError(errorMessage)
      setAnalysisError(errorMessage)
    } finally {
      setIsAnalyzing(false)
      setAnalyzing(false)
      setTimeout(() => {
        setProgress('')
        setAnalysisProgress('')
      }, 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* File Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900">Resume Uploaded Successfully!</h3>
            <p className="text-sm text-blue-700">{fileName}</p>
          </div>
        </div>
      </div>

      {/* Questionnaire Summary */}
      {questionnaireData ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Analysis Ready</h3>
              <p className="text-sm text-gray-600">Your questionnaire data has been loaded successfully</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Target Position</h4>
              <p className="text-sm text-blue-800">{questionnaireData.jobContext.jobTitle}</p>
              <p className="text-sm text-blue-700">{questionnaireData.jobContext.companyName}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Dream Role</h4>
              <p className="text-sm text-purple-800">{questionnaireData.dreamJob.title}</p>
              <p className="text-sm text-purple-700">{questionnaireData.dreamJob.industry}</p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Experience</h4>
              <p className="text-sm text-emerald-800">{questionnaireData.currentStatus.experienceLevel}</p>
              <p className="text-sm text-emerald-700">{questionnaireData.currentStatus.yearsOfExperience}</p>
            </div>
            
            {questionnaireData.additionalInfo.keySkills.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Key Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {questionnaireData.additionalInfo.keySkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {questionnaireData.additionalInfo.keySkills.length > 3 && (
                    <span className="text-xs text-orange-700">+{questionnaireData.additionalInfo.keySkills.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
            
            {questionnaireData.additionalInfo.challenges.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                <h4 className="font-semibold text-red-900 mb-2">Focus Areas</h4>
                <p className="text-sm text-red-800">{questionnaireData.additionalInfo.challenges.slice(0, 2).join(', ')}</p>
                {questionnaireData.additionalInfo.challenges.length > 2 && (
                  <p className="text-xs text-red-700">+{questionnaireData.additionalInfo.challenges.length - 2} more</p>
                )}
              </div>
            )}
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">Work Preference</h4>
              <p className="text-sm text-indigo-800 capitalize">{questionnaireData.dreamJob.workType}</p>
              <p className="text-sm text-indigo-700">{questionnaireData.dreamJob.location || 'Flexible location'}</p>
            </div>
          </div>
          
          {questionnaireData.additionalInfo.careerGoals && (
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Career Goals</h4>
              <p className="text-sm text-gray-700 line-clamp-3">{questionnaireData.additionalInfo.careerGoals}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Questionnaire Data Missing</h3>
              <p className="text-sm text-yellow-800">Please complete the questionnaire first for personalized analysis.</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <>
          {error.includes('PDF') || error.includes('text') || error.includes('image-based') || error.includes('corrupted') ? (
            <PdfDiagnostic 
              error={error}
              onRetry={handleAnalyze}
            />
          ) : (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              {(error.includes('Authentication') || error.includes('AI service not configured')) && (
                <div className="ml-11">
                  {error.includes('Authentication') ? (
                    <button 
                      onClick={() => window.location.href = '/auth'}
                      className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Sign In Again
                    </button>
                  ) : (
                    <button 
                      onClick={() => window.location.href = '/settings'}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Configure AI Settings
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isAnalyzing && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="animate-spin w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-bold text-blue-900 mb-2">AI Analysis in Progress</h4>
            <p className="text-blue-700 font-medium mb-1">{progress}</p>
            <p className="text-sm text-blue-600">
              Our AI is carefully analyzing your resume against the job requirements...
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !questionnaireData}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
          isAnalyzing || !questionnaireData
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Analyzing Resume...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Start AI Analysis</span>
          </div>
        )}
      </button>
    </div>
  )
}
