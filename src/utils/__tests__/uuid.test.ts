import { describe, it, expect } from 'vitest'
import { generateId, isValidUuid } from '../uuid'

describe('UUID utilities', () => {
  describe('generateId', () => {
    it('should generate a valid UUID', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('isValidUuid', () => {
    it('should validate correct UUIDs', () => {
      const validUuid = '123e4567-e89b-42d3-a456-426614174000'
      expect(isValidUuid(validUuid)).toBe(true)
    })

    it('should reject invalid UUIDs', () => {
      expect(isValidUuid('invalid-uuid')).toBe(false)
      expect(isValidUuid('123e4567-e89b-12d3-a456')).toBe(false)
      expect(isValidUuid('')).toBe(false)
    })

    it('should validate generated UUIDs', () => {
      const id = generateId()
      expect(isValidUuid(id)).toBe(true)
    })
  })
})