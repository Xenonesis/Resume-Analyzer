// Utility functions for cookie management

export type CookieConsentType = 'accepted' | 'rejected' | null

/**
 * Get the user's cookie consent preference
 * @returns The user's cookie consent preference or null if not set
 */
export const getCookieConsent = (): CookieConsentType => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cookieConsent') as CookieConsentType || null
}

/**
 * Set the user's cookie consent preference
 * @param consent The user's cookie consent preference
 */
export const setCookieConsent = (consent: 'accepted' | 'rejected'): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('cookieConsent', consent)
}

/**
 * Check if analytics cookies are allowed
 * @returns True if analytics cookies are allowed, false otherwise
 */
export const areAnalyticsCookiesAllowed = (): boolean => {
  const consent = getCookieConsent()
  return consent === 'accepted'
}

/**
 * Check if marketing cookies are allowed
 * @returns True if marketing cookies are allowed, false otherwise
 */
export const areMarketingCookiesAllowed = (): boolean => {
  const consent = getCookieConsent()
  return consent === 'accepted'
}

/**
 * Check if functional cookies are allowed
 * @returns True if functional cookies are allowed, false otherwise
 */
export const areFunctionalCookiesAllowed = (): boolean => {
  const consent = getCookieConsent()
  return consent === 'accepted'
}

/**
 * Set a cookie (for browser environments)
 * @param name Cookie name
 * @param value Cookie value
 * @param days Days until expiration
 */
export const setCookie = (name: string, value: string, days: number): void => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Get a cookie value (for browser environments)
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
