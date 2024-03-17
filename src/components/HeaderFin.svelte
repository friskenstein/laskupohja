<section>
	<div class="flex flex-row">
		<div class="w-6/12"></div>
		<div class="w-6/12">
			<h1 class="text-3xl">Lasku</h1>
			<br />
			<table class="w-full border-t border-neutral-700">
				<tr>
					<td>Laskun numero</td>
					<td><input type="text" class="w-52 bg-yellow-200 print:bg-white" value="" /></td>
				</tr>
				<tr>
					<td>Viitenumero</td>
					<td><input type="text" class="w-52 bg-yellow-200 print:bg-white" value="" /></td>
				</tr>
				<tr>
					<td>Laskun päiväys</td>
					<td>
						<input type="date" class="bg-yellow-200 print:hidden" value="2024-03-17" />
						<span class="hidden print:inline">17.3.2024</span>
					</td>
				</tr>
				<tr>
					<td>Eräpäivä</td>
					<td class="font-bold">15.4.2024</td>
				</tr>
				<tr>
					<td>Maksuehto</td>
					<td>
						<select class="bg-yellow-200 print:hidden">
							<option value="7">7</option>
							<option value="14">14</option>
							<option value="30">30</option>
						</select>
						<span class="hidden print:inline">30</span>
						pv netto
					</td>
				</tr>
				<tr>
					<td>Viivästyskorko</td>
					<td>Korkolain mukaan</td>
				</tr>
			</table>
		</div>
	</div>
</section>
