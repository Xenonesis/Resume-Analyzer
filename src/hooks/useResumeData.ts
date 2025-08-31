import { useEffect } from 'react'
import { useResumeActions } from '@/stores/useAppStore'
import puterService from '@/services/puterService'
import { Resume } from '@/types'

export const useResumeData = (isAuthenticated: boolean) => {
  const { setResumes, setResumesLoading } = useResumeActions()

  useEffect(() => {
    if (!isAuthenticated) {
      setResumes([])
      return
    }

    const loadResumes = async () => {
      setResumesLoading(true)
      
      try {
        // List all resume keys from KV storage
        const kvItems = await puterService.kv.list('resume_')
        
        const resumes: Resume[] = []
        
        for (const item of kvItems) {
          try {
            const resumeData = await puterService.kv.get(item.key)
            if (resumeData) {
              const resume = JSON.parse(resumeData)
              // Convert date strings back to Date objects
              resume.createdAt = new Date(resume.createdAt)
              resume.updatedAt = new Date(resume.updatedAt)
              resumes.push(resume)
            }
          } catch (error) {
            console.warn(`Failed to parse resume data for key ${item.key}:`, error)
          }
        }
        
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
}