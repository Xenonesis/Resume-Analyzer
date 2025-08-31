import React, { useState, useEffect } from 'react'
import { puterService } from '@/services/puterService'

interface PDFViewerProps {
  filePath: string
  fileName?: string
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ filePath, fileName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if the filePath is a Puter path (doesn't start with http)
        if (!filePath.startsWith('http') && !filePath.startsWith('blob:')) {
          console.log('Loading PDF from Puter file system:', filePath)
          
          // Read the file from Puter's file system
          const fileData = await puterService.fs.read(filePath)
          
          // Create a blob from the file data
          const blob = new Blob([fileData], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          
          setPdfUrl(url)
        } else {
          // Direct URL, use as-is
          setPdfUrl(filePath)
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load PDF:', err)
        setError(err instanceof Error ? err.message : 'Failed to load PDF')
        setIsLoading(false)
      }
    }

    if (filePath) {
      loadPDF()
    }

    // Cleanup blob URL when component unmounts or filePath changes
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [filePath])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Failed to display PDF in viewer')
  }

  const handleDownload = async () => {
    try {
      if (pdfUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = fileName || filePath.split('/').pop() || 'resume.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 className="text-lg font-bold">Resume Preview</h3>
              <p className="text-sm opacity-90">{fileName || filePath.split('/').pop()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenInNewTab}
              disabled={!pdfUrl}
              className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Open Full PDF</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="p-12 text-center bg-gray-50">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Unable to Preview PDF</h4>
            <p className="text-gray-600 mb-4">
              The PDF preview couldn't be loaded. You can still download or open the file directly.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href={filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Open PDF
              </a>
              <a
                href={filePath}
                download={fileName}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Download PDF
              </a>
            </div>
          </div>
        ) : pdfUrl ? (
          <div className="bg-gray-100 p-8 min-h-[600px]">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              width="100%"
              height="600"
              className="border-0 rounded-lg shadow-inner"
              onLoad={handleLoad}
              onError={handleError}
              title="Resume Preview"
            />
          </div>
        ) : (
          <div className="p-12 text-center bg-gray-50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No PDF Available</h4>
            <p className="text-gray-600">
              The PDF file could not be loaded for preview.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}