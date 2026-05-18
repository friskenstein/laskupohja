<script lang="ts">
	import {
		calculateInvoiceTotals,
		createFinnishBankBarcodeV4Payload,
		formatLocalDate,
		parseEditableMoney,
		renderMarkdown,
		tryCalculateDueDate,
		type EditableInvoiceDocumentSelection,
		type InvoiceLine,
		type ValidationIssue,
	} from '../..'
	import BarcodeSvg from '../../ui/BarcodeSvg.svelte'

	export let selection: EditableInvoiceDocumentSelection
	export let warnings: ValidationIssue[] = []

	$: content = selection.content
	$: invoiceLines = content.lines.flatMap(toInvoiceLine)
	$: totals = calculateInvoiceTotals(invoiceLines)
	$: dueDate = tryCalculateDueDate(content.identity.invoiceDate, content.identity.paymentTermDays)
	$: barcodePayload =
		dueDate &&
		createFinnishBankBarcodeV4Payload({
			iban: content.paymentDetails.iban,
			amountMinorUnits: totals.grossTotalMinorUnits,
			dueDate,
			finnishReferenceNumber: content.paymentDetails.paymentReference,
		})

	function toInvoiceLine(line: EditableInvoiceDocumentSelection['content']['lines'][number]) {
		const unitPrice = parseEditableMoney(line.unitPrice)
		const quantity = Number(line.quantity)
		const vatRate = Number(line.vatRate)

		if (!unitPrice.ok || !Number.isFinite(quantity) || !Number.isFinite(vatRate)) {
			return []
		}

		return [
			{
				description: line.description,
				quantity,
				unit: line.unit,
				unitPriceMinorUnits: unitPrice.minorUnits,
				vatRate,
			} satisfies InvoiceLine,
		]
	}

	const formatMoney = (minorUnits: number) => {
		return new Intl.NumberFormat('fi-FI', {
			style: 'currency',
			currency: selection.currency,
		}).format(minorUnits / 100)
	}

	const formatPaymentSlipMoney = (minorUnits: number) => {
		return formatMoney(minorUnits).replace('€', '').trim()
	}

	const formatDate = (localDate: string) => {
		try {
			return formatLocalDate(localDate, 'fi-FI')
		} catch {
			return localDate
		}
	}

	const sellerIdentifier = (label: string) => {
		return content.seller.identifiers.find(identifier => identifier.label === label)?.value ?? ''
	}
</script>

<article
	class="flex h-full w-full max-w-5xl flex-col justify-between bg-white text-neutral-950 print:min-h-screen print:max-w-none"
>
	{#if warnings.length > 0}
		<aside class="mb-6 border-l-4 border-amber-400 bg-amber-50 p-4 text-sm print:hidden">
			<h2 class="font-bold">Tulostusvalmiuden varoitukset</h2>
			<ul class="mt-2 list-disc pl-5">
				{#each warnings as warning (`${warning.code}:${warning.path}`)}
					<li>{warning.message}</li>
				{/each}
			</ul>
		</aside>
	{/if}

	<section>
		<div class="flex flex-row">
			<div class="w-6/12"></div>
			<div class="w-6/12">
				<h1 class="text-3xl">Lasku</h1>
				<br />
				<table class="w-full border-t border-neutral-700">
					<tbody>
						<tr>
							<td>Laskun numero</td>
							<td>{content.identity.invoiceNumber}</td>
						</tr>
						<tr>
							<td>Viitenumero</td>
							<td>{content.paymentDetails.paymentReference}</td>
						</tr>
						<tr>
							<td>Laskun päiväys</td>
							<td>{formatDate(content.identity.invoiceDate)}</td>
						</tr>
						<tr>
							<td>Eräpäivä</td>
							<td class="font-bold">{dueDate ? formatDate(dueDate) : ''}</td>
						</tr>
						<tr>
							<td>Maksuehto</td>
							<td>{content.identity.paymentTermDays} pv netto</td>
						</tr>
						<tr>
							<td>Viivästyskorko</td>
							<td>Korkolain mukaan</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<section>
		<div class="invoice-note px-2 py-8">
			{@html renderMarkdown(content.note)}
		</div>

		<table class="w-full">
			<tbody>
				<tr class="bg-neutral-200 font-bold">
					<th class="w-2/12 p-2 text-left">Kuvaus</th>
					<th class="w-2/12 text-right">Määrä</th>
					<th class="w-2/12 text-right">Yksikkö</th>
					<th class="w-2/12 text-right">À-hinta</th>
					<th class="w-2/12 text-right">Alv %</th>
					<th class="w-2/12 p-2 text-right">Yhteensä</th>
				</tr>

				{#each content.lines as line, index (line)}
					<tr>
						<td class="p-2 text-left">{line.description}</td>
						<td class="text-right">{line.quantity}</td>
						<td class="text-right">{line.unit}</td>
						<td class="text-right">
							{#if invoiceLines[index]}
								{formatMoney(invoiceLines[index].unitPriceMinorUnits)}
							{:else}
								{line.unitPrice}
							{/if}
						</td>
						<td class="text-right">{line.vatRate} %</td>
						<td class="p-2 text-right">
							{#if totals.lineAmounts[index]}
								{formatMoney(totals.lineAmounts[index].grossMinorUnits)}
							{/if}
						</td>
					</tr>
				{/each}

				<tr class="h-8"><td colspan="6"></td></tr>

				<tr>
					<td colspan="2"></td>
					<td colspan="3" class="font-bold">Yhteensä (alv 0%)</td>
					<td class="pr-2 pt-2 text-right font-bold">
						{formatMoney(totals.netTotalMinorUnits)}
					</td>
				</tr>
				<tr>
					<td colspan="2"></td>
					<td colspan="3" class="font-bold">Alv yhteensä</td>
					<td class="pr-2 pt-2 text-right font-bold">
						{formatMoney(totals.vatTotalMinorUnits)}
					</td>
				</tr>
				{#each totals.vatBreakdown as breakdown (`${breakdown.vatRate}`)}
					<tr>
						<td colspan="2"></td>
						<td colspan="3" class="text-sm">Alv {breakdown.vatRate} %</td>
						<td class="pr-2 pt-1 text-right text-sm">
							{formatMoney(breakdown.vatMinorUnits)}
						</td>
					</tr>
				{/each}
				<tr>
					<td colspan="2"></td>
					<td colspan="2" class="border-t border-neutral-700 text-lg font-bold">
						Maksettava yhteensä
					</td>
					<td colspan="2" class="border-t border-neutral-700 p-2 text-right text-lg font-bold">
						{formatMoney(totals.grossTotalMinorUnits)}
					</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<table class="w-full border-t-2 border-neutral-700 text-sm">
			<tbody>
				<tr>
					<td>Yritys</td>
					<td>{content.seller.name}</td>
					<td>Puh.</td>
					<td>{content.seller.contactDetails.phone}</td>
				</tr>
				<tr>
					<td>Osoite</td>
					<td>
						{content.seller.postalAddress.addressLine1}, {content.seller.postalAddress.addressLine2}
					</td>
					<td>Sähköposti</td>
					<td>{content.seller.contactDetails.email}</td>
				</tr>
				<tr>
					<td>Y-tunnus</td>
					<td>{sellerIdentifier('Y-tunnus')}</td>
					<td>www</td>
					<td>{content.seller.contactDetails.website}</td>
				</tr>
			</tbody>
		</table>

		<table class="w-full border-t-2 border-dashed border-neutral-700 leading-5">
			<tbody>
				<tr>
					<td
						class="w-1/12 border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs"
					>
						Saajan
						<br />
						tilinumero
						<br />
						Mottagarens
						<br />
						kontonummer
					</td>
					<td class="w-6/12 border-b-2 border-r-2 border-neutral-700 p-1 align-top">
						IBAN
						<br />
						{content.paymentDetails.iban}
					</td>
					<td class="w-5/12 border-b-2 border-neutral-700 p-1 align-top" colspan="4">
						SWIFT/BIC
						<br />
						{content.paymentDetails.swiftBic}
					</td>
				</tr>
				<tr>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs">
						Saaja
						<br />
						Mottagare
					</td>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1 align-top">
						{content.seller.name}
						<br />
						{content.seller.postalAddress.addressLine1}
						<br />
						{content.seller.postalAddress.addressLine2}
					</td>
					<td class="border-b-2 border-neutral-700 p-1" colspan="4" rowspan="2">
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
					</td>
				</tr>
				<tr>
					<td
						class="whitespace-nowrap border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs"
						rowspan="2"
					>
						Maksajan nimi
						<br />
						ja osoite
						<br />
						Betalarens namn
						<br />
						och adress
						<br />
						<br />
						<br />
						Allekirjoitus
						<br />
						Underskrift
					</td>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1 align-top" rowspan="2">
						{content.buyer.name}
						<br />
						{content.buyer.postalAddress.addressLine1}
						<br />
						{content.buyer.postalAddress.addressLine2}
						<br />
						<br />
						<br />
						<br />
						<hr class="border border-neutral-700" />
					</td>
					<td class="p-1" colspan="4"></td>
				</tr>
				<tr>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-xs">
						Viitenro
						<br />
						Ref.nr
					</td>
					<td class="border-b-2 border-neutral-700 p-1" colspan="3">
						{content.paymentDetails.paymentReference}
					</td>
				</tr>
				<tr>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-right text-xs">
						Tililtä nro
						<br />
						Från konto nr
					</td>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1"></td>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-xs">
						Eräpäivä
						<br />
						Förf.dag
					</td>
					<td class="border-b-2 border-r-2 border-neutral-700 p-1">
						{dueDate ? formatDate(dueDate) : ''}
					</td>
					<td class="border-b-2 border-neutral-700 p-1 align-top text-xs">Euro</td>
					<td class="border-b-2 border-neutral-700 p-1">
						{formatPaymentSlipMoney(totals.grossTotalMinorUnits)}
					</td>
				</tr>
			</tbody>
		</table>

		<div class="flex flex-row items-center">
			{#if barcodePayload && barcodePayload.ok}
				<BarcodeSvg payload={barcodePayload.payload} />
			{:else}
				<div class="w-7/12"></div>
			{/if}
			<p class="w-5/12 text-xs">
				Maksu välitetään saajalle maksujenvälityksen ehtojen mukaisesti ja vain maksajan ilmoittaman
				tilinumeron perusteella.
				<br />
				Betalningen förmedlas till mottagaren enligt villkoren för betalningsförmedling och endast till
				det kontonummer som betalaren angivit.
			</p>
		</div>
	</section>
</article>
