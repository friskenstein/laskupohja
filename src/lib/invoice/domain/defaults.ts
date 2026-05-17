import type { EditableInvoiceDocumentSelection, Party, PaymentDetails } from './types'

const emptyPostalAddress = () => ({
	addressLine1: '',
	addressLine2: '',
	country: '',
})

const emptyContactDetails = () => ({
	phone: '',
	email: '',
	website: '',
})

const emptyParty = (): Party => ({
	name: '',
	postalAddress: emptyPostalAddress(),
	identifiers: [],
	contactDetails: emptyContactDetails(),
})

const emptyPaymentDetails = (): PaymentDetails => ({
	iban: '',
	swiftBic: '',
	bankName: '',
	bankAddress: emptyPostalAddress(),
	paymentReference: '',
})

export const createDefaultEditableInvoiceDocumentSelection =
	(): EditableInvoiceDocumentSelection => ({
		content: {
			identity: {
				invoiceNumber: '',
				invoiceDate: '',
				paymentTermDays: '14',
			},
			seller: emptyParty(),
			buyer: emptyParty(),
			lines: [
				{
					description: '',
					quantity: '1',
					unit: '',
					unitPrice: '',
					vatRate: '24',
				},
			],
			paymentDetails: emptyPaymentDetails(),
			note: '',
		},
		layoutVariantId: 'finnish-bank-transfer',
		currency: 'EUR',
	})
