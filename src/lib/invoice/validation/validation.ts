import { parseEditableMoney } from '../calculation/money'
import { calculateInvoiceTotals } from '../calculation/totals'
import { tryCalculateDueDate } from '../calculation/dates'
import { refChecksum } from '../../refChecksum'
import type {
	EditableInvoiceContent,
	EditableInvoiceDocumentSelection,
	InvoiceLine,
	PaymentCapability,
} from '../domain/types'

export type ValidationIssue = {
	code: string
	path: string
	message: string
}

export type Readiness = {
	ready: boolean
	issues: ValidationIssue[]
}

export type PrintReadiness = {
	canRender: true
	warnings: ValidationIssue[]
}

export type InvoiceDocumentValidationResult = {
	contentIssues: ValidationIssue[]
	layoutIssues: ValidationIssue[]
	printReadiness: PrintReadiness
	paymentArtifactReadiness: Partial<Record<PaymentCapability, Readiness>>
}

export const validateContentRules = (content: EditableInvoiceContent): ValidationIssue[] => {
	const issues: ValidationIssue[] = []

	addRequiredIssue(issues, content.identity.invoiceNumber, {
		code: 'invoice-number-required',
		path: 'identity.invoiceNumber',
		message: 'Invoice number is required.',
	})

	if (isBlank(content.identity.invoiceDate)) {
		issues.push({
			code: 'invoice-date-required',
			path: 'identity.invoiceDate',
			message: 'Invoice date is required.',
		})
	} else if (!tryCalculateDueDate(content.identity.invoiceDate, '0')) {
		issues.push({
			code: 'invoice-date-invalid',
			path: 'identity.invoiceDate',
			message: 'Invoice date must be a valid local date.',
		})
	}

	if (!isNonNegativeInteger(content.identity.paymentTermDays)) {
		issues.push({
			code: 'payment-term-invalid',
			path: 'identity.paymentTermDays',
			message: 'Payment term must be a non-negative whole number of days.',
		})
	}

	addRequiredIssue(issues, content.seller.name, {
		code: 'seller-name-required',
		path: 'seller.name',
		message: 'Seller name is required.',
	})
	addRequiredIssue(issues, content.buyer.name, {
		code: 'buyer-name-required',
		path: 'buyer.name',
		message: 'Buyer name is required.',
	})

	if (content.lines.length === 0) {
		issues.push({
			code: 'invoice-line-required',
			path: 'lines',
			message: 'At least one invoice line is required.',
		})
	}

	for (const [index, line] of content.lines.entries()) {
		const path = `lines[${index}]`

		addRequiredIssue(issues, line.description, {
			code: 'line-description-required',
			path: `${path}.description`,
			message: 'Invoice line description is required.',
		})
		addRequiredIssue(issues, line.unit, {
			code: 'line-unit-required',
			path: `${path}.unit`,
			message: 'Invoice line unit is required.',
		})

		if (!isPositiveNumber(line.quantity)) {
			issues.push({
				code: 'line-quantity-invalid',
				path: `${path}.quantity`,
				message: 'Invoice line quantity must be greater than zero.',
			})
		}

		if (isBlank(line.unitPrice)) {
			issues.push({
				code: 'line-unit-price-required',
				path: `${path}.unitPrice`,
				message: 'Invoice line unit price is required.',
			})
		} else if (!parseEditableMoney(line.unitPrice).ok) {
			issues.push({
				code: 'line-unit-price-invalid',
				path: `${path}.unitPrice`,
				message: 'Invoice line unit price must be a valid monetary amount.',
			})
		}

		if (!isNonNegativeNumber(line.vatRate)) {
			issues.push({
				code: 'line-vat-rate-invalid',
				path: `${path}.vatRate`,
				message: 'Invoice line VAT rate must be zero or greater.',
			})
		}
	}

	return issues
}

export const validateLayoutRequirements = (
	selection: EditableInvoiceDocumentSelection
): ValidationIssue[] => {
	const { paymentDetails } = selection.content
	const issues: ValidationIssue[] = []

	addRequiredIssue(issues, paymentDetails.iban, {
		code: 'iban-required',
		path: 'paymentDetails.iban',
		message: 'Bank transfer requires an IBAN.',
	})

	if (selection.layoutVariantId === 'finnish-bank-transfer') {
		addRequiredIssue(issues, paymentDetails.paymentReference, {
			code: 'finnish-reference-required',
			path: 'paymentDetails.paymentReference',
			message: 'Finnish bank transfer requires a Finnish reference number.',
		})
	}

	if (selection.layoutVariantId === 'international-invoice') {
		addRequiredIssue(issues, paymentDetails.swiftBic, {
			code: 'swift-bic-required',
			path: 'paymentDetails.swiftBic',
			message: 'International invoice requires a SWIFT/BIC.',
		})
		addRequiredIssue(issues, paymentDetails.bankName, {
			code: 'bank-name-required',
			path: 'paymentDetails.bankName',
			message: 'International invoice requires a bank name.',
		})
	}

	return issues
}

export const validateInvoiceDocumentSelection = (
	selection: EditableInvoiceDocumentSelection
): InvoiceDocumentValidationResult => {
	const contentIssues = validateContentRules(selection.content)
	const layoutIssues = validateLayoutRequirements(selection)
	const warnings = [...contentIssues, ...layoutIssues]

	return {
		contentIssues,
		layoutIssues,
		printReadiness: {
			canRender: true,
			warnings,
		},
		paymentArtifactReadiness: paymentArtifactReadiness(selection),
	}
}

const paymentArtifactReadiness = (
	selection: EditableInvoiceDocumentSelection
): Partial<Record<PaymentCapability, Readiness>> => {
	if (selection.layoutVariantId !== 'finnish-bank-transfer') {
		return {
			'bank-transfer': readinessFromIssues(validateLayoutRequirements(selection)),
		}
	}

	return {
		'bank-transfer': readinessFromIssues(validateLayoutRequirements(selection)),
		'finnish-bank-barcode': readinessFromIssues(validateFinnishBankBarcodeRequirements(selection)),
	}
}

const validateFinnishBankBarcodeRequirements = (
	selection: EditableInvoiceDocumentSelection
): ValidationIssue[] => {
	const issues: ValidationIssue[] = []
	const { content } = selection
	const iban = normalizedIban(content.paymentDetails.iban)

	if (isBlank(content.paymentDetails.iban)) {
		issues.push({
			code: 'iban-required',
			path: 'paymentDetails.iban',
			message: 'Finnish Bank Barcode requires an IBAN.',
		})
	} else if (!/^FI\d{16}$/.test(iban)) {
		issues.push({
			code: 'finnish-iban-invalid',
			path: 'paymentDetails.iban',
			message: 'Finnish Bank Barcode requires a Finnish IBAN.',
		})
	}

	if (isBlank(content.paymentDetails.paymentReference)) {
		issues.push({
			code: 'finnish-reference-required',
			path: 'paymentDetails.paymentReference',
			message: 'Finnish Bank Barcode requires a Finnish reference number.',
		})
	} else if (!isValidFinnishReferenceNumber(content.paymentDetails.paymentReference)) {
		issues.push({
			code: 'finnish-reference-invalid',
			path: 'paymentDetails.paymentReference',
			message: 'Finnish Bank Barcode requires a valid Finnish reference number.',
		})
	}

	if (!tryCalculateDueDate(content.identity.invoiceDate, content.identity.paymentTermDays)) {
		issues.push({
			code: 'barcode-due-date-invalid',
			path: 'identity',
			message: 'Finnish Bank Barcode requires a valid due date.',
		})
	}

	const invoiceLines = parseInvoiceLines(content)

	if (!invoiceLines) {
		issues.push({
			code: 'barcode-amount-invalid',
			path: 'lines',
			message: 'Finnish Bank Barcode requires valid invoice line amounts.',
		})
	} else if (calculateInvoiceTotals(invoiceLines).grossTotalMinorUnits <= 0) {
		issues.push({
			code: 'barcode-amount-positive-required',
			path: 'lines',
			message: 'Finnish Bank Barcode requires a positive payable amount.',
		})
	}

	return issues
}

const addRequiredIssue = (issues: ValidationIssue[], value: string, issue: ValidationIssue) => {
	if (isBlank(value)) {
		issues.push(issue)
	}
}

const isBlank = (value: string): boolean => value.trim() === ''

const isNonNegativeInteger = (value: string): boolean => {
	if (isBlank(value)) {
		return false
	}

	const parsed = Number(value)

	return Number.isInteger(parsed) && parsed >= 0
}

const isPositiveNumber = (value: string): boolean => {
	if (isBlank(value)) {
		return false
	}

	const parsed = Number(value)

	return Number.isFinite(parsed) && parsed > 0
}

const isNonNegativeNumber = (value: string): boolean => {
	if (isBlank(value)) {
		return false
	}

	const parsed = Number(value)

	return Number.isFinite(parsed) && parsed >= 0
}

const readinessFromIssues = (issues: ValidationIssue[]): Readiness => ({
	ready: issues.length === 0,
	issues,
})

const normalizedIban = (iban: string): string => iban.replaceAll(/\s/g, '').toUpperCase()

const normalizedReference = (reference: string): string => reference.replaceAll(/\s/g, '')

const isValidFinnishReferenceNumber = (reference: string): boolean => {
	const normalized = normalizedReference(reference)

	if (!/^\d{4,20}$/.test(normalized)) {
		return false
	}

	const baseReference = normalized.slice(0, -1)
	const checksum = Number(normalized.at(-1))

	return refChecksum(baseReference) === checksum
}

const parseInvoiceLines = (content: EditableInvoiceContent): InvoiceLine[] | null => {
	const lines: InvoiceLine[] = []

	for (const line of content.lines) {
		const unitPrice = parseEditableMoney(line.unitPrice)
		const quantity = Number(line.quantity)
		const vatRate = Number(line.vatRate)

		if (!unitPrice.ok || !Number.isFinite(quantity) || !Number.isFinite(vatRate)) {
			return null
		}

		lines.push({
			description: line.description,
			quantity,
			unit: line.unit,
			unitPriceMinorUnits: unitPrice.minorUnits,
			vatRate,
		})
	}

	return lines
}
