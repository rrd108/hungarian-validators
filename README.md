# hungarian-validators

[🇭🇺 Magyarul / Hungarian](README.hu.md)

A TypeScript/JavaScript library for validating Hungarian identifiers: tax numbers (adóazonosító jel), TAJ numbers, bank accounts, and more.

## Installation

```bash
npm install hungarian-validators
```

## Usage

### Tax Number (Adóazonosító jel) Validation

```typescript
import { validateTaxNumber, validateTaxNumberBirthDate } from 'hungarian-validators'

// Basic validation
const result = validateTaxNumber('8123456789')
if (result.isValid) {
  console.log('Valid tax number')
} else {
  console.error(result.error)
}

// Validation with English error messages
const resultEn = validateTaxNumber('8123456789', { language: 'en' })

// Validate tax number with birth date
const resultWithDate = validateTaxNumberBirthDate('8123456789', '1980-01-01', { language: 'en' })
```

## API

### `validateTaxNumber(taxNumber: string, options?: TaxNumberValidationOptions): ValidationResult`

Validates a Hungarian tax number (adóazonosító jel).

**Parameters:**

- `taxNumber`: The tax number to validate (10 digits)
- `options`: Optional configuration
  - `language`: 'hu' | 'en' (default: 'hu')

**Returns:**

- `ValidationResult` object with:
  - `isValid`: boolean
  - `error?`: string (error message if invalid)

**Validation Rules:**

1. Exactly 10 digits
2. First digit must be 8 (for private individuals)
3. Digits 2-6: Days since 1867-01-01 (birth date encoding)
4. Digits 7-9: Random identifier (000-999)
5. Digit 10: Checksum (modulo 11 of weighted sum)

### `validateTaxNumberBirthDate(taxNumber: string, birthDate: string | Date, options?: TaxNumberValidationOptions): ValidationResult`

Validates if the birth date encoding in tax number matches the actual birth date.

**Parameters:**

- `taxNumber`: The tax number to validate
- `birthDate`: Birth date in YYYY-MM-DD format or Date object
- `options`: Optional configuration (same as above)

## Examples

```typescript
import { validateTaxNumber, validateTaxNumberBirthDate } from 'hungarian-validators'

// Example 1: Basic validation
const result1 = validateTaxNumber('8123456789')
console.log(result1.isValid) // true or false

// Example 2: Validation with English messages
const result2 = validateTaxNumber('123456789', { language: 'en' })
console.log(result2.error) // "Tax number must be exactly 10 digits"

// Example 3: Validate with birth date
const result3 = validateTaxNumberBirthDate('8123456789', '1980-01-01')
```

## Future Validators

This package is designed to be extended with additional Hungarian validators:

- **TAJ Number** (Társadalombiztosítási azonosító jel)
- **Bank Account Number** (Bankszámlaszám)
- **Company Tax Number** (Adószám)
- And more...

## License

MIT

## Publishing New Versions

For maintainers, use the following scripts to publish new versions:

### Version Bump Scripts

- `pnpm run version:patch` - Bumps patch version (1.0.0 → 1.0.1), creates git commit/tag, pushes to GitHub, and creates a GitHub release
- `pnpm run version:minor` - Bumps minor version (1.0.0 → 1.1.0), creates git commit/tag, pushes to GitHub, and creates a GitHub release
- `pnpm run version:major` - Bumps major version (1.0.0 → 2.0.0), creates git commit/tag, pushes to GitHub, and creates a GitHub release
- `pnpm run version:patch:preview` - Preview what the next patch version would be

### Publish Scripts (Version Bump + Publish)

- `pnpm run publish:patch` - Bumps patch version, creates GitHub release, and publishes to npm
- `pnpm run publish:minor` - Bumps minor version, creates GitHub release, and publishes to npm
- `pnpm run publish:major` - Bumps major version, creates GitHub release, and publishes to npm

**Usage examples:**

```bash
# For a patch release (bug fixes)
pnpm run publish:patch

# For a minor release (new features, backward compatible)
pnpm run publish:minor

# For a major release (breaking changes)
pnpm run publish:major
```

**Note:**

- Make sure your git working directory is clean (commit or stash changes) before running these scripts, as they create git commits and tags automatically.
- The scripts automatically push commits and tags to GitHub, and create GitHub releases using the GitHub CLI (`gh`).
- Ensure you're authenticated with GitHub CLI (`gh auth login`) before running these scripts.
- Release notes are automatically generated from the commits between releases.

## Contributing

Contributions are welcome! We appreciate any help, whether it's reporting bugs, suggesting features, or submitting Pull Requests.

### Getting Started

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/hungarian-validators.git
   cd hungarian-validators
   ```

2. **Install dependencies**

   This project uses [pnpm](https://pnpm.io) for package management.

   ```bash
   pnpm install
   ```

3. **Build the project**

   ```bash
   pnpm run build
   ```

4. **Run tests**

   ```bash
   pnpm test
   ```

5. **Run tests in watch mode** (for development)
   ```bash
   pnpm run test:watch
   ```

### Reporting Issues

Found a bug or have a feature request? Please open an [issue](https://github.com/your-username/hungarian-validators/issues) on GitHub. Include as much detail as possible to help us understand and reproduce the problem.

### Submitting Pull Requests

1. Create a branch for your changes
2. Make your changes and ensure tests pass
3. Add tests for any new functionality
4. Update documentation if needed
5. Submit a Pull Request with a clear description of your changes

We'll review your PR as soon as possible. Thank you for contributing!
