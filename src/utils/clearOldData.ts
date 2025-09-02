/**
 * Utility to clear old data from localStorage
 * This ensures users start fresh with real AI analysis only
 */

export const clearOldResumeData = (): void => {
  try {
    // Clear resume data from localStorage
    localStorage.removeItem('resumes')
    
    // Clear any other related data that might contain outdated results
    localStorage.removeItem('resume-analysis')
    localStorage.removeItem('outdated-data')
    localStorage.removeItem('old-results')
    
    console.log('✅ Cleared old resume data from localStorage')
  } catch (error) {
    console.warn('Failed to clear old data:', error)
  }
}

export const hasOldResumeData = (): boolean => {
  try {
    const stored = localStorage.getItem('resumes')
    if (stored) {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) && parsed.length > 0
    }
  } catch (error) {
    console.warn('Failed to check for old data:', error)
  }
  return false
}

export const getOldDataInfo = (): { count: number; hasAnalysis: boolean } => {
  try {
    const stored = localStorage.getItem('resumes')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        const hasAnalysis = parsed.some(resume => resume.analysis || resume.feedback)
        return { count: parsed.length, hasAnalysis }
      }
    }
  } catch (error) {
    console.warn('Failed to get old data info:', error)
  }
  return { count: 0, hasAnalysis: false }
}