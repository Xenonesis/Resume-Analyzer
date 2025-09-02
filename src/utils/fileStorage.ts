/**
 * Utility functions for temporary file storage
 */

export const storeFileInSession = (filePath: string, file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      try {
        const result = reader.result as string
        sessionStorage.setItem(`resume_file_${filePath}`, result)
        resolve()
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

export const getFileFromSession = (filePath: string): File | null => {
  try {
    const fileData = sessionStorage.getItem(`resume_file_${filePath}`)
    if (!fileData) return null
    
    // Check if it's a data URL
    if (!fileData.startsWith('data:')) {
      console.error('Invalid file data format in session storage')
      return null
    }
    
    // Convert data URL back to file
    const [header, base64Data] = fileData.split(',')
    if (!base64Data) {
      console.error('No base64 data found in stored file')
      return null
    }
    
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    
    // Extract filename from filePath
    const fileName = filePath.split('/').pop() || 'resume.pdf'
    
    return new File([byteArray], fileName, { type: 'application/pdf' })
  } catch (error) {
    console.error('Error retrieving file from session storage:', error)
    return null
  }
}

export const clearFileFromSession = (filePath: string): void => {
  sessionStorage.removeItem(`resume_file_${filePath}`)
}