import type { InvoiceLine } from '../domain/types'

export type InvoiceLineAmounts = {
	netMinorUnits: number
	vatMinorUnits: number
	grossMinorUnits: number
}

export type VatBreakdownLine = {
	vatRate: number
	netMinorUnits: number
	vatMinorUnits: number
	grossMinorUnits: number
}

export type InvoiceTotals = {
	lineAmounts: InvoiceLineAmounts[]
	netTotalMinorUnits: number
	vatTotalMinorUnits: number
	grossTotalMinorUnits: number
	vatBreakdown: VatBreakdownLine[]
}

export function calculateInvoiceLineAmounts(line: InvoiceLine): InvoiceLineAmounts {
	const netMinorUnits = roundScaledProduct(line.unitPriceMinorUnits, toScaledDecimal(line.quantity))
	const vatMinorUnits = roundScaledProduct(netMinorUnits, toScaledDecimal(line.vatRate), 100)

	return {
		netMinorUnits,
		vatMinorUnits,
		grossMinorUnits: netMinorUnits + vatMinorUnits,
	}
}

export function calculateInvoiceTotals(lines: InvoiceLine[]): InvoiceTotals {
	const lineAmounts = lines.map(calculateInvoiceLineAmounts)
	const vatBreakdownByRate = new Map<number, VatBreakdownLine>()

	for (const [index, line] of lines.entries()) {
		const lineAmount = lineAmounts[index]
		const existingBreakdownLine = vatBreakdownByRate.get(line.vatRate)

		if (existingBreakdownLine) {
			existingBreakdownLine.netMinorUnits += lineAmount.netMinorUnits
			existingBreakdownLine.vatMinorUnits += lineAmount.vatMinorUnits
			existingBreakdownLine.grossMinorUnits += lineAmount.grossMinorUnits
		} else {
			vatBreakdownByRate.set(line.vatRate, {
				vatRate: line.vatRate,
				...lineAmount,
			})
		}
	}

	return {
		lineAmounts,
		netTotalMinorUnits: sumLineAmounts(lineAmounts, 'netMinorUnits'),
		vatTotalMinorUnits: sumLineAmounts(lineAmounts, 'vatMinorUnits'),
		grossTotalMinorUnits: sumLineAmounts(lineAmounts, 'grossMinorUnits'),
		vatBreakdown: [...vatBreakdownByRate.values()],
	}
}

function sumLineAmounts(lineAmounts: InvoiceLineAmounts[], key: keyof InvoiceLineAmounts): number {
	return lineAmounts.reduce((total, lineAmount) => total + lineAmount[key], 0)
}

function toScaledDecimal(value: number) {
	const [integerPart, fractionPart = ''] = value.toString().split('.')
	const sign = integerPart.startsWith('-') ? -1 : 1
	const absoluteIntegerPart = integerPart.replace('-', '')

	return {
		value: sign * Number(`${absoluteIntegerPart}${fractionPart}`),
		scale: 10 ** fractionPart.length,
	}
}

function roundScaledProduct(
	minorUnits: number,
	multiplier: ReturnType<typeof toScaledDecimal>,
	extraDivisor = 1
) {
	const numerator = minorUnits * multiplier.value
	const denominator = multiplier.scale * extraDivisor
	const absoluteNumerator = Math.abs(numerator)
	const rounded = Math.floor(absoluteNumerator / denominator)
	const remainder = absoluteNumerator % denominator
	const roundedAbsoluteValue = remainder * 2 >= denominator ? rounded + 1 : rounded

	return Math.sign(numerator) * roundedAbsoluteValue
}
