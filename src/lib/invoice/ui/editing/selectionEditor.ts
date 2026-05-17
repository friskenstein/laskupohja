import {
	createDefaultEditableInvoiceDocumentSelection,
	decodeShareableInvoiceUrl,
	encodeShareableInvoiceUrl,
	calculateFinnishReferenceNumberChecksum,
	completeFinnishReferenceNumber,
	isValidFinnishReferenceNumber,
	normalizeFinnishReferenceNumber,
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

export const getFinnishReferenceBaseForEditing = (paymentReference: string): string => {
	const normalized = normalizeFinnishReferenceNumber(paymentReference)

	if (isValidFinnishReferenceNumber(normalized)) {
		return normalized.slice(0, -1)
	}

	return normalized
}

export const completeFinnishReferenceForEditing = (baseReference: string): string => {
	const normalized = normalizeFinnishReferenceNumber(baseReference)

	if (normalized === '' || !/^\d+$/.test(normalized)) {
		return normalized
	}

	return completeFinnishReferenceNumber(normalized)
}

export const getFinnishReferenceChecksumForEditing = (baseReference: string): string => {
	const normalized = normalizeFinnishReferenceNumber(baseReference)

	if (!/^\d+$/.test(normalized)) {
		return ''
	}

	return String(calculateFinnishReferenceNumberChecksum(normalized))
}
