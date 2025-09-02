/**
 * PDF processing utilities for resume handling
 */

// Import PDF.js for text extraction
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

/**
 * Loads PDF.js library dynamically with fallback CDNs
 */
const loadPdfJs = async (): Promise<void> => {
  if (window.pdfjsLib) return;

  const cdnUrls = [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js',
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'
  ]

  const workerUrls = [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
  ]

  for (let i = 0; i < cdnUrls.length; i++) {
    try {
      await loadFromCdn(cdnUrls[i], workerUrls[i])
      console.log(`PDF.js loaded successfully from CDN ${i + 1}`)
      return
    } catch (error) {
      console.warn(`Failed to load PDF.js from CDN ${i + 1}:`, error)
      if (i === cdnUrls.length - 1) {
        throw new Error('Failed to load PDF.js from all available CDNs. Please check your internet connection.')
      }
    }
  }
}

const loadFromCdn = (scriptUrl: string, workerUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = scriptUrl
    
    const timeoutId = setTimeout(() => {
      document.head.removeChild(script)
      reject(new Error('PDF.js library loading timed out'))
    }, 8000)
    
    script.onload = () => {
      clearTimeout(timeoutId)
      try {
        if (!window.pdfjsLib) {
          reject(new Error('PDF.js library failed to initialize'))
          return
        }
        
        // Set worker source
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
        
        // Verify PDF.js is working
        if (typeof window.pdfjsLib.getDocument !== 'function') {
          reject(new Error('PDF.js library is not properly loaded'))
          return
        }
        
        resolve()
      } catch (error) {
        reject(new Error(`PDF.js initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    
    script.onerror = () => {
      clearTimeout(timeoutId)
      reject(new Error('Failed to load PDF.js library from CDN'))
    }
    
    document.head.appendChild(script)
  })
};

/**
 * Extracts text content from PDF file using PDF.js
 * @param file The PDF file to process
 * @returns Promise resolving to extracted text
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid or empty file provided');
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('File is not a PDF document');
    }

    // Load PDF.js if not already loaded
    await loadPdfJs();

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('PDF file appears to be empty');
    }
    
    // Load PDF document with error handling
    const loadingTask = window.pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0 // Reduce console noise
    });
    
    const pdf = await loadingTask.promise;
    
    if (!pdf || pdf.numPages === 0) {
      throw new Error('PDF document has no pages or is corrupted');
    }
    
    let fullText = '';
    let totalTextLength = 0;
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items with proper spacing and positioning
        const pageText = textContent.items
          .filter((item: any) => item.str && item.str.trim()) // Filter out empty strings
          .map((item: any) => item.str.trim())
          .join(' ')
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        if (pageText && pageText.length > 0) {
          fullText += pageText + '\n\n';
          totalTextLength += pageText.length;
        }
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }
    
    // Clean up the extracted text
    fullText = fullText
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    // More lenient text validation
    if (!fullText || fullText.length < 20) {
      throw new Error('No readable text found in PDF. The file might be image-based, corrupted, or contain very little text content.');
    }
    
    console.log(`Successfully extracted ${fullText.length} characters from ${pdf.numPages} pages`);
    return fullText;
    
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('The uploaded file is not a valid PDF document. Please ensure you\'re uploading a proper PDF file.');
      } else if (error.message.includes('password')) {
        throw new Error('This PDF is password-protected. Please upload an unprotected PDF file.');
      } else if (error.message.includes('corrupted') || error.message.includes('damaged')) {
        throw new Error('The PDF file appears to be corrupted or damaged. Please try uploading a different version.');
      } else if (error.message.includes('image-based')) {
        throw new Error('This PDF contains only images or scanned content. Please upload a PDF with selectable text content.');
      }
      throw error;
    }
    
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid, text-based PDF document.');
  }
};

/**
 * Converts a PDF file to an image for preview purposes using PDF.js
 * @param file The PDF file to convert
 * @returns Promise resolving to image data URL
 */
export const convertPdfToImage = async (file: File): Promise<string> => {
  try {
    // Load PDF.js if not already loaded
    await loadPdfJs();

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Get first page
    const page = await pdf.getPage(1);
    
    // Set up canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    // Calculate scale to fit within reasonable dimensions
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(600 / viewport.width, 800 / viewport.height);
    const scaledViewport = page.getViewport({ scale });
    
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    
    // Render page to canvas
    await page.render({
      canvasContext: context,
      viewport: scaledViewport
    }).promise;
    
    // Convert to data URL
    return canvas.toDataURL('image/png');
    
  } catch (error) {
    console.error('PDF to image conversion failed:', error);
    
    // Fallback to placeholder image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create fallback preview');
    }
    
    canvas.width = 600;
    canvas.height = 800;
    
    // Create a clean placeholder
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PDF Document', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '16px Arial';
    ctx.fillText(file.name, canvas.width / 2, canvas.height / 2 + 20);
    
    return canvas.toDataURL('image/png');
  }
};

/**
 * Gets PDF metadata
 * @param file The PDF file
 * @returns Promise resolving to PDF metadata
 */
export const getPdfMetadata = async (file: File): Promise<{
  pageCount: number
  title?: string
  author?: string
  creationDate?: Date
}> => {
  // Placeholder implementation
  return {
    pageCount: 1,
    title: file.name.replace('.pdf', ''),
    creationDate: new Date(file.lastModified)
  }
}