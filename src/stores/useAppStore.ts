/**
 * Zustand store for AI Resume Analyzer global state management
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Resume, User, AppState } from '@/types'
import { AIConfig } from '@/services/aiService'
import { ThemeName } from '@/types/theme'

interface AppStore extends AppState {
  // Auth actions
  setAuthenticated: (isAuthenticated: boolean) => void
  setUser: (user: User | null) => void
  setAuthLoading: (isLoading: boolean) => void
  signOut: () => void

  // File actions
  setUploadProgress: (progress: number) => void
  setUploading: (isUploading: boolean) => void
  setFileError: (error: string | null) => void
  resetFileState: () => void

  // Resume actions
  setResumes: (resumes: Resume[]) => void
  addResume: (resume: Resume) => void
  updateResume: (id: string, updates: Partial<Resume>) => void
  deleteResume: (id: string) => void
  setCurrentResume: (resume: Resume | null) => void
  setResumesLoading: (isLoading: boolean) => void

  // Analysis actions
  setAnalyzing: (isAnalyzing: boolean) => void
  setAnalysisProgress: (progress: string) => void
  setAnalysisError: (error: string | null) => void
  resetAnalysisState: () => void

  // AI Config actions
  setAIConfig: (config: AIConfig | null) => void
  setAIConfigured: (isConfigured: boolean) => void

  // Theme actions
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
    isLoading: false
  },
  files: {
    uploadProgress: 0,
    isUploading: false,
    error: null
  },
  resumes: {
    items: [],
    isLoading: false,
    currentResume: null
  },
  analysis: {
    isAnalyzing: false,
    progress: '',
    error: null
  },
  aiConfig: {
    config: null,
    isConfigured: false
  }
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        currentTheme: 'default' as ThemeName,

        // Auth actions
        setAuthenticated: (isAuthenticated: boolean) =>
          set(
            (state) => ({
              auth: { ...state.auth, isAuthenticated }
            }),
            false,
            'setAuthenticated'
          ),

        setUser: (user: User | null) =>
          set(
            (state) => ({
              auth: { ...state.auth, user }
            }),
            false,
            'setUser'
          ),

        setAuthLoading: (isLoading: boolean) =>
          set(
            (state) => ({
              auth: { ...state.auth, isLoading }
            }),
            false,
            'setAuthLoading'
          ),

        signOut: () =>
          set(
            () => ({
              ...initialState,
              resumes: { items: [], isLoading: false, currentResume: null }
            }),
            false,
            'signOut'
          ),

        // File actions
        setUploadProgress: (uploadProgress: number) =>
          set(
            (state) => ({
              files: { ...state.files, uploadProgress }
            }),
            false,
            'setUploadProgress'
          ),

        setUploading: (isUploading: boolean) =>
          set(
            (state) => ({
              files: { ...state.files, isUploading }
            }),
            false,
            'setUploading'
          ),

        setFileError: (error: string | null) =>
          set(
            (state) => ({
              files: { ...state.files, error }
            }),
            false,
            'setFileError'
          ),

        resetFileState: () =>
          set(
            () => ({
              files: { uploadProgress: 0, isUploading: false, error: null }
            }),
            false,
            'resetFileState'
          ),

        // Resume actions
        setResumes: (items: Resume[]) =>
          set(
            (state) => ({
              resumes: { ...state.resumes, items }
            }),
            false,
            'setResumes'
          ),

        addResume: (resume: Resume) =>
          set(
            (state) => ({
              resumes: {
                ...state.resumes,
                items: [resume, ...state.resumes.items]
              }
            }),
            false,
            'addResume'
          ),

        updateResume: (id: string, updates: Partial<Resume>) =>
          set(
            (state) => ({
              resumes: {
                ...state.resumes,
                items: state.resumes.items.map((resume) =>
                  resume.id === id
                    ? { ...resume, ...updates, updatedAt: new Date() }
                    : resume
                ),
                currentResume:
                  state.resumes.currentResume?.id === id
                    ? { ...state.resumes.currentResume, ...updates, updatedAt: new Date() }
                    : state.resumes.currentResume
              }
            }),
            false,
            'updateResume'
          ),

        deleteResume: (id: string) =>
          set(
            (state) => ({
              resumes: {
                ...state.resumes,
                items: state.resumes.items.filter((resume) => resume.id !== id),
                currentResume:
                  state.resumes.currentResume?.id === id
                    ? null
                    : state.resumes.currentResume
              }
            }),
            false,
            'deleteResume'
          ),

        setCurrentResume: (currentResume: Resume | null) =>
          set(
            (state) => ({
              resumes: { ...state.resumes, currentResume }
            }),
            false,
            'setCurrentResume'
          ),

        setResumesLoading: (isLoading: boolean) =>
          set(
            (state) => ({
              resumes: { ...state.resumes, isLoading }
            }),
            false,
            'setResumesLoading'
          ),

        // Analysis actions
        setAnalyzing: (isAnalyzing: boolean) =>
          set(
            (state) => ({
              analysis: { ...state.analysis, isAnalyzing }
            }),
            false,
            'setAnalyzing'
          ),

        setAnalysisProgress: (progress: string) =>
          set(
            (state) => ({
              analysis: { ...state.analysis, progress }
            }),
            false,
            'setAnalysisProgress'
          ),

        setAnalysisError: (error: string | null) =>
          set(
            (state) => ({
              analysis: { ...state.analysis, error }
            }),
            false,
            'setAnalysisError'
          ),

        resetAnalysisState: () =>
          set(
            () => ({
              analysis: { isAnalyzing: false, progress: '', error: null }
            }),
            false,
            'resetAnalysisState'
          ),

        // AI Config actions
        setAIConfig: (config: AIConfig | null) =>
          set(
            (state) => ({
              aiConfig: { ...state.aiConfig, config }
            }),
            false,
            'setAIConfig'
          ),

        setAIConfigured: (isConfigured: boolean) =>
          set(
            (state) => ({
              aiConfig: { ...state.aiConfig, isConfigured }
            }),
            false,
            'setAIConfigured'
          ),

        // Theme actions
        setTheme: (theme: ThemeName) =>
          set(
            () => ({
              currentTheme: theme
            }),
            false,
            'setTheme'
          )
      }),
      {
        name: 'ai-resume-analyzer-store',
        partialize: (state) => ({
          auth: {
            isAuthenticated: state.auth.isAuthenticated,
            user: state.auth.user
          },
          resumes: {
            items: state.resumes.items
          },
          aiConfig: state.aiConfig,
          currentTheme: state.currentTheme
        })
      }
    ),
    { name: 'AI Resume Analyzer Store' }
  )
)

// Selectors for better performance
export const useAuth = () => useAppStore((state) => state.auth)
export const useFiles = () => useAppStore((state) => state.files)
export const useResumes = () => useAppStore((state) => state.resumes)
export const useAnalysis = () => useAppStore((state) => state.analysis)
export const useAIConfig = () => useAppStore((state) => state.aiConfig)

// Action selectors
export const useAuthActions = () => useAppStore((state) => ({
  setAuthenticated: state.setAuthenticated,
  setUser: state.setUser,
  setAuthLoading: state.setAuthLoading,
  signOut: state.signOut
}))

export const useFileActions = () => useAppStore((state) => ({
  setUploadProgress: state.setUploadProgress,
  setUploading: state.setUploading,
  setFileError: state.setFileError,
  resetFileState: state.resetFileState
}))

export const useResumeActions = () => useAppStore((state) => ({
  setResumes: state.setResumes,
  addResume: state.addResume,
  updateResume: state.updateResume,
  deleteResume: state.deleteResume,
  setCurrentResume: state.setCurrentResume,
  setResumesLoading: state.setResumesLoading
}))

export const useAnalysisActions = () => useAppStore((state) => ({
  setAnalyzing: state.setAnalyzing,
  setAnalysisProgress: state.setAnalysisProgress,
  setAnalysisError: state.setAnalysisError,
  resetAnalysisState: state.resetAnalysisState
}))

export const useAIConfigActions = () => useAppStore((state) => ({
  setAIConfig: state.setAIConfig,
  setAIConfigured: state.setAIConfigured
}))

// Theme selectors
export const useTheme = () => useAppStore((state) => state.currentTheme)
export const useThemeActions = () => useAppStore((state) => ({
  setTheme: state.setTheme
}))