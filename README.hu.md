# hungarian-validators

TypeScript/JavaScript könyvtár magyar azonosítók validálásához: adóazonosító jel, TAJ szám, bankszámlaszám és további azonosítók ellenőrzéséhez.

## Telepítés

```bash
npm install hungarian-validators
```

## Használat

### Adóazonosító jel validálás

```typescript
import { validateTaxNumber, validateTaxNumberBirthDate } from 'hungarian-validators'

// Alap validálás
const result = validateTaxNumber('8123456789')
if (result.isValid) {
  console.log('Érvényes adóazonosító')
} else {
  console.error(result.error)
}

// Validálás angol hibaüzenetekkel
const resultEn = validateTaxNumber('8123456789', { language: 'en' })

// Adóazonosító validálás születési dátummal
const resultWithDate = validateTaxNumberBirthDate('8123456789', '1980-01-01', { language: 'en' })
```

## API

### `validateTaxNumber(taxNumber: string, options?: TaxNumberValidationOptions): ValidationResult`

Magyar adóazonosító jel (adóazonosító jel) validálása.

**Paraméterek:**

- `taxNumber`: A validálandó adóazonosító (10 számjegy)
- `options`: Opcionális beállítások
  - `language`: 'hu' | 'en' (alapértelmezett: 'hu')

**Visszatérési érték:**

- `ValidationResult` objektum a következő mezőkkel:
  - `isValid`: boolean
  - `error?`: string (hibaüzenet, ha érvénytelen)

**Validálási szabályok:**

1. Pontosan 10 számjegy
2. Az első számjegynek 8-nak kell lennie (magánszemélyek esetében)
3. 2-6. számjegy: Napok száma 1867-01-01 óta (születési dátum kódolása)
4. 7-9. számjegy: Véletlenszerű azonosító (000-999)
5. 10. számjegy: Ellenőrzőszám (súlyozott összeg modulo 11)

### `validateTaxNumberBirthDate(taxNumber: string, birthDate: string | Date, options?: TaxNumberValidationOptions): ValidationResult`

Validálja, hogy az adóazonosítóban kódolt születési dátum megegyezik-e a tényleges születési dátummal.

**Paraméterek:**

- `taxNumber`: A validálandó adóazonosító
- `birthDate`: Születési dátum YYYY-MM-DD formátumban vagy Date objektumként
- `options`: Opcionális beállítások (ugyanaz, mint fent)

## Példák

```typescript
import { validateTaxNumber, validateTaxNumberBirthDate } from 'hungarian-validators'

// Példa 1: Alap validálás
const result1 = validateTaxNumber('8123456789')
console.log(result1.isValid) // true vagy false

// Példa 2: Validálás angol üzenetekkel
const result2 = validateTaxNumber('123456789', { language: 'en' })
console.log(result2.error) // "Tax number must be exactly 10 digits"

// Példa 3: Validálás születési dátummal
const result3 = validateTaxNumberBirthDate('8123456789', '1980-01-01')
```

## Jövőbeli validátorok

Ez a csomag kiterjeszthető további magyar validátorokkal:

- **TAJ szám** (Társadalombiztosítási azonosító jel)
- **Bankszámlaszám** (Bankszámlaszám)
- **Cég adószáma** (Adószám)
- És még továbbak...

## Licenc

MIT

## Közreműködés

A közreműködés szívesen látott! Bármilyen segítséget értékelünk, legyen az hibajelentés, funkció javaslat vagy Pull Request beküldése.

### Kezdés

1. **Forkolás és klónozás**

   ```bash
   git clone https://github.com/your-username/hungarian-validators.git
   cd hungarian-validators
   ```

2. **Függőségek telepítése**

   A projekt [pnpm](https://pnpm.io)-t használ a csomagkezeléshez.

   ```bash
   pnpm install
   ```

3. **Projekt buildelése**

   ```bash
   pnpm run build
   ```

4. **Tesztek futtatása**

   ```bash
   pnpm test
   ```

5. **Tesztek futtatása watch módban** (fejlesztéshez)
   ```bash
   pnpm run test:watch
   ```

### Hibajelentés

Találtál egy hibát vagy van egy funkció kérése? Kérjük, nyiss egy [issue](https://github.com/your-username/hungarian-validators/issues)-t a GitHubon. Minél több részletet tartalmaz, annál könnyebb lesz megérteni és reprodukálni a problémát.

### Pull Request beküldése

1. Hozz létre egy ágat a változtatásaidhoz
2. Végezd el a módosításokat és bizonyosodj meg arról, hogy a tesztek átmennek
3. Adj hozzá teszteket minden új funkcióhoz
4. Frissítsd a dokumentációt, ha szükséges
5. Küldj be egy Pull Request-et a változtatások világos leírásával

A PR-t a lehető leghamarabb átnézzük. Köszönjük a közreműködést!
