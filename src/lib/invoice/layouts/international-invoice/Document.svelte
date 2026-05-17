<script lang="ts">
	import {
		calculateInvoiceTotals,
		formatLocalDate,
		parseEditableMoney,
		tryCalculateDueDate,
		type EditableInvoiceDocumentSelection,
		type InvoiceLine,
		type ValidationIssue,
	} from '../..'

	export let selection: EditableInvoiceDocumentSelection
	export let warnings: ValidationIssue[] = []

	$: content = selection.content
	$: invoiceLines = content.lines.flatMap(toInvoiceLine)
	$: totals = calculateInvoiceTotals(invoiceLines)
	$: dueDate = tryCalculateDueDate(content.identity.invoiceDate, content.identity.paymentTermDays)

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
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: selection.currency,
		}).format(minorUnits / 100)
	}

	const formatDate = (localDate: string) => {
		try {
			return formatLocalDate(localDate, 'en-US')
		} catch {
			return localDate
		}
	}
</script>

<article
	class="flex h-full w-full max-w-5xl flex-col justify-between bg-white text-neutral-950 print:max-w-none"
>
	{#if warnings.length > 0}
		<aside class="mb-6 border-l-4 border-amber-400 bg-amber-50 p-4 text-sm print:hidden">
			<h2 class="font-bold">Print readiness warnings</h2>
			<ul class="mt-2 list-disc pl-5">
				{#each warnings as warning (`${warning.code}:${warning.path}`)}
					<li>{warning.message}</li>
				{/each}
			</ul>
		</aside>
	{/if}

	<section>
		<div class="flex flex-row">
			<div class="w-full">
				<h1 class="mb-4 text-5xl print:mb-16">Invoice</h1>
				<table class="w-full">
					<tbody>
						<tr>
							<td class="font-bold">Sender</td>
							<td class="font-bold">{content.seller.name}</td>
							<td class="font-bold">Invoice no.</td>
							<td>{content.identity.invoiceNumber}</td>
						</tr>
						<tr>
							<td></td>
							<td>{content.seller.postalAddress.addressLine1}</td>
							<td class="font-bold">Invoice date</td>
							<td>{formatDate(content.identity.invoiceDate)}</td>
						</tr>
						<tr>
							<td></td>
							<td>{content.seller.postalAddress.addressLine2}</td>
							<td class="font-bold">Payment terms</td>
							<td>{content.identity.paymentTermDays} days</td>
						</tr>
						<tr>
							<td></td>
							<td>{content.seller.postalAddress.country}</td>
							<td class="font-bold">Due date</td>
							<td class="font-bold">{dueDate ? formatDate(dueDate) : ''}</td>
						</tr>
						{#each content.seller.identifiers as identifier (`${identifier.label}:${identifier.value}`)}
							<tr>
								<td></td>
								<td>{identifier.label} {identifier.value}</td>
								<td></td>
								<td></td>
							</tr>
						{/each}
						<tr><td>&nbsp;</td></tr>
						<tr>
							<td class="font-bold">Recipient</td>
							<td class="font-bold">{content.buyer.name}</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td>{content.buyer.postalAddress.addressLine1}</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td>{content.buyer.postalAddress.addressLine2}</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td>{content.buyer.postalAddress.country}</td>
							<td></td>
							<td></td>
						</tr>
						{#each content.buyer.identifiers as identifier (`${identifier.label}:${identifier.value}`)}
							<tr>
								<td></td>
								<td>{identifier.label} {identifier.value}</td>
								<td></td>
								<td></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<section>
		<p class="px-2 py-8">{content.note}</p>

		<table class="w-full">
			<tbody>
				<tr class="bg-neutral-200 font-bold">
					<th class="w-2/12 p-2 text-left">Description</th>
					<th class="w-2/12 text-right">Qty</th>
					<th class="w-2/12 text-right">Unit</th>
					<th class="w-2/12 text-right">Unit price</th>
					<th class="w-2/12 text-right">VAT %</th>
					<th class="w-2/12 p-2 text-right">Total</th>
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
					<td colspan="3" class="font-bold">Total excl. VAT</td>
					<td class="pr-2 pt-2 text-right font-bold">
						{formatMoney(totals.netTotalMinorUnits)}
					</td>
				</tr>
				<tr>
					<td colspan="2"></td>
					<td colspan="3" class="font-bold">Total VAT</td>
					<td class="pr-2 pt-2 text-right font-bold">
						{formatMoney(totals.vatTotalMinorUnits)}
					</td>
				</tr>
				{#each totals.vatBreakdown as breakdown (`${breakdown.vatRate}`)}
					<tr>
						<td colspan="2"></td>
						<td colspan="3" class="text-sm">VAT {breakdown.vatRate} %</td>
						<td class="pr-2 pt-1 text-right text-sm">
							{formatMoney(breakdown.vatMinorUnits)}
						</td>
					</tr>
				{/each}
				<tr>
					<td colspan="2"></td>
					<td colspan="2" class="border-t border-neutral-700 text-lg font-bold">
						Total amount due
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
					<td>{content.seller.name}</td>
					<td class="font-bold">Contact Information</td>
					<td class="font-bold" colspan="2">Payment Details</td>
				</tr>
				<tr>
					<td>{content.seller.postalAddress.addressLine1}</td>
					<td>{content.seller.name}</td>
					<td>IBAN</td>
					<td>{content.paymentDetails.iban}</td>
				</tr>
				<tr>
					<td>{content.seller.postalAddress.addressLine2}</td>
					<td>{content.seller.contactDetails.phone}</td>
					<td>Swift/BIC</td>
					<td>{content.paymentDetails.swiftBic}</td>
				</tr>
				<tr>
					<td>{content.seller.postalAddress.country}</td>
					<td>{content.seller.contactDetails.email}</td>
					<td>Bank name</td>
					<td>{content.paymentDetails.bankName}</td>
				</tr>
				<tr>
					<td>
						{#each content.seller.identifiers as identifier (`${identifier.label}:${identifier.value}`)}
							{identifier.label} {identifier.value}
						{/each}
					</td>
					<td>{content.seller.contactDetails.website}</td>
					<td>Bank address</td>
					<td>{content.paymentDetails.bankAddress.addressLine1}</td>
				</tr>
				<tr>
					<td colspan="3"></td>
					<td>{content.paymentDetails.bankAddress.addressLine2}</td>
				</tr>
				<tr>
					<td colspan="3"></td>
					<td>{content.paymentDetails.bankAddress.country}</td>
				</tr>
			</tbody>
		</table>
	</section>
</article>
