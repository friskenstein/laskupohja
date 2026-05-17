const CURRENCY: Record<string, [string, string]> = {
	USD: ['en-US', 'USD'],
	EUR: ['fi-FI', 'EUR'],
	SEK: ['sv-SE', 'SEK'],
}

export function fmtMoney(amount: number, currency: string): string {
	const [locale, currencyCode] = CURRENCY[currency]

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currencyCode,
		maximumFractionDigits: 2,
	}).format(amount)
}
