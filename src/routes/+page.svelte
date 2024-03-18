<script lang="ts">
	import { page } from '$app/stores'
	import HeaderFin from '../components/HeaderFin.svelte'
	import ItemBreakdown from '../components/ItemBreakdown.svelte'
	import PaymentDetailsFin from '../components/PaymentDetailsFin.svelte'
	import { pushState } from '$app/navigation'
	import type { State } from '../types/state'
	import type { Item } from '../types/item'

	let today = new Date()

	let state: State = {
		invoiceNumber: $page.url.searchParams.get('invoiceNumber') ?? '',
		reference: $page.url.searchParams.get('reference') ?? '100',
		invoiceDate: today.toISOString().slice(0, 10) ?? '',
		dueDays: $page.url.searchParams.get('dueDays') ?? '14', // NOTE: invoiceDate + dueDays = dueDate
		note: $page.url.searchParams.get('note') ?? '',
		iban: $page.url.searchParams.get('iban') ?? '',
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
	}

	let items: Item[] = JSON.parse(
		$page.url.searchParams.get('items') ?? '[["Esimerkki tuote tai palvelu",1,"kpl",9.99,24]]'
	)
	let lang = 'fi'
</script>

<header class="flex flex-row justify-center p-4 print:hidden">
	<select
		class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
		bind:value={lang}
	>
		<option value="fi" class="">Suomi</option>
		<option value="en" class="">EU / 🌐</option>
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
</header>

<main class="flex flex-col items-center print:h-screen">
	<article class="flex h-full w-full max-w-5xl flex-col justify-between print:max-w-none">
		<HeaderFin bind:state />
		<ItemBreakdown bind:state bind:items />
		<PaymentDetailsFin bind:state {items} />
	</article>
</main>
