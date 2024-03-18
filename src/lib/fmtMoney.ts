export function fmtMoney(amount: number) {
	return new Intl.NumberFormat('fi-FI', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 2,
	}).format(amount)
}
