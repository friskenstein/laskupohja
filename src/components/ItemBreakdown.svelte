<section>
	<textarea class="mx-2 my-8 bg-yellow-200 print:hidden" cols="80"></textarea>
	<p class="hidden px-2 py-8 print:block"><!-- HTML_TAG_START --><!-- HTML_TAG_END --></p>

	<table class="w-full">
		<tr class="bg-neutral-200 font-bold">
			<th class="w-2/12 p-2 text-left">Kuvaus</th>
			<th class="w-2/12 text-right">Määrä</th>
			<th class="w-2/12 text-right">Yksikkö</th>
			<th class="w-2/12 text-right">À-hinta</th>
			<th class="w-2/12 text-right">Alv %</th>
			<th class="w-2/12 p-2 text-right">Yhteensä</th>
		</tr>

		<tr>
			<td class="flex flex-row p-2 text-left">
				<button class="mr-4 rounded-md border px-1 print:hidden">Poista</button>
				<input type="text" class="w-80" value="Esimerkki tuote tai palvelu" />
			</td>
			<td class="text-right">
				<input type="number" class="w-20 text-right print:hidden" value="2" />
				<span class="hidden print:inline">2</span>
			</td>
			<td class="text-right">
				<input type="text" class="w-16 text-right print:hidden" value="kpl" />
				<span class="hidden print:inline">kpl</span>
			</td>
			<td class="text-right">
				<input
					type="number"
					step="0.01"
					max="999999.99"
					class="w-28 text-right print:hidden"
					value="50"
				/>
				<span class="hidden print:inline">50,00</span>
				€
			</td>
			<td class="text-right">
				<input type="number" class="w-12 text-right print:hidden" value="24" />
				<span class="hidden print:inline">24</span>
				%
			</td>
			<td class="p-2 text-right">124,00 €</td>
		</tr>

		<tr class="border-b border-neutral-200">
			<button class="m-2 rounded-md border px-1 print:hidden">Lisää rivi</button>
		</tr>

		<br />
		<br />

		<tr>
		<td colspan="2"></td>
			<td colspan="3" class="font-bold">Yhteensä (alv 0%)</td>
			<td class="pr-2 pt-2 text-right font-bold">100,00 €</td>
		</tr>
		<tr>
		<td colspan="2"></td>
			<td colspan="3" class="font-bold">Alv yhteensä</td>
			<td class="pr-2 pt-2 text-right font-bold">24,00 €</td>
		</tr>
		<tr>
		<td colspan="2"></td>
			<td colspan="2" class="border-t border-neutral-700 text-lg font-bold">
				Maksettava yhteensä
			</td>
			<td colspan="2" class="border-t border-neutral-700 p-2 text-right text-lg font-bold">
				124,00 €
			</td>
		</tr>
	</table>
</section>
