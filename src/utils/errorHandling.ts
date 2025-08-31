/**
 * Error handling utilities for the AI Resume Analyzer
 */

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  FILE_UPLOAD = 'file_upload',
  AI_ANALYSIS = 'ai_analysis',
  DATA_STORAGE = 'data_storage',
  NETWORK = 'network',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

export interface AppError {
  category: ErrorCategory
  message: string
  originalError?: Error
  code?: string
  retryable?: boolean
  userMessage?: string
}

export class AppErrorHandler {
  /**
   * Creates a standardized error object
   */
  static createError(
    category: ErrorCategory,
    message: string,
    originalError?: Error,
    options?: {
      code?: string
      retryable?: boolean
      userMessage?: string
    }
  ): AppError {
    return {
      category,
      message,
      originalError,
      code: options?.code,
      retryable: options?.retryable ?? false,
      userMessage: options?.userMessage ?? this.getDefaultUserMessage(category)
    }
  }

  /**
   * Handles authentication errors
   */
  static handleAuthError(error: Error): AppError {
    const message = error.message.toLowerCase()
    
    if (message.includes('unauthorized') || message.includes('invalid credentials')) {
      return this.createError(
        ErrorCategory.AUTHENTICATION,
        'Authentication failed',
        error,
        {
          code: 'AUTH_INVALID_CREDENTIALS',
          retryable: true,
          userMessage: 'Invalid credentials. Please try signing in again.'
        }
      )
    }
    
    if (message.includes('session expired') || message.includes('token expired')) {
      return this.createError(
        ErrorCategory.AUTHENTICATION,
        'Session expired',
        error,
        {
          code: 'AUTH_SESSION_EXPIRED',
          retryable: true,
          userMessage: 'Your session has expired. Please sign in again.'
        }
      )
    }

    return this.createError(
      ErrorCategory.AUTHENTICATION,
      'Authentication error occurred',
      error,
      {
        retryable: true,
        userMessage: 'Authentication failed. Please try again.'
      }
    )
  }

  /**
   * Handles file upload errors
   */
  static handleFileUploadError(error: Error): AppError {
    const message = error.message.toLowerCase()
    
    if (message.includes('file too large') || message.includes('size limit')) {
      return this.createError(
        ErrorCategory.FILE_UPLOAD,
        'File size exceeds limit',
        error,
        {
          code: 'FILE_TOO_LARGE',
          retryable: false,
          userMessage: 'File is too large. Please select a file smaller than 10MB.'
        }
      )
    }
    
    if (message.includes('invalid file type') || message.includes('unsupported format')) {
      return this.createError(
        ErrorCategory.FILE_UPLOAD,
        'Invalid file type',
        error,
        {
          code: 'FILE_INVALID_TYPE',
          retryable: false,
          userMessage: 'Only PDF files are supported. Please select a PDF file.'
        }
      )
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return this.createError(
        ErrorCategory.FILE_UPLOAD,
        'Network error during upload',
        error,
        {
          code: 'FILE_NETWORK_ERROR',
          retryable: true,
          userMessage: 'Upload failed due to network issues. Please check your connection and try again.'
        }
      )
    }

    return this.createError(
      ErrorCategory.FILE_UPLOAD,
      'File upload failed',
      error,
      {
        retryable: true,
        userMessage: 'File upload failed. Please try again.'
      }
    )
  }

  /**
   * Handles AI analysis errors
   */
  static handleAIAnalysisError(error: Error): AppError {
    const message = error.message.toLowerCase()
    
    if (message.includes('quota') || message.includes('rate limit')) {
      return this.createError(
        ErrorCategory.AI_ANALYSIS,
        'AI service quota exceeded',
        error,
        {
          code: 'AI_QUOTA_EXCEEDED',
          retryable: true,
          userMessage: 'AI analysis is temporarily unavailable. Please try again later.'
        }
      )
    }
    
    if (message.includes('timeout') || message.includes('took too long')) {
      return this.createError(
        ErrorCategory.AI_ANALYSIS,
        'AI analysis timeout',
        error,
        {
          code: 'AI_TIMEOUT',
          retryable: true,
          userMessage: 'Analysis is taking longer than expected. Please try again.'
        }
      )
    }
    
    if (message.includes('service unavailable') || message.includes('maintenance')) {
      return this.createError(
        ErrorCategory.AI_ANALYSIS,
        'AI service unavailable',
        error,
        {
          code: 'AI_SERVICE_UNAVAILABLE',
          retryable: true,
          userMessage: 'AI analysis service is temporarily unavailable. Please try again later.'
        }
      )
    }

    return this.createError(
      ErrorCategory.AI_ANALYSIS,
      'AI analysis failed',
      error,
      {
        retryable: true,
        userMessage: 'Resume analysis failed. Please try again.'
      }
    )
  }

  /**
   * Handles data storage errors
   */
  static handleStorageError(error: Error): AppError {
    const message = error.message.toLowerCase()
    
    if (message.includes('quota') || message.includes('storage full')) {
      return this.createError(
        ErrorCategory.DATA_STORAGE,
        'Storage quota exceeded',
        error,
        {
          code: 'STORAGE_QUOTA_EXCEEDED',
          retryable: false,
          userMessage: 'Storage limit reached. Please delete some files and try again.'
        }
      )
    }
    
    if (message.includes('permission') || message.includes('access denied')) {
      return this.createError(
        ErrorCategory.DATA_STORAGE,
        'Storage access denied',
        error,
        {
          code: 'STORAGE_ACCESS_DENIED',
          retryable: false,
          userMessage: 'Unable to access storage. Please check your permissions.'
        }
      )
    }

    return this.createError(
      ErrorCategory.DATA_STORAGE,
      'Storage operation failed',
      error,
      {
        retryable: true,
        userMessage: 'Failed to save data. Please try again.'
      }
    )
  }

  /**
   * Handles network errors
   */
  static handleNetworkError(error: Error): AppError {
    const message = error.message.toLowerCase()
    
    if (message.includes('offline') || message.includes('no internet')) {
      return this.createError(
        ErrorCategory.NETWORK,
        'No internet connection',
        error,
        {
          code: 'NETWORK_OFFLINE',
          retryable: true,
          userMessage: 'No internet connection. Please check your network and try again.'
        }
      )
    }
    
    if (message.includes('timeout') || message.includes('request timeout')) {
      return this.createError(
        ErrorCategory.NETWORK,
        'Request timeout',
        error,
        {
          code: 'NETWORK_TIMEOUT',
          retryable: true,
          userMessage: 'Request timed out. Please try again.'
        }
      )
    }

    return this.createError(
      ErrorCategory.NETWORK,
      'Network error',
      error,
      {
        retryable: true,
        userMessage: 'Network error occurred. Please try again.'
      }
    )
  }

  /**
   * Generic error handler that categorizes errors automatically
   */
  static handleError(error: Error, context?: string): AppError {
    const message = error.message.toLowerCase()
    
    // Try to categorize based on error message
    if (message.includes('auth') || message.includes('login') || message.includes('credential')) {
      return this.handleAuthError(error)
    }
    
    if (message.includes('upload') || message.includes('file')) {
      return this.handleFileUploadError(error)
    }
    
    if (message.includes('ai') || message.includes('analysis') || message.includes('feedback')) {
      return this.handleAIAnalysisError(error)
    }
    
    if (message.includes('storage') || message.includes('save') || message.includes('database')) {
      return this.handleStorageError(error)
    }
    
    if (message.includes('network') || message.includes('connection') || message.includes('fetch')) {
      return this.handleNetworkError(error)
    }

    // Default to unknown error
    return this.createError(
      ErrorCategory.UNKNOWN,
      `Unknown error${context ? ` in ${context}` : ''}`,
      error,
      {
        retryable: true,
        userMessage: 'An unexpected error occurred. Please try again.'
      }
    )
  }

  /**
   * Gets default user message for error category
   */
  private static getDefaultUserMessage(category: ErrorCategory): string {
    switch (category) {
      case ErrorCategory.AUTHENTICATION:
        return 'Authentication failed. Please try again.'
      case ErrorCategory.FILE_UPLOAD:
        return 'File upload failed. Please try again.'
      case ErrorCategory.AI_ANALYSIS:
        return 'Resume analysis failed. Please try again.'
      case ErrorCategory.DATA_STORAGE:
        return 'Failed to save data. Please try again.'
      case ErrorCategory.NETWORK:
        return 'Network error occurred. Please try again.'
      case ErrorCategory.VALIDATION:
        return 'Invalid input. Please check your data and try again.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  /**
   * Logs error for debugging
   */
  static logError(error: AppError, context?: string): void {
    console.error(`[${error.category.toUpperCase()}]${context ? ` ${context}:` : ''}`, {
      message: error.message,
      userMessage: error.userMessage,
      code: error.code,
      retryable: error.retryable,
      originalError: error.originalError
    })
  }
}

/**
 * Retry utility for retryable operations
 */
export class RetryHandler {
  static async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxAttempts) {
          throw lastError
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoffMultiplier, attempt - 1)))
      }
    }
    
    throw lastError!
  }
}