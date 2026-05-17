import {
	calculateFinnishReferenceNumberChecksum,
	completeFinnishReferenceNumber,
	isValidFinnishReferenceNumber,
} from './finnishReference'

declare const expect: (actual: unknown) => {
	toBe: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('calculates and validates Finnish Reference Number checksums', () => {
	expect(calculateFinnishReferenceNumberChecksum('1234')).toBe(4)
	expect(completeFinnishReferenceNumber('1234')).toBe('12344')
	expect(isValidFinnishReferenceNumber('12344')).toBe(true)
	expect(isValidFinnishReferenceNumber('12345')).toBe(false)
})
