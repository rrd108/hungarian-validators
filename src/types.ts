/**
 * Shared types and interfaces for Hungarian validators
 */

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Base validation options with language support
 */
export interface ValidationOptions {
  /** Language for error messages ('hu' | 'en'). Default: 'hu' */
  language?: 'hu' | 'en'
}

/**
 * Utility function to clean input by removing non-numeric characters
 */
export const cleanNumericInput = (input: string): string => {
  return input.replace(/\D/g, '')
}

