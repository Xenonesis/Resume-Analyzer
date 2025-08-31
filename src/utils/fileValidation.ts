/**
 * File validation utilities for resume uploads
 */

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Allowed file types for resume uploads
 */
export const ALLOWED_FILE_TYPES = ['application/pdf']

/**
 * Allowed file extensions
 */
export const ALLOWED_EXTENSIONS = ['.pdf']

/**
 * Validates a file for resume upload
 * @param file The file to validate
 * @returns Validation result with error message if invalid
 */
export const validateResumeFile = (file: File): FileValidationResult => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only PDF files are allowed'
    }
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: 'File must have a .pdf extension'
    }
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File cannot be empty'
    }
  }

  return { isValid: true }
}

/**
 * Formats file size in human readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}