import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { AuthPage } from '../AuthPage'
import { useAuthActions } from '@/stores/useAppStore'
import puterService from '@/services/puterService'

// Mock the store
vi.mock('@/stores/useAppStore', () => ({
  useAuthActions: vi.fn()
}))

// Mock the puter service
vi.mock('@/services/puterService', () => ({
  default: {
    auth: {
      signIn: vi.fn(),
      getCurrentUser: vi.fn()
    },
    checkAuthStatus: vi.fn(),
    isAvailable: vi.fn(() => true)
  }
}))

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('AuthPage', () => {
  const mockSetAuthenticated = vi.fn()
  const mockSetUser = vi.fn()
  const mockSetAuthLoading = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
    
    vi.mocked(useAuthActions).mockReturnValue({
      setAuthenticated: mockSetAuthenticated,
      setUser: mockSetUser,
      setAuthLoading: mockSetAuthLoading,
      signOut: vi.fn()
    })
  })

  it('renders the auth page correctly', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('AI Resume Analyzer')).toBeInTheDocument()
    expect(screen.getByText('Sign In with Puter')).toBeInTheDocument()
    expect(screen.getByText('ATS compatibility analysis')).toBeInTheDocument()
  })

  it('handles successful sign in', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    
    vi.mocked(puterService.auth.signIn).mockResolvedValue(undefined)
    vi.mocked(puterService.checkAuthStatus).mockResolvedValue(true)
    vi.mocked(puterService.auth.getCurrentUser).mockResolvedValue(mockUser)

    render(
      <BrowserRouter>
        <AuthPage onSuccess={mockOnSuccess} />
      </BrowserRouter>
    )
    
    const signInButton = screen.getByText('Sign In with Puter')
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true)
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('handles sign in failure', async () => {
    vi.mocked(puterService.auth.signIn).mockRejectedValue(new Error('Auth failed'))

    render(<AuthPage />)
    
    const signInButton = screen.getByText('Sign In with Puter')
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText(/Authentication failed/)).toBeInTheDocument()
    })
  })

  it('shows loading state during sign in', async () => {
    vi.mocked(puterService.auth.signIn).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<AuthPage />)
    
    const signInButton = screen.getByText('Sign In with Puter')
    fireEvent.click(signInButton)

    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })
})