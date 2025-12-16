import { ValidationResult, ValidationOptions, cleanNumericInput } from './types'

/**
 * Validates Hungarian Social Security Number (TAJ - Társadalombiztosítási Azonosító Jel)
 *
 * Rules based on 1996. évi XX. law:
 * 1. Exactly 9 digits
 * 2. Digits 1-8: Unique sequence number
 * 3. Digit 9: Control digit (CDV - Check Digit Verification)
 * 4. Checksum: Multiply odd positions (1st, 3rd, 5th, 7th) by 3,
 *    multiply even positions (2nd, 4th, 6th, 8th) by 7,
 *    sum all products, take modulo 10, compare with 9th digit
 *
 * @param ssNumber - The TAJ number to validate
 * @param options - Optional configuration
 * @returns Object with isValid boolean and optional error message
 */
export interface SSNumberValidationOptions extends ValidationOptions { }

const errorMessages = {
    hu: {
        invalidLength: 'A TAJ szám pontosan 9 számjegyből kell álljon',
        invalidChecksum: 'A TAJ szám ellenőrző számjegye érvénytelen'
    },
    en: {
        invalidLength: 'TAJ number must be exactly 9 digits',
        invalidChecksum: 'TAJ number checksum is invalid'
    }
}

export const validateSSNumber = (
    ssNumber: string,
    options: SSNumberValidationOptions = {}
): ValidationResult => {
    const lang = options.language || 'hu'
    const messages = errorMessages[lang]

    // Remove any whitespace and non-numeric characters
    const cleaned = cleanNumericInput(ssNumber)

    // Check if it's exactly 9 digits
    if (!/^\d{9}$/.test(cleaned)) {
        return {
            isValid: false,
            error: messages.invalidLength
        }
    }

    const digits: number[] = cleaned.split('').map(Number)

    // Calculate checksum
    // Odd positions (1st, 3rd, 5th, 7th) - indices 0, 2, 4, 6 - multiply by 3
    // Even positions (2nd, 4th, 6th, 8th) - indices 1, 3, 5, 7 - multiply by 7
    let sum = 0
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            // Odd position (1st, 3rd, 5th, 7th) - multiply by 3
            sum += (digits[i] ?? 0) * 3
        } else {
            // Even position (2nd, 4th, 6th, 8th) - multiply by 7
            sum += (digits[i] ?? 0) * 7
        }
    }

    const remainder = sum % 10

    // Check if remainder matches the 9th digit (index 8)
    if (remainder !== digits[8]) {
        return {
            isValid: false,
            error: messages.invalidChecksum
        }
    }

    return { isValid: true }
}

