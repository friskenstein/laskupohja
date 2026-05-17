import {
	calculateDueDate,
	formatFinnishBankBarcodeDate,
	formatLocalDate,
	tryCalculateDueDate,
} from './dates'

declare const expect: (actual: unknown) => {
	toBe: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('calculates due date by calendar days across daylight saving time changes', () => {
	expect(calculateDueDate('2024-03-30', 2)).toBe('2024-04-01')
})

test('calculates due date across month boundaries with leap year dates', () => {
	expect(calculateDueDate('2024-02-28', 1)).toBe('2024-02-29')
})

test('formats local dates for Finnish invoice documents', () => {
	expect(formatLocalDate('2024-04-01', 'fi-FI')).toBe('1.4.2024')
})

test('formats local dates for Finnish bank barcode payloads', () => {
	expect(formatFinnishBankBarcodeDate('2024-04-01')).toBe('240401')
})

test('leaves incomplete editable dates for later validation', () => {
	expect(tryCalculateDueDate('', '14')).toBe(null)
})

test('leaves impossible editable dates for later validation', () => {
	expect(tryCalculateDueDate('2024-02-31', '14')).toBe(null)
})
