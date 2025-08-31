import React, { useState } from 'react'
import { useAnalysisActions, useResumeActions, useAIConfig } from '@/stores/useAppStore'
import { aiService } from '@/services/aiService'
import puterService from '@/services/puterService'
import { generateId } from '@/utils/uuid'
import { Resume, Feedback } from '@/types'

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
  const [jobDetails, setJobDetails] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: ''
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { setAnalyzing, setAnalysisProgress, setAnalysisError } = useAnalysisActions()
  const { addResume } = useResumeActions()
  const { isConfigured } = useAIConfig()

  // Helper function to create fallback feedback
  const createFallbackFeedback = (_aiResponseText: string): Feedback => {
    const fallbackTips = [
      { type: 'improve' as const, tip: 'Analysis incomplete due to AI response format issue', explanation: 'Please try the analysis again for complete feedback.' }
    ]
    
    return {
      overallScore: 75,
      ATS: {
        score: 75,
        tips: [
          { type: 'improve' as const, tip: 'ATS analysis incomplete due to response formatting' }
        ]
      },
      toneAndStyle: {
        score: 75,
        tips: fallbackTips
      },
      content: {
        score: 75,
        tips: fallbackTips
      },
      structure: {
        score: 75,
        tips: fallbackTips
      },
      skills: {
        score: 75,
        tips: fallbackTips
      }
    }
  }

  // Helper function to repair and validate feedback structure
  const repairFeedback = (partialFeedback: any): Feedback => {
    const defaultSection = {
      score: 75,
      tips: [{ type: 'improve' as const, tip: 'Analysis incomplete', explanation: 'This section could not be fully analyzed.' }]
    }
    
    const defaultATSSection = {
      score: 75,
      tips: [{ type: 'improve' as const, tip: 'ATS analysis incomplete' }]
    }

    return {
      overallScore: typeof partialFeedback.overallScore === 'number' ? partialFeedback.overallScore : 75,
      ATS: (partialFeedback.ATS && typeof partialFeedback.ATS.score === 'number' && Array.isArray(partialFeedback.ATS.tips)) 
        ? partialFeedback.ATS : defaultATSSection,
      toneAndStyle: (partialFeedback.toneAndStyle && typeof partialFeedback.toneAndStyle.score === 'number' && Array.isArray(partialFeedback.toneAndStyle.tips))
        ? partialFeedback.toneAndStyle : defaultSection,
      content: (partialFeedback.content && typeof partialFeedback.content.score === 'number' && Array.isArray(partialFeedback.content.tips))
        ? partialFeedback.content : defaultSection,
      structure: (partialFeedback.structure && typeof partialFeedback.structure.score === 'number' && Array.isArray(partialFeedback.structure.tips))
        ? partialFeedback.structure : defaultSection,
      skills: (partialFeedback.skills && typeof partialFeedback.skills.score === 'number' && Array.isArray(partialFeedback.skills.tips))
        ? partialFeedback.skills : defaultSection
    }
  }

  const handleAnalyze = async () => {
    if (!jobDetails.companyName || !jobDetails.jobTitle) {
      setError('Please fill in company name and job title')
      return
    }

    // Check if AI service is configured
    if (!isConfigured || !aiService.isConfigured()) {
      setError('AI service not configured. Please go to Settings to configure your AI provider and API key.')
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
You are an expert resume analyzer. Please analyze this resume for the following position:

Company: ${jobDetails.companyName}
Job Title: ${jobDetails.jobTitle}
Job Description: ${jobDetails.jobDescription || 'Not provided'}

Provide detailed feedback focusing on:
1. ATS (Applicant Tracking System) compatibility
2. Tone and writing style
3. Content quality and relevance
4. Resume structure and formatting
5. Skills alignment with the job requirements

Rate each category from 0-100 and provide specific, actionable tips.

IMPORTANT: Respond ONLY with valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Start your response with { and end with }.

JSON format:
{
  "overallScore": number (0-100),
  "ATS": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip"}]
  },
  "toneAndStyle": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  },
  "content": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  },
  "structure": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  },
  "skills": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  }
}
`

      // Step 2: Read file content
      setProgress('Reading resume file...')
      setAnalysisProgress('Reading resume file...')
      
      let resumeText = ''
      try {
        const fileContent = await puterService.fs.read(filePath)
        
        // Handle different file content types
        if (typeof fileContent === 'string') {
          resumeText = fileContent
        } else if (fileContent instanceof ArrayBuffer) {
          const decoder = new TextDecoder()
          resumeText = decoder.decode(fileContent)
        } else if (fileContent && typeof fileContent === 'object' && 'byteLength' in fileContent) {
          // Handle Uint8Array or similar buffer types
          const decoder = new TextDecoder()
          resumeText = decoder.decode(new Uint8Array(fileContent as ArrayBuffer))
        } else {
          resumeText = String(fileContent)
        }
        
        // If file content is empty or very small, it might be a binary PDF
        if (resumeText.length < 50) {
          resumeText = `[PDF resume file: ${fileName}. This appears to be a binary PDF file. The actual content extraction would normally be handled by a PDF processing service.]`
        }
      } catch (fileError) {
        console.error('Error reading file:', fileError)
        resumeText = `[Resume file: ${fileName}. Could not read file content: ${fileError}]`
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
        
        // Validate and repair the feedback structure
        const isValidFeedback = (fb: any): fb is Feedback => {
          return (
            fb && typeof fb === 'object' &&
            typeof fb.overallScore === 'number' &&
            fb.ATS && typeof fb.ATS === 'object' && typeof fb.ATS.score === 'number' && Array.isArray(fb.ATS.tips) &&
            fb.toneAndStyle && typeof fb.toneAndStyle === 'object' && typeof fb.toneAndStyle.score === 'number' && Array.isArray(fb.toneAndStyle.tips) &&
            fb.content && typeof fb.content === 'object' && typeof fb.content.score === 'number' && Array.isArray(fb.content.tips) &&
            fb.structure && typeof fb.structure === 'object' && typeof fb.structure.score === 'number' && Array.isArray(fb.structure.tips) &&
            fb.skills && typeof fb.skills === 'object' && typeof fb.skills.score === 'number' && Array.isArray(fb.skills.tips)
          )
        }
        
        if (!isValidFeedback(feedback)) {
          console.warn('Incomplete feedback structure detected, attempting to repair:', feedback)
          feedback = repairFeedback(feedback)
          setError('Note: AI response was incomplete, some sections have been filled with default values.')
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
        
        // Create a fallback feedback so the user gets some result
        console.log('Creating fallback feedback due to parsing error')
        feedback = createFallbackFeedback(aiResponse.text)
        
        // Log the issue but don't throw - let the user see the fallback result
        console.warn(`Using fallback feedback due to: ${errorMessage}`)
        setError(`Note: ${errorMessage} Showing approximate analysis.`)
      }

      // Step 4: Create resume preview image (placeholder)
      setProgress('Creating preview...')
      setAnalysisProgress('Creating preview...')
      
      // For now, we'll use a placeholder image path
      const imagePath = `${filePath}_preview.png`

      // Step 5: Create resume object
      const resume: Resume = {
        id: generateId(),
        companyName: jobDetails.companyName,
        jobTitle: jobDetails.jobTitle,
        jobDescription: jobDetails.jobDescription,
        imagePath,
        resumePath: filePath,
        feedback,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Step 6: Save to storage
      setProgress('Saving results...')
      setAnalysisProgress('Saving results...')
      
      await puterService.kv.set(`resume_${resume.id}`, JSON.stringify(resume))
      
      // Step 7: Update state
      addResume(resume)
      
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

      {/* Job Details Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Job Details</h3>
            <p className="text-sm text-gray-600">Tell us about the position you're applying for</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={jobDetails.companyName}
              onChange={(e) => setJobDetails(prev => ({ ...prev, companyName: e.target.value }))}
              className="input-field"
              placeholder="e.g. Google, Microsoft, Apple"
              disabled={isAnalyzing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={jobDetails.jobTitle}
              onChange={(e) => setJobDetails(prev => ({ ...prev, jobTitle: e.target.value }))}
              className="input-field"
              placeholder="e.g. Software Engineer, Product Manager"
              disabled={isAnalyzing}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Description (Optional)
          </label>
          <textarea
            value={jobDetails.jobDescription}
            onChange={(e) => setJobDetails(prev => ({ ...prev, jobDescription: e.target.value }))}
            className="input-field min-h-[120px] resize-none"
            placeholder="Paste the complete job description here for more accurate analysis. Include requirements, responsibilities, and qualifications..."
            disabled={isAnalyzing}
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Adding a job description significantly improves analysis accuracy
          </p>
        </div>
      </div>

      {error && (
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
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Configure AI Settings
                </button>
              )}
            </div>
          )}
        </div>
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
        disabled={isAnalyzing || !jobDetails.companyName || !jobDetails.jobTitle}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
          isAnalyzing || !jobDetails.companyName || !jobDetails.jobTitle
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
