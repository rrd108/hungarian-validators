/**
 * Hungarian Validators
 * A TypeScript/JavaScript library for validating Hungarian identifiers
 *
 * @packageDocumentation
 */

// Shared types
export type { ValidationResult, ValidationOptions } from './types.js'

// Tax Number (Adóazonosító jel) validators
export {
  validateTaxNumber,
  validateTaxNumberBirthDate,
  type TaxNumberValidationOptions
} from './taxNumber.js'

// Social Security Number (TAJ) validators
export {
  validateSSNumber,
  type SSNumberValidationOptions
} from './ssNumber.js'

// Future validators will be exported here:
// export { validateBankAccount } from './bankAccount'
// etc.

