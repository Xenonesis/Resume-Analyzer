import React, { useState, useCallback } from 'react'
import { validateResumeFile } from '@/utils/fileValidation'
import { useFileActions } from '@/stores/useAppStore'
import { useSupabaseResumes } from '@/hooks/useSupabaseResumes'
import { storeFileInSession } from '@/utils/fileStorage'

interface FileUploaderProps {
  onUploadComplete?: (filePath: string, fileName: string) => void
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { setUploading, setFileError } = useFileActions()
  const { uploadResume } = useSupabaseResumes()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    setError(null)
    
    // Validate file
    const validation = validateResumeFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setSelectedFile(file)
  }

  const uploadFile = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Upload to Supabase
      const resume = await uploadResume(selectedFile)
      
      // Store file in session storage as fallback for analysis
      try {
        await storeFileInSession(resume.filePath, selectedFile)
      } catch (sessionError) {
        console.warn('Failed to store file in session storage:', sessionError)
        // Continue anyway, as this is just a fallback
      }
      
      setUploadProgress(100)
      
      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete(resume.filePath, resume.fileName)
      }
      
      // Reset state
      setTimeout(() => {
        setSelectedFile(null)
        setUploadProgress(0)
      }, 1000)
    } catch (error) {
      console.error('Upload failed:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
      setFileError(error instanceof Error ? error.message : 'Upload failed')
      setUploadProgress(0)
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploading(false)
      }, 1000)
    }
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 ${
          dragActive
            ? 'border-blue-400 bg-blue-50/50 scale-[1.02] shadow-lg'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50/50 shadow-md'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-8">
          <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            selectedFile 
              ? 'bg-emerald-100 text-emerald-600 scale-110' 
              : dragActive 
              ? 'bg-blue-100 text-blue-600 scale-110' 
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-500'
          }`}>
            {selectedFile ? (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          
          <div>
            <h3 className={`text-2xl font-semibold mb-3 transition-colors duration-300 ${
              selectedFile ? 'text-emerald-900' : 'text-slate-900'
            }`}>
              {selectedFile ? selectedFile.name : dragActive ? 'Drop your file here' : 'Choose your resume'}
            </h3>
            <p className={`text-lg mb-6 transition-colors duration-300 ${
              selectedFile ? 'text-emerald-700' : 'text-slate-600'
            }`}>
              {selectedFile ? 'Ready to analyze' : 'Drag and drop your PDF file or click to browse'}
            </p>
            
            {/* File requirements */}
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span>PDF format only</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span>Maximum 10MB</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span>Secure & private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-900 mb-1">Upload Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {selectedFile && !error && (
        <div className="mt-8 space-y-6">
          {/* File Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-slate-900 truncate">{selectedFile.name}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">Uploading your resume</span>
                    <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-blue-700">Please wait while we securely upload and prepare your file for analysis.</p>
            </div>
          )}
          
          {/* Upload Button */}
          <button
            onClick={uploadFile}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              isUploading
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Processing...' : 'Start AI Analysis'}
          </button>
        </div>
      )}
    </div>
  )
}