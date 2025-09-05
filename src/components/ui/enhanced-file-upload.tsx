import React, { useState, useCallback, useRef } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
  loading?: boolean
}

export const EnhancedFileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  accept = '.pdf,.doc,.docx',
  maxSize = 10,
  className,
  disabled = false,
  loading = false
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      return `File type not supported. Please upload: ${allowedTypes.join(', ')}`
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return `File size too large. Maximum size is ${maxSize}MB`
    }

    return null
  }

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSelectedFile(file)
    
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          onFileSelect(file)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }, [onFileSelect, maxSize, accept])

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

    if (disabled || loading) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [handleFile, disabled, loading])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [handleFile])

  const removeFile = () => {
    setSelectedFile(null)
    setError(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileRemove?.()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer group",
            dragActive 
              ? "border-blue-500 bg-blue-50/50 scale-105" 
              : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/50",
            disabled && "opacity-50 cursor-not-allowed",
            loading && "pointer-events-none"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && !loading && fileInputRef.current?.click()}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 transition-opacity duration-300",
              dragActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />
          </div>

          <div className="relative z-10">
            {loading ? (
              <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-spin" />
            ) : (
              <div className={cn(
                "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transform transition-all duration-300",
                dragActive ? "scale-110 rotate-6" : "group-hover:scale-105"
              )}>
                <Upload className="w-10 h-10 text-white" />
              </div>
            )}

            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              {loading ? 'Processing...' : dragActive ? 'Drop your resume here' : 'Upload your resume'}
            </h3>
            
            <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
              {loading 
                ? 'Please wait while we process your file...'
                : 'Drag and drop your resume here, or click to browse. We support PDF, DOC, and DOCX files.'
              }
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                PDF
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                DOC
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                DOCX
              </span>
            </div>

            <Button 
              variant="outline" 
              disabled={disabled || loading}
              className="pointer-events-none"
            >
              Choose File
            </Button>

            <p className="text-xs text-slate-500 mt-4">
              Maximum file size: {maxSize}MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || loading}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  {formatFileSize(selectedFile.size)}
                </p>
                
                {uploadProgress < 100 ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Uploading...</span>
                      <span className="text-slate-900 font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mt-2 text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Upload complete</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-slate-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">Upload Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}