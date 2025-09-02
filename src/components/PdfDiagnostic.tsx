import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfDiagnosticProps {
  file?: File
  error?: string
  onRetry?: () => void
}

export const PdfDiagnostic: React.FC<PdfDiagnosticProps> = ({ file, error, onRetry }) => {
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)

  const runDiagnostic = async () => {
    if (!file) return

    setIsChecking(true)
    try {
      const { getPdfInfo } = await import('@/utils/pdfValidator')
      const info = await getPdfInfo(file)
      setDiagnosticInfo(info)
    } catch (error) {
      console.error('Diagnostic failed:', error)
      setDiagnosticInfo({ 
        isValid: false, 
        fileSize: '0 Bytes', 
        error: 'Diagnostic check failed' 
      })
    } finally {
      setIsChecking(false)
    }
  }

  const getErrorSuggestions = (errorMessage: string) => {
    const suggestions = []
    
    if (errorMessage.includes('image-based') || errorMessage.includes('scanned')) {
      suggestions.push('Your PDF contains only images or scanned content. Try using a PDF with selectable text.')
      suggestions.push('If you have a Word document version, try converting it to PDF instead.')
    }
    
    if (errorMessage.includes('password') || errorMessage.includes('protected')) {
      suggestions.push('Remove password protection from your PDF before uploading.')
    }
    
    if (errorMessage.includes('corrupted') || errorMessage.includes('damaged')) {
      suggestions.push('Try re-saving or re-exporting your PDF from the original application.')
      suggestions.push('Check if the file opens correctly in a PDF viewer.')
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('upload')) {
      suggestions.push('Re-upload your resume file.')
      suggestions.push('Make sure you complete the upload process before analyzing.')
    }
    
    if (errorMessage.includes('PDF.js') || errorMessage.includes('library')) {
      suggestions.push('Check your internet connection and try again.')
      suggestions.push('Refresh the page and try uploading again.')
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Try uploading a different PDF file.')
      suggestions.push('Ensure your PDF contains selectable text (not just images).')
      suggestions.push('Check that your PDF file is not corrupted.')
    }
    
    return suggestions
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">PDF Processing Issue</h3>
          <p className="text-sm text-gray-600">
            We encountered a problem processing your PDF file
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
          <p className="text-sm text-red-700 mb-3">{error}</p>
          
          <div className="space-y-2">
            <h5 className="font-medium text-red-800">Suggested Solutions:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              {getErrorSuggestions(error).map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {file && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">File Information</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={runDiagnostic}
              disabled={isChecking}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isChecking ? 'Checking...' : 'Run Diagnostic'}</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">File Name:</span>
              <p className="font-medium">{file.name}</p>
            </div>
            <div>
              <span className="text-gray-600">File Size:</span>
              <p className="font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <span className="text-gray-600">File Type:</span>
              <p className="font-medium">{file.type || 'Unknown'}</p>
            </div>
            <div>
              <span className="text-gray-600">Last Modified:</span>
              <p className="font-medium">{new Date(file.lastModified).toLocaleDateString()}</p>
            </div>
          </div>

          {diagnosticInfo && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {diagnosticInfo.isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-medium">
                  {diagnosticInfo.isValid ? 'PDF Structure Valid' : 'PDF Issues Detected'}
                </span>
              </div>
              
              {diagnosticInfo.error && (
                <p className="text-sm text-red-600 mb-2">{diagnosticInfo.error}</p>
              )}
              
              {diagnosticInfo.warning && (
                <p className="text-sm text-yellow-600">{diagnosticInfo.warning}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center space-x-4">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => window.location.href = '/upload'}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Upload Different File
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for Best Results</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use PDFs with selectable text (not scanned images)</li>
          <li>• Ensure your PDF is not password-protected</li>
          <li>• Keep file size under 10MB for optimal processing</li>
          <li>• Use standard fonts and formatting</li>
          <li>• Test that text can be selected/copied in your PDF viewer</li>
        </ul>
      </div>
    </div>
  )
}