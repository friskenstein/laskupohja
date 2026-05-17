export type LocalDate = string

export type CurrencyCode = string

export type LayoutVariantId = 'finnish-bank-transfer' | 'international-invoice'

export type PaymentCapability = 'bank-transfer' | 'finnish-bank-barcode'

export type PartyIdentifier = {
	label: string
	value: string
}

export type PostalAddress = {
	addressLine1: string
	addressLine2: string
	country: string
}

export type ContactDetails = {
	phone: string
	email: string
	website: string
}

export type Party = {
	name: string
	postalAddress: PostalAddress
	identifiers: PartyIdentifier[]
	contactDetails: ContactDetails
}

export type InvoiceIdentity = {
	invoiceNumber: string
	invoiceDate: LocalDate
	paymentTermDays: number
}

export type EditableInvoiceIdentity = {
	invoiceNumber: string
	invoiceDate: string
	paymentTermDays: string
}

export type InvoiceLine = {
	description: string
	quantity: number
	unit: string
	unitPriceMinorUnits: number
	vatRate: number
}

export type EditableInvoiceLine = {
	description: string
	quantity: string
	unit: string
	unitPrice: string
	vatRate: string
}

export type PaymentDetails = {
	iban: string
	swiftBic: string
	bankName: string
	bankAddress: PostalAddress
	paymentReference: string
}

export type InvoiceContent = {
	identity: InvoiceIdentity
	seller: Party
	buyer: Party
	lines: InvoiceLine[]
	paymentDetails: PaymentDetails
	note: string
}

export type EditableInvoiceContent = {
	identity: EditableInvoiceIdentity
	seller: Party
	buyer: Party
	lines: EditableInvoiceLine[]
	paymentDetails: PaymentDetails
	note: string
}

export type InvoiceDocumentSelection = {
	content: InvoiceContent
	layoutVariantId: LayoutVariantId
	currency: CurrencyCode
}

export type EditableInvoiceDocumentSelection = {
	content: EditableInvoiceContent
	layoutVariantId: LayoutVariantId
	currency: CurrencyCode
}
