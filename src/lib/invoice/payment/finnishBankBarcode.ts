import { formatFinnishBankBarcodeDate } from '../calculation/dates'
import { isValidFinnishReferenceNumber } from './references/finnishReference'

export type FinnishBankBarcodeV4PaymentData = {
	iban: string
	amountMinorUnits: number
	dueDate: string
	finnishReferenceNumber: string
}

export type FinnishBankBarcodeIssue = {
	code: string
	path: keyof FinnishBankBarcodeV4PaymentData
	message: string
}

export type FinnishBankBarcodePayloadResult =
	| { ok: true; payload: string }
	| { ok: false; issues: FinnishBankBarcodeIssue[] }

export class FinnishBankBarcodePayloadError extends Error {
	constructor(readonly issues: FinnishBankBarcodeIssue[]) {
		super('Finnish Bank Barcode v4 payment data is invalid.')
		this.name = 'FinnishBankBarcodePayloadError'
	}
}

export const createFinnishBankBarcodeV4Payload = (
	paymentData: FinnishBankBarcodeV4PaymentData
): FinnishBankBarcodePayloadResult => {
	const issues = validateFinnishBankBarcodeV4PaymentData(paymentData)

	if (issues.length > 0) {
		return { ok: false, issues }
	}

	return { ok: true, payload: buildFinnishBankBarcodeV4Payload(paymentData) }
}

export const generateFinnishBankBarcodeV4Payload = (
	paymentData: FinnishBankBarcodeV4PaymentData
): string => {
	const issues = validateFinnishBankBarcodeV4PaymentData(paymentData)

	if (issues.length > 0) {
		throw new FinnishBankBarcodePayloadError(issues)
	}

	return buildFinnishBankBarcodeV4Payload(paymentData)
}

const buildFinnishBankBarcodeV4Payload = (paymentData: FinnishBankBarcodeV4PaymentData): string => {
	return [
		'4',
		normalizeFinnishIban(paymentData.iban).slice(2),
		paymentData.amountMinorUnits.toString().padStart(8, '0'),
		'000',
		paymentData.finnishReferenceNumber.replaceAll(/\s/g, '').padStart(20, '0'),
		formatFinnishBankBarcodeDate(paymentData.dueDate),
	].join('')
}

export const validateFinnishBankBarcodeV4PaymentData = (
	paymentData: FinnishBankBarcodeV4PaymentData
): FinnishBankBarcodeIssue[] => {
	const issues: FinnishBankBarcodeIssue[] = []

	if (!isValidFinnishIban(paymentData.iban)) {
		issues.push({
			code: 'finnish-bank-barcode-iban-invalid',
			path: 'iban',
			message: 'Finnish Bank Barcode v4 requires a Finnish IBAN.',
		})
	}

	if (
		!Number.isInteger(paymentData.amountMinorUnits) ||
		paymentData.amountMinorUnits <= 0 ||
		paymentData.amountMinorUnits > 99999999
	) {
		issues.push({
			code: 'finnish-bank-barcode-amount-positive-required',
			path: 'amountMinorUnits',
			message: 'Finnish Bank Barcode v4 requires a positive payable amount.',
		})
	}

	if (!isValidFinnishBankBarcodeDueDate(paymentData.dueDate)) {
		issues.push({
			code: 'finnish-bank-barcode-due-date-invalid',
			path: 'dueDate',
			message: 'Finnish Bank Barcode v4 requires a valid due date.',
		})
	}

	if (!isValidFinnishReferenceNumber(paymentData.finnishReferenceNumber)) {
		issues.push({
			code: 'finnish-bank-barcode-reference-invalid',
			path: 'finnishReferenceNumber',
			message: 'Finnish Bank Barcode v4 requires a valid Finnish Reference Number.',
		})
	}

	return issues
}

const normalizeFinnishIban = (iban: string): string => iban.replaceAll(/\s/g, '').toUpperCase()

const isValidFinnishIban = (iban: string): boolean => {
	const normalized = normalizeFinnishIban(iban)

	return /^FI\d{16}$/.test(normalized) && ibanChecksumRemainder(normalized) === 1
}

const ibanChecksumRemainder = (iban: string): number => {
	const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`
	let remainder = 0

	for (const character of rearranged) {
		const value = /[A-Z]/.test(character) ? String(character.charCodeAt(0) - 55) : character

		for (const digit of value) {
			remainder = (remainder * 10 + Number(digit)) % 97
		}
	}

	return remainder
}

const isValidFinnishBankBarcodeDueDate = (dueDate: string): boolean => {
	try {
		formatFinnishBankBarcodeDate(dueDate)
		return true
	} catch {
		return false
	}
}
