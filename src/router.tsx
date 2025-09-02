
import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthPage } from '@/components/auth/AuthPage'
import { AuthCallback } from '@/components/auth/AuthCallback'
import HomePage from '@/pages/HomePage'
import LandingPage from '@/pages/LandingPage'
import { UploadPage } from '@/pages/UploadPage'
import { QuestionnairePage } from '@/pages/QuestionnairePage'
import { AnalyzePage } from '@/pages/AnalyzePage'
import { ResultsPage } from '@/pages/ResultsPage'
import { ThemePage } from '@/pages/ThemePage'
import DashboardPage from '@/pages/DashboardPage'
import { Layout } from '@/components/layout/Layout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import AISettings from '@/components/AISettings'
import HeroDemo from '@/components/HeroDemo'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      }
    ]
  },
  {
    path: '/app',
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
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'upload',
        element: <UploadPage />
      },
      {
        path: 'questionnaire/:filePath',
        element: <QuestionnairePage />
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
        path: 'setup',
        element: <Navigate to="/app/settings" replace />
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
