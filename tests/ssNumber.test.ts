import { describe, it, expect } from 'vitest'
import { validateSSNumber } from '../src/ssNumber'

describe('validateSSNumber', () => {
    it('should reject TAJ number with incorrect length', () => {
        expect(validateSSNumber('12345678').isValid).toBe(false)
        expect(validateSSNumber('1234567890').isValid).toBe(false)
    })

    it('should validate the example TAJ number 111111110', () => {
        // Example from documentation:
        // 1×3 + 1×7 + 1×3 + 1×7 + 1×3 + 1×7 + 1×3 + 1×7 = 40
        // 40 % 10 = 0, which matches the 9th digit (0)
        expect(validateSSNumber('111111110').isValid).toBe(true)
    })

    it('should reject TAJ number with invalid checksum', () => {
        expect(validateSSNumber('111111111').isValid).toBe(false)
        expect(validateSSNumber('123456789').isValid).toBe(false)
    })

    it('should support English error messages', () => {
        const result = validateSSNumber('12345678', { language: 'en' })
        expect(result.isValid).toBe(false)
        expect(result.error).toBe('TAJ number must be exactly 9 digits')
    })

    it('should support Hungarian error messages by default', () => {
        const result = validateSSNumber('12345678')
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('számjegyből')
    })

    it('should remove non-numeric characters from TAJ number', () => {
        // Test with spaces
        expect(validateSSNumber('111 111 110').isValid).toBe(true)
        // Test with dashes
        expect(validateSSNumber('111-111-110').isValid).toBe(true)
        // Test with mixed non-numeric characters
        expect(validateSSNumber('111-111 110').isValid).toBe(true)
        // Test with only numbers (should still work)
        expect(validateSSNumber('111111110').isValid).toBe(true)
    })

    it('should handle leading zeros correctly', () => {
        // Test with a TAJ number that has leading zeros
        // We need to calculate a valid checksum for this
        // Let's use 000000000: 0×3 + 0×7 + 0×3 + 0×7 + 0×3 + 0×7 + 0×3 + 0×7 = 0, remainder = 0
        expect(validateSSNumber('000000000').isValid).toBe(true)
    })

    it('should validate various valid TAJ numbers', () => {
        // Test with different valid combinations
        // 123456789: 1×3 + 2×7 + 3×3 + 4×7 + 5×3 + 6×7 + 7×3 + 8×7
        // = 3 + 14 + 9 + 28 + 15 + 42 + 21 + 56 = 188
        // 188 % 10 = 8, so checksum digit should be 8
        expect(validateSSNumber('123456788').isValid).toBe(true)

        // 987654321: 9×3 + 8×7 + 7×3 + 6×7 + 5×3 + 4×7 + 3×3 + 2×7
        // = 27 + 56 + 21 + 42 + 15 + 28 + 9 + 14 = 212
        // 212 % 10 = 2, so checksum digit should be 2
        expect(validateSSNumber('987654322').isValid).toBe(true)
    })

    it('should return error message for invalid checksum', () => {
        const result = validateSSNumber('111111111', { language: 'en' })
        expect(result.isValid).toBe(false)
        expect(result.error).toBe('TAJ number checksum is invalid')
    })
})

