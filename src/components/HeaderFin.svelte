<script lang="ts">
	import type { State } from '../types/state'
	import { calculateDueDate } from '$lib/dueDate'

	export let state: State
</script>

<section>
	<div class="flex flex-row">
		<div class="w-6/12"></div>
		<div class="w-6/12">
			<h1 class="text-3xl">Lasku</h1>
			<br />
			<table class="w-full border-t border-neutral-700">
				<tr>
					<td>Laskun numero</td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.invoiceNumber}
						/>
					</td>
				</tr>
				<tr>
					<td>Viitenumero</td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.reference}
						/>
					</td>
				</tr>
				<tr>
					<td>Laskun päiväys</td>
					<td>
						<input type="date" class="bg-yellow-200 print:hidden" bind:value={state.invoiceDate} />
						<span class="hidden print:inline">
							{new Date(state.invoiceDate).toLocaleDateString('fi-FI')}
						</span>
					</td>
				</tr>
				<tr>
					<td>Eräpäivä</td>
					<td class="font-bold">{calculateDueDate(state)}</td>
				</tr>
				<tr>
					<td>Maksuehto</td>
					<td>
						<input
							type="number"
							class="w-12 bg-yellow-200 print:hidden"
							bind:value={state.dueDays}
						/>
						<span class="hidden print:inline">{state.dueDays}</span>
						pv netto
					</td>
				</tr>
				<tr>
					<td>Viivästyskorko</td>
					<td>Korkolain mukaan</td>
				</tr>
			</table>
		</div>
	</div>
</section>
