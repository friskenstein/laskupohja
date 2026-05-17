import {
	createDefaultEditableInvoiceDocumentSelection,
	validateInvoiceDocumentSelection,
	validateLayoutRequirements,
	validateContentRules,
	type EditableInvoiceContent,
	type EditableInvoiceDocumentSelection,
} from '..'

declare const expect: (actual: unknown) => {
	toEqual: (expected: unknown) => void
	toBe: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('validates shared Content Rules independently of selected Layout Variant', () => {
	const content: EditableInvoiceContent = createDefaultEditableInvoiceDocumentSelection().content

	expect(validateContentRules(content)).toEqual([
		{
			code: 'invoice-number-required',
			path: 'identity.invoiceNumber',
			message: 'Invoice number is required.',
		},
		{
			code: 'invoice-date-required',
			path: 'identity.invoiceDate',
			message: 'Invoice date is required.',
		},
		{
			code: 'seller-name-required',
			path: 'seller.name',
			message: 'Seller name is required.',
		},
		{
			code: 'buyer-name-required',
			path: 'buyer.name',
			message: 'Buyer name is required.',
		},
		{
			code: 'line-description-required',
			path: 'lines[0].description',
			message: 'Invoice line description is required.',
		},
		{
			code: 'line-unit-required',
			path: 'lines[0].unit',
			message: 'Invoice line unit is required.',
		},
		{
			code: 'line-unit-price-required',
			path: 'lines[0].unitPrice',
			message: 'Invoice line unit price is required.',
		},
	])
})

test('validates editable invoice dates, payment terms, and invoice line numbers as Content Rules', () => {
	const selection = createValidEditableInvoiceDocumentSelection()

	expect(
		validateContentRules({
			...selection.content,
			identity: {
				invoiceNumber: '2024-001',
				invoiceDate: '2024-02-31',
				paymentTermDays: '-1',
			},
			lines: [
				{
					description: 'Consulting',
					quantity: '0',
					unit: 'h',
					unitPrice: '10.123',
					vatRate: '-24',
				},
			],
		})
	).toEqual([
		{
			code: 'invoice-date-invalid',
			path: 'identity.invoiceDate',
			message: 'Invoice date must be a valid local date.',
		},
		{
			code: 'payment-term-invalid',
			path: 'identity.paymentTermDays',
			message: 'Payment term must be a non-negative whole number of days.',
		},
		{
			code: 'line-quantity-invalid',
			path: 'lines[0].quantity',
			message: 'Invoice line quantity must be greater than zero.',
		},
		{
			code: 'line-unit-price-invalid',
			path: 'lines[0].unitPrice',
			message: 'Invoice line unit price must be a valid monetary amount.',
		},
		{
			code: 'line-vat-rate-invalid',
			path: 'lines[0].vatRate',
			message: 'Invoice line VAT rate must be zero or greater.',
		},
	])
})

test('validates Finnish and international Layout Requirements separately', () => {
	const selection = createValidEditableInvoiceDocumentSelection()
	const paymentDetailsWithoutReference = {
		...selection.content.paymentDetails,
		paymentReference: '',
	}

	expect(
		validateLayoutRequirements({
			...selection,
			layoutVariantId: 'finnish-bank-transfer',
			content: {
				...selection.content,
				paymentDetails: paymentDetailsWithoutReference,
			},
		})
	).toEqual([
		{
			code: 'finnish-reference-required',
			path: 'paymentDetails.paymentReference',
			message: 'Finnish bank transfer requires a Finnish reference number.',
		},
	])

	expect(
		validateLayoutRequirements({
			...selection,
			layoutVariantId: 'international-invoice',
			content: {
				...selection.content,
				paymentDetails: paymentDetailsWithoutReference,
			},
		})
	).toEqual([])

	const paymentDetailsWithoutInternationalBankInformation = {
		...selection.content.paymentDetails,
		swiftBic: '',
		bankName: '',
	}

	expect(
		validateLayoutRequirements({
			...selection,
			layoutVariantId: 'finnish-bank-transfer',
			content: {
				...selection.content,
				paymentDetails: paymentDetailsWithoutInternationalBankInformation,
			},
		})
	).toEqual([])

	expect(
		validateLayoutRequirements({
			...selection,
			layoutVariantId: 'international-invoice',
			content: {
				...selection.content,
				paymentDetails: paymentDetailsWithoutInternationalBankInformation,
			},
		})
	).toEqual([
		{
			code: 'swift-bic-required',
			path: 'paymentDetails.swiftBic',
			message: 'International invoice requires a SWIFT/BIC.',
		},
		{
			code: 'bank-name-required',
			path: 'paymentDetails.bankName',
			message: 'International invoice requires a bank name.',
		},
	])
})

test('keeps print readiness permissive while Finnish Bank Barcode readiness requires valid payment data', () => {
	const incompleteSelection = createDefaultEditableInvoiceDocumentSelection()

	expect(validateInvoiceDocumentSelection(incompleteSelection).printReadiness.canRender).toBe(true)

	expect(
		validateInvoiceDocumentSelection({
			...createValidEditableInvoiceDocumentSelection(),
			content: {
				...createValidEditableInvoiceDocumentSelection().content,
				paymentDetails: {
					...createValidEditableInvoiceDocumentSelection().content.paymentDetails,
					paymentReference: '12345',
				},
			},
		}).paymentArtifactReadiness['finnish-bank-barcode']
	).toEqual({
		ready: false,
		issues: [
			{
				code: 'finnish-reference-invalid',
				path: 'paymentDetails.paymentReference',
				message: 'Finnish Bank Barcode requires a valid Finnish reference number.',
			},
		],
	})

	expect(
		validateInvoiceDocumentSelection(createValidEditableInvoiceDocumentSelection())
			.paymentArtifactReadiness['finnish-bank-barcode']
	).toEqual({
		ready: true,
		issues: [],
	})
})

const createValidEditableInvoiceDocumentSelection = (): EditableInvoiceDocumentSelection => ({
	...createDefaultEditableInvoiceDocumentSelection(),
	content: {
		...createDefaultEditableInvoiceDocumentSelection().content,
		identity: {
			invoiceNumber: '2024-001',
			invoiceDate: '2024-04-01',
			paymentTermDays: '14',
		},
		seller: {
			...createDefaultEditableInvoiceDocumentSelection().content.seller,
			name: 'Seller Ltd',
		},
		buyer: {
			...createDefaultEditableInvoiceDocumentSelection().content.buyer,
			name: 'Buyer Ltd',
		},
		lines: [
			{
				description: 'Consulting',
				quantity: '2',
				unit: 'h',
				unitPrice: '100.00',
				vatRate: '24',
			},
		],
		paymentDetails: {
			...createDefaultEditableInvoiceDocumentSelection().content.paymentDetails,
			iban: 'FI21 1234 5600 0007 85',
			swiftBic: 'NDEAFIHH',
			bankName: 'Nordea',
			paymentReference: '12344',
		},
	},
})
