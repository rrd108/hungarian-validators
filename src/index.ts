/**
 * Hungarian Validators
 * A TypeScript/JavaScript library for validating Hungarian identifiers
 *
 * @packageDocumentation
 */

// Tax Number (Adóazonosító jel) validators
export {
  validateTaxNumber,
  validateTaxNumberBirthDate,
  type TaxNumberValidationOptions,
  type ValidationResult
} from './taxNumber'

// Future validators will be exported here:
// export { validateTAJ } from './taj'
// export { validateBankAccount } from './bankAccount'
// etc.

