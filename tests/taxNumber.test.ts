import { describe, it, expect } from 'vitest'
import {
  validateTaxNumber,
  calculateDaysSince1867,
  validateTaxNumberBirthDate
} from '../src/taxNumber'

describe('validateTaxNumber', () => {
  it('should reject tax number with incorrect length', () => {
    expect(validateTaxNumber('123456789').isValid).toBe(false)
    expect(validateTaxNumber('12345678901').isValid).toBe(false)
  })

  it('should reject tax number that does not start with 8', () => {
    expect(validateTaxNumber('7123456789').isValid).toBe(false)
    expect(validateTaxNumber('9123456789').isValid).toBe(false)
  })

  it('should support English error messages', () => {
    const result = validateTaxNumber('123456789', { language: 'en' })
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Tax number must be exactly 10 digits')
  })

  it('should support Hungarian error messages by default', () => {
    const result = validateTaxNumber('123456789')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('számjegyből')
  })
})

describe('calculateDaysSince1867', () => {
  it('should calculate days for 1867-01-01 as 0', () => {
    expect(calculateDaysSince1867('1867-01-01')).toBe(0)
  })

  it('should calculate days for 1867-01-02 as 1', () => {
    expect(calculateDaysSince1867('1867-01-02')).toBe(1)
  })

  it('should handle Date object input', () => {
    const date = new Date('2000-01-01')
    const days = calculateDaysSince1867(date)
    expect(days).toBeGreaterThan(48000)
    expect(days).toBeLessThan(49000)
  })
})

describe('validateTaxNumberBirthDate', () => {
  it('should return basic validation error if tax number format is invalid', () => {
    const result = validateTaxNumberBirthDate('123456789', '1980-01-01')
    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should support language option', () => {
    const result = validateTaxNumberBirthDate(
      '123456789',
      '1980-01-01',
      { language: 'en' }
    )
    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
  })
})

