/**
 * Supabase resume operations hook
 */

import { useCallback } from 'react'
import { useAuth, useResumeActions, useFileActions } from '@/stores/useAppStore'
import { supabaseService } from '@/services/supabaseService'
import { Resume } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export const useSupabaseResumes = () => {
  const { user } = useAuth()
  const { setResumes, addResume, updateResume, deleteResume, setResumesLoading } = useResumeActions()
  const { setUploading, setUploadProgress, setFileError, resetFileState } = useFileActions()

  const loadResumes = useCallback(async () => {
    if (!user) return

    setResumesLoading(true)
    try {
      const { data, error } = await supabaseService.data.getResumes(user.id)
      if (error) throw error

      const resumes: Resume[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        fileName: item.file_name,
        filePath: item.file_path,
        resumePath: item.file_path,
        imagePath: item.image_path,
        fileSize: item.file_size,
        uploadedAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        createdAt: new Date(item.created_at),
        analysis: item.analysis ? JSON.parse(item.analysis) : null,
        feedback: item.analysis ? JSON.parse(item.analysis) : null,
        status: item.status || 'uploaded',
        companyName: item.company_name,
        jobTitle: item.job_title,
        jobDescription: item.job_description,
        userId: item.user_id
      }))

      setResumes(resumes)
    } catch (error: any) {
      console.error('Error loading resumes:', error)
      setFileError(error.message)
    } finally {
      setResumesLoading(false)
    }
  }, [user, setResumes, setResumesLoading, setFileError])

  const uploadResume = useCallback(async (file: File) => {
    if (!user) throw new Error('User not authenticated')

    resetFileState()
    setUploading(true)
    setUploadProgress(0)

    try {
      const resumeId = uuidv4()
      const filePath = `${user.id}/${resumeId}/${file.name}`

      // Upload file to Supabase Storage
      setUploadProgress(25)
      const { error: uploadError } = await supabaseService.storage.uploadFile(
        'resumes',
        filePath,
        file
      )

      if (uploadError) throw uploadError

      setUploadProgress(50)

      // Create resume record in database
      const resumeData = {
        id: resumeId,
        user_id: user.id,
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        status: 'uploaded',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: dbData, error: dbError } = await supabaseService.data.createResume(resumeData)
      if (dbError) throw dbError

      setUploadProgress(75)

      // Convert to Resume type and add to store
      const resume: Resume = {
        id: dbData.id,
        name: dbData.name,
        fileName: dbData.file_name,
        filePath: dbData.file_path,
        resumePath: dbData.file_path,
        imagePath: dbData.image_path,
        fileSize: dbData.file_size,
        uploadedAt: new Date(dbData.created_at),
        updatedAt: new Date(dbData.updated_at),
        createdAt: new Date(dbData.created_at),
        analysis: null,
        feedback: null,
        status: dbData.status,
        companyName: dbData.company_name,
        jobTitle: dbData.job_title,
        jobDescription: dbData.job_description,
        userId: dbData.user_id
      }

      addResume(resume)
      setUploadProgress(100)

      return resume
    } catch (error: any) {
      console.error('Error uploading resume:', error)
      setFileError(error.message)
      throw error
    } finally {
      setUploading(false)
    }
  }, [user, addResume, setUploading, setUploadProgress, setFileError, resetFileState])

  const downloadResume = useCallback(async (resume: Resume): Promise<Blob> => {
    try {
      const { data, error } = await supabaseService.storage.downloadFile('resumes', resume.filePath)
      if (error) throw error
      if (!data) throw new Error('No file data received')
      
      return data
    } catch (error: any) {
      console.error('Error downloading resume:', error)
      throw new Error(`Failed to download resume: ${error.message}`)
    }
  }, [])

  const removeResume = useCallback(async (resumeId: string) => {
    try {
      // Get resume data first to get file path
      const resume = await supabaseService.data.getResumes(user?.id || '')
      const resumeData = resume.data?.find(r => r.id === resumeId)
      
      if (resumeData?.file_path) {
        // Delete file from storage
        await supabaseService.storage.deleteFile('resumes', resumeData.file_path)
      }

      // Delete from database
      const { error } = await supabaseService.data.deleteResume(resumeId)
      if (error) throw error

      // Remove from store
      deleteResume(resumeId)
    } catch (error: any) {
      console.error('Error deleting resume:', error)
      setFileError(error.message)
      throw error
    }
  }, [user, deleteResume, setFileError])

  const updateResumeAnalysis = useCallback(async (resumeId: string, analysis: any) => {
    try {
      const updates = {
        analysis: JSON.stringify(analysis),
        status: 'analyzed'
      }

      const { data, error } = await supabaseService.data.updateResume(resumeId, updates)
      if (error) throw error

      // Update in store
      updateResume(resumeId, {
        analysis,
        status: 'analyzed' as const,
        updatedAt: new Date()
      })

      return data
    } catch (error: any) {
      console.error('Error updating resume analysis:', error)
      throw error
    }
  }, [updateResume])

  return {
    loadResumes,
    uploadResume,
    downloadResume,
    removeResume,
    updateResumeAnalysis
  }
}