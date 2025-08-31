
import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthPage } from '@/components/auth/AuthPage'
import HomePage from '@/pages/HomePage'
import { UploadPage } from '@/pages/UploadPage'
import { AnalyzePage } from '@/pages/AnalyzePage'
import { ResultsPage } from '@/pages/ResultsPage'
import { ThemePage } from '@/pages/ThemePage'
import { Layout } from '@/components/layout/Layout'
import AISettings from '@/components/AISettings'
import HeroDemo from '@/components/HeroDemo'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'upload',
        element: <UploadPage />
      },
      {
        path: 'analyze/:filePath',
        element: <AnalyzePage />
      },
      {
        path: 'results/:resumeId',
        element: <ResultsPage />
      },
      {
        path: 'settings',
        element: <AISettings />
      },
      {
        path: 'hero-demo',
        element: <HeroDemo />
      },
      {
        path: 'themes',
        element: <ThemePage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])
