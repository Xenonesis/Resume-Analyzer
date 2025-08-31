/**
 * Puter.js service wrapper for AI Resume Analyzer
 */

// Types are imported in individual files as needed

declare global {
  interface Window {
    puter: any
  }
}

export interface PuterAuthService {
  signIn(): Promise<void>
  signOut(): Promise<void>
  isAuthenticated(): boolean
  getCurrentUser(): Promise<any>
}

export interface PuterFileService {
  upload(files: File[], path?: string): Promise<UploadResult>
  read(path: string): Promise<ArrayBuffer>
  delete(path: string): Promise<void>
  exists(path: string): Promise<boolean>
}

export interface PuterKVService {
  set(key: string, value: string): Promise<void>
  get(key: string): Promise<string | null>
  list(pattern?: string): Promise<KVItem[]>
  delete(key: string): Promise<void>
}

export interface PuterAIService {
  feedback(filePath: string, instructions: string): Promise<AIResponse>
}

export interface UploadResult {
  files: Array<{
    name: string
    path: string
    size: number
  }>
}

export interface KVItem {
  key: string
  value: string
}

export interface AIResponse {
  text: string
  usage?: {
    tokens: number
    cost: number
  }
}

class PuterService {
  private puter: any
  // Service initialization state is managed internally

  constructor() {
    this.puter = window.puter
  }

  // Wait for Puter to be available
  private async waitForPuter(): Promise<void> {
    if (this.puter) return

    return new Promise((resolve) => {
      const checkPuter = () => {
        if (window.puter) {
          this.puter = window.puter
          resolve()
        } else {
          setTimeout(checkPuter, 100)
        }
      }
      checkPuter()
    })
  }

  // Authentication Service
  get auth(): PuterAuthService {
    return {
      signIn: async () => {
        try {
          await this.waitForPuter()
          await this.puter.auth.signIn()
        } catch (error) {
          throw new Error(`Authentication failed: ${error}`)
        }
      },

      signOut: async () => {
        try {
          await this.waitForPuter()
          await this.puter.auth.signOut()
        } catch (error) {
          throw new Error(`Sign out failed: ${error}`)
        }
      },

      isAuthenticated: () => {
        return this.puter?.auth?.isSignedIn() || false
      },

      getCurrentUser: async () => {
        try {
          await this.waitForPuter()
          return await this.puter.auth.getUser()
        } catch (error) {
          throw new Error(`Failed to get user: ${error}`)
        }
      }
    }
  }

  // File Storage Service
  get fs(): PuterFileService {
    return {
      upload: async (files: File[], path = 'resumes') => {
        try {
          await this.waitForPuter()
          
          // Create directory if it doesn't exist
          try {
            await this.puter.fs.mkdir(path)
          } catch (error: any) {
            // Check if it's a 409 conflict (directory already exists) - this is okay
            if (error?.status === 409 ||
                error?.code === 'EEXIST' ||
                error?.code === 'item_with_same_name_exists' ||
                error?.message?.includes('already exists')) {
              console.log(`Directory ${path} already exists, continuing...`)
            } else {
              console.warn(`Failed to create directory ${path}:`, error)
              throw new Error(`Directory creation failed: ${error?.message || error}`)
            }
          }

          const uploadResults = []
          for (const file of files) {
            const filePath = `${path}/${file.name}`
            await this.puter.fs.write(filePath, file)
            uploadResults.push({
              name: file.name,
              path: filePath,
              size: file.size
            })
          }

          return { files: uploadResults }
        } catch (error) {
          throw new Error(`File upload failed: ${error}`)
        }
      },

      read: async (path: string) => {
        try {
          await this.waitForPuter()
          return await this.puter.fs.read(path)
        } catch (error: any) {
          console.error(`File read error for ${path}:`, error)

          // Handle specific error codes
          if (error?.status === 401) {
            throw new Error('Authentication required. Please sign in to access files.')
          } else if (error?.status === 404) {
            throw new Error('File not found. Please upload the resume again.')
          } else if (error?.status === 403) {
            throw new Error('Access denied. You may not have permission to read this file.')
          }

          throw new Error(`File read failed: ${error?.message || error}`)
        }
      },

      delete: async (path: string) => {
        try {
          await this.waitForPuter()
          await this.puter.fs.delete(path)
        } catch (error) {
          throw new Error(`File delete failed: ${error}`)
        }
      },

      exists: async (path: string) => {
        try {
          await this.waitForPuter()
          await this.puter.fs.stat(path)
          return true
        } catch (error) {
          return false
        }
      }
    }
  }

  // Key-Value Storage Service
  get kv(): PuterKVService {
    return {
      set: async (key: string, value: string) => {
        try {
          await this.waitForPuter()
          await this.puter.kv.set(key, value)
        } catch (error) {
          throw new Error(`KV set failed: ${error}`)
        }
      },

      get: async (key: string) => {
        try {
          await this.waitForPuter()
          const result = await this.puter.kv.get(key)
          return result || null
        } catch (error) {
          console.warn(`KV get failed for key ${key}:`, error)
          return null
        }
      },

      list: async (pattern?: string) => {
        try {
          await this.waitForPuter()
          const result = await this.puter.kv.list(pattern)
          return result || []
        } catch (error) {
          throw new Error(`KV list failed: ${error}`)
        }
      },

      delete: async (key: string) => {
        try {
          await this.waitForPuter()
          await this.puter.kv.del(key)
        } catch (error) {
          throw new Error(`KV delete failed: ${error}`)
        }
      }
    }
  }

  // AI Service
  get ai(): PuterAIService {
    return {
      feedback: async (filePath: string, instructions: string) => {
        try {
          await this.waitForPuter()

          // First, check authentication status
          console.log('Checking authentication status...')
          const isAuthenticated = this.puter?.auth?.isSignedIn?.() || false
          console.log('User authenticated:', isAuthenticated)
          
          if (!isAuthenticated) {
            throw new Error('User must be signed in to use AI services. Please sign in to continue.')
          }

          // Read the file content first
          console.log('Reading file content from:', filePath)
          const fileContent = await this.puter.fs.read(filePath)
          console.log('File content type:', typeof fileContent)
          console.log('File content length:', fileContent?.length || fileContent?.byteLength || 0)
          
          // Handle different file content types
          let fileText = ''
          if (typeof fileContent === 'string') {
            fileText = fileContent
          } else if (fileContent instanceof ArrayBuffer) {
            // Convert ArrayBuffer to text (assuming it's a text-based file like PDF text extraction)
            const decoder = new TextDecoder()
            fileText = decoder.decode(fileContent)
          } else if (fileContent instanceof Uint8Array) {
            const decoder = new TextDecoder()
            fileText = decoder.decode(fileContent)
          } else {
            console.log('Unexpected file content format:', fileContent)
            fileText = String(fileContent)
          }
          
          console.log('Processed file text length:', fileText.length)
          
          // If file content is empty or very small, it might be a binary PDF
          if (fileText.length < 50) {
            console.warn('File content appears to be empty or binary. File might be a PDF that needs special processing.')
            // For now, we'll proceed with a placeholder message
            fileText = `[PDF file: ${filePath}. Content could not be extracted as text. This is a PDF resume file that would normally require PDF text extraction.]`
          }

          // Create a comprehensive prompt for resume analysis
          const prompt = `${instructions}

Please analyze this resume and provide feedback in the following JSON format:
{
  "overallScore": number (0-100),
  "ATS": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip"}]
  },
  "toneAndStyle": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  },
  "content": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  },
  "structure": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  },
  "skills": {
    "score": number (0-100),
    "tips": [{"type": "good" | "improve", "tip": "brief tip", "explanation": "detailed explanation"}]
  }
}

Resume content: ${fileText}`

          // Try up to 3 times for transient errors
          let response
          let lastError

          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              console.log(`AI service attempt ${attempt}/3 - Making request...`)
              console.log('Puter object:', this.puter)
              console.log('AI service available:', !!this.puter?.ai)
              console.log('Chat method available:', !!this.puter?.ai?.chat)

              // Check if AI service is available
              if (!this.puter) {
                throw new Error('Puter instance not available')
              }

              if (!this.puter.ai) {
                throw new Error('AI service not available on Puter instance - this might be a subscription/plan issue')
              }

              if (!this.puter.ai.chat) {
                throw new Error('AI chat method not available - API might have changed')
              }

              // Create the chat request with better error handling
              const messages = [
                {
                  role: 'system',
                  content: 'You are an expert resume analyzer. Provide detailed, actionable feedback in the requested JSON format.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ]

              console.log('Making AI chat request with messages:', messages)
              response = await this.puter.ai.chat(messages)
              console.log('Raw AI response received:', response)

              // Check if the response indicates an error (Puter API format)
              if (response && typeof response === 'object' && response.success === false) {
                const errorInfo = response.error || {}
                console.error('Puter API returned error response:', response)
                
                // Convert Puter API error to standard error format
                const apiError = new Error(errorInfo.message || errorInfo.code || 'AI service returned an error')
                if (errorInfo.code) apiError.name = errorInfo.code
                if (errorInfo.status) (apiError as any).status = errorInfo.status
                
                throw apiError
              }

              console.log(`AI service attempt ${attempt}/3 - Success!`)
              break // Success, exit retry loop
            } catch (error: any) {
              lastError = error
              
              // Enhanced error logging
              console.error(`AI chat attempt ${attempt} failed:`)
              console.error('Error object:', error)
              console.error('Error details:', {
                message: error?.message,
                status: error?.status,
                code: error?.code,
                name: error?.name,
                stack: error?.stack,
                toString: error?.toString?.(),
                constructor: error?.constructor?.name
              })

              // Try to get more information about the error
              if (error && typeof error === 'object') {
                console.error('All error properties:', Object.keys(error))
                console.error('Error prototype:', Object.getPrototypeOf(error))
              }

              // Don't retry on authentication errors (401)
              if (error?.status === 401 || error?.code === 'UNAUTHENTICATED') {
                throw new Error('Authentication required. Please sign in to continue.')
              }

              // Don't retry on certain error types that won't succeed
              if (error?.status === 403) {
                throw new Error('Access denied to AI service. This might be a subscription or permission issue.')
              }

              if (error?.status === 404) {
                throw new Error('AI service endpoint not found. The service might be unavailable.')
              }

              // Check for network errors
              if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
                throw new Error('Network connection failed. Please check your internet connection.')
              }

              // Handle specific Puter AI errors
              if (error?.message?.includes('subscription') || error?.message?.includes('plan') || error?.message?.includes('quota')) {
                throw new Error('AI service requires a Puter subscription or you have exceeded your quota. Please upgrade your plan or try again later.')
              }

              if (error?.message?.includes('not available') || error?.message?.includes('disabled')) {
                throw new Error('AI service is not available on your Puter account. This feature may require a paid plan.')
              }

              if (error?.name === 'UNAUTHORIZED' || error?.status === 401) {
                throw new Error('AI service access denied. Please sign out and sign back in, or check your Puter account permissions.')
              }

              // Wait before retry (exponential backoff)
              if (attempt < 3) {
                const delay = Math.pow(2, attempt) * 1000
                console.log(`Retrying in ${delay}ms...`)
                await new Promise(resolve => setTimeout(resolve, delay))
              }
            }
          }

          if (!response) {
            // Create a more detailed error message based on the last error
            let errorDetails = 'No response received from AI service'
            
            if (lastError) {
              if (lastError.message) {
                errorDetails = `Last error: ${lastError.message}`
              } else if (typeof lastError === 'object') {
                try {
                  errorDetails = `Last error: ${JSON.stringify(lastError, Object.getOwnPropertyNames(lastError))}`
                } catch (e) {
                  errorDetails = `Last error: ${String(lastError)}`
                }
              } else {
                errorDetails = `Last error: ${String(lastError)}`
              }
            }
            
            throw new Error(`AI service unavailable after 3 attempts. ${errorDetails}. This might be due to: 1) Network connectivity issues, 2) Puter AI service subscription requirements, 3) Service temporarily unavailable.`)
          }

          // Handle different response formats with better logging
          let responseText
          console.log('Processing AI response:', { response })

          if (typeof response === 'string') {
            responseText = response
          } else if (response.message) {
            responseText = response.message
          } else if (response.content) {
            responseText = response.content
          } else if (response.text) {
            responseText = response.text
          } else {
            console.log('Converting response object to string:', response)
            responseText = JSON.stringify(response)
          }

          console.log('Final response text:', responseText)

          return {
            text: responseText,
            usage: response.usage
          }
        } catch (error) {
          console.error('AI feedback error details:', error)

          // Provide more specific error messages
          let errorMessage = 'AI analysis failed'

          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            // Better object serialization
            try {
              errorMessage = JSON.stringify(error, Object.getOwnPropertyNames(error))
            } catch (serializeError) {
              errorMessage = `AI analysis failed: ${String(error)}`
            }
          } else {
            errorMessage = `AI analysis failed: ${String(error)}`
          }

          throw new Error(errorMessage)
        }
      }
    }
  }

  // Utility method to check if Puter is available
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.puter
  }

  // Initialize Puter.js
  async initialize(): Promise<void> {
    try {
      await this.waitForPuter()
      
      // Puter.js v2 doesn't require explicit initialization
      // Just ensure it's loaded and ready
      // Service is now initialized
    } catch (error) {
      throw new Error(`Puter initialization failed: ${error}`)
    }
  }

  // Check if user is signed in
  async checkAuthStatus(): Promise<boolean> {
    try {
      await this.waitForPuter()
      console.log('Checking Puter auth status...')
      console.log('Puter instance:', !!this.puter)
      console.log('Auth service:', !!this.puter?.auth)
      console.log('isSignedIn method:', !!this.puter?.auth?.isSignedIn)
      
      const isSignedIn = this.puter.auth.isSignedIn()
      console.log('isSignedIn result:', isSignedIn)
      
      // Also try to get user info to double-check auth
      if (isSignedIn) {
        try {
          const user = await this.puter.auth.getUser()
          console.log('Current user:', user)
          return true
        } catch (userError) {
          console.warn('Failed to get user despite being signed in:', userError)
          return false
        }
      }
      
      return isSignedIn
    } catch (error) {
      console.error('Failed to check auth status:', error)
      return false
    }
  }
}

// Create singleton instance
export const puterService = new PuterService()

// Export the service
export default puterService
