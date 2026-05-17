export const supportedCurrencyCodes = ['EUR', 'USD', 'SEK'] as const

export type CurrencyCode = (typeof supportedCurrencyCodes)[number]

export const supportedCurrencies: readonly {
	code: CurrencyCode
	label: string
}[] = [
	{ code: 'EUR', label: 'EUR - Euro' },
	{ code: 'USD', label: 'USD - US dollar' },
	{ code: 'SEK', label: 'SEK - Swedish krona' },
]
