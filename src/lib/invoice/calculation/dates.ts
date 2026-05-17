import type { LocalDate } from '../domain/types'

const localDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

export function calculateDueDate(invoiceDate: LocalDate, paymentTermDays: number): LocalDate {
	const { year, month, day } = parseLocalDate(invoiceDate)
	const dueDate = new Date(Date.UTC(year, month - 1, day + paymentTermDays))

	return dueDate.toISOString().slice(0, 10)
}

export function tryCalculateDueDate(
	invoiceDate: string,
	paymentTermDays: string
): LocalDate | null {
	const parsedPaymentTermDays = Number(paymentTermDays)

	if (!Number.isInteger(parsedPaymentTermDays)) {
		return null
	}

	try {
		return calculateDueDate(invoiceDate, parsedPaymentTermDays)
	} catch {
		return null
	}
}

export function formatLocalDate(localDate: LocalDate, locale: string): string {
	const { year, month, day } = parseLocalDate(localDate)
	const date = new Date(Date.UTC(year, month - 1, day))

	return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(date)
}

export function formatFinnishBankBarcodeDate(localDate: LocalDate): string {
	const { year, month, day } = parseLocalDate(localDate)

	return [
		year.toString().slice(-2),
		month.toString().padStart(2, '0'),
		day.toString().padStart(2, '0'),
	].join('')
}

function parseLocalDate(localDate: LocalDate) {
	const match = localDatePattern.exec(localDate)

	if (!match) {
		throw new Error(`Invalid Local Date: ${localDate}`)
	}

	const [, year, month, day] = match
	const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
	const normalizedLocalDate = date.toISOString().slice(0, 10)

	if (normalizedLocalDate !== localDate) {
		throw new Error(`Invalid Local Date: ${localDate}`)
	}

	return {
		year: Number(year),
		month: Number(month),
		day: Number(day),
	}
}
