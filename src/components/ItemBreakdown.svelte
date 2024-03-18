<script lang="ts">
	import type { State } from '../types/state'
	import type { Item } from '../types/item'
	import { fmtMoney } from '../lib/fmtMoney'

	export let state: State
	export let items: Item[]
</script>

<section>
	<textarea class="mx-2 my-8 bg-yellow-200 print:hidden" cols="80" bind:value={state.note} />
	<p class="hidden px-2 py-8 print:block">{@html state.note}</p>

	<table class="w-full">
		<tr class="bg-neutral-200 font-bold">
			<th class="w-2/12 p-2 text-left">Kuvaus</th>
			<th class="w-2/12 text-right">Määrä</th>
			<th class="w-2/12 text-right">Yksikkö</th>
			<th class="w-2/12 text-right">À-hinta</th>
			<th class="w-2/12 text-right">Alv %</th>
			<th class="w-2/12 p-2 text-right">Yhteensä</th>
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
						Poista
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
					<span class="print:hidden">€</span>
					<span class="hidden print:inline">{fmtMoney(item[3])}</span>
				</td>
				<td class="text-right">
					<input type="number" class="w-12 text-right print:hidden" bind:value={item[4]} />
					<span class="hidden print:inline">{item[4]}</span>
					%
				</td>
				<td class="p-2 text-right">{fmtMoney(item[1] * item[3] * (item[4] * 0.01 + 1))}</td>
			</tr>
		{/each}

		<tr class="border-b border-neutral-200">
			<button
				class="m-2 rounded-md border px-1 print:hidden"
				on:click={() => (items = [...items, ['', 1, '', 0, 24]])}
			>
				Lisää rivi
			</button>
		</tr>

		<br />
		<br />

		<tr>
			<td colspan="2"></td>
			<td colspan="3" class="font-bold">Yhteensä (alv 0%)</td>
			<td class="pr-2 pt-2 text-right font-bold">
				{fmtMoney(items.reduce((acc, item) => acc + item[1] * item[3], 0))}
			</td>
		</tr>
		<tr>
			<td colspan="2"></td>
			<td colspan="3" class="font-bold">Alv yhteensä</td>
			<td class="pr-2 pt-2 text-right font-bold">
				{fmtMoney(items.reduce((acc, item) => acc + item[1] * item[3] * item[4] * 0.01, 0))}
			</td>
		</tr>
		<tr>
			<td colspan="2"></td>
			<td colspan="2" class="border-t border-neutral-700 text-lg font-bold">Maksettava yhteensä</td>
			<td colspan="2" class="border-t border-neutral-700 p-2 text-right text-lg font-bold">
				{fmtMoney(items.reduce((acc, item) => acc + item[1] * item[3] * (item[4] * 0.01 + 1), 0))}
			</td>
		</tr>
	</table>
</section>
