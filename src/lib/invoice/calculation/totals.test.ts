import { calculateInvoiceLineAmounts, calculateInvoiceTotals } from './totals'

declare const expect: (actual: unknown) => {
	toEqual: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('calculates invoice line net, VAT, and gross line amounts', () => {
	expect(
		calculateInvoiceLineAmounts({
			description: 'Consulting',
			quantity: 2,
			unit: 'h',
			unitPriceMinorUnits: 12345,
			vatRate: 24,
		})
	).toEqual({
		netMinorUnits: 24690,
		vatMinorUnits: 5926,
		grossMinorUnits: 30616,
	})
})

test('rounds line amounts without floating point calculation errors', () => {
	expect(
		calculateInvoiceLineAmounts({
			description: 'Usage',
			quantity: 1.005,
			unit: 'kWh',
			unitPriceMinorUnits: 100,
			vatRate: 0,
		})
	).toEqual({
		netMinorUnits: 101,
		vatMinorUnits: 0,
		grossMinorUnits: 101,
	})
})

test('calculates invoice totals and VAT breakdown grouped by VAT rate', () => {
	expect(
		calculateInvoiceTotals([
			{
				description: 'Development',
				quantity: 2,
				unit: 'h',
				unitPriceMinorUnits: 10000,
				vatRate: 24,
			},
			{
				description: 'Hosting',
				quantity: 1,
				unit: 'month',
				unitPriceMinorUnits: 1000,
				vatRate: 24,
			},
			{
				description: 'Export service',
				quantity: 3,
				unit: 'h',
				unitPriceMinorUnits: 5000,
				vatRate: 0,
			},
		])
	).toEqual({
		lineAmounts: [
			{ netMinorUnits: 20000, vatMinorUnits: 4800, grossMinorUnits: 24800 },
			{ netMinorUnits: 1000, vatMinorUnits: 240, grossMinorUnits: 1240 },
			{ netMinorUnits: 15000, vatMinorUnits: 0, grossMinorUnits: 15000 },
		],
		netTotalMinorUnits: 36000,
		vatTotalMinorUnits: 5040,
		grossTotalMinorUnits: 41040,
		vatBreakdown: [
			{ vatRate: 24, netMinorUnits: 21000, vatMinorUnits: 5040, grossMinorUnits: 26040 },
			{ vatRate: 0, netMinorUnits: 15000, vatMinorUnits: 0, grossMinorUnits: 15000 },
		],
	})
})
