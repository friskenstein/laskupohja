<script lang="ts">
	import { onMount } from 'svelte'
	import JsBarcode from 'jsbarcode'

	export let payload: string

	let element: SVGElement

	onMount(() => {
		JsBarcode(element, payload, {
			format: 'CODE128',
			displayValue: false,
			marginRight: 40,
		})
	})
</script>

<svg bind:this={element} class="w-7/12" data-finnish-bank-barcode-payload={payload}></svg>
