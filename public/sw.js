const CACHE_NAME = 'ai-resume-analyzer-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/upload',
  '/settings',
  '/themes',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.log('Cache install failed:', error)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/')
          }
        })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline resume uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-resume') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Get pending uploads from IndexedDB
    const pendingUploads = await getPendingUploads()
    
    for (const upload of pendingUploads) {
      try {
        // Attempt to upload
        await uploadResume(upload)
        // Remove from pending if successful
        await removePendingUpload(upload.id)
      } catch (error) {
        console.log('Background sync failed for upload:', upload.id, error)
      }
    }
  } catch (error) {
    console.log('Background sync error:', error)
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New resume analysis complete!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Results',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('AI Resume Analyzer', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    // Open the app to dashboard
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Helper functions for IndexedDB operations
async function getPendingUploads() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ResumeAnalyzerDB', 1)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingUploads'], 'readonly')
      const store = transaction.objectStore('pendingUploads')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }
    
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('pendingUploads')) {
        db.createObjectStore('pendingUploads', { keyPath: 'id' })
      }
    }
  })
}

async function removePendingUpload(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ResumeAnalyzerDB', 1)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingUploads'], 'readwrite')
      const store = transaction.objectStore('pendingUploads')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}

async function uploadResume(uploadData) {
  // This would integrate with your actual upload API
  const response = await fetch('/api/upload-resume', {
    method: 'POST',
    body: uploadData.formData
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  return response.json()
}