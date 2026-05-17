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

test('renders Finnish bank transfer Invoice Document from Invoice Document Selection', async () => {
	const selection: EditableInvoiceDocumentSelection = {
		layoutVariantId: 'finnish-bank-transfer',
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
				identifiers: [
					{ label: 'Y-tunnus', value: '1234567-8' },
					{ label: 'ALV nro', value: 'FI12345678' },
				],
				contactDetails: {
					phone: '+358 40 123 4567',
					email: 'billing@example.test',
					website: 'example.test',
				},
			},
			buyer: {
				name: 'Helsinki Buyer Oy',
				postalAddress: {
					addressLine1: 'Buyer Road 2',
					addressLine2: '00500 Helsinki',
					country: 'Finland',
				},
				identifiers: [{ label: 'ALV nro', value: 'FI87654321' }],
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
					description: 'VAT-free service',
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
				paymentReference: '12344',
			},
			note: 'Maksu tilisiirtona.',
		},
	}
	const warnings: ValidationIssue[] = [
		{
			code: 'buyer-email-missing',
			path: 'buyer.contactDetails.email',
			message: 'Buyer email is missing.',
		},
	]
	const FinnishBankTransferDocument = await compileServerComponent()

	const { body } = render(FinnishBankTransferDocument, { props: { selection, warnings } })

	expect(body).toContain('Lasku')
	expect(body).toContain('Laskun numero')
	expect(body).toContain('INV-2026-001')
	expect(body).toContain('17.5.2026')
	expect(body).toContain('31.5.2026')
	expect(body).toContain('Helsinki Buyer Oy')
	expect(body).toContain('Consulting')
	expect(body).toContain('Yhteensä (alv 0%)')
	expect(body).toContain('250,00')
	expect(body).toContain('Alv yhteensä')
	expect(body).toContain('48,00')
	expect(body).toContain('Alv 24 %')
	expect(body).toContain('Alv 0 %')
	expect(body).toContain('Maksettava yhteensä')
	expect(body).toContain('298,00')
	expect(body).toContain('Saajan')
	expect(body).toContain('tilinumero')
	expect(body).toContain('FI21 1234 5600 0007 85')
	expect(body).toContain('Viitenro')
	expect(body).toContain('12344')
	expect(body).toContain('data-finnish-bank-barcode-payload')
	expect(body).toContain('421123456000007850002980000000000000000000012344260531')
	expect(body).toContain('Buyer email is missing.')
	expect(body).not.toContain('Kopioi virtuaaliviivakoodi')
}, 20000)

test('renders Finnish bank transfer document without barcode payload when payment data is invalid', async () => {
	const selection: EditableInvoiceDocumentSelection = {
		layoutVariantId: 'finnish-bank-transfer',
		currency: 'EUR',
		content: {
			identity: {
				invoiceNumber: 'INV-2026-002',
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
				iban: 'not an iban',
				swiftBic: '',
				bankName: '',
				bankAddress: {
					addressLine1: '',
					addressLine2: '',
					country: '',
				},
				paymentReference: '12345',
			},
			note: '',
		},
	}
	const FinnishBankTransferDocument = await compileServerComponent()

	const { body } = render(FinnishBankTransferDocument, { props: { selection, warnings: [] } })

	expect(body).toContain('Lasku')
	expect(body).toContain('INV-2026-002')
	expect(body).toContain('not an iban')
	expect(body).not.toContain('data-finnish-bank-barcode-payload')
}, 20000)

const compileServerComponent = async () => {
	const source = await readFile(new URL('./Document.svelte', import.meta.url), 'utf8')
	const barcodeSvgSource = await readFile(
		new URL('../../ui/BarcodeSvg.svelte', import.meta.url),
		'utf8'
	)
	const invoiceIndexUrl = new URL('../../index.ts', import.meta.url).href
	const barcodeSvgCompiled = compile(barcodeSvgSource, {
		filename: 'BarcodeSvg.svelte',
		generate: 'server',
	}).js.code
	const barcodeSvgCompiledModuleUrl = new URL(`.barcode-svg-${Date.now()}.mjs`, import.meta.url)
	const compiled = compile(source, {
		filename: 'Document.svelte',
		generate: 'server',
	})
		.js.code.replace("from '../..'", `from ${JSON.stringify(invoiceIndexUrl)}`)
		.replace(
			"from '../../ui/BarcodeSvg.svelte'",
			`from ${JSON.stringify(barcodeSvgCompiledModuleUrl.href)}`
		)
	const compiledModuleUrl = new URL(
		`.finnish-bank-transfer-document-${Date.now()}.mjs`,
		import.meta.url
	)

	await writeFile(barcodeSvgCompiledModuleUrl, barcodeSvgCompiled)
	await writeFile(compiledModuleUrl, compiled)
	try {
		const module = await import(compiledModuleUrl.href)

		return module.default
	} finally {
		await unlink(compiledModuleUrl)
		await unlink(barcodeSvgCompiledModuleUrl)
	}
}
