import { v4 as uuidv4 } from 'uuid'

/**
 * Generates a unique identifier using UUID v4
 * @returns A unique string identifier
 */
export const generateId = (): string => {
  return uuidv4()
}

/**
 * Validates if a string is a valid UUID
 * @param id The string to validate
 * @returns True if the string is a valid UUID
 */
export const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}