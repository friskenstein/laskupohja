import { parseEditableMoney } from './money'

declare const expect: (actual: unknown) => {
	toEqual: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('parses editable money strings into minor unit amounts', () => {
	expect(parseEditableMoney('1234.56')).toEqual({ ok: true, minorUnits: 123456 })
	expect(parseEditableMoney('1234,56')).toEqual({ ok: true, minorUnits: 123456 })
	expect(parseEditableMoney('0.1')).toEqual({ ok: true, minorUnits: 10 })
})

test('leaves incomplete and invalid editable money values for later validation', () => {
	expect(parseEditableMoney('')).toEqual({ ok: false, reason: 'incomplete' })
	expect(parseEditableMoney('12.')).toEqual({ ok: false, reason: 'incomplete' })
	expect(parseEditableMoney('12.345')).toEqual({ ok: false, reason: 'invalid' })
	expect(parseEditableMoney('not money')).toEqual({ ok: false, reason: 'invalid' })
})
