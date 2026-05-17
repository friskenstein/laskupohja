<script lang="ts">
	import { fmtMoney } from '$lib/fmtMoney'
	import { calculateDueDate } from '$lib/dueDate'
	import type { Item } from '../types/item'
	import type { State } from '../types/state'
	import { refChecksum } from '$lib/refChecksum'

	export let state: State
	export let items: Item[]

	const IBAN_FMT = 'FI(\\d{16}|\\d{2} \\d{4} \\d{4} \\d{4} \\d{2})'
</script>

<section>
	<table class="w-full border-t-2 border-neutral-700 text-sm">
		<tbody>
			<tr>
				<td>Yritys</td>
				<td><input class="bg-yellow-200 print:bg-white" bind:value={state.companyName} /></td>
				<td>Puh.</td>
				<td><input class="w-60 bg-yellow-200 print:bg-white" bind:value={state.companyPhone} /></td>
			</tr>
			<tr>
				<td>Osoite</td>
				<td>
					<input class="bg-yellow-200 print:hidden" bind:value={state.companyAddress1} />
					<input class="bg-yellow-200 print:hidden" bind:value={state.companyAddress2} />
					<span class="hidden print:inline">{state.companyAddress1}, {state.companyAddress2}</span>
				</td>
				<td>Sähköposti</td>
				<td><input class="w-60 bg-yellow-200 print:bg-white" bind:value={state.companyEmail} /></td>
			</tr>
			<tr>
				<td>Y-tunnus</td>
				<td><input class="bg-yellow-200 print:bg-white" bind:value={state.companyYtunnus} /></td>
				<td>www</td>
				<td><input class="w-60 bg-yellow-200 print:bg-white" bind:value={state.companyWww} /></td>
			</tr>
		</tbody>
	</table>

	<table class="w-full border-t-2 border-dashed border-neutral-700 leading-5">
		<tbody>
			<tr>
				<td
					class="w-1/12 border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs"
				>
					Saajan
					<br />
					tilinumero
					<br />
					Mottagarens
					<br />
					kontonummer
				</td>
				<td class="w-6/12 border-b-2 border-r-2 border-neutral-700 p-1 align-top">
					IBAN
					<br />
					<input
						type="text"
						class="w-52 bg-yellow-200 invalid:bg-red-300 print:bg-white"
						pattern={IBAN_FMT}
						required
						bind:value={state.iban}
					/>
				</td>
				<td class="w-5/12 border-b-2 border-neutral-700 p-1 align-top" colspan="4">
					SWIFT/BIC
					<br />
					<input class="bg-yellow-200 print:bg-white" bind:value={state.swiftBic} />
				</td>
			</tr>
			<tr>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs">
					Saaja
					<br />
					Mottagare
				</td>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1 align-top">
					{state.companyName}
					<br />
					{state.companyAddress1}
					<br />
					{state.companyAddress2}
				</td>
				<td class="border-b-2 border-neutral-700 p-1" colspan="4" rowspan="2">
					<br />
					<br />
					<br />
					<!-- this is how legends code -->
					<br />
					<br />
					<br />
					<br />
				</td>
			</tr>
			<tr>
				<td
					class="whitespace-nowrap border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs"
					rowspan="2"
				>
					Maksajan nimi
					<br />
					ja osoite
					<br />
					Betalarens namn
					<br />
					och adress
					<br />
					<br />
					<br />
					Allekirjoitus
					<br />
					Underskrift
				</td>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1 align-top" rowspan="2">
					<input class="w-80 bg-yellow-200 print:bg-white" bind:value={state.payerName} />
					<br />
					<input class="w-80 bg-yellow-200 print:bg-white" bind:value={state.payerAddress1} />
					<br />
					<input class="w-80 bg-yellow-200 print:bg-white" bind:value={state.payerAddress2} />
					<br />
					<br />
					<br />
					<br />
					<hr class="border border-neutral-700" />
				</td>
				<td class="p-1" colspan="4"></td>
			</tr>
			<tr>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-xs">
					Viitenro
					<br />
					Ref.nr
				</td>
				<td class="border-b-2 border-neutral-700 p-1" colspan="3">
					<input
						type="text"
						class="w-52 bg-yellow-200 invalid:bg-red-300 print:hidden"
						bind:value={state.reference}
						required
						pattern={'[1-9]\\d{2,18}'}
					/>
					<span class="print:hidden">{refChecksum(state.reference)}</span>
					<span class="hidden print:inline">{state.reference}{refChecksum(state.reference)}</span>
				</td>
			</tr>
			<tr>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-right text-xs">
					Tililtä nro
					<br />
					Från konto nr
				</td>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1"></td>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-xs">
					Eräpäivä
					<br />
					Förf.dag
				</td>
				<td class="border-b-2 border-r-2 border-neutral-700 p-1">{calculateDueDate(state)}</td>
				<td class="border-b-2 border-neutral-700 p-1 align-top text-xs">Euro</td>
				<td class="border-b-2 border-neutral-700 p-1">
					{fmtMoney(
						items.reduce((acc, item) => acc + item[1] * item[3] * (item[4] * 0.01 + 1), 0),
						'EUR'
					).replace('€', '')}
				</td>
			</tr>
		</tbody>
	</table>

	<div class="flex flex-row items-center">
		<svg id="barcode" class="w-7/12"></svg>
		<p class="w-5/12 text-xs">
			Maksu välitetään saajalle maksujenvälityksen ehtojen mukaisesti ja vain maksajan ilmoittaman
			tilinumeron perusteella.
			<br />
			Betalningen förmedlas till mottagaren enligt villkoren för betalningsförmedling och endast till
			det kontonummer som betalaren angivit.
		</p>
	</div>
</section>
