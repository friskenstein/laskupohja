import {
	createDefaultEditableInvoiceDocumentSelection,
	decodeShareableInvoiceUrl,
	encodeShareableInvoiceUrl,
	type EditableInvoiceDocumentSelection,
} from '..'

declare const expect: (actual: unknown) => {
	toEqual: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('round-trips incomplete editable invoice document selections through one payload parameter', () => {
	const selection: EditableInvoiceDocumentSelection = {
		...createDefaultEditableInvoiceDocumentSelection(),
		layoutVariantId: 'international-invoice',
		currency: 'SEK',
		content: {
			...createDefaultEditableInvoiceDocumentSelection().content,
			identity: {
				invoiceNumber: '',
				invoiceDate: '',
				paymentTermDays: '',
			},
			seller: {
				...createDefaultEditableInvoiceDocumentSelection().content.seller,
				name: 'Seller Ltd',
			},
			lines: [
				{
					description: '',
					quantity: '',
					unit: '',
					unitPrice: '',
					vatRate: '',
				},
			],
		},
	}

	const url = new URL(encodeShareableInvoiceUrl('https://example.test/invoice?legacy=1', selection))

	expect([...url.searchParams.keys()]).toEqual(['payload'])
	expect(decodeShareableInvoiceUrl(url.toString())).toEqual({
		ok: true,
		selection,
	})
})

test('rejects unsupported payload versions before returning invoice state', () => {
	const url = shareableInvoiceUrlWithPayload({
		version: 2,
		selection: createDefaultEditableInvoiceDocumentSelection(),
	})

	expect(decodeShareableInvoiceUrl(url)).toEqual({
		ok: false,
		reason: 'unsupported-version',
	})
})

test('rejects structurally invalid invoice document selections', () => {
	const url = shareableInvoiceUrlWithPayload({
		version: 1,
		selection: {
			...createDefaultEditableInvoiceDocumentSelection(),
			content: {
				...createDefaultEditableInvoiceDocumentSelection().content,
				lines: [
					{
						description: 'Consulting',
						quantity: 1,
						unit: 'h',
						unitPrice: '100.00',
						vatRate: '24',
					},
				],
			},
		},
	})

	expect(decodeShareableInvoiceUrl(url)).toEqual({
		ok: false,
		reason: 'invalid-selection',
	})
})

test('rejects unsupported invoice currencies', () => {
	const url = shareableInvoiceUrlWithPayload({
		version: 1,
		selection: {
			...createDefaultEditableInvoiceDocumentSelection(),
			currency: 'INVALID',
		},
	})

	expect(decodeShareableInvoiceUrl(url)).toEqual({
		ok: false,
		reason: 'invalid-selection',
	})
})

test('does not support old flat invoice query parameters', () => {
	const oldFlatUrl =
		'https://example.test/invoice?invoiceNumber=123&layoutVariantId=finnish-bank-transfer&currency=EUR'

	expect(decodeShareableInvoiceUrl(oldFlatUrl)).toEqual({
		ok: false,
		reason: 'missing-payload',
	})
})

test('rejects malformed payload query data', () => {
	expect(decodeShareableInvoiceUrl('https://example.test/invoice?payload=not-json')).toEqual({
		ok: false,
		reason: 'malformed-payload',
	})
})

const shareableInvoiceUrlWithPayload = (payload: unknown): string => {
	const bytes = new TextEncoder().encode(JSON.stringify(payload))
	let binary = ''

	for (const byte of bytes) {
		binary += String.fromCharCode(byte)
	}

	const encodedPayload = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')

	return `https://example.test/invoice?payload=${encodedPayload}`
}
