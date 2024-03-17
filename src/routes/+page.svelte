<script>
	import HeaderFin from '../components/HeaderFin.svelte'
	import ItemBreakdown from '../components/ItemBreakdown.svelte'
	import PaymentDetailsFin from '../components/PaymentDetailsFin.svelte'
</script>

<header class="flex flex-row justify-center p-4 print:hidden">
	<select
		class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
	>
		<option value="fi" class="">Suomi</option>
		<option value="en" class="">EU / 🌐</option>
	</select>

	<button
		class="relative m-2 rounded bg-blue-400 p-1 text-white shadow hover:left-0.5 hover:top-0.5"
	>
		Päivitä URL
	</button>
</header>

<main class="flex flex-col items-center print:h-screen">
	<article class="flex h-full w-full max-w-5xl flex-col justify-between print:max-w-none">
		<HeaderFin />
		<ItemBreakdown />
		<PaymentDetailsFin />
	</article>
</main>
