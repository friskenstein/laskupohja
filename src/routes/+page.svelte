<script lang="ts">
	import { page } from '$app/stores'
	import FinnishBankTransferDocument from '$lib/invoice/layouts/finnish-bank-transfer/Document.svelte'
	import InternationalInvoiceDocument from '$lib/invoice/layouts/international-invoice/Document.svelte'
	import {
		getLayoutVariantMetadata,
		layoutVariantMetadata,
		validateInvoiceDocumentSelection,
		type LayoutVariantId,
		type PartyIdentifier,
	} from '$lib/invoice'
	import {
		canUsePaymentArtifactAction,
		createEditableInvoiceDocumentSelectionFromUrl,
		createEmptyInvoiceLine,
		createShareableInvoiceUrl,
		selectLayoutVariant,
	} from '$lib/invoice/ui/editing/selectionEditor'
	import { onMount } from 'svelte'

	let selection = createEditableInvoiceDocumentSelectionFromUrl($page.url)
	let content = selection.content
	let mounted = false

	$: currentSelection = { ...selection, content }
	$: validation = validateInvoiceDocumentSelection(currentSelection)
	$: warnings = validation.printReadiness.warnings
	$: selectedLayout = getLayoutVariantMetadata(currentSelection.layoutVariantId)
	$: canCopyFinnishBankBarcode = canUsePaymentArtifactAction(
		currentSelection,
		'finnish-bank-barcode'
	)
	$: if (mounted) {
		replaceBrowserUrl(currentSelection)
	}

	onMount(() => {
		mounted = true
		replaceBrowserUrl(currentSelection)
	})

	const chooseLayoutVariant = (layoutVariantId: string) => {
		selection = selectLayoutVariant(currentSelection, layoutVariantId as LayoutVariantId)
		content = selection.content
	}

	const addInvoiceLine = () => {
		content.lines = [...content.lines, createEmptyInvoiceLine()]
		content = content
	}

	const removeInvoiceLine = (index: number) => {
		content.lines = content.lines.filter((_, lineIndex) => lineIndex !== index)
		content = content
	}

	const setIdentifier = (
		identifiers: PartyIdentifier[],
		index: number,
		label: string,
		value: string
	) => {
		identifiers[index] = {
			label,
			value,
		}
		content = content
	}

	const identifierValue = (identifiers: PartyIdentifier[], index: number) =>
		identifiers[index]?.value ?? ''

	const replaceBrowserUrl = (nextSelection: typeof currentSelection) => {
		window.history.replaceState(
			{},
			'',
			createShareableInvoiceUrl(window.location.href, nextSelection)
		)
	}

	const copyRenderedFinnishBankBarcode = () => {
		if (!canCopyFinnishBankBarcode) {
			return
		}

		const payload = document
			.querySelector('[data-finnish-bank-barcode-payload]')
			?.getAttribute('data-finnish-bank-barcode-payload')

		if (payload) {
			navigator.clipboard.writeText(payload)
		}
	}
</script>

<svelte:head>
	<title>Laskupohja</title>
</svelte:head>

<div class="min-h-screen bg-neutral-100 text-neutral-950">
	<header class="border-b border-neutral-300 bg-white print:hidden">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
			<label class="flex items-center gap-2 text-sm font-medium">
				<span>Layout</span>
				<select
					class="rounded border border-neutral-300 bg-white px-3 py-2"
					value={currentSelection.layoutVariantId}
					on:change={event => chooseLayoutVariant(event.currentTarget.value)}
				>
					{#each layoutVariantMetadata as layoutVariant (layoutVariant.id)}
						<option value={layoutVariant.id}>{layoutVariant.name}</option>
					{/each}
				</select>
			</label>

			<label class="flex items-center gap-2 text-sm font-medium">
				<span>Currency</span>
				<input
					class="w-24 rounded border border-neutral-300 px-3 py-2 uppercase"
					bind:value={selection.currency}
				/>
			</label>

			<button
				class="rounded bg-neutral-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
				disabled={!canCopyFinnishBankBarcode}
				on:click={copyRenderedFinnishBankBarcode}
			>
				Copy Finnish bank barcode
			</button>

			<p class="ml-auto text-sm text-neutral-600">
				{selectedLayout.name} · {warnings.length} warning{warnings.length === 1 ? '' : 's'}
			</p>
		</div>
	</header>

	<div
		class="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[420px_minmax(0,1fr)] print:block print:max-w-none print:p-0"
	>
		<aside class="space-y-4 print:hidden">
			<section class="rounded border border-neutral-300 bg-white p-4">
				<h2 class="text-lg font-semibold">Invoice Identity</h2>
				<div class="mt-4 grid gap-3">
					<label class="grid gap-1 text-sm">
						<span>Invoice number</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.identity.invoiceNumber}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Invoice date</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							type="date"
							bind:value={content.identity.invoiceDate}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Payment term days</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							inputmode="numeric"
							bind:value={content.identity.paymentTermDays}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Note</span>
						<textarea
							class="min-h-20 rounded border border-neutral-300 px-3 py-2"
							bind:value={content.note}
						></textarea>
					</label>
				</div>
			</section>

			<section class="rounded border border-neutral-300 bg-white p-4">
				<h2 class="text-lg font-semibold">Seller</h2>
				<div class="mt-4 grid gap-3">
					<label class="grid gap-1 text-sm">
						<span>Name</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.seller.name}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Address line 1</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.seller.postalAddress.addressLine1}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Address line 2</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.seller.postalAddress.addressLine2}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Country</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.seller.postalAddress.country}
						/>
					</label>
					<div class="grid grid-cols-2 gap-3">
						<label class="grid gap-1 text-sm">
							<span>Business ID</span>
							<input
								class="rounded border border-neutral-300 px-3 py-2"
								value={identifierValue(content.seller.identifiers, 0)}
								on:input={event =>
									setIdentifier(
										content.seller.identifiers,
										0,
										'Y-tunnus',
										event.currentTarget.value
									)}
							/>
						</label>
						<label class="grid gap-1 text-sm">
							<span>VAT ID</span>
							<input
								class="rounded border border-neutral-300 px-3 py-2"
								value={identifierValue(content.seller.identifiers, 1)}
								on:input={event =>
									setIdentifier(
										content.seller.identifiers,
										1,
										'ALV nro',
										event.currentTarget.value
									)}
							/>
						</label>
					</div>
					<div class="grid grid-cols-3 gap-3">
						<label class="grid gap-1 text-sm">
							<span>Phone</span>
							<input
								class="rounded border border-neutral-300 px-3 py-2"
								bind:value={content.seller.contactDetails.phone}
							/>
						</label>
						<label class="grid gap-1 text-sm">
							<span>Email</span>
							<input
								class="rounded border border-neutral-300 px-3 py-2"
								bind:value={content.seller.contactDetails.email}
							/>
						</label>
						<label class="grid gap-1 text-sm">
							<span>Website</span>
							<input
								class="rounded border border-neutral-300 px-3 py-2"
								bind:value={content.seller.contactDetails.website}
							/>
						</label>
					</div>
				</div>
			</section>

			<section class="rounded border border-neutral-300 bg-white p-4">
				<h2 class="text-lg font-semibold">Buyer</h2>
				<div class="mt-4 grid gap-3">
					<label class="grid gap-1 text-sm">
						<span>Name</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.buyer.name}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Address line 1</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.buyer.postalAddress.addressLine1}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Address line 2</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.buyer.postalAddress.addressLine2}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Country</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.buyer.postalAddress.country}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>VAT ID</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							value={identifierValue(content.buyer.identifiers, 0)}
							on:input={event =>
								setIdentifier(content.buyer.identifiers, 0, 'ALV nro', event.currentTarget.value)}
						/>
					</label>
				</div>
			</section>

			<section class="rounded border border-neutral-300 bg-white p-4">
				<div class="flex items-center justify-between gap-3">
					<h2 class="text-lg font-semibold">Invoice Lines</h2>
					<button
						class="rounded border border-neutral-300 px-3 py-2 text-sm"
						on:click={addInvoiceLine}
					>
						Add line
					</button>
				</div>
				<div class="mt-4 space-y-4">
					{#each content.lines as line, index (index)}
						<div class="grid gap-3 border-t border-neutral-200 pt-4 first:border-t-0 first:pt-0">
							<label class="grid gap-1 text-sm">
								<span>Description</span>
								<input
									class="rounded border border-neutral-300 px-3 py-2"
									bind:value={line.description}
								/>
							</label>
							<div class="grid grid-cols-4 gap-3">
								<label class="grid gap-1 text-sm">
									<span>Qty</span>
									<input
										class="rounded border border-neutral-300 px-3 py-2"
										bind:value={line.quantity}
									/>
								</label>
								<label class="grid gap-1 text-sm">
									<span>Unit</span>
									<input
										class="rounded border border-neutral-300 px-3 py-2"
										bind:value={line.unit}
									/>
								</label>
								<label class="grid gap-1 text-sm">
									<span>Price</span>
									<input
										class="rounded border border-neutral-300 px-3 py-2"
										bind:value={line.unitPrice}
									/>
								</label>
								<label class="grid gap-1 text-sm">
									<span>VAT %</span>
									<input
										class="rounded border border-neutral-300 px-3 py-2"
										bind:value={line.vatRate}
									/>
								</label>
							</div>
							{#if content.lines.length > 1}
								<button
									class="justify-self-start rounded border border-neutral-300 px-3 py-2 text-sm"
									on:click={() => removeInvoiceLine(index)}
								>
									Remove line
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<section class="rounded border border-neutral-300 bg-white p-4">
				<h2 class="text-lg font-semibold">Payment Details</h2>
				<div class="mt-4 grid gap-3">
					<label class="grid gap-1 text-sm">
						<span>IBAN</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.paymentDetails.iban}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Payment reference</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.paymentDetails.paymentReference}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>SWIFT/BIC</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.paymentDetails.swiftBic}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Bank name</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.paymentDetails.bankName}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Bank address line 1</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.paymentDetails.bankAddress.addressLine1}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Bank address line 2</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.paymentDetails.bankAddress.addressLine2}
						/>
					</label>
					<label class="grid gap-1 text-sm">
						<span>Bank country</span>
						<input
							class="rounded border border-neutral-300 px-3 py-2"
							bind:value={content.paymentDetails.bankAddress.country}
						/>
					</label>
				</div>
			</section>
		</aside>

		<main class="min-w-0 print:block">
			{#if currentSelection.layoutVariantId === 'finnish-bank-transfer'}
				<FinnishBankTransferDocument selection={currentSelection} {warnings} />
			{:else}
				<InternationalInvoiceDocument selection={currentSelection} {warnings} />
			{/if}
		</main>
	</div>
</div>
