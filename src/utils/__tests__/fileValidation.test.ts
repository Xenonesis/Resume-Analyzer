import { describe, it, expect } from 'vitest'
import { validateResumeFile, formatFileSize, MAX_FILE_SIZE } from '../fileValidation'

describe('File validation utilities', () => {
  describe('validateResumeFile', () => {
    it('should accept valid PDF files', () => {
      const validFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf'
      })
      
      const result = validateResumeFile(validFile)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject files that are too large', () => {
      const largeFile = new File(['x'.repeat(MAX_FILE_SIZE + 1)], 'resume.pdf', {
        type: 'application/pdf'
      })
      
      const result = validateResumeFile(largeFile)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('File size must be less than')
    })

    it('should reject non-PDF files', () => {
      const invalidFile = new File(['test content'], 'resume.txt', {
        type: 'text/plain'
      })
      
      const result = validateResumeFile(invalidFile)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Only PDF files are allowed')
    })

    it('should reject files with wrong extension', () => {
      const invalidFile = new File(['test content'], 'resume.doc', {
        type: 'application/pdf'
      })
      
      const result = validateResumeFile(invalidFile)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('File must have a .pdf extension')
    })

    it('should reject empty files', () => {
      const emptyFile = new File([], 'resume.pdf', {
        type: 'application/pdf'
      })
      
      const result = validateResumeFile(emptyFile)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('File cannot be empty')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB')
    })
  })
})