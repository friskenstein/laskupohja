<script lang="ts">
	import type { State } from '../types/state'
	import type { Item } from '../types/item'
	import { fmtMoney } from '../lib/fmtMoney'

	export let state: State
	export let items: Item[]
	export let lang: string
	export let currency: string

</script>

<section>
	<textarea class="mx-2 my-8 bg-yellow-200 print:hidden" cols="80" bind:value={state.note} />
	<p class="hidden px-2 py-8 print:block">{@html state.note}</p>

	<table class="w-full">
		<tr class="bg-neutral-200 font-bold">
			<th class="w-2/12 p-2 text-left">{lang === 'fi' ? 'Kuvaus' : 'Description'}</th>
			<th class="w-2/12 text-right">{lang === 'fi' ? 'Määrä' : 'Qty'}</th>
			<th class="w-2/12 text-right">{lang === 'fi' ? 'Yksikkö' : 'Unit'}</th>
			<th class="w-2/12 text-right">{lang === 'fi' ? 'À-hinta' : 'Unit price'}</th>
			<th class="w-2/12 text-right">{lang === 'fi' ? 'Alv %' : 'VAT %'}</th>
			<th class="w-2/12 p-2 text-right">{lang === 'fi' ? 'Yhteensä' : 'Total'}</th>
		</tr>

		{#each items as item}
			<tr>
				<td class="flex flex-row p-2 text-left">
					<button
						on:click={() => {
							items = items.filter(i => i !== item)
						}}
						class="mr-4 rounded-md border px-1 print:hidden"
					>
						{lang === 'fi' ? 'Poista' : 'Remove'}
					</button>
					<input type="text" class="w-80" bind:value={item[0]} />
				</td>
				<td class="text-right">
					<input type="number" class="w-20 text-right print:hidden" bind:value={item[1]} />
					<span class="hidden print:inline">{item[1]}</span>
				</td>
				<td class="text-right">
					<input type="text" class="w-16 text-right print:hidden" bind:value={item[2]} />
					<span class="hidden print:inline">{item[2]}</span>
				</td>
				<td class="text-right">
					<input
						type="number"
						step="0.01"
						max="999999.99"
						class="w-28 text-right print:hidden"
						bind:value={item[3]}
					/>
					<!-- <span class="print:hidden">€</span> -->
					<span class="hidden print:inline">{fmtMoney(item[3], currency)}</span>
				</td>
				<td class="text-right">
					<input type="number" class="w-12 text-right print:hidden" bind:value={item[4]} />
					<span class="hidden print:inline">{item[4]}</span>
					%
				</td>
				<td class="p-2 text-right">{fmtMoney(item[1] * item[3] * (item[4] * 0.01 + 1), currency)}</td>
			</tr>
		{/each}

		<tr class="border-b border-neutral-200">
			<button
				class="m-2 rounded-md border px-1 print:hidden"
				on:click={() => (items = [...items, ['', 1, '', 0, 24]])}
			>
				{lang === 'fi' ? 'Lisää rivi' : 'Add row'}
			</button>
		</tr>

		<br />
		<br />

		<tr>
			<td colspan="2"></td>
			<td colspan="3" class="font-bold">{lang === 'fi' ? 'Yhteensä (alv 0%)' : 'Total excl. VAT'}</td>
			<td class="pr-2 pt-2 text-right font-bold">
				{fmtMoney(items.reduce((acc, item) => acc + item[1] * item[3], 0), currency)}
			</td>
		</tr>
		<tr>
			<td colspan="2"></td>
			<td colspan="3" class="font-bold">{lang === 'fi' ? 'Alv yhteensä' : 'Total VAT'}</td>
			<td class="pr-2 pt-2 text-right font-bold">
				{fmtMoney(items.reduce((acc, item) => acc + item[1] * item[3] * item[4] * 0.01, 0), currency)}
			</td>
		</tr>
		<tr>
			<td colspan="2"></td>
			<td colspan="2" class="border-t border-neutral-700 text-lg font-bold">{lang === 'fi' ? 'Maksettava yhteensä' : 'Total amount due'}</td>
			<td colspan="2" class="border-t border-neutral-700 p-2 text-right text-lg font-bold">
				{fmtMoney(items.reduce((acc, item) => acc + item[1] * item[3] * (item[4] * 0.01 + 1), 0), currency)}
			</td>
		</tr>
	</table>
</section>
