import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Puter.js for testing
((globalThis || window || global) as any).puter = {
  auth: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    isAuthenticated: false,
  },
  fs: {
    upload: vi.fn(),
    read: vi.fn(),
    delete: vi.fn(),
  },
  kv: {
    set: vi.fn(),
    get: vi.fn(),
    list: vi.fn(),
    delete: vi.fn(),
  },
  ai: {
    feedback: vi.fn(),
  },
}