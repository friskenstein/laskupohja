import {
	createDefaultEditableInvoiceDocumentSelection,
	type EditableInvoiceDocumentSelection,
	type CurrencyCode,
	getLayoutVariantMetadata,
	layoutVariantMetadata,
	type LayoutVariantId,
} from '..'

const defaultSelection: EditableInvoiceDocumentSelection =
	createDefaultEditableInvoiceDocumentSelection()

defaultSelection.content.identity.invoiceNumber satisfies string
defaultSelection.content.identity.invoiceDate satisfies string
defaultSelection.content.identity.paymentTermDays satisfies string
defaultSelection.content.seller.name satisfies string
defaultSelection.content.buyer.name satisfies string
defaultSelection.content.lines[0].unitPrice satisfies string
defaultSelection.content.paymentDetails.iban satisfies string
defaultSelection.content.note satisfies string
defaultSelection.currency satisfies CurrencyCode

const defaultLayoutVariant: LayoutVariantId = defaultSelection.layoutVariantId
getLayoutVariantMetadata(defaultLayoutVariant)

layoutVariantMetadata satisfies readonly [
	{ id: 'finnish-bank-transfer' },
	{ id: 'international-invoice' },
]
