<script lang="ts">
	import type { State } from '../types/state'
	import { calculateDueDate } from '$lib/dueDate'

	export let state: State
</script>

<section>
	<div class="flex flex-row">
		<div class="w-full">
			<h1 class="text-5xl mb-4 print:mb-16">Invoice</h1>
			<table class="w-full">
				<tr>
					<td class="font-bold">Sender</td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 font-bold print:bg-white"
							bind:value={state.companyName}
						/>
					</td>
					<td class="font-bold">Invoice no.</td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.invoiceNumber}
						/>
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.companyAddress1}
						/>
					</td>
					<td class="font-bold">Invoice date</td>
					<td>
						<input type="date" class="bg-yellow-200 print:hidden" bind:value={state.invoiceDate} />
						<span class="hidden print:inline">
							{new Date(state.invoiceDate).toLocaleDateString('fi-FI')}
						</span>
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.companyAddress2}
						/>
					</td>
					<td class="font-bold">Payment terms</td>
					<td>
						<input
							type="number"
							class="w-12 bg-yellow-200 print:hidden"
							bind:value={state.dueDays}
						/>
						<span class="hidden print:inline">{state.dueDays}</span>
						days
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.companyCountry}
						/>
					</td>
					<td class="font-bold">Due date</td>
					<td class="font-bold">{calculateDueDate(state)}</td>
				</tr>
				<tr>
					<td></td>
					<td>
						VAT no.
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.companyVat}
						/>
					</td>
					<td></td>
					<td></td>
				</tr>
				<tr><td>&nbsp;</td></tr>
				<tr>
					<td class="font-bold">Recipient</td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 font-bold print:bg-white"
							bind:value={state.payerName}
						/>
					</td>
					<td></td><td></td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.payerAddress1}
						/>
					</td>
					<td></td><td></td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.payerAddress2}
						/>
					</td>
					<td></td><td></td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.payerCountry}
						/>
					</td>
					<td></td><td></td>
				</tr>
				<tr>
					<td></td>
					<td>
						VAT no.
						<input
							type="text"
							class="w-52 bg-yellow-200 print:bg-white"
							bind:value={state.payerVat}
						/>
					</td>
					<td></td><td></td>
				</tr>
			</table>
		</div>
	</div>
</section>
