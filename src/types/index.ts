/**
 * Core type definitions for the AI Resume Analyzer
 */

import { AIConfig } from '@/services/aiService'

export interface Resume {
  id: string
  name: string
  fileName: string
  filePath: string
  resumePath: string
  imagePath?: string
  fileSize: number
  uploadedAt: Date
  updatedAt: Date
  createdAt: Date
  analysis: Feedback | null
  feedback: Feedback | null
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'error'
  companyName?: string
  jobTitle?: string
  jobDescription?: string
  userId: string
}

export interface Feedback {
  overallScore: number
  ATS: {
    score: number
    tips: FeedbackTip[]
  }
  toneAndStyle: {
    score: number
    tips: DetailedFeedbackTip[]
  }
  content: {
    score: number
    tips: DetailedFeedbackTip[]
  }
  structure: {
    score: number
    tips: DetailedFeedbackTip[]
  }
  skills: {
    score: number
    tips: DetailedFeedbackTip[]
  }
}

export interface FeedbackTip {
  type: 'good' | 'improve'
  tip: string
}

export interface DetailedFeedbackTip extends FeedbackTip {
  explanation: string
}

export interface UploadFormData {
  companyName: string
  jobTitle: string
  jobDescription: string
  file: File
}

export interface AnalysisProgress {
  stage: 'uploading' | 'converting' | 'analyzing' | 'complete' | 'error'
  message: string
  progress?: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string | null
  createdAt: Date
}

export interface AppState {
  auth: {
    isAuthenticated: boolean
    user: User | null
    isLoading: boolean
  }
  files: {
    uploadProgress: number
    isUploading: boolean
    error: string | null
  }
  resumes: {
    items: Resume[]
    isLoading: boolean
    currentResume: Resume | null
  }
  analysis: {
    isAnalyzing: boolean
    progress: string
    error: string | null
  }
  aiConfig: {
    config: AIConfig | null
    isConfigured: boolean
  }
}

// Helper function to safely access feedback properties
export const getFeedbackScore = (resume: Resume, category?: keyof Feedback): number => {
  if (!resume.feedback) return 0
  if (!category) return resume.feedback.overallScore || 0
  
  const section = resume.feedback[category]
  if (typeof section === 'object' && 'score' in section) {
    return section.score || 0
  }
  return 0
}

// Helper to check if resume has valid feedback
export const hasValidFeedback = (resume: Resume): boolean => {
  return !!(resume.feedback && resume.feedback.overallScore !== undefined)
}