/**
 * Hungarian Validators
 * A TypeScript/JavaScript library for validating Hungarian identifiers
 *
 * @packageDocumentation
 */

// Shared types
export type { ValidationResult, ValidationOptions } from './types'

// Tax Number (Adóazonosító jel) validators
export {
  validateTaxNumber,
  validateTaxNumberBirthDate,
  type TaxNumberValidationOptions
} from './taxNumber'

// Social Security Number (TAJ) validators
export {
  validateSSNumber,
  type SSNumberValidationOptions
} from './ssNumber'

// Future validators will be exported here:
// export { validateBankAccount } from './bankAccount'
// etc.

