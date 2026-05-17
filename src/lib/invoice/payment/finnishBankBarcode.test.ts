import {
	createFinnishBankBarcodeV4Payload,
	generateFinnishBankBarcodeV4Payload,
} from './finnishBankBarcode'

declare const expect: (actual: unknown) => {
	toEqual: (expected: unknown) => void
	toBe: (expected: unknown) => void
	toThrow: (expected?: string) => void
}
declare const test: (name: string, run: () => void) => void

test('generates Finnish Bank Barcode v4 payloads from valid payment data', () => {
	expect(
		generateFinnishBankBarcodeV4Payload({
			iban: 'FI21 1234 5600 0007 85',
			amountMinorUnits: 24800,
			dueDate: '2024-04-15',
			finnishReferenceNumber: '12344',
		})
	).toBe('421123456000007850002480000000000000000000012344240415')
})

test('returns explicit errors instead of payloads for invalid Finnish Bank Barcode v4 data', () => {
	expect(
		createFinnishBankBarcodeV4Payload({
			iban: 'SE12 3456 7890 1234 56',
			amountMinorUnits: 0,
			dueDate: '2024-02-31',
			finnishReferenceNumber: '12345',
		})
	).toEqual({
		ok: false,
		issues: [
			{
				code: 'finnish-bank-barcode-iban-invalid',
				path: 'iban',
				message: 'Finnish Bank Barcode v4 requires a Finnish IBAN.',
			},
			{
				code: 'finnish-bank-barcode-amount-positive-required',
				path: 'amountMinorUnits',
				message: 'Finnish Bank Barcode v4 requires a positive payable amount.',
			},
			{
				code: 'finnish-bank-barcode-due-date-invalid',
				path: 'dueDate',
				message: 'Finnish Bank Barcode v4 requires a valid due date.',
			},
			{
				code: 'finnish-bank-barcode-reference-invalid',
				path: 'finnishReferenceNumber',
				message: 'Finnish Bank Barcode v4 requires a valid Finnish Reference Number.',
			},
		],
	})
})

test('rejects Finnish-shaped IBANs with invalid checksums', () => {
	expect(
		createFinnishBankBarcodeV4Payload({
			iban: 'FI12 3456 7890 1234 56',
			amountMinorUnits: 24800,
			dueDate: '2024-04-15',
			finnishReferenceNumber: '12344',
		})
	).toEqual({
		ok: false,
		issues: [
			{
				code: 'finnish-bank-barcode-iban-invalid',
				path: 'iban',
				message: 'Finnish Bank Barcode v4 requires a Finnish IBAN.',
			},
		],
	})
})

test('throws explicit errors instead of generating invalid Finnish Bank Barcode v4 payloads', () => {
	expect(() =>
		generateFinnishBankBarcodeV4Payload({
			iban: 'FI12 3456 7890 1234 56',
			amountMinorUnits: 24800,
			dueDate: '2024-04-15',
			finnishReferenceNumber: '12344',
		})
	).toThrow('Finnish Bank Barcode v4 payment data is invalid.')
})
