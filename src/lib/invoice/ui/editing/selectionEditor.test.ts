import {
	createDefaultEditableInvoiceDocumentSelection,
	encodeShareableInvoiceUrl,
	type EditableInvoiceDocumentSelection,
} from '../..'
import {
	canUsePaymentArtifactAction,
	createEditableInvoiceDocumentSelectionFromUrl,
	createShareableInvoiceUrl,
	selectLayoutVariant,
} from './selectionEditor'

declare const expect: (actual: unknown) => {
	toBe: (expected: unknown) => void
	toEqual: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('coordinates editable Invoice Document Selection over Shareable Invoice URLs', () => {
	const restoredSelection = validSelection()
	const restoredUrl = encodeShareableInvoiceUrl('https://example.test/invoice', restoredSelection)

	expect(createEditableInvoiceDocumentSelectionFromUrl(restoredUrl)).toEqual(restoredSelection)

	const defaultSelection = createEditableInvoiceDocumentSelectionFromUrl(
		'https://example.test/invoice?invoiceNumber=OLD-FLAT'
	)
	expect(defaultSelection).toEqual(createDefaultEditableInvoiceDocumentSelection())

	const workInProgressSelection: EditableInvoiceDocumentSelection = {
		...restoredSelection,
		content: {
			...restoredSelection.content,
			identity: {
				invoiceNumber: '',
				invoiceDate: '',
				paymentTermDays: '',
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
	const shareableUrl = new URL(
		createShareableInvoiceUrl(
			'https://example.test/invoice?invoiceNumber=OLD-FLAT',
			workInProgressSelection
		)
	)

	expect([...shareableUrl.searchParams.keys()]).toEqual(['payload'])
	expect(createEditableInvoiceDocumentSelectionFromUrl(shareableUrl)).toEqual(
		workInProgressSelection
	)

	const internationalSelection = selectLayoutVariant(
		workInProgressSelection,
		'international-invoice'
	)

	expect(internationalSelection.content.paymentDetails).toEqual(
		workInProgressSelection.content.paymentDetails
	)
	expect(canUsePaymentArtifactAction(internationalSelection, 'finnish-bank-barcode')).toBe(false)
	expect(
		canUsePaymentArtifactAction(
			selectLayoutVariant(restoredSelection, 'finnish-bank-transfer'),
			'finnish-bank-barcode'
		)
	).toBe(true)
})

const validSelection = (): EditableInvoiceDocumentSelection => ({
	layoutVariantId: 'finnish-bank-transfer',
	currency: 'EUR',
	content: {
		identity: {
			invoiceNumber: 'INV-10',
			invoiceDate: '2026-05-17',
			paymentTermDays: '14',
		},
		seller: {
			name: 'Nordic Seller Oy',
			postalAddress: {
				addressLine1: 'Seller Street 1',
				addressLine2: '00100 Helsinki',
				country: 'Finland',
			},
			identifiers: [],
			contactDetails: {
				phone: '',
				email: '',
				website: '',
			},
		},
		buyer: {
			name: 'Helsinki Buyer Oy',
			postalAddress: {
				addressLine1: 'Buyer Road 2',
				addressLine2: '00500 Helsinki',
				country: 'Finland',
			},
			identifiers: [],
			contactDetails: {
				phone: '',
				email: '',
				website: '',
			},
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
			iban: 'FI21 1234 5600 0007 85',
			swiftBic: 'NDEAFIHH',
			bankName: 'Nordea',
			bankAddress: {
				addressLine1: 'Bank Street 3',
				addressLine2: '00020 NORDEA',
				country: 'Finland',
			},
			paymentReference: '12344',
		},
		note: '',
	},
})
