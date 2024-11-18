<script lang="ts">
	import type { State } from '../types/state'

	export let state: State
</script>

<section>
	<table class="w-full border-t-2 border-neutral-700 text-sm">
		<tr>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 font-bold print:bg-white"
					bind:value={state.companyName}
				/>
			</td>
			<td class="font-bold">Contact Information</td>
			<td class="font-bold" colspan="2">Payment Details</td>
		</tr>
		<tr>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyAddress1}
				/>
			</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyName}
				/>
			</td>
			<td>IBAN</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.iban}
				/>
			</td>
		</tr>
		<tr>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyAddress2}
				/>
			</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyPhone}
				/>
			</td>
			<td>Swift/BIC</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.swiftBic}
				/>
			</td>
		</tr>
		<tr>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyCountry}
				/>
			</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyEmail}
				/>
			</td>
			<td>Bank name</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.bankName}
				/>
			</td>
		</tr>
		<tr>
			<td>
				VAT no.
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyVat}
				/>
			</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.companyWww}
				/>
			</td>
			<td>Bank address</td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.bankAddress1}
				/>
			</td>
		</tr>
		<tr>
			<td colspan="3"></td>
			<td>
				<input
					type="text"
					class="w-52 bg-yellow-200 print:bg-white"
					bind:value={state.bankAddress2}
				/>
			</td>
		</tr>
	</table>
</section>
