<script lang="ts">
	import type { State } from '../types/state'
	import HeaderFin from './HeaderFin.svelte'
	import HeaderInt from './HeaderInt.svelte'

	export let lang: string = 'fi'

	export let state: State
</script>

{#if lang === 'fi'}
	<HeaderFin bind:state />
{:else}
	<HeaderInt bind:state />
{/if}
