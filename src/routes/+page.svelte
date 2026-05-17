<script lang="ts">
	import { page } from '$app/stores'
	import Header from '../components/Header.svelte'
	import ItemBreakdown from '../components/ItemBreakdown.svelte'
	import PaymentDetails from '../components/PaymentDetails.svelte'
	import { pushState } from '$app/navigation'
	import type { State } from '../types/state'
	import type { Item } from '../types/item'
	import { onMount } from 'svelte'
	import JsBarcode from 'jsbarcode'
	import { v4 } from '$lib/bankBarcode'
	import FinnishBankTransferDocument from '$lib/invoice/layouts/finnish-bank-transfer/Document.svelte'
	import InternationalInvoiceDocument from '$lib/invoice/layouts/international-invoice/Document.svelte'
	import {
		decodeShareableInvoiceUrl,
		validateInvoiceDocumentSelection,
		type EditableInvoiceDocumentSelection,
	} from '$lib/invoice'

	const decodedSelection = decodeShareableInvoiceUrl($page.url)
	const invoiceDocumentSelection: EditableInvoiceDocumentSelection | null = decodedSelection.ok
		? decodedSelection.selection
		: null
	const invoiceDocumentValidation = invoiceDocumentSelection
		? validateInvoiceDocumentSelection(invoiceDocumentSelection)
		: null
	const invoiceDocumentWarnings = invoiceDocumentValidation?.printReadiness.warnings ?? []
	const canCopyFinnishBankBarcode =
		invoiceDocumentSelection?.layoutVariantId === 'finnish-bank-transfer' &&
		invoiceDocumentValidation?.paymentArtifactReadiness['finnish-bank-barcode']?.ready === true

	const copyRenderedFinnishBankBarcode = () => {
		const payload = document
			.querySelector('[data-finnish-bank-barcode-payload]')
			?.getAttribute('data-finnish-bank-barcode-payload')

		if (payload) {
			navigator.clipboard.writeText(payload)
		}
	}

	let today = new Date()
	let todayLocalDate = [
		today.getFullYear(),
		(today.getMonth() + 1).toString().padStart(2, '0'),
		today.getDate().toString().padStart(2, '0'),
	].join('-')

	let state: State = {
		invoiceNumber: $page.url.searchParams.get('invoiceNumber') ?? '',
		reference: $page.url.searchParams.get('reference') ?? '100',
		invoiceDate: todayLocalDate,
		dueDays: $page.url.searchParams.get('dueDays') ?? '14', // NOTE: invoiceDate + dueDays = dueDate
		note: $page.url.searchParams.get('note') ?? '',
		iban: $page.url.searchParams.get('iban') ?? 'FI00 0000 0000 0000 00',
		swiftBic: $page.url.searchParams.get('swiftBic') ?? '',

		payerName: $page.url.searchParams.get('payerName') ?? '',
		payerAddress1: $page.url.searchParams.get('payerAddress1') ?? '',
		payerAddress2: $page.url.searchParams.get('payerAddress2') ?? '',
		payerCountry: $page.url.searchParams.get('payerCountry') ?? '',
		payerVat: $page.url.searchParams.get('payerVat') ?? '',

		companyName: $page.url.searchParams.get('companyName') ?? '',
		companyAddress1: $page.url.searchParams.get('companyAddress1') ?? '',
		companyAddress2: $page.url.searchParams.get('companyAddress2') ?? '',
		companyCountry: $page.url.searchParams.get('companyCountry') ?? '',
		companyYtunnus: $page.url.searchParams.get('companyYtunnus') ?? '',
		companyVat: $page.url.searchParams.get('companyVat') ?? '',
		companyPhone: $page.url.searchParams.get('companyPhone') ?? '',
		companyEmail: $page.url.searchParams.get('companyEmail') ?? '',
		companyWww: $page.url.searchParams.get('companyWww') ?? '',

		bankName: $page.url.searchParams.get('bankName') ?? '',
		bankAddress1: $page.url.searchParams.get('bankAddress1') ?? '',
		bankAddress2: $page.url.searchParams.get('bankAddress2') ?? '',
	}

	let items: Item[] = JSON.parse(
		$page.url.searchParams.get('items') ?? '[["Esimerkki tuote tai palvelu",1,"kpl",9.99,24]]'
	)
	let lang = 'fi'

	let currency = 'EUR'

	let mounted = false
	onMount(() => (mounted = true))

	// BUG:
	$: barcode = v4(state, items)
	$: {
		if (mounted && !invoiceDocumentSelection) {
			JsBarcode('#barcode', barcode, {
				format: 'CODE128',
				displayValue: false,
				marginRight: 40,
			})
		}
	}
</script>

{#if invoiceDocumentSelection}
	{#if canCopyFinnishBankBarcode}
		<header class="flex flex-row justify-center p-4 print:hidden">
			<button
				class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
				on:click={copyRenderedFinnishBankBarcode}
			>
				Kopioi virtuaaliviivakoodi
			</button>
		</header>
	{/if}
	<main class="flex flex-col items-center print:h-screen">
		{#if invoiceDocumentSelection.layoutVariantId === 'finnish-bank-transfer'}
			<FinnishBankTransferDocument
				selection={invoiceDocumentSelection}
				warnings={invoiceDocumentWarnings}
			/>
		{:else}
			<InternationalInvoiceDocument
				selection={invoiceDocumentSelection}
				warnings={invoiceDocumentWarnings}
			/>
		{/if}
	</main>
{:else}
	<header class="flex flex-row justify-center p-4 print:hidden">
		<select
			class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
			bind:value={lang}
		>
			<option value="fi" class="">Suomi</option>
			<option value="en" class="">EU / 🌐</option>
		</select>

		<select
			class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
			bind:value={currency}
		>
			<option value="EUR" class="">EUR</option>
			<option value="USD" class="">USD</option>
			<option value="SEK" class="">SEK</option>
		</select>

		<button
			class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
			on:click={() => {
				// take all the fields of data and update the current URL
				let url = new URL(window.location.href)
				for (const [key, value] of Object.entries(state)) {
					url.searchParams.set(key, value ?? '')
				}
				url.searchParams.set('items', JSON.stringify(items))
				// set the URL without reloading the page
				pushState(url.toString(), {})
			}}
		>
			Päivitä URL
		</button>

		{#if lang === 'fi'}
			<button
				class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
				on:click={() => {
					navigator.clipboard.writeText(barcode)
				}}
			>
				Kopioi virtuaaliviivakoodi
			</button>
		{/if}
	</header>

	<main class="flex flex-col items-center print:h-screen">
		<article class="flex h-full w-full max-w-5xl flex-col justify-between print:max-w-none">
			<Header bind:state {lang} />
			<ItemBreakdown bind:state bind:items {lang} {currency} />
			<PaymentDetails bind:state {items} {lang} />
		</article>
	</main>
{/if}
