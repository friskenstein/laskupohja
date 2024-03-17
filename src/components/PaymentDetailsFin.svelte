<section>
	<table class="w-full border-t-2 border-neutral-700 text-sm">
		<tr>
			<td>Yritys</td>
			<td><input class="bg-yellow-200 print:bg-white" value="" /></td>
			<td>Puh.</td>
			<td><input class="w-60 bg-yellow-200 print:bg-white" value="" /></td>
		</tr>
		<tr>
			<td>Osoite</td>
			<td>
				<input class="bg-yellow-200 print:hidden" value="" />
				<input class="bg-yellow-200 print:hidden" value="" />
				<span class="hidden print:inline">,</span>
			</td>
			<td>Sähköposti</td>
			<td><input class="w-60 bg-yellow-200 print:bg-white" value="" /></td>
		</tr>
		<tr>
			<td>Y-tunnus</td>
			<td><input class="bg-yellow-200 print:bg-white" value="" /></td>
			<td>www</td>
			<td><input class="w-60 bg-yellow-200 print:bg-white" value="" /></td>
		</tr>
	</table>

	<table class="w-full border-t-2 border-dashed border-neutral-700 leading-5">
		<tr>
			<td class="w-1/12 border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs">
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
				<input type="text" class="w-52 bg-yellow-200 print:bg-white" value="" />
			</td>
			<td class="w-5/12 border-b-2 border-neutral-700 p-1 align-top" colspan="4">
				SWIFT/BIC
				<br />
				<input class="bg-yellow-200 print:bg-white" value="" />
			</td>
		</tr>
		<tr>
			<td class="border-b-2 border-r-2 border-neutral-700 p-1 text-right align-top text-xs">
				Saaja
				<br />
				Mottagare
			</td>
			<td class="border-b-2 border-r-2 border-neutral-700 p-1 align-top">
				<br />
				<br />
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
				<input class="w-80 bg-yellow-200 print:bg-white" value="" />
				<br />
				<input class="w-80 bg-yellow-200 print:bg-white" value="" />
				<br />
				<input class="w-80 bg-yellow-200 print:bg-white" value="" />
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
			<td class="border-b-2 border-neutral-700 p-1" colspan="3"></td>
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
			<td class="border-b-2 border-r-2 border-neutral-700 p-1">15.4.2024</td>
			<td class="border-b-2 border-neutral-700 p-1 align-top text-xs">Euro</td>
			<td class="border-b-2 border-neutral-700 p-1">0,00</td>
		</tr>
	</table>

	<div class="flex flex-row items-center">
		<svg id="barcode" class="w-7/12"></svg>
		<p class="w-5/12 text-xs">
			Maksu välitetään saajalle maksujenvälityksen ehtojen mukaisesti ja vain maksajan ilmoittaman
			tilinumeron perusteella.
			<br />
			Betalningen förmedlas till mottagaren enligt villkoren för betalningsförmedling och endast till
			det kontonummer som betalaren angivit.
		</p>
	</div>
</section>
