export type ParsedMinorUnitAmount =
	| {
			ok: true
			minorUnits: number
	  }
	| {
			ok: false
			reason: 'incomplete' | 'invalid'
	  }

const editableMoneyPattern = /^(-?)(\d+)(?:[,.](\d{1,2}))?$/

export function parseEditableMoney(value: string): ParsedMinorUnitAmount {
	const trimmedValue = value.trim()

	if (trimmedValue === '') {
		return { ok: false, reason: 'incomplete' }
	}

	if (trimmedValue.endsWith('.') || trimmedValue.endsWith(',')) {
		return { ok: false, reason: 'incomplete' }
	}

	const match = editableMoneyPattern.exec(trimmedValue)

	if (!match) {
		return { ok: false, reason: 'invalid' }
	}

	const [, sign, euros, cents = ''] = match
	const minorUnits = Number(euros) * 100 + Number(cents.padEnd(2, '0'))

	return {
		ok: true,
		minorUnits: sign === '-' ? -minorUnits : minorUnits,
	}
}
