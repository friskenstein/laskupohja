import {
	createDefaultEditableInvoiceDocumentSelection,
	decodeShareableInvoiceUrl,
	encodeShareableInvoiceUrl,
	validateInvoiceDocumentSelection,
	type EditableInvoiceDocumentSelection,
	type EditableInvoiceLine,
	type LayoutVariantId,
	type PaymentCapability,
} from '../..'

export const createEditableInvoiceDocumentSelectionFromUrl = (
	url: string | URL
): EditableInvoiceDocumentSelection => {
	const decodedSelection = decodeShareableInvoiceUrl(url)

	if (decodedSelection.ok) {
		return decodedSelection.selection
	}

	return createDefaultEditableInvoiceDocumentSelection()
}

export const createShareableInvoiceUrl = (
	baseUrl: string | URL,
	selection: EditableInvoiceDocumentSelection
): string => encodeShareableInvoiceUrl(baseUrl, selection)

export const selectLayoutVariant = (
	selection: EditableInvoiceDocumentSelection,
	layoutVariantId: LayoutVariantId
): EditableInvoiceDocumentSelection => ({
	...selection,
	layoutVariantId,
})

export const canUsePaymentArtifactAction = (
	selection: EditableInvoiceDocumentSelection,
	paymentCapability: PaymentCapability
): boolean =>
	validateInvoiceDocumentSelection(selection).paymentArtifactReadiness[paymentCapability]?.ready ===
	true

export const createEmptyInvoiceLine = (): EditableInvoiceLine => ({
	description: '',
	quantity: '1',
	unit: '',
	unitPrice: '',
	vatRate: '24',
})
