/**
 * PDF validation utilities
 */

/**
 * Validates if a file is a proper PDF
 */
export const validatePdfFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, error: 'File is not a PDF document' }
  }

  // Check file size
  if (file.size === 0) {
    return { isValid: false, error: 'PDF file is empty' }
  }

  // Check if file is too large (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    return { isValid: false, error: 'PDF file is too large (maximum 50MB)' }
  }

  return { isValid: true }
}

/**
 * Checks if a PDF file contains readable text by examining the first few bytes
 */
export const quickPdfTextCheck = async (file: File): Promise<{ hasText: boolean; warning?: string }> => {
  try {
    // Read first 1KB of the file to check for text indicators
    const slice = file.slice(0, 1024)
    const arrayBuffer = await slice.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    
    // Convert to string to look for text indicators
    const header = String.fromCharCode(...bytes)
    
    // Check for PDF header
    if (!header.startsWith('%PDF-')) {
      return { hasText: false, warning: 'File does not appear to be a valid PDF' }
    }
    
    // Look for text-related keywords in the header
    const textIndicators = ['/Text', '/Font', '/Encoding', 'stream', '/Contents']
    const hasTextIndicators = textIndicators.some(indicator => header.includes(indicator))
    
    if (!hasTextIndicators) {
      return { hasText: false, warning: 'PDF may contain only images or be corrupted' }
    }
    
    return { hasText: true }
  } catch (error) {
    return { hasText: false, warning: 'Could not analyze PDF structure' }
  }
}

/**
 * Gets basic PDF information without full processing
 */
export const getPdfInfo = async (file: File): Promise<{
  isValid: boolean
  fileSize: string
  error?: string
  warning?: string
}> => {
  const validation = validatePdfFile(file)
  if (!validation.isValid) {
    return {
      isValid: false,
      fileSize: formatFileSize(file.size),
      error: validation.error
    }
  }

  const textCheck = await quickPdfTextCheck(file)
  
  return {
    isValid: true,
    fileSize: formatFileSize(file.size),
    warning: textCheck.warning
  }
}

/**
 * Formats file size in human readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}