import { useEffect } from 'react'
import { useResumeActions } from '@/stores/useAppStore'
import { Resume } from '@/types'

// Load resumes from localStorage
const loadResumesFromLocalStorage = (): Resume[] => {
  try {
    const stored = localStorage.getItem('resumes')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      return parsed.map((resume: any) => ({
        ...resume,
        createdAt: new Date(resume.createdAt),
        updatedAt: new Date(resume.updatedAt)
      }))
    }
  } catch (error) {
    console.warn('Failed to load resumes from localStorage:', error)
  }
  return []
}

// Save resumes to localStorage
const saveResumesToLocalStorage = (resumes: Resume[]) => {
  try {
    localStorage.setItem('resumes', JSON.stringify(resumes))
  } catch (error) {
    console.warn('Failed to save resumes to localStorage:', error)
  }
}

export const useResumeData = (isAuthenticated: boolean) => {
  const { setResumes, setResumesLoading } = useResumeActions()

  useEffect(() => {
    if (!isAuthenticated) {
      setResumes([])
      return
    }

    const loadResumes = () => {
      setResumesLoading(true)
      
      try {
        const resumes = loadResumesFromLocalStorage()
        
        // Sort by creation date (newest first)
        resumes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        
        setResumes(resumes)
      } catch (error) {
        console.error('Failed to load resumes:', error)
        setResumes([])
      } finally {
        setResumesLoading(false)
      }
    }

    loadResumes()
  }, [isAuthenticated, setResumes, setResumesLoading])

  // Expose function to save a new resume and clear old data
  return {
    saveNewResume: (resume: Resume) => {
      // For this task, we want to replace the existing data with the new resume
      // This ensures that only the new resume is stored, clearing any previous data
      const updatedResumes = [resume]
      
      // Save to localStorage
      saveResumesToLocalStorage(updatedResumes)
      
      // Update state
      setResumes(updatedResumes)
    }
  }
}