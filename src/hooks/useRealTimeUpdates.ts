import { useEffect, useRef, useState } from 'react'
import { useResumes } from '@/stores/useAppStore'
import { Resume } from '@/types'

interface NotificationData {
  id: string
  type: 'new_analysis' | 'score_improvement' | 'milestone' | 'warning'
  title: string
  message: string
  timestamp: Date
  resumeId?: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
}

interface RealTimeUpdateHook {
  notifications: NotificationData[]
  unreadCount: number
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  isConnected: boolean
  lastUpdate: Date | null
}

export const useRealTimeUpdates = (): RealTimeUpdateHook => {
  const { items: resumes } = useResumes()
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const previousResumesRef = useRef<Resume[]>([])
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Generate notification ID
  const generateNotificationId = () => `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Create notification
  const createNotification = (
    type: NotificationData['type'],
    title: string,
    message: string,
    resumeId?: string,
    priority: NotificationData['priority'] = 'medium'
  ): NotificationData => ({
    id: generateNotificationId(),
    type,
    title,
    message,
    timestamp: new Date(),
    resumeId,
    isRead: false,
    priority
  })

  // Add notification
  const addNotification = (notification: NotificationData) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]) // Keep max 50 notifications
    setLastUpdate(new Date())

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  // Clear single notification
  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length

  // Detect changes in resumes and generate notifications
  useEffect(() => {
    const previousResumes = previousResumesRef.current
    const currentResumes = resumes

    if (previousResumes.length === 0) {
      previousResumesRef.current = currentResumes
      return
    }

    // Check for new resumes
    const newResumes = currentResumes.filter(current => 
      !previousResumes.some(prev => prev.id === current.id)
    )

    newResumes.forEach(resume => {
      addNotification(createNotification(
        'new_analysis',
        'New Resume Analysis Complete',
        `Analysis completed for ${resume.companyName || 'Unknown Company'} position with score ${resume.feedback.overallScore.toFixed(1)}`,
        resume.id,
        'medium'
      ))

      // Check for high score milestone
      if (resume.feedback.overallScore >= 90) {
        addNotification(createNotification(
          'milestone',
          'Excellent Score Achieved! 🎉',
          `Outstanding! You scored ${resume.feedback.overallScore.toFixed(1)} - that's in the top 10%!`,
          resume.id,
          'high'
        ))
      } else if (resume.feedback.overallScore >= 80) {
        addNotification(createNotification(
          'milestone',
          'Great Score! 🌟',
          `Well done! You scored ${resume.feedback.overallScore.toFixed(1)} - above average performance!`,
          resume.id,
          'medium'
        ))
      }
    })

    // Check for updated resumes
    const updatedResumes = currentResumes.filter(current => {
      const previous = previousResumes.find(prev => prev.id === current.id)
      return previous && previous.updatedAt.getTime() !== current.updatedAt.getTime()
    })

    updatedResumes.forEach(resume => {
      const previous = previousResumes.find(prev => prev.id === resume.id)
      if (previous) {
        const scoreImprovement = resume.feedback.overallScore - previous.feedback.overallScore
        
        if (scoreImprovement > 5) {
          addNotification(createNotification(
            'score_improvement',
            'Score Improvement Detected! 📈',
            `Your score improved by ${scoreImprovement.toFixed(1)} points to ${resume.feedback.overallScore.toFixed(1)}`,
            resume.id,
            'high'
          ))
        } else if (scoreImprovement < -5) {
          addNotification(createNotification(
            'warning',
            'Score Decrease Alert ⚠️',
            `Your score decreased by ${Math.abs(scoreImprovement).toFixed(1)} points. Consider reviewing recent changes.`,
            resume.id,
            'high'
          ))
        }
      }
    })

    // Check for performance patterns
    if (currentResumes.length >= 5) {
      const recentResumes = currentResumes.slice(0, 5)
      const averageScore = recentResumes.reduce((sum, r) => sum + r.feedback.overallScore, 0) / recentResumes.length
      
      if (averageScore >= 85) {
        const hasConsistentHighScores = !notifications.some(n => 
          n.type === 'milestone' && 
          n.title.includes('Consistent Excellence') &&
          Date.now() - n.timestamp.getTime() < 24 * 60 * 60 * 1000 // Within last 24 hours
        )
        
        if (hasConsistentHighScores) {
          addNotification(createNotification(
            'milestone',
            'Consistent Excellence! 🏆',
            `Amazing! Your last 5 resumes averaged ${averageScore.toFixed(1)} points. You're on fire!`,
            undefined,
            'high'
          ))
        }
      }
    }

    previousResumesRef.current = currentResumes
  }, [resumes])

  // Simulate real-time connection monitoring
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine)
      setLastUpdate(new Date())
    }

    // Check connection every 30 seconds
    intervalRef.current = setInterval(checkConnection, 30000)

    // Listen for online/offline events
    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
    }
  }, [])

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Generate periodic insights (every 5 minutes when active)
  useEffect(() => {
    const generateInsights = () => {
      if (resumes.length === 0) return

      const now = new Date()
      const lastInsight = notifications.find(n => n.type === 'milestone' && n.title.includes('Weekly Summary'))
      
      // Generate weekly summary if it's been more than 7 days
      if (!lastInsight || (now.getTime() - lastInsight.timestamp.getTime()) > 7 * 24 * 60 * 60 * 1000) {
        const weeklyResumes = resumes.filter(r => 
          (now.getTime() - new Date(r.createdAt).getTime()) <= 7 * 24 * 60 * 60 * 1000
        )

        if (weeklyResumes.length > 0) {
          const averageScore = weeklyResumes.reduce((sum, r) => sum + r.feedback.overallScore, 0) / weeklyResumes.length
          
          addNotification(createNotification(
            'milestone',
            'Weekly Summary 📊',
            `This week: ${weeklyResumes.length} analyses with ${averageScore.toFixed(1)} average score. Keep up the great work!`,
            undefined,
            'low'
          ))
        }
      }
    }

    const insightInterval = setInterval(generateInsights, 5 * 60 * 1000) // Every 5 minutes

    return () => clearInterval(insightInterval)
  }, [resumes, notifications])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    isConnected,
    lastUpdate
  }
}