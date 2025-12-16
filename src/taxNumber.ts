/**
 * Validates Hungarian tax number (adóazonosító jel)
 *
 * Rules:
 * 1. Exactly 10 digits
 * 2. 1st digit must be 8 (for private individuals)
 * 3. 2-6th digits: Days since 1867-01-01 (birth date encoding)
 * 4. 7-9th digits: Random identifier (000-999)
 * 5. 10th digit: Checksum (modulo 11 of weighted sum)
 *
 * @param taxNumber - The tax number to validate
 * @param options - Optional configuration
 * @returns Object with isValid boolean and optional error message
 */
export interface TaxNumberValidationOptions {
  /** Language for error messages ('hu' | 'en'). Default: 'hu' */
  language?: 'hu' | 'en'
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

const errorMessages = {
  hu: {
    invalidLength: 'Az adóazonosító pontosan 10 számjegyből kell álljon',
    invalidFirstDigit: 'Az első számjegynek 8-nak kell lennie magánszemélyek esetében',
    invalidChecksum: 'Az adóazonosító ellenőrző számjegye érvénytelen',
    invalidChecksumDigit: 'Az adóazonosító ellenőrző számjegye nem megfelelő',
    invalidBirthDateEncoding: 'Az adóazonosító születési dátum kódolása érvénytelen',
    birthDateMismatch: 'Az adóazonosító születési dátuma nem egyezik meg a megadott születési dátummal'
  },
  en: {
    invalidLength: 'Tax number must be exactly 10 digits',
    invalidFirstDigit: 'First digit must be 8 for private individuals',
    invalidChecksum: 'Tax number checksum is invalid',
    invalidChecksumDigit: 'Tax number checksum digit is incorrect',
    invalidBirthDateEncoding: 'Tax number birth date encoding is invalid',
    birthDateMismatch: 'Tax number birth date does not match the provided birth date'
  }
}

export function validateTaxNumber(
  taxNumber: string,
  options: TaxNumberValidationOptions = {}
): ValidationResult {
  const lang = options.language || 'hu'
  const messages = errorMessages[lang]

  // Remove any whitespace
  const cleaned = taxNumber.trim()

  // Check if it's exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      isValid: false,
      error: messages.invalidLength
    }
  }

  const digits: number[] = cleaned.split('').map(Number)

  // Check 1st digit (must be 8 for private individuals)
  if (digits[0] !== 8) {
    return {
      isValid: false,
      error: messages.invalidFirstDigit
    }
  }

  // Calculate checksum (10th digit validation)
  // RegEx already guarantees 10 digits, so digits array has exactly 10 elements
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += (digits[i] ?? 0) * (i + 1)
  }

  const remainder = sum % 11

  // If remainder is 10, the tax number is invalid (can't be represented as single digit)
  if (remainder === 10) {
    return {
      isValid: false,
      error: messages.invalidChecksum
    }
  }

  // Check if remainder matches the 10th digit
  if (remainder !== digits[9]) {
    return {
      isValid: false,
      error: messages.invalidChecksumDigit
    }
  }

  // Extract birth date encoding (digits 2-6)
  const daysSince1867 = parseInt(cleaned.substring(1, 6), 10)

  // Validate that the days value is reasonable
  // Days from 1867-01-01 to today (approximately 58,000 days)
  // And reasonable minimum (e.g., someone born in 1900 would be ~12,000 days)
  // Maximum reasonable: someone born today would be ~58,000 days
  // But we'll be more lenient: 0 to 100,000 days (covers 1867 to ~2250)
  if (daysSince1867 < 0 || daysSince1867 > 100000) {
    return {
      isValid: false,
      error: messages.invalidBirthDateEncoding
    }
  }

  return { isValid: true }
}

/**
 * Calculates the number of days between 1867-01-01 and a given date
 * Uses UTC dates to avoid timezone and DST issues
 *
 * @param date - Date string in YYYY-MM-DD format or Date object
 * @returns Number of days since 1867-01-01
 */
export function calculateDaysSince1867(date: string | Date): number {
  // Parse date to UTC components to avoid timezone issues
  let year: number
  let month: number
  let day: number

  if (typeof date === 'string') {
    // Parse YYYY-MM-DD format
    const parts = date.split('-')
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD')
    }
    year = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
    day = parseInt(parts[2], 10)
  } else {
    // Extract UTC components from Date object
    year = date.getUTCFullYear()
    month = date.getUTCMonth()
    day = date.getUTCDate()
  }

  // Create UTC dates for calculation
  const baseDate = Date.UTC(1867, 0, 1) // 1867-01-01 UTC
  const targetDate = Date.UTC(year, month, day)

  // Calculate difference in milliseconds
  const diffTime = targetDate - baseDate

  // Convert to days using Math.round to handle fractional days correctly
  // This avoids issues with timezone/DST differences
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Validates if the birth date encoding in tax number matches the actual birth date
 *
 * @param taxNumber - The tax number
 * @param birthDate - Birth date in YYYY-MM-DD format or Date object
 * @param options - Optional configuration
 * @returns Object with isValid boolean and optional error message
 */
export function validateTaxNumberBirthDate(
  taxNumber: string,
  birthDate: string | Date,
  options: TaxNumberValidationOptions = {}
): ValidationResult {
  const lang = options.language || 'hu'
  const messages = errorMessages[lang]

  const basicValidation = validateTaxNumber(taxNumber, options)
  if (!basicValidation.isValid) {
    return basicValidation
  }

  const cleaned = taxNumber.trim()
  const daysFromTaxNumber = parseInt(cleaned.substring(1, 6), 10)
  const daysFromBirthDate = calculateDaysSince1867(birthDate)

  if (daysFromTaxNumber !== daysFromBirthDate) {
    return {
      isValid: false,
      error: messages.birthDateMismatch
    }
  }

  return { isValid: true }
}

