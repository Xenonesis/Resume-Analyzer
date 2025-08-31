/**
 * Core type definitions for the AI Resume Analyzer
 */

import { AIConfig } from '@/services/aiService'

export interface Resume {
  id: string
  companyName?: string
  jobTitle?: string
  jobDescription?: string
  imagePath: string
  resumePath: string
  feedback: Feedback
  createdAt: Date
  updatedAt: Date
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
  email?: string
  name?: string
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