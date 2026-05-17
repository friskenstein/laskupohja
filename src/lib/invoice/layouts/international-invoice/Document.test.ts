import { render } from 'svelte/server'
import { compile } from 'svelte/compiler'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import type { EditableInvoiceDocumentSelection, ValidationIssue } from '../..'

declare const expect: (actual: unknown) => {
	toContain: (expected: unknown) => void
	not: {
		toContain: (expected: unknown) => void
	}
}
declare const test: (name: string, run: () => Promise<void>, timeout?: number) => void

test('renders international Invoice Document from Invoice Document Selection', async () => {
	const selection: EditableInvoiceDocumentSelection = {
		layoutVariantId: 'international-invoice',
		currency: 'EUR',
		content: {
			identity: {
				invoiceNumber: 'INV-2026-001',
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
				identifiers: [{ label: 'VAT no.', value: 'FI12345678' }],
				contactDetails: {
					phone: '+358 40 123 4567',
					email: 'billing@example.test',
					website: 'example.test',
				},
			},
			buyer: {
				name: 'Global Buyer Ltd',
				postalAddress: {
					addressLine1: 'Buyer Road 2',
					addressLine2: 'EC1A London',
					country: 'United Kingdom',
				},
				identifiers: [{ label: 'VAT no.', value: 'GB123456789' }],
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
				{
					description: 'Export service',
					quantity: '1',
					unit: 'project',
					unitPrice: '50.00',
					vatRate: '0',
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
				paymentReference: 'RF18539007547034',
			},
			note: 'Payment by bank transfer.',
		},
	}
	const warnings: ValidationIssue[] = [
		{
			code: 'buyer-email-missing',
			path: 'buyer.contactDetails.email',
			message: 'Buyer email is missing.',
		},
	]
	const InternationalInvoiceDocument = await compileServerComponent()

	const { body } = render(InternationalInvoiceDocument, { props: { selection, warnings } })

	expect(body).toContain('Invoice')
	expect(body).toContain('Invoice no.')
	expect(body).toContain('INV-2026-001')
	expect(body).toContain('5/17/2026')
	expect(body).toContain('5/31/2026')
	expect(body).toContain('Global Buyer Ltd')
	expect(body).toContain('Consulting')
	expect(body).toContain('Total excl. VAT')
	expect(body).toContain('€250.00')
	expect(body).toContain('Total VAT')
	expect(body).toContain('€48.00')
	expect(body).toContain('VAT 24 %')
	expect(body).toContain('VAT 0 %')
	expect(body).toContain('Total amount due')
	expect(body).toContain('€298.00')
	expect(body).toContain('Payment Details')
	expect(body).toContain('IBAN')
	expect(body).toContain('FI21 1234 5600 0007 85')
	expect(body).toContain('Swift/BIC')
	expect(body).toContain('NDEAFIHH')
	expect(body).toContain('Buyer email is missing.')
	expect(body).not.toContain('Kopioi virtuaaliviivakoodi')
	expect(body).not.toContain('barcode')
}, 20000)

const compileServerComponent = async () => {
	const source = await readFile(new URL('./Document.svelte', import.meta.url), 'utf8')
	const invoiceIndexUrl = new URL('../../index.ts', import.meta.url).href
	const compiled = compile(source, {
		filename: 'Document.svelte',
		generate: 'server',
	}).js.code.replace("from '../..'", `from ${JSON.stringify(invoiceIndexUrl)}`)
	const compiledModuleUrl = new URL(
		`.international-invoice-document-${Date.now()}.mjs`,
		import.meta.url
	)

	await writeFile(compiledModuleUrl, compiled)
	try {
		const module = await import(compiledModuleUrl.href)

		return module.default
	} finally {
		await unlink(compiledModuleUrl)
	}
}
