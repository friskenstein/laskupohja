<script lang="ts">
	import type { Item } from "../types/item"
	import type { State } from "../types/state"
	import PaymentDetailsFin from "./PaymentDetailsFin.svelte"
	import PaymentDetailsInt from "./PaymentDetailsInt.svelte"

	export let lang: string = 'fi'

	export let items: Item[]
	export let state: State
</script>

{#if lang === 'fi'}
	<PaymentDetailsFin bind:state {items} />
{:else}
	<PaymentDetailsInt bind:state />
{/if}
